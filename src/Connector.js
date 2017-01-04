
import { lineBuilder } from './Builder'
const CLASS = "connector"

export const connectorLine = ({ annotation, offset=annotation.position, context, 
    curve, bbox}) => {

  let x1 = annotation.x - offset.x,
    x2 = x1 + annotation.dx,
    y1 = annotation.y - offset.y,
    y2 = y1 + annotation.dy


  if (annotation.dx && bbox && bbox.width && annotation.dx < 0 
      && Math.abs(annotation.dx) > bbox.width/2) {
    
    x2 += bbox.width
  }

  const td = annotation.typeData
  if (td.outerRadius || td.radius){

    const h =  Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2))
    const angle = Math.asin(-y2/h)
    const r = td.outerRadius || td.radius + (td.radiusPadding || 0)

    x1 = Math.abs(Math.cos(angle)*r)*(x2 < 0 ? -1 : 1)
    y1 = Math.abs(Math.sin(angle)*r)*(y2 < 0 ? -1 : 1)

  }

  const data = [[x1, y1], [x2, y2]]
  return lineBuilder({ data, curve, context, className : CLASS })
}