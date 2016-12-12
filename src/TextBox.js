import { line, curveLinear } from "d3-shape"

const CLASS = "connector"

export const textBoxBasic = ({ annotation, offset={x: 0, y: 0}, context }) => {

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