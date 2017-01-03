
import { lineBuilder } from './Builder'
const CLASS = "connector"

export const textBoxUnderline = ({ annotation, offset={x: 0, y: 0}, context, 
    curve, bbox}) => {

  let x1 = offset.x,
    x2 = x1 + bbox.width,
    y1 = offset.y,
    y2 = offset.y

  const data = [[x1, y1], [x2, y2]]
  return lineBuilder({ data, curve, context, className : CLASS })
}