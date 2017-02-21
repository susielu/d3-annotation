const md = require('marked');
const contents = require('./content/contents.md')
const introduction = require('./content/introduction.md')
const anatomy = require('./content/anatomy.md')
const start = require('./content/start.md')
const annotation = require('./content/annotation.md')
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

    $('.collapsible').collapsible();

    highlight.initHighlightingOnLoad();

    let typeSettings = {
      className: "custom",
      subject: {},
      connector: {},
      textBox: {}
    }

    let currentType = d3.annotationLabel

    const types = {
      d3Label: { 
        type: d3.annotationLabel,
        typeSettings: {

        }
      },
      d3Callout: { 
        type: d3.annotationCallout,
        typeSettings: {

        }
      },
      d3CalloutElbow: { 
        type: d3.annotationCalloutElbow,
        typeSettings: {

        }
      },
      d3CalloutLeftRight: { 
        type: d3.annotationCalloutLeftRight,
        typeSettings: {

        }
      },
      d3CalloutCircle: { 
        type: d3.annotationCalloutCircle,
        typeSettings: {

        }
      },
      d3CalloutCurve: { 
        type: d3.annotationCalloutCurve,
        typeSettings: {

        }
      }
    }

    window.makeAnnotations = d3.annotation()
    .editMode(true)
    .type(currentType)
    .annotations([
      {
        text: "Annotation Label d3.annotationLabel",
        x: 150,
        y: 150,
        dy: 137,
        dx: 142,
      }])

    d3.selectAll('.icons .btn')
      .on('click', function() {

        let type = d3.event.target.attributes['data-section'].value
        const value = d3.event.target.attributes['data-setting'].value

        d3.selectAll(`[data-section="${type}"]`)
          .classed('grey lighten-1', true)

        d3.selectAll(`[data-section="${type}"][data-setting="${value}"]`)
          .classed('grey lighten-1', false)

        type = type.split(':')
        typeSettings[type[0]][type[1]] = value

        
        currentType = d3.annotationCustomType(d3.annotationLabel, typeSettings)

        d3.select(".sandbox g.sandbox-annotations")
          .remove()

        makeAnnotations.type(currentType)

        d3.select(".sandbox")
          .call(makeAnnotations)

        //makeAnnotations.update()
    })

    d3.selectAll('.icons .presets img')
      .on('click', function(){
        let type = d3.event.target.attributes['data-type'].value

        const t = types[type]
        currentType = t.type

        d3.select(".sandbox g.sandbox-annotations")
          .remove()

        makeAnnotations.type(currentType)

        d3.select(".sandbox")
          .call(makeAnnotations)

      })

     d3.select(".sandbox")
      .append("g")
      .attr("class", "sandbox-annotations")
      .call(makeAnnotations)


    d3.select("#sandbox-code code")
      .text('const labels = [{ ' +
  'text: "Basic callout elbow ", \n' +
  '   data: {date: "18-Sep-09",'    
   )

    // d3.select("#annotation-label-example")
    //   .append("g")
    //   .attr("class", "annotation-label")
    //   .call(d3.annotation()
    //     .editMode(true)
    //     .annotations([
    //       {
    //         text: "Annotation Label d3.annotationLabel",
    //         x: 150,
    //         y: 150,
    //         dy: 37,
    //         dx: 42,
    //         type:  d3.annotationLabel
    //       }])
    //   )

    // d3.select("#annotation-labeldots-example")
    //   .append("g")
    //   .attr("class", "annotation-labeldots")
    //   .call(d3.annotation()
    //     .editMode(true)
    //     .annotations([
    //       {
    //         text: "Annotation Label Dots d3.annotationLabelDots",
    //         x: 150,
    //         y: 150,
    //         dy: 37,
    //         dx: 42,
    //         type:  d3.annotationLabelDots
    //       }])
    //   )

    // d3.select("#annotation-callout-example")
    //   .append("g")
    //   .attr("class", "annotation-callout")
    //   .call(d3.annotation()
    //     .editMode(true)
    //     .annotations([
    //       {
    //         text: "Annotation Label Dots d3.annotationCallout",
    //         x: 150,
    //         y: 150,
    //         dy: 37,
    //         dx: 42,
    //         type:  d3.annotationCallout
    //       }])
    //   )

    // d3.select("#annotation-calloutelbow-example")
    //   .append("g")
    //   .attr("class", "annotation-calloutelbow")
    //   .call(d3.annotation()
    //     .editMode(true)
    //     .annotations([
    //       {
    //         text: "Annotation Label Dots d3.annotationElbow",
    //         x: 150,
    //         y: 150,
    //         dy: 37,
    //         dx: 42,
    //         type:  d3.annotationCalloutElbow
    //       }])
    //   )

    // d3.select("#annotation-calloutcurve-example")
    //   .append("g")
    //   .attr("class", "annotation-calloutcurve")
    //   .call(d3.annotation()
    //     .editMode(true)
    //     .annotations([
    //       {
    //         text: "Annotation Label Dots d3.annotationcurve",
    //         x: 150,
    //         y: 150,
    //         dy: 37,
    //         dx: 122,
    //         type:  d3.annotationCalloutCurve
    //       }])
    //   )

    // d3.select("#annotation-calloutcircle-example")
    //   .append("g")
    //   .attr("class", "annotation-calloutcircle")
    //   .call(d3.annotation()
    //     .editMode(true)
    //     .annotations([
    //       {
    //         text: "Annotation Label Dots d3.annotationcircle",
    //         x: 150,
    //         y: 150,
    //         dy: 57,
    //         dx: 132,
    //         type:  d3.annotationCalloutCircle
    //       }])
    //   )
});