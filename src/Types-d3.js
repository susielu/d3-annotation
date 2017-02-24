import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { Annotation } from './Annotation'
import { textBoxLine, textBoxSideline } from './TextBox'
import { addHandles } from './Handles'

//Connector options
import connectorLine from './Connector/type-line'
import connectorElbow from './Connector/type-elbow'
import connectorCurve from './Connector/type-curve'
import connectorArrow from './Connector/end-arrow'
import connectorDot from './Connector/end-dot'

//Subject options
import subjectCircle from './Subject/circle'
import subjectThreshold from './Subject/threshold'
import subjectBadge from './Subject/badge'

class Type {
  constructor({ a, annotation, editMode, textWrap, textPadding, dispatcher }) {
    this.a = a

    this.textBox = annotation.disable.indexOf("textBox") === -1 && a.select('g.annotation-textbox')
    this.connector = annotation.disable.indexOf("connector") === -1 && a.select('g.annotation-connector')
    this.subject = annotation.disable.indexOf("subject") === -1 && a.select('g.annotation-subject')

    if (dispatcher){
      const handler = addHandlers.bind(null, annotation)
      handler(this.textBox, 'textbox')
      handler(this.connector, 'connector')
      handler(this.subject, 'subject')
    }
  
    this.annotation = annotation
    this.editMode = editMode
    this.textWrap = textWrap
    this.textPadding = textPadding
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

  updateEditMode () {
    this.a.selectAll('circle.handle')
      .remove()
  }

  updateTextWrap (textWrap) {
    this.textWrap = textWrap
    this.drawText()
  }

  drawOnSVG (component, builders) {
    if (!Array.isArray(builders)){
      builders = [ builders ]
    }

    builders
      .filter(b => b)
      .forEach(({ type, className, attrs, handles}) => {
        if (type === "handle"){
          addHandles({ group: component, r: attrs && attrs.r, handles })
        } else {
          newWithClass(component, [this.annotation], type, className)
          const el = component.select(`${type}.${className}`) 
          const attrKeys = Object.keys(attrs)

          attrKeys.forEach(attr => {
            if (attr === "text"){
              el.text(attrs[attr])
            } else {
              el.attr(attr, attrs[attr])
            }
          })
        }
      })
  }

  getTextBBox() { return bboxWithoutHandles(this.textBox, '.annotation-text, .annotation-title')}
  getConnectorBBox() { return bboxWithoutHandles(this.connector)}
  getSubjectBBox() { return bboxWithoutHandles(this.subject)}
  getAnnotationBBox() { return bboxWithoutHandles(this.a)}

  drawSubject (context) {
    let components = []
    let handles = []

    const type = context.type
    const subjectData = this.annotation.subject
    if (type === "circle") {
      const { components: c, handles: h } = subjectCircle({ subjectData, type: this })
      components = components.concat(c)
      handles = handles.concat(h)
       
     } else if (type === "threshold") {
      const { components: c } = subjectThreshold({ subjectData, type: this })
      components.push(c)

     } else if (type === "badge") {
      const { components: c, handles: h } = subjectBadge({ subjectData, type: this })
      components = components.concat(c)
      handles = handles.concat(h)
    
    }

    if (this.editMode){
      handles = handles.concat(this.mapHandles([{ drag: this.dragSubject.bind(this)}]))
      components.push({ type: "handle", handles })
    }

    return components
 }

  drawConnector (context) {
    let components = []
    let handles = []

    const type = context.type
    let connectorData = this.annotation.connector
    let line
    if (type === "curve") {
      const { components: c, handles: h } = connectorCurve({ type: this, connectorData })
      line = c
      handles = handles.concat(h)

    } else if (type === "elbow") {
      const { components: c } = connectorElbow({ type: this })
      line = c

    } else {
      const { components: c } = connectorLine({ type: this })
      line = c

    }
    components.push(line)

    const endType = context.end
    if (endType === "arrow"){      
      const { components: c } = connectorArrow({ annotation: this.annotation, 
          start: line.data[1], end: line.data[0] })
      components.push(c)
    } else if (endType === "dot"){
      const { components: c } = connectorDot({ line })
      components.push(c)
    }

    if (this.editMode && handles.length !== 0){
      components.push({ type: "handle", handles })
    }

    return components;
  }

  drawText() {
    if (this.textBox){

      const textbox = a.select('g.annotation-textbox')
      const offset = d.offset
      textbox.attr('transform', `translate(${offset.x}, ${offset.y})`)
      
      newWithClass(textbox, [d], 'g', 'annotation-textwrapper')

      const textWrapper = textbox.select('g.annotation-textwrapper')

      newWithClass(textWrapper, [d], 'text', 'annotation-text')
      newWithClass(textWrapper, [d], 'text', 'annotation-title')

      let titleBBox = { height: 0 }
      const text = this.a.select('text.annotation-text')
      const wrapLength = this.annotation.textBox && this.annotation.textBox.wrap || this.textWrap ||  120

      if (this.annotation.title){
        const title = this.a.select('text.annotation-title')
        title.text(this.annotation.title)
          .attr('dy', '1.1em')
        title.call(wrap, wrapLength)
        titleBBox = title.node().getBBox()
      }

      text.text(this.annotation.text)
        .attr('dy', '1em')
      text.call(wrap, wrapLength)

      const textBBox = text.node().getBBox()
      text.attr('y', titleBBox.height * 1.1 || 3)
    }
  }

  drawTextBox (context) {
    let components = []
    let handles = []

    const textBoxData = this.annotation.textBox
    
    const lineType = textBoxData.lineType || context.lineType

    let orientation = textBoxData.orientation || context.orientation || 'topBottom'
    let align = textBoxData.align || context.align || 'dynamic'

    const leftRightDyanmic = () => {
      if (align == "dynamic" || align == "left" || align == "right"){
         if (offset.y < 0){ 
              align = "top" 
            } else {
              align = "bottom"
            } 
      }
    }

    const topBottomDynamic = () => {
      if (align == "dynamic" || align == "top" || align == "bottom"){
        if (offset.x < 0){
            align = "right"
          } else {
            align = "left"
          }      
        }
    }
        
    if(lineType){

      if (lineType == "vertical") {
        orientation = "leftRight"
        leftRightDyanmic()
        components.push(textBoxSideline({...context, align }))
      } else if (lineType == "horizontal") {
        orientation = "topBottom"        
        topBottomDynamic()
        components.push(textBoxLine({ ...context, align }) )
      }
    }

    // if (orientation === 'topBottom' ){
    //   topBottomDynamic()
    //   if (offset.y < 0){ 
    //     y -= (context.bbox.height + padding)
    //  } else {
    //    y += padding
    //  }

    //   if (align === "middle") {
    //     x -= context.bbox.width/2
    //   } else if (align === "right" ) {
    //     x -= (context.bbox.width)
    //   } 

    // } else if (orientation === 'leftRight'){
    //   leftRightDyanmic()
    //   if (offset.x < 0){ 
    //     x -= (context.bbox.width + padding) 
    //   } else {
    //     x += padding
    //   }

    //    if (align === "middle") {
    //       y -= context.bbox.height/2
    //    } else if (align === "top" ){
    //       y -= (context.bbox.height )
    //    }
    // } 

    //this.textBox.select('g.annotation-textwrapper').attr('transform', `translate(${x}, ${y})`)

    // if (textBoxData.type){

    // }

    if (this.editMode) {
      handles = this.mapHandles([{ x: 0, y: 0, drag: this.dragTextBox.bind(this)}])
      components.push({ type: "handle", handles })
    }

    return components
  }

  redraw(bbox=this.getTextBBox()) {
    const annotation = this.annotation
    const context = { annotation, bbox }

    //Extend with custom annotation components
    this.subject && this.drawOnSVG( this.subject, this.drawSubject(context))
    this.connector && this.drawOnSVG( this.connector, this.drawConnector(context))
    this.textBox && this.drawOnSVG( this.textBox, this.drawTextBox(context))
  }  
  
  // draw() {
  //   // this.drawText()
  //   this.update()
  // }

  draw() {
    const position = this.annotation.position 
    this.a.attr('transform', `translate(${position.x}, ${position.y})`)
    const offset = this.annotation.offset
    this.textBox.attr('transform', `translate(${offset.x}, ${offset.y})`)
    this.redraw()
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
    this.redraw()
  }

  mapHandles(handles) {
    return handles
    .map(h => ({ ...h, 
      start: this.dragstarted.bind(this), end: this.dragended.bind(this) }))
  }
}

export const customType = (initialType, typeSettings, init) => {
  return class customType extends initialType {
    constructor (settings) {
      super(settings)
      this.typeSettings = typeSettings
      if (typeSettings.disable){
        typeSettings.disable.forEach(d => {
          this[d] = undefined
        })
      }
    }

    static init(annotation, accessors){ 
      super.init(annotation, accessors); 
      if (init) {
        annotation = init(annotation, accessors) 
      }
      return annotation
    }

    static className(){ return typeSettings.className || initialType.className()}

    drawSubject(context){
       return super.drawSubject({ ...context, ...typeSettings.subject, ...this.typeSettings.subject })
    }

    drawConnector(context){
      return super.drawConnector({ ...context, ...typeSettings.connector, ...this.typeSettings.connector })
    }

    drawTextBox(context){
      return super.drawTextBox({ ...context, ...typeSettings.textBox, ...this.typeSettings.textBox })
    }
  }
}

export const d3Label = customType(Type, {
  className: "label", 
  textBox: { align: "middle"}
})

export const d3Callout = customType(Type, {
  className: "callout",
  textBox: { lineType: "horizontal" }
})

export const d3CalloutElbow = customType(d3Callout, {
  className: "callout elbow",
  connector: { type: "elbow" }
})

export const d3CalloutCircle = customType(d3CalloutElbow, {
  className: "callout circle",
  subject: { type: "circle"}
})

export const d3CalloutCurve = customType(d3Callout, {
  className: "callout curve",
  connector: { type: "curve" }
})

export const d3Badge = customType(d3CalloutElbow, {
  className: "badge",
  subject: { type: "badge"},
  disable: ['connector', 'textBox']
})

export const d3XYThreshold = customType(d3Callout, {
  className: "xythreshold",
  subject: { type: "threshold" }
  }, (annotation, accessors) => {
      //TODO: come back to here to check assumptions being made
      if (!annotation.x && (annotation.subject.y1 || annotation.subject.y2) && annotation.data && accessors.x){
        annotation.x = accessors.x(annotation.data)
      }

      if (!annotation.y && (annotation.subject.x1 || annotation.subject.x2) && annotation.data && accessors.y){
        annotation.y = accessors.y(annotation.data)
      }

      return annotation
    }
  )

const newWithClass = (a, d, type, className) => {
  const group = a.selectAll(`${type}.${className}`).data(d)
  group.enter()
    .append(type)
    .merge(group)
    .attr('class', className)

  group.exit().remove()
  return a
}


const addHandlers = ( annotation, { component, name }) => {
  if (component){
    component
    .on("mouseover.annotations", () => {
      dispatcher.call(`${name}over`, component, annotation)})
    .on("mouseout.annotations", () => dispatcher.call(`${name}out`, component, annotation))
    .on("click.annotations", () => dispatcher.call(`${name}click`, component, annotation))
  }
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
  d3Callout,
  d3CalloutElbow,
  d3CalloutCurve,
  d3CalloutCircle,
  d3XYThreshold,
  d3Badge,
  customType
}
