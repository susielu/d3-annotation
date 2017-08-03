import Annotation from "./Annotation"
import AnnotationCollection from "./AnnotationCollection"
import { newWithClass, d3Callout } from "./Types-d3"
import { select } from "d3-selection"
import { dispatch } from "d3-dispatch"

export default function annotation() {
  let annotations = [],
    collection,
    context, //TODO: add canvas functionality
    disable = [],
    accessors = {},
    accessorsInverse = {},
    editMode = false,
    ids,
    type = d3Callout,
    textWrap,
    notePadding,
    annotationDispatcher = dispatch(
      "subjectover",
      "subjectout",
      "subjectclick",
      "connectorover",
      "connectorout",
      "connectorclick",
      "noteover",
      "noteout",
      "noteclick",
      "dragend",
      "dragstart"
    ),
    sel

  const annotation = function(selection) {
    sel = selection
    //TODO: check to see if this is still needed
    if (!editMode) {
      selection.selectAll("circle.handle").remove()
    }

    const translatedAnnotations = annotations.map(a => {
      if (!a.type) {
        a.type = type
      }
      if (!a.disable) {
        a.disable = disable
      }
      return new Annotation(a)
    })

    collection =
      collection ||
      new AnnotationCollection({
        annotations: translatedAnnotations,
        accessors,
        accessorsInverse,
        ids
      })

    const annotationG = selection.selectAll("g").data([collection])
    annotationG.enter().append("g").attr("class", `annotations`)

    const group = selection.select("g.annotations")
    newWithClass(group, collection.annotations, "g", "annotation")

    const annotation = group.selectAll("g.annotation")

    annotation.each(function(d) {
      const a = select(this)

      a.attr("class", "annotation")

      newWithClass(a, [d], "g", "annotation-connector")
      newWithClass(a, [d], "g", "annotation-subject")
      newWithClass(a, [d], "g", "annotation-note")
      newWithClass(
        a.select("g.annotation-note"),
        [d],
        "g",
        "annotation-note-content"
      )
      d.type =
        d.type.toString() === "[object Object]"
          ? d.type
          : new d.type({
            a,
            annotation: d,
            textWrap,
            notePadding,
            editMode,
            dispatcher: annotationDispatcher,
            accessors
          })
      d.type.draw()
      d.type.drawText && d.type.drawText()
    })
  }

  annotation.json = function() {
    /* eslint-disable no-console */
    console.log(
      "Annotations JSON was copied to your clipboard. Please note the annotation type is not JSON compatible. It appears in the objects array in the console, but not in the copied JSON.",
      collection.json
    )
    /* eslint-enable no-console */
    window.copy(
      JSON.stringify(
        collection.json.map(a => {
          delete a.type
          return a
        })
      )
    )
    return annotation
  }

  annotation.update = function() {
    if (annotations && collection) {
      annotations = collection.annotations.map(a => {
        a.type.draw()
        return a
      })
    }
    return annotation
  }

  annotation.updateText = function() {
    if (collection) {
      collection.updateText(textWrap)
      annotations = collection.annotations
    }
    return annotation
  }

  annotation.updatedAccessors = function() {
    collection.setPositionWithAccessors()
    annotations = collection.annotations
    return annotation
  }

  annotation.disable = function(_) {
    if (!arguments.length) return disable
    disable = _
    if (collection) {
      collection.updateDisable(disable)
      annotations = collection.annotations
    }
    return annotation
  }

  annotation.textWrap = function(_) {
    if (!arguments.length) return textWrap
    textWrap = _
    if (collection) {
      collection.updateTextWrap(textWrap)
      annotations = collection.annotations
    }
    return annotation
  }

  annotation.notePadding = function(_) {
    if (!arguments.length) return notePadding
    notePadding = _
    if (collection) {
      collection.updateNotePadding(notePadding)
      annotations = collection.annotations
    }
    return annotation
  }
  //todo think of how to handle when undefined is sent
  annotation.type = function(_, settings) {
    if (!arguments.length) return type
    type = _
    if (collection) {
      collection.annotations.map(a => {
        a.type.note &&
          a.type.note.selectAll("*:not(.annotation-note-content)").remove()
        a.type.noteContent && a.type.noteContent.selectAll("*").remove()
        a.type.subject && a.type.subject.selectAll("*").remove()
        a.type.connector && a.type.connector.selectAll("*").remove()
        a.type.typeSettings = {}
        a.type = type

        a.subject = settings && settings.subject || a.subject
        a.connector = settings && settings.connector || a.connector
        a.note = settings && settings.note || a.note
      })

      annotations = collection.annotations
    }
    return annotation
  }

  annotation.annotations = function(_) {
    if (!arguments.length)
      return collection && collection.annotations || annotations
    annotations = _

    if (collection && collection.annotations) {
      const rerun = annotations.some(
        d => !d.type || d.type.toString() !== "[object Object]"
      )

      if (rerun) {
        collection = null
        annotation(sel)
      } else {
        collection.annotations = annotations
      }
    }
    return annotation
  }

  annotation.context = function(_) {
    if (!arguments.length) return context
    context = _
    return annotation
  }

  annotation.accessors = function(_) {
    if (!arguments.length) return accessors
    accessors = _
    return annotation
  }

  annotation.accessorsInverse = function(_) {
    if (!arguments.length) return accessorsInverse
    accessorsInverse = _
    return annotation
  }

  annotation.ids = function(_) {
    if (!arguments.length) return ids
    ids = _
    return annotation
  }

  annotation.editMode = function(_) {
    if (!arguments.length) return editMode
    editMode = _

    if (sel) {
      sel.selectAll("g.annotation").classed("editable", editMode)
    }

    if (collection) {
      collection.editMode(editMode)
      annotations = collection.annotations
    }
    return annotation
  }

  annotation.collection = function(_) {
    if (!arguments.length) return collection
    collection = _
    return annotation
  }

  annotation.on = function() {
    const value = annotationDispatcher.on.apply(annotationDispatcher, arguments)
    return value === annotationDispatcher ? annotation : value
  }

  return annotation
}
