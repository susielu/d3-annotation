const md = require('marked');
const contents = require('./content/contents.md')
const introduction = require('./content/introduction.md')
const anatomy = require('./content/anatomy.md')
const start = require('./content/start.md')
const annotation = require('./content/annotation.md')
const types = require('./content/types.md')
const styles = require('./content/styles.md')
const custom = require('./content/custom.md')
const layout = require('./content/layout.md')
const extend = require('./content/extend.md')
const notes = require('./content/notes.md')
const highlight = require('highlight.js')
// md.setOptions({
//   highlight: function (code) {
//     console.log('in highlight')
//     return require('highlight.js').highlightAuto(code).value;
//   }
// })

document.getElementById('toc1').innerHTML = md(contents);
document.getElementById('slide-out').innerHTML = '<li><a class="header">d3-annotation</a></li><li><div class="divider"></div></li>' + md(contents)
document.getElementById('introduction').innerHTML = md(introduction);
document.getElementById('anatomy').innerHTML = md(anatomy);
document.getElementById('start').innerHTML = md(start);

document.getElementById('annotation').innerHTML = md(annotation);
document.getElementById('types').innerHTML = md(types);
document.getElementById('styles').innerHTML = md(styles);
document.getElementById('custom').innerHTML = md(custom);
document.getElementById('layout').innerHTML = md(layout);
document.getElementById('extend').innerHTML = md(extend);
document.getElementById('notes').innerHTML = md(notes);

$(document).ready(function(){
    $('.scrollspy').scrollSpy();
    $('.button-collapse').sideNav();
    $('.toc').pushpin({
      top: 140,
      offset: 0
    });

    highlight.initHighlightingOnLoad();

    // const types = {
    //   label: {
    //     img: 'a-label'
    //   },
    //   dots: {
    //     img: 'a-dots'
    //   },
    //   callout: {
    //     img: 'a-callout'
    //   },
    //   e
    // }

    // const icons = [
    //   'label',
    //   'dots',
    //   'callout',
    //   'elbow',
    //   'curve',
    //   'circle',
    // ]

    //text align, anchor, orientation, textwrap length
    //connector, line, elbow, curve, arrow
    //subject, nothing, dot, circle, threshold, rectangle, 
  


    //d3.select('.icons')

    d3.select("#annotation-label-example")
      .append("g")
      .attr("class", "annotation-label")
      .call(d3.annotation()
        .editMode(true)
        .annotations([
          {
            text: "Annotation Label d3.annotationLabel",
            x: 150,
            y: 150,
            dy: 37,
            dx: 42,
            type:  d3.annotationLabel
          }])
      )

    d3.select("#annotation-labeldots-example")
      .append("g")
      .attr("class", "annotation-labeldots")
      .call(d3.annotation()
        .editMode(true)
        .annotations([
          {
            text: "Annotation Label Dots d3.annotationLabelDots",
            x: 150,
            y: 150,
            dy: 37,
            dx: 42,
            type:  d3.annotationLabelDots
          }])
      )

    d3.select("#annotation-callout-example")
      .append("g")
      .attr("class", "annotation-callout")
      .call(d3.annotation()
        .editMode(true)
        .annotations([
          {
            text: "Annotation Label Dots d3.annotationCallout",
            x: 150,
            y: 150,
            dy: 37,
            dx: 42,
            type:  d3.annotationCalloutLeftRight
          }])
      )

    d3.select("#annotation-calloutelbow-example")
      .append("g")
      .attr("class", "annotation-calloutelbow")
      .call(d3.annotation()
        .editMode(true)
        .annotations([
          {
            text: "Annotation Label Dots d3.annotationElbow",
            x: 150,
            y: 150,
            dy: 37,
            dx: 42,
            type:  d3.annotationCalloutElbow
          }])
      )

    d3.select("#annotation-calloutcurve-example")
      .append("g")
      .attr("class", "annotation-calloutcurve")
      .call(d3.annotation()
        .editMode(true)
        .annotations([
          {
            text: "Annotation Label Dots d3.annotationcurve",
            x: 150,
            y: 150,
            dy: 37,
            dx: 122,
            type:  d3.annotationCalloutCurve
          }])
      )

    d3.select("#annotation-calloutcircle-example")
      .append("g")
      .attr("class", "annotation-calloutcircle")
      .call(d3.annotation()
        .editMode(true)
        .annotations([
          {
            text: "Annotation Label Dots d3.annotationcircle",
            x: 150,
            y: 150,
            dy: 57,
            dx: 132,
            type:  d3.annotationCalloutCircle,
            subject: {
              innerRadius: 20,
              outerRadius: 50,
              radiusPadding: 5
            }
          }])
      )
});