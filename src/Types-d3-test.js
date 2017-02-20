import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { curveCatmullRom } from 'd3-shape'
import { Annotation } from './Annotation'
import { connectorLine, connectorArrow } from './Connector'
import { textBoxLine, textBoxSideline } from './TextBox'
import { subjectLine, subjectCircle } from './Subject'
import { pointHandle, circleHandles, rectHandles, lineHandles, addHandles } from './Handles'

class Type {
  constructor({ a, annotation, editMode }) {
    this.a = a
    this.textBox = annotation.disable.indexOf("textBox") === -1 && a.select('g.annotation-textbox')
    this.connector = annotation.disable.indexOf("connector") === -1 && a.select('g.annotation-connector')
    this.subject = annotation.disable.indexOf("subject") === -1 && a.select('g.annotation-subject')
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

  getTextBBox() { return bboxWithoutHandles(this.textBox, '.annotation-text, .annotation-title')}
  getConnectorBBox() { return bboxWithoutHandles(this.connector)}
  getSubjectBBox() { return bboxWithoutHandles(this.subject)}
  getAnnotationBBox() { return bboxWithoutHandles(this.a)}

  drawText() {
    if (this.textBox){

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
  }

  drawSubject () {

    if (this.editMode){
      const h = pointHandle({})

      addHandles({
        group: this.subject,
        handles: this.mapHandles([{ ...h.move, drag: this.dragSubject.bind(this)}])
      })
    }

    const type = context.type

    switch (type) {
      case "circle":
       const c = subjectCircle(context);

      if (this.editMode){
        const subjectData = this.annotation.subject
        const h = circleHandles({
          r1: c.data.outerRadius || c.data.radius,
          r2: c.data.innerRadius,
          padding: this.annotation.subject.radiusPadding
        })

        const updateRadius = (type) => {      
          const r = subjectData[type] + event.dx*Math.sqrt(2)
          subjectData[type] = r
          this.customization()
        }

        const updateRadiusPadding = () => {
          const rpad = subjectData.radiusPadding + event.dx
          subjectData.radiusPadding = rpad
          this.customization()
        }

        const handles = [{ ...h.padding, drag : updateRadiusPadding.bind(this)},
          { ...h.r1, drag: updateRadius.bind(this, subjectData.outerRadius !== undefined ? 'outerRadius': 'radius')}
          ]

        if (subjectData.innerRadius){
          handles.push({ ...h.r2, drag: updateRadius.bind(this, 'innerRadius')})
        }

        //TODO add handles when there is an inner radius and outer radius
        addHandles({
          group: this.subject,
          handles: this.mapHandles(handles)
        })
      }
      return c
    case "threshold":
        return subjectLine(context)

    }
 }

  drawConnector (context) {
    
    // connector types 
    // can send, elbow, curve, or nothing defaults to straight line
    const lineType = context.lineType
    switch (lineType) {
      case "elbow":
        context.elbow = true

      case "curve": 
        const createPoints = function(anchors=2){
              const offset = this.annotation.offset
              const diff = { x: offset.x/(anchors + 1), y: offset.y/(anchors + 1) }
              const p = []

              let i = 1 
              for (; i <= anchors; i++){
                p.push([diff.x*i + i%2*20, diff.y*i - i%2*20])
              }
              return p
        }.bind(this)

        if (!this.annotation.connector){ this.annotation.connector = {} }
        if (!this.annotation.connector.points || typeof this.annotation.connector.points === "number"){ 
          this.annotation.connector.points = createPoints(this.annotation.connector.points) 
        }
        if (!this.annotation.connector.curve){ this.annotation.connector.curve = curveCatmullRom }

        context.points = this.annotation.connector.points 
        context.curve = this.annotation.connector.curve

        if (this.editMode) {
          let handles = context.points
            .map((c,i) => ({...pointHandle({cx: c[0], cy: c[1]}), index: i}))

        const updatePoint = (index) => {      
            this.annotation.connector.points[index][0] += event.dx
            this.annotation.connector.points[index][1] += event.dy
            this.customization()
        }

        addHandles({
            group: this.connector,
            handles: this.mapHandles(handles
              .map(h => ({ ...h.move, drag: updatePoint.bind(this, h.index)})))
        })
      }

      default: 
        context.elbow = false
    }
    
    const line = connectorLine(context)

    // connector end 
    const endType = context.end
    switch (endType){
      case "arrow":
        const dataLength = line.data.length
      
        context.start = line.data[1]
        context.end = line.data[0]
        
        return [line, connectorArrow(context)]

      //Add dot case
      default: 
        //no end
    }

    return line;
  }

  drawTextBox (context) {
    const offset = this.annotation.offset
    const tData = this.annotation.textBox
    const padding = tData.padding || context.padding || 5
    const orientation = tData.orientation || context.orientation || 'topBottom'
    const align = tData.align || context.align

    let x = -context.bbox.x + padding
    let y = -context.bbox.y

    if (orientation === 'topBottom' ){
      if (offset.y < 0){ y = -context.bbox.height - padding }

      if (align === "middle") {
        x -= context.bbox.width/2
      } else if (align === "right" ) {
        x -= (context.bbox.width + padding*2)
      } 

    } else if (orientation === 'leftRight'){
      if (offset.x < 0){ 
        x -= (context.bbox.width + padding) 
      } else {
        x += padding
      }

       if (align === "middle") {
          y -= context.bbox.height/2
       } else if (align === "top" ){
          y -= (context.bbox.height + padding)
       }
    } 

    this.textBox.attr('transform', `translate(${offset.x}, ${offset.y})`)
    this.textBox.select('g.annotation-textwrapper').attr('transform', `translate(${x}, ${y})`)

    if (this.editMode) {

      addHandles({
        group: this.textBox,
        handles: this.mapHandles([{ x: 0, y: 0, drag: this.dragTextBox.bind(this)}])
      })
    }

    const lineType = context.lineType

    switch(lineType){
      case "horizontal":
        if (context.orientation == "leftRight" && offset.x < 0) {
          context.align = "right"
        }
        return textBoxLine(context) 
      case "vertical":
        if (offset.y < 0){
          context.position = "top"
        }
        return textBoxSideline(context)
    }
  }

  customization(bbox=this.getTextBBox()) {
    const annotation = this.annotation
    const context = { annotation, bbox }

    //Extend with custom annotation components
    this.subject && this.drawOnSVG( this.subject, this.drawSubject(context))
    this.connector && this.drawOnSVG( this.connector, this.drawConnector(context))
    this.textBox && this.drawOnSVG( this.textBox, this.drawTextBox(context))
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

const customType = (initialType, typeSettings) => {
  return class customType extends initialType {
    static className(){ return typeSettings.className || initialType.className()}

    drawSubject(context){
       return super.drawSubject({ ...context, ...typeSettings.subject })
    }

    drawConnector(context){
      return super.drawConnector({ ...context, ...typeSettings.connector })
    }

    drawTextBox(context){
      return super.drawTextBox({ ...context, ...typeSettings.textBox })
    }
  }
}

//This is callout except without textbox underline, and centered text
// export class d3Label extends Type {
//   static className(){ return "label" }
//   drawTextBox(context) { 
//     context.align = this.annotation.textBox.align || "middle"
//     super.drawTextBox(context)
//   }
// }

export const d3Label = customType(Type, 
  { className: "label", 
  textBox: { align: "middle"}
})

export class d3LabelDots extends d3Label {
  static className(){ return "label dots" }
  drawTextBox(context) { 
    super.drawTextBox(context)
    return subjectCircle(context)
  }

  drawSubject(context) {
    super.drawSubject()
    return subjectCircle(context)
  }
}

// Custom annotation types
export class d3Callout extends Type {
  static className(){ return "callout" }

  drawTextBox(context) { 

    return textBoxLine(context) 
  }
}

export class d3CalloutElbow extends d3Callout {
  static className(){ return "callout elbow" }

  drawConnector(context) {
    context.elbow = true
    return super.drawConnector(context)
  }

  drawTextBox(context) {
    const offset = this.annotation.offset

    if (offset.x < 0 && (!context.orientation || context.orientation == "topBottom")){
      context.align = "right"
    }
    return super.drawTextBox(context)
  }
}

export class d3CalloutLeftRight extends d3CalloutElbow {
  static className() { return "callout leftright"}

  drawTextBox(context) {
    super.drawTextBox(context)

    const offset = this.annotation.offset
    if (offset.y < 0){
      context.position = "top"
    }

    return textBoxSideline(context)
  }
}

export class d3CalloutCircle extends d3CalloutElbow {
  static className(){ return "callout circle" }
  
  drawSubject(context) { 
    context.type = "circle"
    return super.drawSubject(context)
  }

}


export class d3CalloutCurve extends d3Callout{ 
  static className(){ return "callout curve" }
  drawConnector(context) { 
     context.lineType = "curve"
     return super.drawConnector(context)
  }
}


export class d3XYThreshold extends d3Callout {
  static className(){ return "xythreshold" }

  drawSubject(context) { 
    super.drawSubject()
    return subjectLine(context)
  }

  static init(annotation, accessors) {
    super.init(annotation, accessors)

    //TODO: come back to here to check assumptions being made
    if (!annotation.x && (annotation.subject.y1 || annotation.subject.y2) && annotation.data && accessors.x){
      annotation.x = accessors.x(annotation.data)
    }

    if (!annotation.y && (annotation.subject.x1 || annotation.subject.x2) && annotation.data && accessors.y){
      annotation.y = accessors.y(annotation.data)
    }

    return annotation
  }
}


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
  if (!selection){
    return { x: 0, y: 0, width: 0, height: 0}
  }

  return selection.selectAll(selector).nodes().reduce((p, c) => {
        const bbox = c.getBBox()
        p.x = Math.min(p.x, bbox.x)
        p.y = Math.min(p.y, bbox.y)
        p.width = Math.max(p.width, bbox.width)
        p.height += bbox.height
        return p
      }, { x: 0, y: 0, width: 0, height: 0});
}

export default {
  d3Label,
  d3LabelDots,
  d3Callout,
  d3CalloutElbow,
  d3CalloutCurve,
  d3CalloutLeftRight,
  d3CalloutCircle,
  d3XYThreshold,
  customType
}
