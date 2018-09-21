import { select, event } from "d3-selection"
import { drag } from "d3-drag"
import { addHandles } from "./Handles"

//Note options
import noteAlignment from "./Note/alignment"
import noteVertical from "./Note/lineType-vertical"
import noteHorizontal from "./Note/lineType-horizontal"

//Connector options
import connectorLine from "./Connector/type-line"
import connectorElbow from "./Connector/type-elbow"
import connectorCurve from "./Connector/type-curve"
import connectorArrow from "./Connector/end-arrow"
import connectorDot from "./Connector/end-dot"

//Subject options
import subjectCircle from "./Subject/circle"
import subjectRect from "./Subject/rect"
import subjectThreshold from "./Subject/threshold"
import subjectBadge from "./Subject/badge"

export class Type {
  constructor({ a, annotation, editMode, dispatcher, notePadding, accessors }) {
    this.a = a

    this.note =
      annotation.disable.indexOf("note") === -1 && a.select("g.annotation-note")
    this.noteContent = this.note && a.select("g.annotation-note-content")
    this.connector =
      annotation.disable.indexOf("connector") === -1 &&
      a.select("g.annotation-connector")
    this.subject =
      annotation.disable.indexOf("subject") === -1 &&
      a.select("g.annotation-subject")
    this.dispatcher = dispatcher

    if (dispatcher) {
      const handler = addHandlers.bind(null, dispatcher, annotation)
      handler({ component: this.note, name: "note" })
      handler({ component: this.connector, name: "connector" })
      handler({ component: this.subject, name: "subject" })
    }

    this.annotation = annotation
    this.editMode = annotation.editMode || editMode
    this.notePadding = notePadding !== undefined ? notePadding : 3
    this.offsetCornerX = 0
    this.offsetCornerY = 0

    if (accessors && annotation.data) {
      this.init(accessors)
    }
  }

  init(accessors) {
    if (!this.annotation.x) {
      this.mapX(accessors)
    }
    if (!this.annotation.y) {
      this.mapY(accessors)
    }
  }

  mapY(accessors) {
    if (accessors.y) {
      this.annotation.y = accessors.y(this.annotation.data)
    }
  }

  mapX(accessors) {
    if (accessors.x) {
      this.annotation.x = accessors.x(this.annotation.data)
    }
  }

  updateEditMode() {
    this.a.selectAll("circle.handle").remove()
  }

  drawOnSVG(component, builders) {
    if (!Array.isArray(builders)) {
      builders = [builders]
    }

    builders
      .filter(b => b)
      .forEach(({ type, className, attrs, handles, classID }) => {
        if (type === "handle") {
          addHandles({ group: component, r: attrs && attrs.r, handles })
        } else {
          newWithClass(component, [this.annotation], type, className, classID)
          const el = component.select(`${type}.${classID || className}`)
          const addAttrs = Object.keys(attrs)
          const removeAttrs = []

          const currentAttrs = el.node().attributes
          for (let i = currentAttrs.length - 1; i >= 0; i--) {
            const name = currentAttrs[i].name
            if (addAttrs.indexOf(name) === -1 && name !== "class")
              removeAttrs.push(name)
          }

          addAttrs.forEach(attr => {
            if (attr === "text") {
              el.text(attrs[attr])
            } else {
              el.attr(attr, attrs[attr])
            }
          })

          removeAttrs.forEach(attr => el.attr(attr, null))
        }
      })
  }

  //TODO: how to extend this to a drawOnCanvas mode?

  getNoteBBox() {
    return bboxWithoutHandles(this.note, ".annotation-note-content text")
  }
  getNoteBBoxOffset() {
    const bbox = bboxWithoutHandles(this.note, ".annotation-note-content")
    const transform = this.noteContent.attr("transform").split(/\(|\,|\)/g)
    bbox.offsetCornerX = parseFloat(transform[1]) + this.annotation.dx
    bbox.offsetCornerY = parseFloat(transform[2]) + this.annotation.dy
    bbox.offsetX = this.annotation.dx
    bbox.offsetY = this.annotation.dy
    return bbox
  }

  drawSubject(context = {}) {
    const subjectData = this.annotation.subject
    const type = context.type
    const subjectParams = { type: this, subjectData }

    let subject = {}
    if (type === "circle") subject = subjectCircle(subjectParams)
    else if (type === "rect") subject = subjectRect(subjectParams)
    else if (type === "threshold") subject = subjectThreshold(subjectParams)
    else if (type === "badge")
      subject = subjectBadge(subjectParams, this.annotation)

    let { components = [], handles = [] } = subject
    components.forEach(c => {
      if (c && c.attrs && !c.attrs.stroke) {
        c.attrs.stroke = this.annotation.color
      }
    })

    if (this.editMode) {
      handles = handles.concat(
        this.mapHandles([{ drag: this.dragSubject.bind(this) }])
      )
      components.push({ type: "handle", handles })
    }

    return components
  }

  drawConnector(context = {}) {
    const connectorData = this.annotation.connector
    const type = connectorData.type || context.type
    const connectorParams = { type: this, connectorData }
    connectorParams.subjectType =
      this.typeSettings &&
      this.typeSettings.subject &&
      this.typeSettings.subject.type

    let connector = {}
    if (type === "curve") connector = connectorCurve(connectorParams)
    else if (type === "elbow") connector = connectorElbow(connectorParams)
    else connector = connectorLine(connectorParams)
    let { components = [], handles = [] } = connector
    const line = components[0]
    //TODO: genericize this into fill t/f stroke t/f
    if (line) {
      line.attrs.stroke = this.annotation.color
      line.attrs.fill = "none"
    }
    const endType = connectorData.end || context.end
    let end = {}
    if (endType === "arrow") {
      let s = line.data[1]
      const e = line.data[0]
      const distance = Math.sqrt(
        Math.pow(s[0] - e[0], 2) + Math.pow(s[1] - e[1], 2)
      )
      if (distance < 5 && line.data[2]) {
        s = line.data[2]
      }
      end = connectorArrow({
        annotation: this.annotation,
        start: s,
        end: e,
        scale: connectorData.endScale
      })
    } else if (endType === "dot") {
      end = connectorDot({ line, scale: connectorData.endScale })
    } else if (!endType || endType === "none") {
      this.connector && this.connector.select(".connector-end").remove()
    }

    if (end.components) {
      end.components.forEach(c => {
        c.attrs.fill = this.annotation.color
        c.attrs.stroke = this.annotation.color
      })
      components = components.concat(end.components)
    }

    if (this.editMode) {
      if (handles.length !== 0) components.push({ type: "handle", handles })
    }
    return components
  }

  drawNote(context = {}) {
    const noteData = this.annotation.note
    const align = noteData.align || context.align || "dynamic"
    const noteParams = {
      bbox: context.bbox,
      align,
      offset: this.annotation.offset
    }
    const lineType = noteData.lineType || context.lineType
    let note = {}
    if (lineType === "vertical") note = noteVertical(noteParams)
    else if (lineType === "horizontal") note = noteHorizontal(noteParams)

    let { components = [], handles = [] } = note
    components.forEach(c => {
      c.attrs.stroke = this.annotation.color
    })

    if (this.editMode) {
      handles = this.mapHandles([
        { x: 0, y: 0, drag: this.dragNote.bind(this) }
      ])
      components.push({ type: "handle", handles })

      const dragging = this.dragNote.bind(this),
        start = this.dragstarted.bind(this),
        end = this.dragended.bind(this)
      this.note.call(
        drag()
          .container(select("g.annotations").node())
          .on("start", d => start(d))
          .on("drag", d => dragging(d))
          .on("end", d => end(d))
      )
    } else {
      this.note.on("mousedown.drag", null)
    }
    return components
  }

  drawNoteContent(context) {
    const noteData = this.annotation.note
    const padding =
      noteData.padding !== undefined ? noteData.padding : this.notePadding
    let orientation = noteData.orientation || context.orientation || "topBottom"
    const lineType = noteData.lineType || context.lineType
    const align = noteData.align || context.align || "dynamic"

    if (lineType === "vertical") orientation = "leftRight"
    else if (lineType === "horizontal") orientation = "topBottom"

    const noteParams = {
      padding,
      bbox: context.bbox,
      offset: this.annotation.offset,
      orientation,
      align
    }
    const { x, y } = noteAlignment(noteParams)
    this.offsetCornerX = x + this.annotation.dx
    this.offsetCornerY = y + this.annotation.dy
    this.note && this.noteContent.attr("transform", `translate(${x}, ${y})`)

    return []
  }

  drawOnScreen(component, drawFunction) {
    return this.drawOnSVG(component, drawFunction)
  }

  redrawSubject() {
    this.subject && this.drawOnScreen(this.subject, this.drawSubject())
  }

  redrawConnector() {
    this.connector && this.drawOnScreen(this.connector, this.drawConnector())
  }

  redrawNote(bbox = this.getNoteBBox()) {
    this.noteContent &&
      this.drawOnScreen(this.noteContent, this.drawNoteContent({ bbox }))
    this.note && this.drawOnScreen(this.note, this.drawNote({ bbox }))
  }

  setPosition() {
    const position = this.annotation.position
    this.a.attr("transform", `translate(${position.x}, ${position.y})`)
  }

  clearComponents() {
    this.subject && this.subject.select("*").remove()
    this.connector && this.connector.select("*").remove()
    // this.note && this.note.select("*").remove()
  }

  setOffset() {
    if (this.note) {
      const offset = this.annotation.offset
      this.note.attr("transform", `translate(${offset.x}, ${offset.y})`)
    }
  }

  setPositionWithAccessors(accessors) {
    if (accessors && this.annotation.data) {
      this.mapX(accessors)
      this.mapY(accessors)
    }
    this.setPosition()
  }

  setClassName() {
    this.a.attr(
      "class",
      `annotation ${this.className && this.className()} ${
        this.editMode ? "editable" : ""
      } ${this.annotation.className || ""}`
    )
  }

  draw() {
    this.setClassName()
    this.setPosition()
    this.setOffset()
    this.redrawSubject()
    this.redrawConnector()
    this.redrawNote()
  }

  dragstarted() {
    event.sourceEvent.stopPropagation()
    this.dispatcher &&
      this.dispatcher.call("dragstart", this.a, this.annotation)
    this.a.classed("dragging", true)
    this.a.selectAll("circle.handle").style("pointer-events", "none")
  }
  dragended() {
    this.dispatcher && this.dispatcher.call("dragend", this.a, this.annotation)
    this.a.classed("dragging", false)
    this.a.selectAll("circle.handle").style("pointer-events", "all")
  }

  dragSubject() {
    const position = this.annotation.position
    position.x += event.dx
    position.y += event.dy
    this.annotation.position = position
  }

  dragNote() {
    const offset = this.annotation.offset
    offset.x += event.dx
    offset.y += event.dy
    this.annotation.offset = offset
  }

  mapHandles(handles) {
    return handles.map(h => ({
      ...h,
      start: this.dragstarted.bind(this),
      end: this.dragended.bind(this)
    }))
  }
}

export const customType = (initialType, typeSettings, init) => {
  return class customType extends initialType {
    constructor(settings) {
      super(settings)
      this.typeSettings = typeSettings

      if (typeSettings.disable) {
        typeSettings.disable.forEach(d => {
          this[d] && this[d].remove()

          this[d] = undefined
          if (d === "note") {
            this.noteContent = undefined
          }
        })
      }
    }

    static init(annotation, accessors) {
      super.init(annotation, accessors)
      if (init) {
        annotation = init(annotation, accessors)
      }
      return annotation
    }

    className() {
      return `${typeSettings.className ||
        super.className && super.className() ||
        ""}`
    }

    drawSubject(context) {
      this.typeSettings.subject = Object.assign(
        {},
        typeSettings.subject,
        this.typeSettings.subject
      )
      return super.drawSubject({ ...context, ...this.typeSettings.subject })
    }

    drawConnector(context) {
      this.typeSettings.connector = Object.assign(
        {},
        typeSettings.connector,
        this.typeSettings.connector
      )
      return super.drawConnector({
        ...context,
        ...typeSettings.connector,
        ...this.typeSettings.connector
      })
    }

    drawNote(context) {
      this.typeSettings.note = Object.assign(
        {},
        typeSettings.note,
        this.typeSettings.note
      )
      return super.drawNote({
        ...context,
        ...typeSettings.note,
        ...this.typeSettings.note
      })
    }

    drawNoteContent(context) {
      return super.drawNoteContent({
        ...context,
        ...typeSettings.note,
        ...this.typeSettings.note
      })
    }
  }
}

export class d3NoteText extends Type {
  constructor(params) {
    super(params)
    this.textWrap = params.textWrap || 120
    this.drawText()
  }

  updateTextWrap(textWrap) {
    this.textWrap = textWrap
    this.drawText()
  }

  //TODO: add update text functionality

  drawText() {
    if (this.note) {
      newWithClass(this.note, [this.annotation], "g", "annotation-note-content")

      const noteContent = this.note.select("g.annotation-note-content")
      newWithClass(noteContent, [this.annotation], "rect", "annotation-note-bg")
      newWithClass(
        noteContent,
        [this.annotation],
        "text",
        "annotation-note-label"
      )
      newWithClass(
        noteContent,
        [this.annotation],
        "text",
        "annotation-note-title"
      )

      let titleBBox = { height: 0 }
      const label = this.a.select("text.annotation-note-label")
      const wrapLength =
        this.annotation.note && this.annotation.note.wrap ||
        this.typeSettings &&
          this.typeSettings.note &&
          this.typeSettings.note.wrap ||
        this.textWrap

      const wrapSplitter =
        this.annotation.note && this.annotation.note.wrapSplitter ||
        this.typeSettings &&
          this.typeSettings.note &&
          this.typeSettings.note.wrapSplitter

      let bgPadding =
        this.annotation.note && this.annotation.note.bgPadding ||
        this.typeSettings &&
          this.typeSettings.note &&
          this.typeSettings.note.bgPadding

      let bgPaddingFinal = { top: 0, bottom: 0, left: 0, right: 0 }
      if (typeof bgPadding === "number") {
        bgPaddingFinal = {
          top: bgPadding,
          bottom: bgPadding,
          left: bgPadding,
          right: bgPadding
        }
      } else if (bgPadding && typeof bgPadding === "object") {
        bgPaddingFinal = Object.assign(bgPaddingFinal, bgPadding)
      }

      if (this.annotation.note.title) {
        const title = this.a.select("text.annotation-note-title")
        title.text(this.annotation.note.title)
        title.attr("fill", this.annotation.color)
        title.attr("font-weight", "bold")
        title.call(wrap, wrapLength, wrapSplitter)
        titleBBox = title.node().getBBox()
      }

      label.text(this.annotation.note.label).attr("dx", "0")
      label.call(wrap, wrapLength, wrapSplitter)

      label.attr("y", titleBBox.height * 1.1 || 0)
      label.attr("fill", this.annotation.color)

      const bbox = this.getNoteBBox()

      this.a
        .select("rect.annotation-note-bg")
        .attr("width", bbox.width + bgPaddingFinal.left + bgPaddingFinal.right)
        .attr(
          "height",
          bbox.height + bgPaddingFinal.top + bgPaddingFinal.bottom
        )
        .attr("x", bbox.x - bgPaddingFinal.left)
        .attr("y", -bgPaddingFinal.top)
        .attr("fill", "white")
        .attr("fill-opacity", 0)
    }
  }
}

export const d3Label = customType(d3NoteText, {
  className: "label",
  note: { align: "middle" }
})

export const d3Callout = customType(d3NoteText, {
  className: "callout",
  note: { lineType: "horizontal" }
})

export const d3CalloutElbow = customType(d3Callout, {
  className: "callout elbow",
  connector: { type: "elbow" }
})

export const d3CalloutCurve = customType(d3Callout, {
  className: "callout curve",
  connector: { type: "curve" }
})

export const d3Badge = customType(Type, {
  className: "badge",
  subject: { type: "badge" },
  disable: ["connector", "note"]
})

export const d3CalloutCircle = customType(d3NoteText, {
  className: "callout circle",
  subject: { type: "circle" },
  note: { lineType: "horizontal" },
  connector: { type: "elbow" }
})

export const d3CalloutRect = customType(d3NoteText, {
  className: "callout rect",
  subject: { type: "rect" },
  note: { lineType: "horizontal" },
  connector: { type: "elbow" }
})

class ThresholdMap extends d3Callout {
  mapY(accessors) {
    super.mapY(accessors)
    const a = this.annotation
    if ((a.subject.x1 || a.subject.x2) && a.data && accessors.y) {
      a.y = accessors.y(a.data)
    }
    if ((a.subject.x1 || a.subject.x2) && !a.x) {
      a.x = a.subject.x1 || a.subject.x2
    }
  }

  mapX(accessors) {
    super.mapX(accessors)
    const a = this.annotation
    if ((a.subject.y1 || a.subject.y2) && a.data && accessors.x) {
      a.x = accessors.x(a.data)
    }
    if ((a.subject.y1 || a.subject.y2) && !a.y) {
      a.y = a.subject.y1 || a.subject.y2
    }
  }
}

export const d3XYThreshold = customType(ThresholdMap, {
  className: "callout xythreshold",
  subject: { type: "threshold" }
})

export const newWithClass = (a, d, type, className, classID) => {
  const group = a.selectAll(`${type}.${classID || className}`).data(d)
  group
    .enter()
    .append(type)
    .merge(group)
    .attr("class", className)

  group.exit().remove()
  return a
}

const addHandlers = (dispatcher, annotation, { component, name }) => {
  if (component) {
    component
      .on("mouseover.annotations", () => {
        dispatcher.call(`${name}over`, component, annotation)
      })
      .on("mouseout.annotations", () =>
        dispatcher.call(`${name}out`, component, annotation)
      )
      .on("click.annotations", () =>
        dispatcher.call(`${name}click`, component, annotation)
      )
  }
}

//Text wrapping code adapted from Mike Bostock
const wrap = (text, width, wrapSplitter, lineHeight = 1.2) => {
  text.each(function() {
    const text = select(this),
      words = text
        .text()
        .split(wrapSplitter || /[ \t\r\n]+/)
        .reverse()
        .filter(w => w !== "")
    let word,
      line = [],
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("dy", 0.8 + "em")

    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", lineHeight + "em")
          .text(word)
      }
    }
  })
}

const bboxWithoutHandles = (selection, selector = ":not(.handle)") => {
  if (!selection) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  return selection
    .selectAll(selector)
    .nodes()
    .reduce(
      (p, c) => {
        const bbox = c.getBBox()
        p.x = Math.min(p.x, bbox.x)
        p.y = Math.min(p.y, bbox.y)
        p.width = Math.max(p.width, bbox.width)

        const yOffset = c && c.attributes && c.attributes.y
        p.height = Math.max(
          p.height,
          (yOffset && parseFloat(yOffset.value) || 0) + bbox.height
        )
        return p
      },
      { x: 0, y: 0, width: 0, height: 0 }
    )
}

export default {
  Type,
  d3Label,
  d3Callout,
  d3CalloutElbow,
  d3CalloutCurve,
  d3CalloutCircle,
  d3CalloutRect,
  d3XYThreshold,
  d3Badge,
  customType
}
