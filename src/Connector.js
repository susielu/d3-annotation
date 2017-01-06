
import { lineBuilder } from './Builder'
const CLASS = "connector"

export const connectorLine = ({ annotation, offset=annotation.position, context, 
    curve, bbox, elbow=true }) => {

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

  if (elbow) {
    const angle = 45/180*Math.PI
    let diff = - (y1 - y2)/Math.cos(angle)
    let xe = x1 

    if (y2 < 0 && x2 < 0) {
      xe += diff
    } else {
      xe -= diff
    }

    data.splice(1, 0, [xe , y2 ])
  }

  return lineBuilder({ data, curve, context, className : CLASS })
}

export const connectorArrow = ({ annotation, offset=annotation.position, context, bbox}) => {

  let x1 = annotation.x - offset.x,
    y1 = annotation.y - offset.y;

  let dx = annotation.dx

  //Think about how to deal with this properly
  if (annotation.dx && bbox && bbox.width && annotation.dx < 0 
      && Math.abs(annotation.dx) > bbox.width/2) {
    
    dx += bbox.width
  }

  let size = 10;
  let angleOffset = 16/180*Math.PI
  let angle = Math.atan(annotation.dy/dx)

  if (dx < 0 ) {
    angle += Math.PI
  }

  const data = [[x1, y1], 
    [Math.cos(angle + angleOffset)*size, Math.sin(angle + angleOffset)*size],
    [Math.cos(angle - angleOffset)*size, Math.sin(angle - angleOffset)*size],
    [x1, y1]
    ]

  return lineBuilder({ data, context, className : CLASS + '-arrow' })
}