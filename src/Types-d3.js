import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { Annotation } from './Annotation'
// import { textBoxLine, textBoxSideline } from './TextBox'
import { addHandles } from './Handles'

//Note options
import noteAlignment from './Note/alignment'
import noteVertical from './Note/lineType-vertical'
import noteHorizontal from './Note/lineType-horizontal'

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
  constructor({ a, annotation, editMode, dispatcher, notePadding }) {
    this.a = a

    this.note = annotation.disable.indexOf("note") === -1 && a.select('g.annotation-note')
    this.noteContent = this.note && a.select('g.annotation-note-content')
    this.connector = annotation.disable.indexOf("connector") === -1 && a.select('g.annotation-connector')
    this.subject = annotation.disable.indexOf("subject") === -1 && a.select('g.annotation-subject')

    if (dispatcher){
      const handler = addHandlers.bind(null, annotation)
      handler(this.note, 'note')
      handler(this.connector, 'connector')
      handler(this.subject, 'subject')
    }
  
    this.annotation = annotation
    this.editMode = editMode
    this.notePadding = notePadding || 5
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

  getNoteBBox() { return bboxWithoutHandles(this.note, '.annotation-note-content')}
  getConnectorBBox() { return bboxWithoutHandles(this.connector)}
  getSubjectBBox() { return bboxWithoutHandles(this.subject)}
  getAnnotationBBox() { return bboxWithoutHandles(this.a)}

  drawSubject (context) {
    const subjectData = this.annotation.subject
    const type = context.type
    const subjectParams = { type: this, subjectData}

    let subject = {}
    if (type === "circle") subject = subjectCircle(subjectParams)
    else if (type === "threshold") subject = subjectThreshold(subjectParams)
    else if (type === "badge") subject = subjectBadge(subjectParams)
    
    let { components=[], handles=[] } = subject
    if (this.editMode){
      handles = handles.concat(this.mapHandles([{ drag: this.dragSubject.bind(this)}]))
      components.push({ type: "handle", handles })
    }

    return components
 }

  drawConnector (context) {
    const connectorData = this.annotation.connector
    const type = context.type
    const connectorParams = { type: this, connectorData}

    let connector = {}
    if (type === "curve") connector = connectorCurve(connectorParams)
    else if (type === "elbow") connector = connectorElbow(connectorParams)
    else connector = connectorLine(connectorParams)

    let { components=[], handles=[] } = connector
    const line = components[0]
    const endType = context.end
    let end = {}
    if (endType === "arrow") end = connectorArrow({ annotation: this.annotation, start: line.data[1], end: line.data[0] })
    else if (endType === "dot") end = connectorDot({ line })

    if (end.components){ components = components.concat(end.components)}

    if (this.editMode && handles.length !== 0){
      components.push({ type: "handle", handles })
    }
    return components;
  }

  drawNote (context) {
    const noteData = this.annotation.note
    const align = noteData.align || context.align || 'dynamic'
    const noteParams = { bbox: context.bbox, align, offset: this.annotation.offset }
    const lineType = noteData.lineType || context.lineType
    let note={}
    if (lineType == "vertical") note = noteVertical(noteParams)
    else if (lineType == "horizontal") note = noteHorizontal(noteParams)

    let { components=[], handles=[] } = note
    if (this.editMode) {
      handles = this.mapHandles([{ x: 0, y: 0, drag: this.dragNote.bind(this)}])
      components.push({ type: "handle", handles })
    }
    return components
  }

  drawNoteContent (context) {
    const noteData = this.annotation.note
    const padding = noteData.padding || this.notePadding || 5
    let orientation = noteData.orientation || context.orientation || 'topBottom'
    const lineType = noteData.lineType || context.lineType
    const align = noteData.align || context.align || 'dynamic'

    
    if (lineType == "vertical") orientation =  "leftRight"
    else if (lineType == "horizontal") orientation = "topBottom"

    const noteParams = { padding, bbox: context.bbox, offset: 
    this.annotation.offset, orientation, align }

    this.note && this.noteContent.attr('transform', noteAlignment(noteParams))
    
    return []
  }

  redraw(bbox=this.getNoteBBox()) {
    const annotation = this.annotation
    const context = { annotation, bbox }

    this.subject && this.drawOnSVG( this.subject, this.drawSubject(context))
    this.connector && this.drawOnSVG( this.connector, this.drawConnector(context))
    this.noteContent && this.drawOnSVG( this.noteContent, this.drawNoteContent(context))
    this.note && this.drawOnSVG( this.note, this.drawNote(context))
  }  

  setPosition(){
    const position = this.annotation.position 
    this.a.attr('transform', `translate(${position.x}, ${position.y})`)
  }

  setOffset(){
    const offset = this.annotation.offset
    this.note && this.note.attr('transform', `translate(${offset.x}, ${offset.y})`)
  }

  update(){
    this.setPosition()
    this.redraw()
  }

  draw() {
    this.setPosition()
    this.setOffset()
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

  dragNote() {
    const offset = this.annotation.offset
    offset.x += event.dx
    offset.y += event.dy
    this.annotation.offset = offset
    this.setOffset()
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

    drawNote(context){
      return super.drawNote({ ...context, ...typeSettings.note, ...this.typeSettings.note })
    }

    drawNoteContent(context){
      return super.drawNoteContent({ ...context, ...typeSettings.note, ...this.typeSettings.note })
    }
  }
}

export class d3NoteText extends Type {

  constructor(params){
    super(params)
    this.textWrap = params.textWrap || 120

    this.drawText()
  }

  updateTextWrap (textWrap) {
    this.textWrap = textWrap
    this.drawText()
  }

  drawText () {
    if (this.note){
      
      newWithClass(this.note, [this.annotation], 'g', 'annotation-note-content')

      const noteContent = this.note.select('g.annotation-note-content')
      newWithClass(noteContent, [this.annotation], 'text', 'annotation-note-text')
      newWithClass(noteContent, [this.annotation], 'text', 'annotation-note-title')

      let titleBBox = { height: 0 }
      const text = this.a.select('text.annotation-note-text')
      const wrapLength = this.annotation.note && this.annotation.note.wrap || this.textWrap 

      if (this.annotation.title){
        const title = this.a.select('text.annotation-note-title')
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
}

export const d3Label = customType(d3NoteText, {
  className: "label", 
  note: { align: "middle"}
})

export const d3Callout = customType(d3NoteText, {
  className: "callout",
  note: { lineType: "horizontal" }
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

export const d3Badge = customType(Type, {
  className: "badge",
  subject: { type: "badge"},
  disable: ['connector', 'note']
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

export const newWithClass = (a, d, type, className) => {
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
  Type,
  d3Label,
  d3Callout,
  d3CalloutElbow,
  d3CalloutCurve,
  d3CalloutCircle,
  d3XYThreshold,
  d3Badge,
  customType
}
