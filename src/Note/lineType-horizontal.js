import { lineBuilder } from '../Builder'
import { topBottomDynamic } from './alignment'

export default ({ align, x=0, y=0, offset, bbox }) => {
  align = topBottomDynamic(align, offset.x)

  if (align === "right") { x -= bbox.width }
  else if (align === "middle") { x -= bbox.width/2 }

  const data = [[x, y], [x + bbox.width, y]]
  return { components: [lineBuilder({ data, className : "note-line" })] }
}