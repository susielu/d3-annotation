import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'

const drawEach = (group, collection) => {
  group.selectAll('g.annotation')
    .data(collection.annotations)
    .enter()
    .append('g')
    .attr('class', 'annotation')
    .merge(group)
    .attr('transform', d => {
      const translation = d.translation
      return `translate(${translation.x}, ${translation.y})`
    })

  return group.selectAll('g.annotation')
}

function dragstarted(d) {
  event.sourceEvent.stopPropagation();
  select(this)
  .classed("dragging", true)

}

function dragged(d) {
  const offset = d.offset
  offset.x += event.dx
  offset.y += event.dy
  d.offset = offset
  const translate = d.translation
  const a = select(this)

  a.attr('transform', d => `translate(${translate.x}, ${translate.y})`)

  const bbox = drawText(a, d)
  drawConnectorLine(a, d, bbox)
  drawUnderline(a, bbox)

}

function dragended(d) {
  select(this).classed("dragging", false);
}

function manageEnter(a, d, type, className){
  a.selectAll(`.${className}`)
  .data([d])
  .enter()
  .append(type)
  .attr('class', className)
  .merge(a)

  return a
}

const drawText = (a, d) => {
  a.select('text.annotation-text')
    .text(d.text)

  const bbox = a.select('text.annotation-text').node().getBBox();

  a.select('text.annotation-text')
  .attr('y', d => {
    if (d.dy && d.dy > 0) {
      return 5 + bbox.height
    }
    return -10
  })

  return bbox
}

const drawConnectorLine = (a, d, bbox) => {
  a.select('line.connector')
    .attr('x2', -d.dx || 0)
    .attr('y2', -d.dy || 0)
    .attr('x1', () => {
      if (d.dx && d.dx < 0 && Math.abs(d.dx) > bbox.width/2) {
          return bbox.width
      }
    })
}

const drawUnderline = (a, bbox) => {
  a.select('line.underline')
    .attr('x1', bbox.x)
    .attr('x2', bbox.x + bbox.width);
}

//TODO
//const drawConnectorElbow = () => {}

const d3Callout = {
  draw: (g, collection, editMode) => {
    const group = drawEach(g, collection)
    group.each(function(d)  {
      const a = select(this)
      const textBBox = drawText(manageEnter(a, d, 'text', 'annotation-text'), d)
      drawUnderline(manageEnter(a, textBBox, 'line', 'underline'), textBBox)
      drawConnectorLine(manageEnter(a, d, 'line', 'connector'), d, textBBox)

      if (editMode) {
        a.call(drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
        )
      }
    })
  }

}

export default {
  d3Callout
}
