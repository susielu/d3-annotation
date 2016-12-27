import { line, curveLinear } from "d3-shape"

const CLASS = "connector"

export const connectorLine = ({ annotation, offset=annotation.position, context, 
    curve=curveLinear, bbox}) => {

  let x1 = annotation.x - offset.x,
    x2 = x1 + annotation.dx,
    y1 = annotation.y - offset.y,
    y2 = y1 + annotation.dy


  if (annotation.dx && bbox && bbox.width && annotation.dx < 0 
      && Math.abs(annotation.dx) > bbox.width/2) {
    
    x2 += bbox.width
  }

  const data = [[x1, y1], [x2, y2]]

  const lineGen = line()
    .curve(curve)

  const builder = {
    type: 'path',
    className: CLASS,
    data
  }

  if (context) {
    lineGen.context(context)
    builder.pathMethods = lineGen

  } else {
    builder.attrs = {
      d: lineGen(data)
    }
  }

  return builder
}