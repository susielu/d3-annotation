import { line, arc, curveLinear } from "d3-shape"

export const lineBuilder = ({ data, curve=curveLinear, canvasContext, className }) => { 
  const lineGen = line()
    .curve(curve)

  const builder = {
    type: 'path',
    className,
    data
  }

  if (canvasContext) {
    lineGen.context(canvasContext)
    builder.pathMethods = lineGen

  } else {
    builder.attrs = {
      d: lineGen(data)
    }
  }

  return builder
}

export const arcBuilder = ({ data, canvasContext, className }) => {

  const builder = {
    type: 'path',
    className,
    data
  }

  const arcShape = arc()
    .innerRadius(data.innerRadius || 0)
    .outerRadius(data.outerRadius || data.radius || 2)
    .startAngle(data.startAngle || 0)
    .endAngle(data.endAngle || 2*Math.PI)

  if (canvasContext) {
    arcShape.context(canvasContext)
    builder.pathMethods = lineGen

  } else {
    
    builder.attrs = {
      d: arcShape()
    }
  }

  return builder
}