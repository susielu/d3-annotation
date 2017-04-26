import { arcBuilder } from '../Builder'

export default ({ canvasContext, line }) => {
  
  let dot = arcBuilder({ className: 'connector-dot', data: { radius: 3}, canvasContext })
  if (!canvasContext) {
    dot.attrs.transform = `translate(${line.data[0][0]}, ${line.data[0][1]})`
  } 
  return { components: [dot] }
}
