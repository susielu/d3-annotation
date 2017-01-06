import { line, arc, curveLinear, symbol, symbolTriangle } from "d3-shape"

export const lineBuilder = ({ data, curve=curveLinear, context, className }) => { 
  const lineGen = line()
    .curve(curve)

  const builder = {
    type: 'path',
    className,
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

export const arcBuilder = ({ data, context, className }) => {

  const builder = {
    type: 'path',
    className,
    data
  }

  const arcShape = arc()
    .innerRadius(data.innerRadius || 0)
    .outerRadius(data.outerRadius || data.radius || 0)
    .startAngle(data.startAngle || 0)
    .endAngle(data.endAngle || 2*Math.PI)

  if (context) {
    arcShape.context(context)
    builder.pathMethods = lineGen

  } else {
    
    builder.attrs = {
      d: arcShape()
    }
  }

  return builder
}

export const triangleBuilder = ({ data, context, className }) => {
   const builder = {
    type: 'path',
    className,
    data
  }

  const triangle = symbol().type(symbolTriangle).size(data.size || 10)

  if (context) {
    arcShape.context(context)
    builder.pathMethods = lineGen
    builder.transform = data.transform

  } else {
    
    builder.attrs = {
      d: triangle(),
      transform: data.transform
    }
  }

  return builder
}