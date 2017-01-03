
import { lineBuilder, arcBuilder } from './Builder'
const CLASS = "subject"

export const subjectLine = ({ annotation, offset=annotation.position, context, 
    curve, bbox}) => {

  const td = annotation.typeData

  let x1 = (td.x1 !== undefined ? td.x1 : annotation.x) - offset.x,
    x2 = (td.x2 !== undefined ? td.x2 : annotation.x) - offset.x,
    y1 = (td.y1 !== undefined ? td.y1 : annotation.y) - offset.y,
    y2 = (td.y2 !== undefined ? td.y2 : annotation.y) - offset.y

  const data = [[x1, y1], [x2, y2]]
  return lineBuilder({ data, curve, context, className : CLASS })
}

export const subjectCircle = ({ annotation, offset=annotation.position, context }) => {
  const data = annotation.typeData || {}
  return arcBuilder({ data, context, className: CLASS })
}