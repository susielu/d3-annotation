import { select, event } from 'd3-selection'
import { addHandles } from './Handles'
import contextRender from './ContextRender'
import svgRender from './SvgRender'

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
import subjectRect from './Subject/rect'
import subjectThreshold from './Subject/threshold'
import subjectBadge from './Subject/badge'



export class CanvasRenderer {
  constructor ({ a, annotation, editMode, dispatcher, notePadding, accessors, context }) {
    this.a = a

    if (!context) {
      this.drawOnScreen = (component, drawFunction) => { return this.drawOnSVG( component, drawFunction) }
    } else {
      this.drawOnScreen = (component, drawFunction) => { return this.drawOnCanvas( component, drawFunction)}
    }
    this.note = annotation.disable.indexOf("note") === -1 && (context || a.select('g.annotation-note'))
    this.noteContent = this.note && (context || a.select('g.annotation-note-content'))

    this.subject = annotation.disable.indexOf("subject") === -1 && (context || a.select('g.annotation-subject'))
    this.connector = annotation.disable.indexOf("connector") === -1 && (context || a.select('g.annotation-connector'))

    this.renderer = context ? canvasRender || svgRender


    if (dispatcher) {
      const handler = addHandlers.bind(null, dispatcher, annotation)
      handler({ component: this.note, name: 'note' })
      handler({ component: this.connector, name: 'connector' })
      handler({ component: this.subject, name: 'subject' })
    }
  
    this.annotation = annotation
    this.context = context
    this.editMode = annotation.editMode || editMode
    this.notePadding = notePadding || 3
    this.offsetCornerX = 0
    this.offsetCornerY = 0

    if (accessors && annotation.data) {
      this.init(accessors)
    }
  }

  init (accessors) {
    if (!this.annotation.x) {
      this.mapX(accessors)
    }
    if (!this.annotation.y) {
      this.mapY(accessors)
    }
  }

  mapY (accessors) {
    if (accessors.y) {
      this.annotation.y = accessors.y(this.annotation.data)
    }
  }

  mapX (accessors) {
    if (accessors.x) {
      this.annotation.x = accessors.x(this.annotation.data)
    }
  }


  updateEditMode () {
    // this.a.selectAll('circle.handle')
    //   .remove()
  }

  drawOnCanvas (component, builders) {
    builders
      .filter(b => b)
      .forEach(({ pathMethods, data }) => {
        component.save()
        const { x, y } = this.annotation.position
        component.translate(x, y);
        pathMethods(data)
        component.restore()
      }) 
  }

  // getNoteBBox () { return bboxWithoutHandles(this.note, '.annotation-note-content text')}
  // getNoteBBoxOffset () { 
  //   const bbox = bboxWithoutHandles(this.note, '.annotation-note-content')
  //   const transform = this.noteContent.attr('transform').split(/\(|\,|\)/g)
  //   bbox.offsetCornerX = parseFloat(transform[1]) + this.annotation.dx
  //   bbox.offsetCornerY = parseFloat(transform[2]) + this.annotation.dy
  //   bbox.offsetX = this.annotation.dx
  //   bbox.offsetY = this.annotation.dy
  //   return bbox 
  // }

  drawSubject (context={}) {
    const subjectData = this.annotation.subject
    const type = context.type
    const subjectParams = { type: this, subjectData}

    let subject = {}
    if (type === "circle") subject = subjectCircle(subjectParams)
    else if (type === "rect") subject = subjectRect(subjectParams)
    else if (type === "threshold") subject = subjectThreshold(subjectParams)
    else if (type === "badge") subject = subjectBadge(subjectParams)

    let { components=[], handles=[] } = subject
    if (this.editMode) {
      handles = handles.concat(this.mapHandles([{ drag: this.dragSubject.bind(this)}]))
      components.push({ type: "handle", handles })
    }

    return components
  }

  drawConnector (context={}) {
    const connectorData = this.annotation.connector
    const type = connectorData.type || context.type
    const connectorParams = { type: this, connectorData }
    connectorParams.subjectType = this.typeSettings && this.typeSettings.subject && this.typeSettings.subject.type 

    let connector = {}
    if (type === "curve") connector = connectorCurve(connectorParams)
    else if (type === "elbow") connector = connectorElbow(connectorParams)
    else connector = connectorLine(connectorParams)

    let { components=[], handles=[] } = connector

    const line = components[0]
    const endType = connectorData.end || context.end
    let end = {}
    if (endType === "arrow") {
      let s = line.data[1]
      const e = line.data[0]
      const distance = Math.sqrt(Math.pow(s[0] - e[0], 2) + Math.pow(s[1] - e[1], 2))
      if (distance < 5 && line.data[2]) {
        s = line.data[2]
      }

      end = connectorArrow({ canvasContext: this.context, annotation: this.annotation, start: s, end: e })
    } else if (endType === "dot") {
      end = connectorDot({ canvasContext: this.context, line })
    }

    if (end.components) { components = components.concat(end.components)}

    if (this.editMode) {
      if (handles.length !== 0) components.push({ type: "handle", handles })
    }
    return components;
  }

  drawNote (context={}) {
    const noteData = this.annotation.note
    const align = noteData.align || context.align || 'dynamic'
    const noteParams = { bbox: context.bbox, align, offset: this.annotation.offset }
    const lineType = noteData.lineType || context.lineType
    let note={}
    if (lineType === "vertical") note = noteVertical(noteParams)
    else if (lineType === "horizontal") note = noteHorizontal(noteParams)

    let { components=[], handles=[] } = note
    if (this.editMode) {
      handles = this.mapHandles([{ x: 0, y: 0, drag: this.dragNote.bind(this)}])
      components.push({ type: "handle", handles })
    }
    return components
  }

  drawNoteContent (context) {
    const noteData = this.annotation.note
    const padding = noteData.padding || this.notePadding
    let orientation = noteData.orientation || context.orientation || 'topBottom'
    const lineType = noteData.lineType || context.lineType
    const align = noteData.align || context.align || 'dynamic'
    
    if (lineType === "vertical") orientation =  "leftRight"
    else if (lineType === "horizontal") orientation = "topBottom"

    const noteParams = { padding, bbox: context.bbox, offset: 
    this.annotation.offset, orientation, align }
    const { x, y } = noteAlignment(noteParams)
    this.offsetCornerX = x + this.annotation.dx
    this.offsetCornerY = y + this.annotation.dy
    this.note && this.noteContent.attr('transform', `translate(${x}, ${y})`)
    
    return []
  } 


  // redrawSubject () {
  //   this.subject && this.drawOnScreen( this.subject, this.drawSubject())
  // }

  // redrawConnector () {
  //   this.connector && this.drawOnScreen( this.connector, this.drawConnector())   
  // }

  // redrawNote (bbox=this.getNoteBBox()) {
  //   this.noteContent && this.drawOnScreen( this.noteContent, this.drawNoteContent({ bbox }))
  //  // this.note && this.drawOnScreen( this.note, this.drawNote({ bbox }))  
  // }

  // setPosition () {
  //   const position = this.annotation.position 
  //   this.a.attr('transform', `translate(${position.x}, ${position.y})`)
  // }

  // setOffset () {
  //   if (this.note) {
  //     const offset = this.annotation.offset
  //     this.note.attr('transform', `translate(${offset.x}, ${offset.y})`)
  //   }
  // }

  setPositionWithAccessors (accessors) {
    if (accessors && this.annotation.data) {
      this.mapX(accessors)
      this.mapY(accessors)
    }
    this.setPosition()
  }


  // setClassName () {
  //   this.a.attr("class", `annotation ${this.className && this.className()} ${this.editMode ? "editable" : ""} ${this.annotation.className || ''}`)
  // }

  draw () {
    // if (!this.context) {
    //   this.setClassName()
    //   this.setPosition()
    //   this.setOffset()
    // }
    this.redrawSubject()
    this.redrawConnector()
    this.redrawNote()
  }

  dragstarted () { event.sourceEvent.stopPropagation(); 
    this.a.classed("dragging", true) 
    this.a.selectAll("circle.handle").style("pointer-events", "none")
  }
  dragended () { 
    this.a.classed("dragging", false)
    this.a.selectAll("circle.handle").style("pointer-events", "all")
  }

  dragSubject () {
    const position = this.annotation.position
    position.x += event.dx
    position.y += event.dy
    this.annotation.position = position
  }

  dragNote () {
    const offset = this.annotation.offset
    offset.x += event.dx
    offset.y += event.dy
    this.annotation.offset = offset
  }

  mapHandles (handles) {
    return handles
    .map(h => ({ ...h, 
      start: this.dragstarted.bind(this), end: this.dragended.bind(this) }))
  }
}

const addHandlers = ( dispatcher, annotation, { component, name }) => {
  if (component) {
    component
    .on("mouseover.annotations", () => {
      dispatcher.call(`${name}over`, component, annotation)})
    .on("mouseout.annotations", () => dispatcher.call(`${name}out`, component, annotation))
    .on("click.annotations", () => dispatcher.call(`${name}click`, component, annotation))
  }
}

//Text wrapping code adapted from Mike Bostock
const wrap = (text, width) => {
  text.each(function () {
    const text = select(this),
      words = text.text().split(/[ \t\r\n]+/).reverse(),
      // lineNumber = 0,
      lineHeight = .2, //ems
      // y = text.attr("y"),
      dy = parseFloat(text.attr("dy")) || 0
    
    let word,
      line = [],
      tspan = text.text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("dy", dy + "em")

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
  if (!selection) {
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

export default CanvasRenderer