import { select } from 'd3-selection'

const drawEach = (group, collection) => {
  group.selectAll('g.annotation')
  .data(collection.annotations)

  group.enter()
  .append('g')
  .attr('class', 'annotation')
  .attr('transform', d => {
    const translation = d.translation
    return `translate(${translation.x}, ${translation.y})`
  })

  return group
}

const draggable = () => {

}

const drawText = (a, d) => {
  const text = a.selectAll('.annotation-text')
    .data([d])

  text.enter()
  .append('text')
  .attr('class', 'annotation-text')

  text.text(d => d.text)

  const bbox = text.node().getBBox();

  // a.select('text.annotation-text')
  // .attr('y', d => {
  //   if (d.dy && d.dy > 0) {
  //     return 5 + bbox.height
  //   }
  //   return -10
  // })

  return bbox
}

const drawConnectorLine = () => {

}

//TODO
//const drawConnectorElbow = () => {}

const d3Callout = {
  draw: (g, collection, editMode) => {
    const group = drawEach(g, collection)

    group.each(function(d)  {

      const a = select(this)
      const textBBox = drawText(a, d)
      // drawUnderline(a, textBBox)
      // drawAnnotationLine(a, textBBox)

    })

    // if (editMode) {
    //   group.call(draggable)
    // }

  }

}

export default d3Callout
