import { lineBuilder } from '../Builder'

export const lineSetup = (type) => {
  let annotation = type.annotation
  let offset = annotation.position
  
  let x1 = annotation.x - offset.x,
    x2 = x1 + annotation.dx,
    y1 = annotation.y - offset.y,
    y2 = y1 + annotation.dy


 const subjectData = annotation.subject

  if (subjectData.outerRadius || subjectData.radius){
    const h =  Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2))
    const angle = Math.asin(-y2/h)
    const r = subjectData.outerRadius || subjectData.radius + (subjectData.radiusPadding || 0)

    x1 = Math.abs(Math.cos(angle)*r)*(x2 < 0 ? -1 : 1)
    y1 = Math.abs(Math.sin(angle)*r)*(y2 < 0 ? -1 : 1)

  }

  return [[x1, y1], [x2, y2]]
}

export default ({ type }) => {
  const data = lineSetup(type)
  return { components: lineBuilder({ data, className : "connector" })} 
}