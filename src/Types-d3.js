import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'

const drawEach = (group, collection) => {
  group.selectAll('g.annotation')
    .data(collection.annotations)
    .enter()
    .append('g')
    .attr('class', 'annotation')
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
  select(this)
    .attr('transform', d => `translate(${translate.x}, ${translate.y})`)

  const bbox = select(this).select('text.annotation-text').node().getBBox()

  select(this)
    .select('line.connector')
    .attr('x2', -d.dx || 0)
    .attr('y2', -d.dy || 0)
    .attr('x1', () => {
      if (d.dx && d.dx < 0 && Math.abs(d.dx) > bbox.width/2) {
          return bbox.width
      }
    })

  select(this)
    .select('line.underline')
    .attr('x1', bbox.x)
    .attr('x2', bbox.x + bbox.width);
}

function dragended(d) {
  select(this).classed("dragging", false);
}

const drawText = (a, d) => {
  const text = a.selectAll('.annotation-text')
    .data([d])

  text.enter()
  .append('text')
  .attr('class', 'annotation-text')
  .merge(text)
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
  const line = a.selectAll('line.connector')
    .data([d])

  line.enter()
    .append('line')
    .attr('class','connector')
    .merge(line)
    .attr('x2', -d.dx || 0)
    .attr('y2', -d.dy || 0)
    .attr('x1', () => {
      if (d.dx && d.dx < 0 && Math.abs(d.dx) > bbox.width/2) {
          return bbox.width
      }
    })
}

const drawUnderline = (a, bbox) => {
  const line = a.selectAll('line.underline')
    .data([bbox])

  line.enter()
    .append('line')
    .attr('class','underline')
    .merge(line)
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
      const textBBox = drawText(a, d)
      drawUnderline(a, textBBox)
      drawConnectorLine(a, d, textBBox)

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
