import { arcBuilder } from '../Builder'

export default ({ line }) => {
  
  let dot = arcBuilder({ className : 'connector-end connector-dot', classID: 'connector-end', data: { radius: 3} })
  dot.attrs.transform = `translate(${line.data[0][0]}, ${line.data[0][1]})`
  
  return { components: [dot] }
}
