import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { Annotation } from './Annotation'
import { connectorLine } from './Connector'
import { textBoxLine, textBoxUnderline } from './TextBox'
import { subjectLine, subjectCircle } from './Subject'

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
        lineHeight = .2, // ems
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

class TypeBase {
  constructor({ a, annotation, editMode }) {
    this.a = a
    this.textBox = a.select('g.annotation-textbox')
    this.connector = a.select('g.annotation-connector')
    this.subject = a.select('g.annotation-subject')
    this.annotation = annotation
    this.editMode = editMode
  }

  getBBox() {
    return this.textBox.selectAll('.annotation-text, .annotation-title').nodes()
      .reduce((p, c) => {
        const bbox = c.getBBox()
        p.x = Math.min(p.x, bbox.x)
        p.y = Math.min(p.y, bbox.y)
        p.width = Math.max(p.width, bbox.width)
        p.height += bbox.height
        return p
      }, { x: 0, y: 0, width: 0, height: 0});
  }

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

    return this.getBBox()
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

  draw() {
    const bbox = this.drawText()
    if (this.editMode) this.editable()
    return bbox
  }

  update() {
    const offset = this.annotation.offset
    offset.x += event.dx
    offset.y += event.dy
    this.annotation.offset = offset
    return this.getBBox()

  }

  dragstarted() { event.sourceEvent.stopPropagation(); this.a.classed("dragging", true) }
  dragged() { this.update() }
  dragended() { this.a.classed("dragging", false)}

  dragSubject() {
    const position = this.annotation.position
    position.x += event.dx
    position.y += event.dy
    this.annotation.position = position
    this.a.attr('transform', `translate(${position.x}, ${position.y})`)
    this.customization(this.getBBox())
  }


  editable() {
    this.subject.call(drag()
      .container(select('g.annotations').node())
      .on('start', this.dragstarted.bind(this))
      .on('drag', this.dragSubject && this.dragSubject.bind(this) || this.dragged.bind(this))
      .on('end', this.dragended.bind(this))
    )

    this.textBox.call(drag()
      .on('start', this.dragstarted.bind(this))
      .on('drag', this.dragTextBox && this.dragTextBox.bind(this) || this.dragged.bind(this))
      .on('end', this.dragended.bind(this))
    )
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

  drawConnector() {}
  drawSubject() {}
  drawTextBox() {}
  
}

class Type extends TypeBase {
  customization(bbox) {
    const annotation = this.annotation
    const context = { annotation, bbox }

    //should be overwritten with custom annotation components
    this.drawOnSVG( this.subject, this.drawSubject({ context }))
    this.drawOnSVG( this.connector, this.drawConnector({ context }))
    this.drawOnSVG( this.textBox, this.drawTextBox({ context}))
  }  

  //super.draw and super.update return textbox bbox 
  draw() { this.customization(super.draw()) }
  update() { this.customization(super.update()) }
}


// Custom annotation types
export class d3Callout extends Type {
  static className(){ return "callout" }
  drawConnector({ context }) { return connectorLine(context)}
  drawTextBox({ context }) {
    const offset = this.annotation.offset
    this.textBox.attr('transform', `translate(${offset.x}, ${offset.y})`)
    return textBoxLine(context)
  }
}

export class d3CalloutCircle extends Type {
  static className(){ return "callout circle" }
  drawConnector({ context }) { return connectorLine(context)}
  drawSubject({ context }) { return subjectCircle(context)}
  drawTextBox({ context }) { 
    const offset = this.annotation.offset
    const padding = 5
    const transform = this.textBox.attr('transform', `translate(${offset.x}, ${offset.y - context.bbox.height - padding })`)
    
    return textBoxUnderline({ ...context, padding })
  }
}

export class d3XYThreshold extends d3Callout {
  static className(){ return "xythreshold" }
  drawSubject({ context }) { return subjectLine(context)}

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
//const drawConnectorElbow = () => {}
//Add text wraping option
//Example to use with divided line

export default {
  d3Callout,
  d3CalloutCircle,
  d3XYThreshold
}
