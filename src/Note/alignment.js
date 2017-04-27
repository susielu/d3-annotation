
export const leftRightDynamic = (align, y) => {
  if (align === "dynamic" || align === "left" || align === "right") {
    if (y < 0) { align = "top" }
    else { align = "bottom" } 
  }
  return align
}

export const topBottomDynamic = (align, x) => {
  if (align === "dynamic" || align === "top" || align === "bottom") {
    if (x < 0) { align = "right" }
    else { align = "left" }      
  }
  return align
}

const orientationTopBottom = ["topBottom", "top", "bottom"]
const orientationLeftRight = ["leftRight", "left", "right"]

export default ({ padding=0, bbox={x:0, y:0, width:0, height:0}, align, orientation, offset={x:0, y:0} }) => {
  let x = -bbox.x 
  let y = 0//-bbox.y
  if ( orientationTopBottom.indexOf(orientation) !== -1 ) {
    align = topBottomDynamic(align, offset.x)
    if (offset.y < 0 && orientation === "topBottom" || orientation === "top") { 
      y -= bbox.height + padding
    } else {
      y += padding
    }

    if ( align === "middle" ) {
      x -= bbox.width/2
    } else if (align === "right" ) {
      x -= bbox.width
    } 

  } else if ( orientationLeftRight.indexOf(orientation) !== -1 ) {
    align = leftRightDynamic(align, offset.y)
    if (offset.x < 0 && orientation === "leftRight" || orientation === "left") { 
      x -= bbox.width + padding
    } else {
      x += padding
    }

    if ( align === "middle" ) {
      y -= bbox.height/2
    } else if (align === "top" ) {
      y -= bbox.height
    }
  } 

  return { x, y }
}