import { lineBuilder, arcBuilder } from "../Builder"
import { event } from "d3-selection"

export default ({ subjectData = {}, type = {} }) => {
  const typeSettings = type.typeSettings && type.typeSettings.subject

  if (!subjectData.radius) {
    if (typeSettings && typeSettings.radius) {
      subjectData.radius = typeSettings.radius
    } else {
      subjectData.radius = 14
    }
  }
  if (!subjectData.x) {
    if (typeSettings && typeSettings.x) {
      subjectData.x = typeSettings.x
    }
  }
  if (!subjectData.y) {
    if (typeSettings && typeSettings.y) {
      subjectData.y = typeSettings.y
    }
  }

  let handles = []
  const components = []
  const radius = subjectData.radius
  const innerRadius = radius * 0.7
  let x = 0
  let y = 0

  const notCornerOffset = Math.sqrt(2) * radius
  const placement = {
    xleftcorner: -radius,
    xrightcorner: radius,
    ytopcorner: -radius,
    ybottomcorner: radius,
    xleft: -notCornerOffset,
    xright: notCornerOffset,
    ytop: -notCornerOffset,
    ybottom: notCornerOffset
  }

  if (subjectData.x && !subjectData.y) {
    x = placement[`x${subjectData.x}`]
  } else if (subjectData.y && !subjectData.x) {
    y = placement[`y${subjectData.y}`]
  } else if (subjectData.x && subjectData.y) {
    x = placement[`x${subjectData.x}corner`]
    y = placement[`x${subjectData.x}corner`]
  }

  const transform = `translate(${x}, ${y})`
  const circlebg = arcBuilder({ className: "subject", data: { radius } })
  circlebg.attrs.transform = transform

  const circle = arcBuilder({
    className: "subject-ring",
    data: { outerRadius: radius, innerRadius }
  })

  circle.attrs.transform = transform

  if (x && y) {
    const pointer = lineBuilder({
      className: "subject-pointer",
      data: [[0, 0], [x, 0], [0, y], [0, 0]]
    })
    components.push(pointer)
  } else if (x || y) {
    const notCornerPointerXY = (v, sign = 1) =>
      v && v / Math.sqrt(2) / Math.sqrt(2) || sign * radius / Math.sqrt(2)

    const pointer = lineBuilder({
      className: "subject-pointer",
      // data: [[0, 0], [x , y || notCornerOffset], [x, y || -notCornerOffset], [0, 0]]
      data: [
        [0, 0],
        [notCornerPointerXY(x), notCornerPointerXY(y)],
        [notCornerPointerXY(x, -1), notCornerPointerXY(y, -1)],
        [0, 0]
      ]
    })
    components.push(pointer)
  }
  if (type.editMode) {
    const dragBadge = () => {
      subjectData.x = event.x < 0 ? "left" : "right"
      subjectData.y = event.y < 0 ? "top" : "bottom"
      type.redrawSubject()
    }

    const bHandles = [{ x: x * 2, y: y * 2, drag: dragBadge.bind(type) }]
    handles = type.mapHandles(bHandles)
  }

  let text
  if (subjectData.text) {
    text = {
      type: "text",
      className: "badge-text",
      attrs: {
        text: subjectData.text,
        "text-anchor": "middle",
        dy: ".25em",
        x,
        y
      }
    }
  }

  components.push(circlebg)
  components.push(circle)
  components.push(text)

  return { components, handles }
}
