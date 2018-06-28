const contents = require("./content/contents.md")
const introduction = require("./content/introduction.md")
const start = require("./content/start.md")
const inpractice = require("./content/inpractice.md")
const api = require("./content/api.md")
const extend = require("./content/extend.md")
const notes = require("./content/notes.md")
const highlight = require("./custom-highlightjs-build")
const highlightjs = require("highlight.js/lib/languages/javascript")
highlight.registerLanguage("js", highlightjs)

document.getElementById("toc1").innerHTML = contents
document.getElementById("slide-out").innerHTML =
  '<li><a class="header">d3-annotation</a></li><li><div class="divider"></div></li>' +
  contents
document.getElementById("introduction").innerHTML = introduction
document.getElementById("setup").innerHTML = start
document.getElementById("in-practice").innerHTML = inpractice
document.getElementById("api").innerHTML = api
document.getElementById("extend").innerHTML = extend
document.getElementById("notes").innerHTML = notes

$(document).ready(function() {
  $(".scrollspy").scrollSpy({ scrollOffset: 0 })
  $(".button-collapse").sideNav()
  $(".toc").pushpin({
    top: 140,
    offset: 0
  })

  $(".collapsible").collapsible()

  const defaultSettings = {
    className: "custom",
    subject: {},
    connector: {},
    note: {}
  }

  let typeSettings = JSON.parse(JSON.stringify(defaultSettings))

  let typeKey = "annotationLabel"
  let curve = "curveCatmullRom"
  let points = 2

  const types = {
    annotationLabel: {
      typeSettings: {
        note: {
          align: "middle",
          orientation: "topBottom",
          bgPadding: 20,
          padding: 15
        },
        connector: { type: "line" },
        className: "show-bg"
      },
      summary: "A centered label annotation"
    },
    annotationCallout: {
      typeSettings: {
        note: {
          align: "dynamic",
          lineType: "horizontal",
          bgPadding: { top: 15, left: 10, right: 10, bottom: 10 },
          padding: 15
        },
        connector: { type: "line" },
        className: "show-bg"
      },
      summary: "Adds a line along the note"
    },
    annotationCalloutElbow: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Keeps connector at 45 and 90 degree angles"
    },
    annotationCalloutCircle: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Subject options: radius, innerRadius, outerRadius, ",
      summaryCont: "radiusPadding",
      subject: {
        radius: 50,
        radiusPadding: 5
      }
    },
    annotationCalloutRect: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Subject options: width, height",
      subject: {
        width: -50,
        height: 100
      }
    },
    annotationCalloutCurve: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "curve" }
      },
      summary: "Connector options: curve, ",
      summaryCont: "points(array of [x,y]s or number)"
    },
    annotationXYThreshold: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Subject options: x1, x2 or y1, y2",
      subject: {
        x1: 0,
        x2: 1000
      }
    },
    annotationBadge: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary:
        "Subject options: radius, text, x:left or right, y:top or bottom",
      subject: {
        radius: 14,
        text: "A"
      }
    }
  }
  let currentType = d3.annotationCustomType(
    d3.annotationLabel,
    types.annotationLabel.typeSettings
  )
  let editMode = true
  let textWrap = 120
  let padding = types[typeKey].typeSettings.note.padding || 5

  const annotation = {
    note: {
      label: "Longer text to show text wrapping",
      title: "Annotations :)"
    },
    className: types[typeKey].className,
    x: 150,
    y: 170,
    dy: 117,
    dx: 162
  }

  const changeOption = function() {
    let type = d3.event.target.attributes["data-section"].value
    const value = d3.event.target.attributes["data-setting"].value
    d3.selectAll(`[data-section="${type}"]`).classed("active", false)

    d3.selectAll(`[data-section="${type}"][data-setting="${value}"]`).classed(
      "active",
      true
    )

    if (type === "note:lineType") {
      if (value === "none") {
        d3.selectAll(".icons .orientation").classed("hidden", false)
      } else {
        d3.selectAll(".icons .orientation").classed("hidden", true)
      }
    }

    if (
      type === "note:lineType" && value === "vertical" ||
      type === "note:orientation" && value === "leftRight"
    ) {
      d3.selectAll("[data-section='note:align'].horizontal").classed(
        "hidden",
        true
      )
      d3.selectAll("[data-section='note:align'].vertical").classed(
        "hidden",
        false
      )
    } else if (
      type === "note:lineType" && value === "horizontal" ||
      type === "note:orientation" && value === "topBottom"
    ) {
      d3.selectAll("[data-section='note:align'].vertical").classed(
        "hidden",
        true
      )
      d3.selectAll("[data-section='note:align'].horizontal").classed(
        "hidden",
        false
      )
    }

    type = type.split(":")
    if (value === "none") {
      delete typeSettings[type[0]][type[1]]
      if (type[0] == "connector" && type[1] == "type") {
        makeAnnotations.disable(["connector"])
        makeAnnotations.update()
      }
    } else {
      if (type[0] == "connector" && type[1] == "type") {
        const connectorTypes = [
          "annotationCallout",
          "annotationCalloutElbow",
          "annotationCalloutCurve"
        ]
        if (connectorTypes.indexOf(typeKey) !== -1) {
          if (value == "line") {
            typeKey = "annotationCallout"
          } else if (value == "elbow") {
            typeKey = "annotationCalloutElbow"
          } else if (value == "curve") {
            typeKey = "annotationCalloutCurve"
          }

          d3.selectAll(`.icons .presets img`).classed("active", false)

          d3.selectAll(`[data-type="${typeKey}"]`).classed("active", true)
        } else {
          typeSettings[type[0]][type[1]] = value
        }

        if (value == "curve") {
          d3.select("#curveButtons").classed("hidden", false)
        } else if (typeKey !== "annotationCalloutCurve") {
          d3.select("#curveButtons").classed("hidden", true)
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
  }

  d3.selectAll(".icons .options img").on("click", changeOption)

  d3.selectAll(".icons .presets .types img").on("click", function() {
    typeKey = d3.event.target.attributes["data-type"].value
    currentType = d3.annotationCustomType(d3[typeKey], {
      className: types[typeKey].typeSettings.className,
      note: { bgPadding: types[typeKey].typeSettings.note.bgPadding }
    })

    d3.selectAll(`.icons .presets img`).classed("active", false)

    d3.selectAll(`[data-type="${typeKey}"]`).classed("active", true)

    typeSettings = JSON.parse(JSON.stringify(defaultSettings))

    if (typeKey == "annotationBadge") {
      d3.select("li.options").classed("hidden", true)
    } else {
      d3.select("li.options").classed("hidden", false)
    }

    //set options
    const options = types[typeKey].typeSettings

    d3.selectAll(".icons .options img").classed("active", false)

    d3.select(
      `.icons img[data-section="note:align"][data-setting="${
        options.note.align
      }"]`
    ).classed("active", true)

    if (options.note.lineType) {
      d3.select(
        `.icons img[data-section="note:lineType"][data-setting=${
          options.note.lineType
        }]`
      ).classed("active", true)
      d3.selectAll(".icons .orientation").classed("hidden", true)
    } else {
      d3.select(
        `.icons img[data-section="note:lineType"][data-setting="none"]`
      ).classed("active", true)
      d3.selectAll(".icons .orientation").classed("hidden", false)
      d3.select(".icons .orientation img").classed("active", true)
    }

    d3.select('.icons img[data-section="connector:end"]').classed(
      "active",
      true
    )

    d3.select(
      `.icons img[data-section="connector:type"][data-setting=${
        options.connector.type
      }]`
    ).classed("active", true)

    if (typeKey == "annotationCalloutCurve") {
      d3.select("#curveButtons").classed("hidden", false)
    } else {
      d3.select("#curveButtons").classed("hidden", true)
    }

    d3.select("#sandbox-title").text(`Use d3.${typeKey}:`)

    updateAnnotations()
    sandboxCode()
  })

  d3.select("#editmode").on("change", function() {
    editMode = d3.event.target.checked

    makeAnnotations.editMode(editMode)
    makeAnnotations.update()

    sandboxCode()
  })

  d3.select("#textWrap").on("change", function() {
    textWrap = parseInt(d3.event.target.value)
    makeAnnotations.textWrap(textWrap).update()
    sandboxCode()
  })

  d3.select("#padding").on("change", function() {
    padding = parseInt(d3.event.target.value)
    makeAnnotations.notePadding(padding).update()
    sandboxCode()
  })

  const changeCurve = function() {
    curve = d3.event.target.attributes["data-curve"].value
    updateAnnotations({ connector: { curve: d3[curve], points } })
    sandboxCode()
  }

  d3.selectAll("#curveButtons ul.curves li img")
    .on("click", changeCurve)
    .on("pointerdown", changeCurve)

  const changePoints = function() {
    points = parseInt(d3.event.target.attributes["data-points"].value)
    updateAnnotations({ connector: { curve: d3[curve], points } })
    sandboxCode()
  }

  d3.selectAll("#curveButtons ul.points li a")
    .on("click", changePoints)
    .on("pointerdown", changePoints)

  window.makeAnnotations = d3
    .annotation()
    .editMode(editMode)
    .type(currentType)
    .annotations([annotation])

  d3.select(".sandbox")
    .append("g")
    .attr("class", "sandbox-annotations")
    .call(makeAnnotations)

  const updateAnnotations = newSettings => {
    d3.select(".sandbox g.sandbox-annotations").remove()

    const subject = types[typeKey].subject || {}
    makeAnnotations.type(currentType, {
      subject,
      connector: newSettings && newSettings.connector
    })

    d3.select(".sandbox")
      .append("g")
      .attr("class", "sandbox-annotations")
      .call(makeAnnotations)

    d3.select(".sandbox .type").text(`d3.${typeKey}`)

    d3.select(".sandbox .summary").text(types[typeKey].summary)

    d3.select(".sandbox .summaryCont").text(types[typeKey].summaryCont || "")
  }

  //change the text to have the right position for the annotation

  const sandboxCode = () => {
    const editModeText = editMode ? `  .editMode(true)\n` : ""

    let typeText = "\nconst type = "

    if (JSON.stringify(typeSettings) == JSON.stringify(defaultSettings)) {
      typeText += `d3.${typeKey}\n`
    } else {
      let json = JSON.parse(JSON.stringify(typeSettings))

      //if (Object.keys(json.subject).length === 0){
      delete json.subject
      //}

      if (Object.keys(json.connector).length === 0) {
        delete json.connector
      }
      if (Object.keys(json.note).length === 0) {
        delete json.note
      }
      typeText +=
        `d3.annotationCustomType(\n` +
        `  d3.${typeKey}, \n` +
        `  ${JSON.stringify(json).replace(/,/g, ",\n    ")}` +
        `)\n`
    }

    let disableText = ""

    if (makeAnnotations.disable().length !== 0) {
      disableText =
        "  //could also be set in the a disable property\n  //of the annotation object\n" +
        `  .disable(${JSON.stringify(makeAnnotations.disable())})\n`
    }

    let textWrapText = ""

    if (textWrap !== 120) {
      textWrapText =
        "  //also can set and override in the note.wrap property\n  //of the annotation object\n" +
        `  .textWrap(${textWrap})\n`
    }

    let paddingText = ""
    if (padding !== 5) {
      paddingText =
        "  //also can set and override in the note.padding property\n  //of the annotation object\n" +
        `  .notePadding(${padding})\n`
    }

    let curveText = ""
    if (
      (typeKey == "annotationCalloutCurve" ||
        typeSettings.connector.type == "curve") &&
      (curve !== "curveCatmullRom" || points !== 2)
    ) {
      curveText =
        "        connector: {\n" +
        (curve !== "curveCatmullRom" ? `          curve: d3.${curve}` : "") +
        (points !== 2 && curve !== "curveCatmullRom" ? ",\n" : "") +
        (points !== 2 ? `          points: ${points}` : "") +
        "\n" +
        "        }"
    }

    let subjectText = ""
    if (typeKey === "annotationCalloutCircle") {
      subjectText =
        `  subject: {\n` +
        "    radius: 50,\n" +
        "    radiusPadding: 5\n" +
        "  }\n"
    } else if (typeKey == "annotationCalloutRect") {
      subjectText =
        `  subject: {\n` + "    width: -50,\n" + "    height: 100\n" + "  }\n"
    } else if (typeKey == "annotationXYThreshold") {
      subjectText =
        `  subject: {\n` + "    x1: 0,\n" + "    x2: 500\n" + "  }\n"
    } else if (typeKey == "annotationBadge") {
      subjectText =
        `  subject: {\n` + '    text: "A",\n' + "    radius: 14\n" + "  }\n"
    }

    d3.select("#sandbox-code code").text(
      typeText +
        "\n" +
        "const annotations = [{\n" +
        "  note: {\n" +
        '    label: "Longer text to show text wrapping",\n' +
        (types[typeKey] &&
          types[typeKey].typeSettings.note &&
          types[typeKey].typeSettings.note.bgPadding &&
          `    bgPadding: ${JSON.stringify(
            types[typeKey].typeSettings.note.bgPadding
          )},\n` ||
          "") +
        '    title: "Annotations :)"\n' +
        "  },\n" +
        "  //can use x, y directly instead of data\n" +
        '  data: { date: "18-Sep-09", close: 185.02 },\n' +
        (types[typeKey] &&
          types[typeKey].typeSettings.className &&
          `  className: ${JSON.stringify(
            types[typeKey].typeSettings.className
          )},\n` ||
          "") +
        "  dy: 137,\n" +
        `  dx: 162${curveText !== "" || subjectText !== "" ? "," : ""}\n` +
        curveText +
        (subjectText !== "" && curveText !== "" ? ",\n" : "") +
        subjectText +
        "}]\n" +
        "\n" +
        'const parseTime = d3.timeParse("%d-%b-%y")\n' +
        'const timeFormat = d3.timeFormat("%d-%b-%y")\n' +
        "\n" +
        "//Skipping setting domains for sake of example\n" +
        "const x = d3.scaleTime().range([0, 800])\n" +
        "const y = d3.scaleLinear().range([300, 0])\n" +
        "\n" +
        "const makeAnnotations = d3.annotation()\n" +
        editModeText +
        disableText +
        textWrapText +
        paddingText +
        `  .type(type)\n` +
        "  //accessors & accessorsInverse not needed\n" +
        "  //if using x, y in annotations JSON\n" +
        "  .accessors({\n" +
        "    x: d => x(parseTime(d.date)),\n" +
        "    y: d => y(d.close)\n" +
        "  })\n" +
        "  .accessorsInverse({\n" +
        "     date: d => timeFormat(x.invert(d.x)),\n" +
        "     close: d => y.invert(d.y)\n" +
        "  })\n" +
        `  .annotations(annotations)\n` +
        "\n" +
        'd3.select("svg")\n' +
        '  .append("g")\n' +
        '  .attr("class", "annotation-group")\n' +
        "  .call(makeAnnotations)\n"
    )

    $("#sandbox-code code").each(function(i, block) {
      highlight.highlightBlock(block)
    })
  }

  sandboxCode()
})
