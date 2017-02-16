const md = require('marked');
const contents = require('./content/contents.md')
const introduction = require('./content/introduction.md')
const anatomy = require('./content/anatomy.md')
const start = require('./content/start.md')
const types = require('./content/types.md')
const layout = require('./content/layout.md')
const extend = require('./content/extend.md')
const thanks = require('./content/thanks.md')
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

document.getElementById('types').innerHTML = md(types);
document.getElementById('layout').innerHTML = md(layout);
document.getElementById('extend').innerHTML = md(extend);
document.getElementById('thanks').innerHTML = md(thanks);

$(document).ready(function(){
    $('.scrollspy').scrollSpy();
    $('.button-collapse').sideNav();
    $('.toc').pushpin({
      top: 140,
      offset: 0
    });

    highlight.initHighlightingOnLoad();

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
            type:  d3.annotationCallout
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
            dx: 42,
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
            typeData: {
              radius: 50,
              radiusPadding: 5
            }
          }])
      )
});