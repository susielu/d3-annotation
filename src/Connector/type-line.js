import { lineBuilder } from '../Builder'

export const lineSetup = ({ type, subjectType }) => {
  let annotation = type.annotation
  let offset = annotation.position
  
  let x1 = annotation.x - offset.x,
    x2 = x1 + annotation.dx,
    y1 = annotation.y - offset.y,
    y2 = y1 + annotation.dy


  const subjectData = annotation.subject

  if (subjectType === "circle" && (subjectData.outerRadius || subjectData.radius)) {
    const h =  Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2))
    const angle = Math.asin(-y2/h)
    const r = subjectData.outerRadius || subjectData.radius + (subjectData.radiusPadding || 0)

    x1 = Math.abs(Math.cos(angle)*r)*(x2 < 0 ? -1 : 1)
    y1 = Math.abs(Math.sin(angle)*r)*(y2 < 0 ? -1 : 1)

  }

  if (subjectType === "rect") {
    const { width, height } = subjectData
    
    if (width > 0 && annotation.dx > 0 || width < 0 && annotation.dx < 0) {
      if (Math.abs(width) > Math.abs(annotation.dx)) x1 = width/2
      else x1 = width
    } 
    if (height > 0 && annotation.dy > 0 || height < 0 && annotation.dy < 0) {
      if (Math.abs(height) > Math.abs(annotation.dy)) y1 = height/2
      else y1 = height
    }
    if (x1 === width/2 && y1 === height/2) { x1 = x2; y1 = y2;}
  }


  return [[x1, y1], [x2, y2]]
}

export default (connectorData) => {
  const data = lineSetup(connectorData)
  return { components: [lineBuilder({ data, className : "connector" })]} 
}