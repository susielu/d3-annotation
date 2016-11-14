import { select } from 'd3-selection';
var drawEach = function (group, collection) {
    group.selectAll('g.annotation')
        .data(collection.annotations);
    group.enter()
        .append('g')
        .attr('class', 'annotation')
        .attr('transform', function (d) {
        var translation = d.translation;
        return "translate(" + translation.x + ", " + translation.y + ")";
    });
    return group;
};
var draggable = function () {
};
var drawText = function (a, d) {
    var text = a.selectAll('.annotation-text')
        .data([d]);
    text.enter()
        .append('text')
        .attr('class', 'annotation-text');
    text.text(function (d) { return d.text; });
    var bbox = text.node().getBBox();
    // a.select('text.annotation-text')
    // .attr('y', d => {
    //   if (d.dy && d.dy > 0) {
    //     return 5 + bbox.height
    //   }
    //   return -10
    // })
    return bbox;
};
var drawConnectorLine = function () {
};
//TODO
//const drawConnectorElbow = () => {}
var d3Callout = {
    draw: function (g, collection, editMode) {
        var group = drawEach(g, collection);
        group.each(function (d) {
            var a = select(this);
            var textBBox = drawText(a, d);
            // drawUnderline(a, textBBox)
            // drawAnnotationLine(a, textBBox)
        });
        // if (editMode) {
        //   group.call(draggable)
        // }
    }
};
export default d3Callout;
