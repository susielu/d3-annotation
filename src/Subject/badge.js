import { lineBuilder, arcBuilder } from "../Builder"
import { event } from "d3-selection"

export default ({ subjectData = {}, type = {} }, annotation = {}) => {
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
    y = placement[`y${subjectData.y}corner`]
  }

  const transform = `translate(${x}, ${y})`
  const circlebg = arcBuilder({ className: "subject", data: { radius } })
  circlebg.attrs.transform = transform
  circlebg.attrs.fill = annotation.color
  circlebg.attrs["stroke-linecap"] = "round"
  circlebg.attrs["stroke-width"] = "3px"

  const circle = arcBuilder({
    className: "subject-ring",
    data: { outerRadius: radius, innerRadius }
  })

  circle.attrs.transform = transform
  // circle.attrs.fill = annotation.color
  circle.attrs["stroke-width"] = "3px"
  circle.attrs.fill = "white"

  let pointer
  if (x && y || !x && !y) {
    pointer = lineBuilder({
      className: "subject-pointer",
      data: [[0, 0], [x || 0, 0], [0, y || 0], [0, 0]]
    })
  } else if (x || y) {
    const notCornerPointerXY = (v, sign = 1) =>
      v && v / Math.sqrt(2) / Math.sqrt(2) || sign * radius / Math.sqrt(2)

    pointer = lineBuilder({
      className: "subject-pointer",
      data: [
        [0, 0],
        [notCornerPointerXY(x), notCornerPointerXY(y)],
        [notCornerPointerXY(x, -1), notCornerPointerXY(y, -1)],
        [0, 0]
      ]
    })
  }

  if (pointer) {
    pointer.attrs.fill = annotation.color
    pointer.attrs["stroke-linecap"] = "round"
    pointer.attrs["stroke-width"] = "3px"
    components.push(pointer)
  }

  if (type.editMode) {
    const dragBadge = () => {
      subjectData.x =
        event.x < -radius * 2
          ? "left"
          : event.x > radius * 2 ? "right" : undefined
      subjectData.y =
        event.y < -radius * 2
          ? "top"
          : event.y > radius * 2 ? "bottom" : undefined

      type.redrawSubject()
    }

    const bHandles = { x: x * 2, y: y * 2, drag: dragBadge.bind(type) }
    if (!bHandles.x && !bHandles.y) {
      bHandles.y = -radius
    }

    handles = type.mapHandles([bHandles])
  }

  let text
  if (subjectData.text) {
    text = {
      type: "text",
      className: "badge-text",
      attrs: {
        fill: "white",
        stroke: "none",
        "font-size": ".7em",
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
