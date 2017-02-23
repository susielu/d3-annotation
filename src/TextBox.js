
import { lineBuilder } from './Builder'
const CLASS = "connector"

export const textBoxLine = ({ annotation, offset={x: 0, y: 0}, canvasContext, 
    curve, bbox, align, padding=5, className }) => {
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
  return lineBuilder({ data, curve, canvasContext, className : className || CLASS })
}

export const textBoxSideline = ({ annotation, offset={x: 0, y: 0}, canvasContext, className, 
    curve, bbox, padding = 5, align}) => {
 if (align == "top") {
    offset.y -= bbox.height
  } else if (align == "middle") {
    offset.y -= bbox.height/2
  }

  let x = offset.x,
    y1 = offset.y,
    y2 = offset.y + bbox.height 



  const data = [[x, y1], [x, y2]]
  return lineBuilder({ data, curve, canvasContext, className : className || CLASS })
}

//TODO: make title line example
export const textBoxTitleline = () => {

}
