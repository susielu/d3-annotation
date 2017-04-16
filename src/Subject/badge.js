import { lineBuilder, arcBuilder } from '../Builder'
import { event } from 'd3-selection'

export default ({ subjectData, type }) => {
  const typeSettings = type.typeSettings && type.typeSettings.subject

  if (!subjectData.radius ) {
    if (typeSettings && typeSettings.radius) {
      subjectData.radius = typeSettings.radius
    } else {
      subjectData.radius = 14
    }
  }
  if (!subjectData.x) {
    if (typeSettings && typeSettings.x) {
      subjectData.x = typeSettings.x
    } else {
      subjectData.x = "left"
    }
  }
  if (!subjectData.y) {
    if (typeSettings && typeSettings.y) {
      subjectData.y = typeSettings.y
    } else {
      subjectData.y = "top"
    }
  }

  let handles = []
  const radius = subjectData.radius 
  const innerRadius = radius*.7
  const x = subjectData.x === "left" ? -radius : radius
  const y = subjectData.y === "top" ? -radius : radius
  const transform = `translate(${x}, ${y})`
  const circlebg = arcBuilder({ className: 'subject', data: { radius} }) 
  circlebg.attrs.transform = transform

  const circle = arcBuilder({ className: 'subject-ring', data: { outerRadius: radius, innerRadius} })
  circle.attrs.transform = transform

  const pointer = lineBuilder({ className: 'subject-pointer',
    data: [[0, 0], [x, 0], [0, y], [0, 0]]
  })

  if (type.editMode) {

    const dragBadge = () => {
      subjectData.x = event.x < 0 ? "left" : "right"
      subjectData.y = event.y < 0 ? "top" : "bottom"
      type.redrawSubject()
    }

    const bHandles = [{ x: x*2, y: y*2, drag: dragBadge.bind(type)}]
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
  return { components: [pointer, circlebg, circle, text], handles }
}