import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { Annotation } from './Annotation'
import { connectorLine } from './Connector'
import { textBoxUnderline } from './TextBox'
import { subjectLine } from './Subject'

export const newWithClass = (a, d, type, className) => {
  const group = a.selectAll(`${type}.${className}`).data(d)
  group.enter()
    .append(type)
    .merge(group)
    .attr('class', className)

  group.exit().remove()
    
  return a
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

  drawText() {
    let titleBBox = { height: 0 }
    const text = this.a.select('text.annotation-text')

    if (this.annotation.title){
      const title = this.a.select('text.annotation-title')
      title.text(this.annotation.title)
      titleBBox = title.node().getBBox()
      title.attr('y', titleBBox.height)
    }

    text.text(this.annotation.text)
    const textBBox = text.node().getBBox()
    text.attr('y', titleBBox.height + textBBox.height)

    return this.textBox.node().getBBox();
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
    
    this.textBox.attr('transform', `translate(${offset.x}, ${offset.y})`)
    
    return this.textBox.node().getBBox()
  }

  dragstarted() { event.sourceEvent.stopPropagation(); this.a.classed("dragging", true) }
  dragged() { this.update() }
  dragended() { this.a.classed("dragging", false)}

  editable() {
    this.a.call(drag()
      .on('start', this.dragstarted.bind(this))
      .on('drag', this.dragged.bind(this))
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
  drawTextBox({ context }) { return textBoxUnderline(context)}
}

export class d3CalloutCircle extends Type {
  static className(){ return "callout" }
  drawConnector({ context }) { return connectorLine(context)}
  drawTextBox({ context }) { return textBoxUnderline(context)}
}

export class d3XYThreshold extends Type {
  static className(){ return "xythreshold" }
  drawConnector({ context }) { return connectorLine(context)}
  drawSubject({ context }) { return subjectLine(context)}
  drawTextBox({ context }) { return textBoxUnderline(context)}
  
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
