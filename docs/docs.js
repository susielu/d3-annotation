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
      textBox: {} 
    }

    let typeSettings = JSON.parse(JSON.stringify(defaultSettings))

    let currentType = d3.annotationLabel
    let typeKey = "annotationLabel"
    let curve = "curveCatmullRom"
    let points = 2
  
    const types = {
      annotationLabel: { 
        typeSettings: {

        },
        summary: "A centered label annotation"
      },
      annotationCallout: { 
        typeSettings: {

        },
        summary: "Adds a line along the textBox"
      },
      annotationCalloutElbow: { 
        typeSettings: {

        },
        summary: "Keeps connector at 45 and 90 degree angles"
      },
      annotationCalloutCircle: { 
        typeSettings: {

        },
        summary: "A circle for the subject"
      },
      annotationCalloutCurve: { 
        typeSettings: {

        },
        summary: "Can be configured with a points and curve property"
      },
      annotationXYThreshold: { 
        typeSettings: {

        },
        summary: "Mark x, or y thresholds"
      }
    }

    let editMode = true
    let textWrap = 120
    let textPadding = 5

    window.makeAnnotations = d3.annotation()
    .editMode(editMode)
    .type(currentType)
    .annotations([
      {
        text: "Longer text to show text wrapping",
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

          delete typeSettings[type[0]][type[1]]
          if (type[0] == "connector" && type[1] == "type"){
            makeAnnotations.disable(['connector'])
            makeAnnotations.update()
          }
        } else {

          if (type[0] == "connector" && type[1] == "type"){
            const connectorTypes = ['annotationCallout', 'annotationCalloutElbow', 'annotationCalloutCurve']
            if (connectorTypes.indexOf(typeKey) !== -1){
              if (value == "line"){
                typeKey = 'annotationCallout'
              } else if (value == "elbow"){
                typeKey = 'annotationCalloutElbow'
              } else if (value == "curve"){
                typeKey = 'annotationCalloutCurve'
              }

              d3.selectAll(`.icons .presets img`)
                .classed('active', false)

              d3.selectAll(`[data-type="${typeKey}"]`)
                .classed('active', true)
            } else {
             typeSettings[type[0]][type[1]] = value
            }

              if (value == "curve") {
                d3.select('#curveButtons')
                  .classed('hidden', false)
              } else if (typeKey !== 'annotationCalloutCurve'){
                d3.select('#curveButtons')
                  .classed('hidden', true)
              }

            makeAnnotations.disable([])
            makeAnnotations.update()
          } else {
            typeSettings[type[0]][type[1]] = value

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

        if (typeKey == "annotationCalloutCurve") {
          d3.select('#curveButtons')
            .classed('hidden', false)
        } else {
          d3.select('#curveButtons')
            .classed('hidden', true)
        }

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

    d3.select('#textWrap')
      .on('change', function(){
        textWrap = parseInt(d3.event.target.value)
        makeAnnotations.textWrap(textWrap)
      })

    d3.select('#textPadding')
      .on('change', function(){
        textPadding = parseInt(d3.event.target.value)
        makeAnnotations.textPadding(textPadding)
        makeAnnotations.update()
      })

    d3.selectAll('#curveButtons ul.curves li a')
      .on('click', function(){
        curve = d3.event.target.attributes['data-curve'].value

        updateAnnotations({ connector: { curve: d3[curve], points } })
        sandboxCode()

   })

    d3.selectAll('#curveButtons ul.points li a')
      .on('click', function(){
        points = parseInt(d3.event.target.attributes['data-points'].value)

        updateAnnotations({ connector: { curve: d3[curve], points } })
        sandboxCode()

   })

    d3.select(".sandbox")
      .append("g")
      .attr("class", "sandbox-annotations")
      .call(makeAnnotations)

    const updateAnnotations = (newSettings) => {
        d3.select(".sandbox g.sandbox-annotations")
          .remove()

        makeAnnotations.type(currentType, newSettings)

        d3.select(".sandbox")
          .append("g")
          .attr("class", "sandbox-annotations")
          .call(makeAnnotations)
        
        d3.select(".sandbox .type")
          .text(`d3.${typeKey}`)

        d3.select(".sandbox .summary")
          .text(types[typeKey].summary)
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
        disableText = '  //could also be set in the a disable property\n  //of the annotation JSON\n' +
        `  .disable(${JSON.stringify(makeAnnotations.disable())})\n`
      }

      let textWrapText = ''

      if (textWrap !== 120) {
        textWrapText = '  //also can set and override in the textBox.wrap property\n  //of the annotation JSON\n' +
        `  .textWrap(${textWrap})`
      }

      let textPaddingText = ''

      if (textPadding !== 5) {
        textPaddingText = '  //also can set and override in the textBox.padding property\n  //of the annotation JSON\n' +
        `  .textPadding(${textPadding})`
      }

      let curveText = ''
      if ((typeKey == "annotationCalloutCurve" || typeSettings.connector.type == "curve") && (curve !== 'curveCatmullRom' || points !== 2)){
        curveText = '        connector: {\n' +
          (curve !== 'curveCatmullRom' ? `          curve: d3.${curve}` : '') +
          (points !== 2 && curve !== 'curveCatmullRom'? ',\n' : '' ) +
          (points !== 2 ? `          points: ${points}` : '') +
          '\n' +
          '        }\n'
      }

     
      d3.select("#sandbox-code code")
      .text(
      typeText +
      '\n' +
      'const annotations = [{\n' +
      '        text: "Longer text to show text wrapping",\n' +
      '        title: "Annotations :)",\n' +
      '        data: {date: "18-Sep-09", close: 185.02},\n' +
      '        dy: 137,\n' +
      `        dx: 162${curveText !== '' ? ',' : ''}\n` +
      curveText +
      '      }]\n' +
      '\n' +
      'const parseTime = d3.timeParse("%d-%b-%y")\n' +
      'const timeFormat = d3.timeFormat("%d-%b-%y")\n' +
      '\n'+
      '//Skipping setting domains for sake of example\n' +
      'const x = d3.scaleTime().range([0, 800])\n' +
      'const y = d3.scaleLinear().range([300, 0])\n' +

      '\n' +
      'const makeAnnotations = d3.annotation()\n' +
      editModeText +
      disableText +
      textWrapText +
      textPaddingText +
      `  .type(type)\n` +
      '  .accessors({\n' + 
      '    x: d => x(parseTime(d.date)),\n' + 
      '    y: d => y(d.close)\n' +
      '  })\n' +
      '  .accessorsInverse({\n' + 
      '     date: d => timeFormat(x.invert(d.x)),\n' +
      '     close: d => y.invert(d.y)\n' +
      '  })\n' +
      `  .annotations(annotations)\n` +
      '\n' +
      'd3.select("svg")\n' +
      '  .append("g")\n' +
      '  .attr("class", "annotation-test")\n' +
      '  .call(makeAnnotations)\n' 
      )

      $('#sandbox-code code, #sandbox-code-with-scales code').each(function(i, block) {
        highlight.highlightBlock(block);
      });
    }

    sandboxCode()

  
});