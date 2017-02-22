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
document.getElementById('setup').innerHTML = md(start);

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

    const defaultSettings = {
      className: "custom",
      subject: {},
      connector: {},
      textBox: {} //,
      // disable: []
    }

    let typeSettings = JSON.parse(JSON.stringify(defaultSettings))

    let currentType = d3.annotationLabel
    let typeKey = "annotationLabel"

  
    const types = {
      annotationLabel: { 
        typeSettings: {

        }
      },
      annotationCallout: { 
        typeSettings: {

        }
      },
      annotationCalloutElbow: { 
        typeSettings: {

        }
      },
      // d3CalloutLeftRight: { 
      //   typeSettings: {

      //   }
      // },
      annotationCalloutCircle: { 
        typeSettings: {

        }
      },
      annotationCalloutCurve: { 
        typeSettings: {

        }
      },
      annotationCalloutXYThreshold: { 
        typeSettings: {

        }
      }
    }

    let editMode = true


    window.makeAnnotations = d3.annotation()
    .editMode(editMode)
    .type(currentType)
    .annotations([
      {
        text: "d3.annotationLabel",
        title: "Annotations :)",
        x: 150,
        y: 150,
        dy: 137,
        dx: 162,
      }])

    d3.selectAll('.icons .options a')
      .on('click', function() {

        let type = d3.event.target.attributes['data-section'].value
        const value = d3.event.target.attributes['data-setting'].value
        d3.selectAll(`[data-section="${type}"]`)
          .classed('active', false)

        d3.selectAll(`[data-section="${type}"][data-setting="${value}"]`)
          .classed('active', true)

        if (type === "textBox:lineType") {
          if (value === "none"){
          d3.selectAll(".icons .orientation")
          .classed('hidden', false)
        } else {
            d3.selectAll(".icons .orientation")
          .classed('hidden', true)
          }
        }

        if ((type === "textBox:lineType" && value === "vertical") || (type === "textBox:orientation" && value === "leftRight")){
          d3.selectAll("[data-section='textBox:align'].horizontal")
          .classed('hidden', true)
          d3.selectAll("[data-section='textBox:align'].vertical")
          .classed('hidden', false)
        } else if ((type === "textBox:lineType" && value === "horizontal") || (type === "textBox:orientation" && value === "topBottom")){
          d3.selectAll("[data-section='textBox:align'].vertical")
          .classed('hidden', true)
          d3.selectAll("[data-section='textBox:align'].horizontal")
          .classed('hidden', false)
        }

        type = type.split(':')


        if (value === "none"){
          //TODO come back to figure out to determin value
          //maybe none becomes dynamic? 
          delete typeSettings[type[0]][type[1]]
          if (type[0] == "connector" && type[1] == "type"){
            makeAnnotations.disable(['connector'])
            makeAnnotations.update()
          }
        } else {
          typeSettings[type[0]][type[1]] = value

          if (type[0] == "connector" && type[1] == "type"){
            makeAnnotations.disable([])
            makeAnnotations.update()
          }
        }

        currentType = d3.annotationCustomType(d3[typeKey], typeSettings)

        updateAnnotations()
        sandboxCode()
    })

    d3.selectAll('.icons .presets img')
      .on('click', function(){
        typeKey = d3.event.target.attributes['data-type'].value
        currentType = d3[typeKey]

        d3.selectAll(`.icons .presets img`)
          .classed('active', false)

        d3.selectAll(`[data-type="${typeKey}"]`)
          .classed('active', true)

        typeSettings = JSON.parse(JSON.stringify(defaultSettings))

        updateAnnotations()
        sandboxCode()

      })
     
    d3.select('#editmode')
      .on('change', function(){

        editMode = d3.event.target.checked

        makeAnnotations.editMode(editMode)
        makeAnnotations.update()

        sandboxCode()
      })

    d3.select(".sandbox")
      .append("g")
      .attr("class", "sandbox-annotations")
      .call(makeAnnotations)

    const updateAnnotations = () => {
        d3.select(".sandbox g.sandbox-annotations")
          .remove()

        makeAnnotations.type(currentType)

        d3.select(".sandbox")
          .append("g")
          .attr("class", "sandbox-annotations")
          .call(makeAnnotations)
        
        d3.select(".sandbox .type")
          .text(`d3.${typeKey}`)
    }

    //change the text to have the right position for the annotation

    const sandboxCode = () => { 
      
      const editModeText = editMode ? `  .editMode(true)\n` : ''

      let typeText = 'const type = '

      if (JSON.stringify(typeSettings) == JSON.stringify(defaultSettings)){
        typeText += `d3.${typeKey}\n`
      } else {
        let json = JSON.parse(JSON.stringify(typeSettings))

        if (Object.keys(json.subject).length === 0){
          delete json.subject
        }

        if (Object.keys(json.connector).length === 0){
          delete json.connector
        }
        if (Object.keys(json.textBox).length === 0){
          delete json.textBox
        }
        typeText += `d3.annotationCustomType(\n` +
          `  d3.${typeKey}, \n` +
          `  ${JSON.stringify(json).replace(/,/g, ',\n    ')}` +
          `)\n`
      }

      let disableText = ''

      if (makeAnnotations.disable().length !== 0) {
        disableText = `  .disable(${JSON.stringify(makeAnnotations.disable())})\n`
      }

      d3.select("#sandbox-code code")
      .text(
      typeText +
      '\n' +
      'const annotations = [{\n' +
      '        text: "d3.annotationLabel",\n' +
      '        title: "Annotations :)",\n' +
      '        x: 150,\n' +
      '        y: 150,\n' +
      '        dy: 137,\n' +
      '        dx: 162,\n' +
      '      }]\n' +
      '\n' +
      'const makeAnnotations = d3.annotation()\n' +
      editModeText +
      disableText +
      `  .type(type)\n` +
      `  .annotations(annotations)\n` +
      '\n' +
      'd3.select("svg")\n' +
      '  .append("g")\n' +
      '  .attr("class", "annotation-test")\n' +
      '  .call(makeAnnotations)\n' 
      )

      $('#sandbox-code code').each(function(i, block) {
        highlight.highlightBlock(block);
      });
    }

    sandboxCode()

  
});