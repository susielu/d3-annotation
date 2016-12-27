import { line, curveLinear } from "d3-shape"

const CLASS = "connector"

export const textBoxUnderline = ({ annotation, offset={x: 0, y: 0}, context, 
    curve=curveLinear, bbox}) => {

  let x1 = offset.x,
    x2 = x1 + bbox.width,
    y1 = offset.y,
    y2 = offset.y

  const data = [[x1, y1], [x2, y2]]

  const lineGen = line()
    .curve(curve)

  const builder = {
    type: 'path',
    className: 'underline',
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