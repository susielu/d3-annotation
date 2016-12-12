import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { Annotation } from './Annotation'
import { connectorLine } from './Connector'

//TODO change the types into classes as well to
//make use of prototype functions?
function onEnter(a, d, type, className){
  console.log('in on enter', a, d, `${type}.${className}`)
  a.selectAll(`${type}.${className}`)
    .data(d)
    .enter()
    .append(type)
    .attr('class', className)
    .merge(a)

  //TODO: handle exit behavior?
  return a
}

export const drawEach = (group, collection) => {
  onEnter(group, collection.annotations, 'g', 'annotation')
  const annotation = group.selectAll('g.annotation')
    
  annotation 
    .each(function(d) {
      const a = select(this)
      const position = d.position

      a.attr('transform', `translate(${position.x}, ${position.y})`)

      onEnter(a, [d], 'g', 'annotation-textbox')
 
      const textbox = a.select('g.annotation-textbox')
      const offset = d.offset
      textbox.attr('transform', `translate(${offset.x}, ${offset.y})`)
      onEnter(textbox, [d], 'text', 'annotation-text')
      onEnter(textbox, [d], 'text', 'annotation-title')
    })

  return group.selectAll('g.annotation')
}


function dragstarted(d) {
  event.sourceEvent.stopPropagation();
  select(this).classed("dragging", true)
}

function dragged(d) {
  d.type.update(select(this), d)
}

function dragended(d) {
  select(this).classed("dragging", false);
}

const drawText = (a, d) => {
  a.select('text.annotation-text')
    .text(d.text)

  if (d.title){
    a.select('text.annotation-title')
      .text(d.title)
      .attr('y', -10)
  }

  const bbox = a.select('g.annotation-textbox').node().getBBox();
  const textBBox = a.select('text.annotation-text').node().getBBox();

  a.select('text.annotation-text')
  .attr('y', d => {
    if (d.title || d.dy && d.dy > 0) {
      return 5 + textBBox.height
    }
    return -10
  })

  return bbox
}

export const drawOnSVG = ({a, d, type, className, attrs}) => {
  onEnter(a, [d], type, className)

  const el = a.select(`${type}.${className}`)
 
  const attrKeys = Object.keys(attrs)
  attrKeys.forEach(attr => {
    el.attr(attr, attrs[attr])
  })
}


const drawUnderline = (a, bbox) => {
  a.select('line.underline')
    .attr('x1', bbox.x)
    .attr('x2', bbox.x + bbox.width);
}

const drawLine = (a, d) => {
  a.select('line.threshold')
    .attr('x1', d.x1)
    .attr('x2', d.x2)
    .attr('y1', d.y1)
    .attr('y2', d.y2)
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

      const base = { a, d: annotation }

      const textBBox = drawText(a, annotation)
      drawUnderline(onEnter(a, [textBBox], 'line', 'underline'), textBBox)
      

      drawOnSVG(Object.assign({}, base, connectorLine({ annotation, bbox: textBBox, offset: annotation.position })))


      editable(a, editMode)
  },
  update: (a, d) => {
    const offset = d.offset
    offset.x += event.dx
    offset.y += event.dy
    d.offset = offset
    const translate = d.translation
    a.attr('transform', d => `translate(${translate.x}, ${translate.y})`)

    const bbox = drawText(a, d)
    drawConnectorLine(a, d, bbox)
    drawUnderline(a, bbox)
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

export const d3XYThreshold = {
  draw: (a, d, editMode) => {
    drawLine(onEnter(a, [d], 'line', 'threshold'), d)
  },
  init: (a, accessors) => {
    if (!a.x1 && a.data && accessors.x){
      a.x1 = accessors.x(a.data)
      a.x2 = accessors.x(a.data)
    }

    if (!a.y1 && a.data && accessors.y){
      a.y1 = accessors.y(a.data)
      a.y2 = accessors.y(a.data)
    }

    return a
  },
  annotation: Annotation
}

//TODO
//const drawConnectorElbow = () => {}
//Add text wraping option
//Create threshold annotation
//Create threshold range annotation
//Example to use with divided line

export default {
  d3Callout,
  d3XYThreshold
}
