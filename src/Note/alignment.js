
export const leftRightDynamic = (align, y) => {
  if (align == "dynamic" || align == "left" || align == "right"){
      if (y < 0){ align = "top" }
      else { align = "bottom" } 
  }
  return align
}

export const topBottomDynamic = (align, x) => {
  if (align == "dynamic" || align == "top" || align == "bottom"){
    if (x < 0){ align = "right" }
    else { align = "left" }      
  }
  return align
}


export default ({ padding, bbox, align, orientation, offset }) => {
    let x = -bbox.x 
    let y = -bbox.y

   if ( orientation === "topBottom" ){
      align = topBottomDynamic(align, offset.x)
      if (offset.y < 0){ 
        y -= (bbox.height + padding)
     } else {
       y += padding
     }

      if ( align === "middle" ) {
        x -= bbox.width/2
      } else if (align === "right" ) {
        x -= (bbox.width)
      } 

    } else if ( orientation === "leftRight" ){
      align = leftRightDynamic(align, offset.y)
      if (offset.x < 0){ 
        x -= (bbox.width + padding) 
      } else {
        x += padding
      }

       if ( align === "middle" ) {
          y -= bbox.height/2
       } else if (align === "top" ){
          y -= (bbox.height )
       }
    } 

    return `translate(${x}, ${y})`
}