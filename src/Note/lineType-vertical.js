import { lineBuilder } from '../Builder'
import { leftRightDynamic } from './alignment'

export default ({ align, x, y, bbox, padding }) => {
  align = leftRightDynamic(align, y)

  if (align == "right") {
    x -= bbox.width
  } else if (align == "middle"){
    x -= bbox.width/2
  }

  let x1 = x,
    x2 = x1 + bbox.width,
    y1 = y,
    y2 = y

  const data = [[x1, y1], [x2, y2]]
  return { components: lineBuilder({ data, className : "note-line" }) }
}