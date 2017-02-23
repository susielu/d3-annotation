
import { lineBuilder, arcBuilder } from './Builder'
const CLASS = "subject"

export const subjectLine = ({ annotation, offset=annotation.position, canvasContext, 
    curve, bbox, className }) => {

  const subjectData = annotation.subject

  let x1 = (subjectData.x1 !== undefined ? subjectData.x1 : annotation.x) - offset.x,
    x2 = (subjectData.x2 !== undefined ? subjectData.x2 : annotation.x) - offset.x,
    y1 = (subjectData.y1 !== undefined ? subjectData.y1 : annotation.y) - offset.y,
    y2 = (subjectData.y2 !== undefined ? subjectData.y2 : annotation.y) - offset.y

  const data = [[x1, y1], [x2, y2]]
  return lineBuilder({ data, curve, canvasContext, className : className ||CLASS })
}

export const subjectCircle = ({ annotation, offset=annotation.position, canvasContext, className, data }) => {
  if (!data) { data = annotation.subject || {}}
  return arcBuilder({ data, canvasContext, className: className || CLASS })
}