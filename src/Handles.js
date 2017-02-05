import { select } from 'd3-selection'
import { drag } from 'd3-drag'


export const pointHandle = ({ cx=0, cy=0 }) => {
  return { move: { x: cx, y: cy} }
}

export const circleHandles = ({ cx=0, cy =0, r, padding }) => {
  const h = { move: { x: cx, y: cy}}
       
  if (r !== undefined) {
    h.radius = { x: cx + r/Math.sqrt(2), y: cy + r/Math.sqrt(2) }
  }

  if (padding !== undefined) {
    h.padding = { x: cx + r + padding, y: cy}
  }

  return h
}

export const rectHandles = ({ x1=0, y1=0, x2=x1, y2=y1, width, height }) => {
  
  const w = width || Math.abs(x2 - x1)
  const h = height || Math.abs(y2 - y1)

  return {
    move: {
      x: Math.min(x1, x2) + w/2,
      y: Math.min(y1, y2) - 10
    },
    width: {
      x: Math.max(x1, x2),
      y: Math.min(y1, y2) + h/2
    },
    height: {
      x: Math.min(x1, x2) + w/2,
      y: Math.max(y1, y2)
    }
  }
}

export const lineHandles = ({ x1, y1, x2, y2, x, y}) => {

  return {
    move: {
      x: x1 - x2,
      y: y1 - y2
    },
    point: {
      x: x,
      y: y
    }
  }
}

//arc handles
export const addHandles = ({ group, handles, r=10}) => { 
   //give it a group and x,y to draw handles
   //then give it instructions on what the handles change 
   group.selectAll('circle.handle')
    .data(handles)
    .enter()
    .append('circle')
    .attr('class', 'handle')
    .call(drag()
      .container(select('g.annotations').node())
      .on('start', d => d.start && d.start(d))
      .on('drag', d => d.drag && d.drag(d))
      .on('end', d => d.end && d.drag(d))
    )

  group.selectAll('circle.handle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r || r)
    
}

