
import { lineBuilder } from './Builder'
const CLASS = "connector"

export const textBoxLine = ({ annotation, offset={x: 0, y: 0}, context, 
    curve, bbox, align, padding=5}) => {
  if (align == "right") {
    offset.x -= bbox.width
  } else if (align == "middle"){
    offset.x -= bbox.width/2
  }

  let x1 = offset.x,
    x2 = x1 + bbox.width,
    y1 = offset.y,
    y2 = offset.y

  const data = [[x1, y1], [x2, y2]]
  return lineBuilder({ data, curve, context, className : CLASS })
}

export const textBoxTitleline = () => {

}

export const textBoxSideline = ({ annotation, offset={x: 0, y: 0}, context, 
    curve, bbox, padding = 5, position="left"}) => {

  let x = offset.x,
    y1 = offset.y,
    y2 = offset.y + bbox.height 

  if (position == "top") {
    y2 = offset.y - bbox.height
  }

  const data = [[x, y1], [x, y2]]
  return lineBuilder({ data, curve, context, className : CLASS })
}