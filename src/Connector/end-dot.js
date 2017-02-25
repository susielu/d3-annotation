import { arcBuilder } from '../Builder'

export default ({ line }) => {
  
  let dot = arcBuilder({ className: 'connector-dot', data: { radius: 3} })
  dot.attrs.transform = `translate(${line.data[0][0]}, ${line.data[0][1]})`
  
  return { components: [dot] }
}
