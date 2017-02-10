
import { lineBuilder } from './Builder'
const CLASS = "connector"

export const textBoxLine = ({ annotation, offset={x: 0, y: 0}, context, 
    curve, bbox, position="top", align="left", padding=5}) => {

  let x1 = offset.x,
    x2 = x1 + bbox.width,
    y1 = offset.y,
    y2 = offset.y

  if (position == "bottom") {
    y1 += bbox.height + padding
    y2 += bbox.height + padding
  }

  const data = [[x1, y1], [x2, y2]]
  return lineBuilder({ data, curve, context, className : CLASS })
}

export const textBoxSideline = ({ annotation, offset={x: 0, y: 0}, context, 
    curve, bbox, padding = 5, position="left"}) => {

  let x = offset.x,
    y1 = offset.y,
    y2 = offset.y + bbox.height + padding

  if (position == "right") {
    x += bbox.width + padding
  }

  const data = [[x, y1], [x, y2]]
  return lineBuilder({ data, curve, context, className : CLASS })
}