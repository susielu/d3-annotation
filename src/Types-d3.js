import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { Annotation } from './Annotation'
import { connectorLine } from './Connector'
import { textBoxUnderline } from './TextBox'

//TODO change the types into classes as well to
//make use of prototype functions?
export const newWithClass = (a, d, type, className) => {
  const group = a.selectAll(`${type}.${className}`).data(d)
  group.enter()
    .append(type)
    .merge(group)
    .attr('class', className)

  group.exit().remove()
    
  return a
}

// default drag behavior
function dragstarted(d) {
  event.sourceEvent.stopPropagation();
  select(this).classed("dragging", true)
}
function dragged(d) { d.type.update(select(this), d) }
function dragended(d) { select(this).classed("dragging", false);}

const drawText = (a, d) => {
  let titleBBox = { height: 0 }
  const text = a.select('text.annotation-text')

  if (d.title){
    const title = a.select('text.annotation-title')
    title.text(d.title)
    titleBBox = title.node().getBBox()
    title.attr('y', titleBBox.height)
  }

  text.text(d.text)
  const textBBox = text.node().getBBox()
  text.attr('y', titleBBox.height + textBBox.height)

  return a.select('g.annotation-textbox').node().getBBox();
 }

export const drawOnSVG = ({a, annotation, type, className, attrs}) => {
  newWithClass(a, [annotation], type, className)
  const el = a.select(`${type}.${className}`) 
  const attrKeys = Object.keys(attrs)

  attrKeys.forEach(attr => {
    el.attr(attr, attrs[attr])
  })
}

const editable = (a, editMode) => {
  if (editMode) {
    a.call(drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )
  }
}

export const d3Callout  = {
  draw: (a, annotation, editMode) => {
      const bbox = drawText(a, annotation)
      
      drawOnSVG({ annotation, a: a.select('g.annotation-connector'), 
        ...connectorLine({ annotation, bbox}) })

      drawOnSVG({ annotation, a: a.select('g.annotation-textbox'), 
        ...textBoxUnderline({ annotation, bbox })})
        
      editable(a, editMode)
  },

  update: (a, annotation) => { 
    const offset = annotation.offset
    offset.x += event.dx
    offset.y += event.dy
    annotation.offset = offset

    a.select('g.annotation-textbox')
      .attr('transform', `translate(${offset.x}, ${offset.y})`)

    const bbox = a.select('g.annotation-textbox').node().getBBox()

    drawOnSVG({ a: a.select('g.annotation-connector'), 
      annotation, ...connectorLine({ annotation, bbox}) })

  },
  init: (a, accessors) => {
    if (!a.x && a.data && accessors.x){
      a.x = accessors.x(a.data)
    }
    if (!a.y && a.data && accessors.y){
      a.y = accessors.y(a.data)
    }
    return a
  },
  annotation: Annotation
}

// export const d3XYThreshold = {
//   draw: (a, d, editMode) => {
//     drawLine(newWithClass(a, [d], 'line', 'threshold'), d)
//   },
//   init: (a, accessors) => {
//     if (!a.x1 && a.data && accessors.x){
//       a.x1 = accessors.x(a.data)
//       a.x2 = accessors.x(a.data)
//     }

//     if (!a.y1 && a.data && accessors.y){
//       a.y1 = accessors.y(a.data)
//       a.y2 = accessors.y(a.data)
//     }

//     return a
//   },
//   annotation: Annotation
// }

//TODO
//const drawConnectorElbow = () => {}
//Add text wraping option
//Create threshold annotation
//Create threshold range annotation
//Example to use with divided line

export default {
  d3Callout//,
  //d3XYThreshold
}
