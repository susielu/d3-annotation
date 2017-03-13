import { lineBuilder } from '../Builder'
import { leftRightDynamic } from './alignment'

export default ({ align, x=0, y=0, bbox, offset }) => {
  align = leftRightDynamic(align, offset.y)

  if (align === "top") { y -= bbox.height } 
  else if (align === "middle") { y -= bbox.height/2 }

  const data = [[x, y], [x, y + bbox.height]]
  return { components: [lineBuilder({ data, className : "note-line" })] }
}