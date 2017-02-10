import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { curveCatmullRom } from 'd3-shape'
import { Annotation } from './Annotation'
import { connectorLine, connectorArrow } from './Connector'
import { textBoxLine, textBoxUnderline, textBoxSideline } from './TextBox'
import { subjectLine, subjectCircle } from './Subject'
import { pointHandle, circleHandles, rectHandles, lineHandles, addHandles } from './Handles'

export const newWithClass = (a, d, type, className) => {
  const group = a.selectAll(`${type}.${className}`).data(d)
  group.enter()
    .append(type)
    .merge(group)
    .attr('class', className)

  group.exit().remove()
  return a
}

//Text wrapping code adapted from Mike Bostock
const wrap = (text, width) => {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = .2, //ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")) || 0,
        tspan = text.text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("x", 0)
          .attr("dy", lineHeight + dy + "em").text(word);
      }
    }
  });
}

const bboxWithoutHandles = (selection, selector=':not(.handle)') => {
  return selection.selectAll(selector).nodes().reduce((p, c) => {
        const bbox = c.getBBox()
        p.x = Math.min(p.x, bbox.x)
        p.y = Math.min(p.y, bbox.y)
        p.width = Math.max(p.width, bbox.width)
        p.height += bbox.height
        return p
      }, { x: 0, y: 0, width: 0, height: 0});
}

class Type {
  constructor({ a, annotation, editMode }) {
    this.a = a
    this.textBox = a.select('g.annotation-textbox')
    this.connector = a.select('g.annotation-connector')
    this.subject = a.select('g.annotation-subject')
    this.annotation = annotation
    this.editMode = editMode
  }

  static init(annotation, accessors) {
    if (!annotation.x && annotation.data && accessors.x){
      annotation.x = accessors.x(annotation.data)
    }
    if (!annotation.y && annotation.data && accessors.y){
      annotation.y = accessors.y(annotation.data)
    }
    return annotation
  }

  drawOnSVG (a, builders) {
    if (!Array.isArray(builders)){
      builders = [ builders ]
    }

    builders
      .filter(b => b)
      .forEach(({ type, className, attrs}) => {
        newWithClass(a, [this.annotation], type, className)
        const el = a.select(`${type}.${className}`) 
        const attrKeys = Object.keys(attrs)

        attrKeys.forEach(attr => {
          el.attr(attr, attrs[attr])
        })
      })
  }

  getTextBBox() { return bboxWithoutHandles(this.textBox, 'text.annotation-text, text.annotation-title')}
  getConnectorBBox() { return bboxWithoutHandles(this.connector)}
  getSubjectBBox() { return bboxWithoutHandles(this.connector)}
  getAnnotationBBox() { return bboxWithoutHandles(this.a)}

  drawText() {
    let titleBBox = { height: 0 }
    const text = this.a.select('text.annotation-text')

    if (this.annotation.title){
      const title = this.a.select('text.annotation-title')
      title.text(this.annotation.title)
        .attr('dy', '1.1em')
      title.call(wrap, 100)
      titleBBox = title.node().getBBox()
    }

    text.text(this.annotation.text)
      .attr('dy', '1em')
    text.call(wrap, 100)

    const textBBox = text.node().getBBox()
    text.attr('y', titleBBox.height * 1.1 || 3)
  }

  drawSubject () {
    if (this.editMode){
      const h = pointHandle({})

      addHandles({
        group: this.subject,
        handles: this.mapHandles([{ ...h.move, drag: this.dragSubject.bind(this)}])
      })
    }
  }

  drawTextBox ({ context }) {
    const offset = this.annotation.offset
    this.textBox.attr('transform', `translate(${offset.x}, ${offset.y})`)
    if (this.editMode) {
      const h = rectHandles({ width: context.bbox.width, height: context.bbox.height })
      
      addHandles({
        group: this.textBox,
        handles: this.mapHandles([{...h.move, drag: this.dragTextBox.bind(this)}])
      })
    }
  }

  customization(bbox=this.getTextBBox()) {
    const annotation = this.annotation
    const context = { annotation, bbox }

    //Extend with custom annotation components
    this.drawSubject && this.drawOnSVG( this.subject, this.drawSubject({ context }))
    this.drawConnector && this.drawOnSVG( this.connector, this.drawConnector({ context }))
    this.drawTextBox && this.drawOnSVG( this.textBox, this.drawTextBox({ context}))
  }  
  
  draw() {
    this.drawText()
    this.update()
  }

  update() {
    const position = this.annotation.position 
    this.a.attr('transform', `translate(${position.x}, ${position.y})`)
    this.customization()
  }

  dragstarted() { event.sourceEvent.stopPropagation(); this.a.classed("dragging", true) }
  dragended() { this.a.classed("dragging", false)}

  dragSubject() {
    const position = this.annotation.position
    position.x += event.dx
    position.y += event.dy
    this.annotation.position = position
    this.update()
  }

  dragTextBox() {
    const offset = this.annotation.offset
    offset.x += event.dx
    offset.y += event.dy
    this.annotation.offset = offset
    this.customization()
  }

  mapHandles(handles) {
    return handles.filter(h => h.x !== undefined && h.y !== undefined)
    .map(h => ({ ...h, 
      start: this.dragstarted.bind(this), end: this.dragended.bind(this) }))
  }
}

export class d3CalloutCircle extends Type {
  static className(){ return "callout circle" }
  drawConnector({ context }) {
     context.elbow = true
    const line = connectorLine(context)
    const dataLength = line.data.length
    console.log('in callout arrow', line.data)
    context.start = line.data[1]
    context.end = line.data[0]
    return [line, connectorArrow(context)]
  }
  drawSubject({ context }) { 
    const c = subjectCircle(context);

    if (this.editMode){
      const h = circleHandles({
        r: c.data.outerRadius || c.data.radius,
        padding: this.annotation.typeData.radiusPadding
      })

      const updateRadius = () => {      
        const r = this.annotation.typeData.radius + event.dx*Math.sqrt(2)
        this.annotation.typeData.radius = r
        this.customization()
      }

      const updateRadiusPadding = () => {
        const rpad = this.annotation.typeData.radiusPadding + event.dx
        this.annotation.typeData.radiusPadding = rpad
        this.customization()
      }

      addHandles({
        group: this.subject,
        handles: this.mapHandles([{ ...h.move, drag: this.dragSubject.bind(this)}, 
        { ...h.radius, drag: updateRadius.bind(this)},
        { ...h.padding, drag : updateRadiusPadding.bind(this)}
        ])
      })
    }
    return c
  }

  drawTextBox({ context }) { 
    super.drawTextBox({ context })

    const offset = this.annotation.offset
    const padding = 5
    const transform = this.textBox
    .attr('transform', `translate(${offset.x}, ${offset.y - context.bbox.height - padding })`)
    return textBoxUnderline({ ...context, padding })
  }
}


// Custom annotation types
export class d3Callout extends Type {
  static className(){ return "callout" }
  drawConnector({ context }) { return connectorLine(context)}
  drawTextBox({ context }) { return textBoxLine(context) }
}

export class d3Label extends Type {
  static className(){ return "label" }
  drawConnector({ context }) { context.elbow = true; return connectorLine(context)}

  drawTextBox({ context }) { 
    const offset = this.annotation.offset
    super.drawTextBox({ context })

    if (offset.y < 0) {
      const padding = 5
      const transform = this.textBox.attr('transform', `translate(${offset.x}, ${offset.y - context.bbox.height - padding })`)
      // context.position = "bottom"
      // context.padding = padding
    }
  }
}

export class d3CalloutDynamic extends Type {
  static className(){ return "callout-dynamic" }
  drawConnector({ context }) { context.elbow = true; return connectorLine(context)}
  drawTextBox({ context }) {
    const offset = this.annotation.offset
    super.drawTextBox({ context })

    if (offset.y < 0) {
      const padding = 5
      const transform = this.textBox.attr('transform', `translate(${offset.x}, ${offset.y - context.bbox.height - padding })`)
      context.position = "bottom"
      context.padding = padding
    } 

    return textBoxLine(context)
  }
}

export class d3CalloutCurve extends d3CalloutDynamic { 
  static className(){ return "callout-curve" }
  drawConnector({ context }) { 

     context.points = this.annotation.typeData.points 
     context.curve = this.annotation.typeData.curve || curveCatmullRom

     if (this.editMode) {
      let handles = context.points
        .map((c,i) => ({...pointHandle({cx: c[0], cy: c[1]}), index: i}))

      const updatePoint = (index) => {      
        this.annotation.typeData.points[index][0] += event.dx
        this.annotation.typeData.points[index][1] += event.dy
        this.customization()
      }

      addHandles({
        group: this.connector,
        handles: this.mapHandles(handles
          .map(h => ({ ...h.move, drag: updatePoint.bind(this, h.index)})))
      })
     }

     return connectorLine(context)
  }
}

export class d3CalloutLeftRight extends d3CalloutDynamic {
  static className() { return "callout-leftright"}

  drawTextBox({ context }) {
    super.drawTextBox({ context })

    const offset = this.annotation.offset
    const padding = 5

    const y =  offset.y > 0 ? offset.y - context.bbox.height : offset.y

    if (offset.x < 0) {
      const transform = this.textBox
        .attr('transform', `translate(${Math.min(offset.x - padding, -context.bbox.width - padding)}, 
        ${y})`)
     // context.position = "left"
      context.padding = padding
    } else {      
      this.textBox.attr('transform', `translate(${Math.max(offset.x + padding, padding)}, ${y})`)
    }

    return //textBoxSideline(context)
  }
}


export class d3CalloutArrow extends Type {
  static className(){ return "callout arrow" }
  drawConnector({ context }) { 
    context.elbow = true
    const line = connectorLine(context)
    const dataLength = line.data.length
    context.start = line.data[1]
    context.end = line.data[0]
    return [line, connectorArrow(context)]
  }
  drawTextBox({ context }) { return super.drawTextBox({ context }) }
}

export class d3XYThreshold extends d3Callout {
  static className(){ return "xythreshold" }

  drawTextBox({ context }) { return textBoxLine(context)}
  drawSubject({ context }) { 
    super.drawSubject()
    return subjectLine(context)
  }

  static init(annotation, accessors) {
    super.init(annotation, accessors)

    if (!annotation.x && (annotation.typeData.y1 || annotation.typeData.y2) && annotation.data && accessors.x){
      annotation.x = accessors.x(annotation.data)
    }

    if (!annotation.y && (annotation.typeData.x1 || annotation.typeData.x2) && annotation.data && accessors.y){
      annotation.y = accessors.y(annotation.data)
    }

    return annotation
  }
}

//TODO
//Example to use with divided line

export default {
  d3Callout,
  d3CalloutCurve,
  d3CalloutDynamic,
  d3CalloutLeftRight,
  d3CalloutArrow,
  d3CalloutCircle,
  d3XYThreshold,
  d3Label
}
