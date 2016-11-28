// import { Annotation, AnnotationCollection } from 'viz-annotation'
import Annotation from './Annotation'
import AnnotationCollection from './AnnotationCollection'
import { drawEach, d3Callout } from './Types-d3'
import { select } from 'd3-selection'

export default function annotation(){
  //declare internal variables
  let annotations = [],
    collection,
    accessors= {},
    editMode = false,
    type= d3Callout;

  //drawing an annotation in d3
  const annotation = function(selection){
    const translatedAnnotations = annotations
      .map(a => {
        if (!a.x && a.data && accessors.x){ a.x = accessors.x(a.data) }
        if (!a.y && a.data && accessors.y){ a.y = accessors.y(a.data) }
        return new Annotation(a)
      });


    collection = new AnnotationCollection ({
      annotations: translatedAnnotations,
      accessors
    })

    const annotationG = selection.selectAll('g').data([collection])
    annotationG.enter().append('g').attr('class', 'annotations')

    const group = drawEach(selection.select('g.annotations'), collection)
    group.each(function(d)  {
      const annotationType = d.type || type
      annotationType.draw(select(this), d, editMode)
    })

  }

  //TODO: add in classprefix functionality
  annotation.type = function(_) {
    if (!arguments.length) return type;
    type = _;
    return annotation;
  }

  annotation.annotations = function(_) {
    if (!arguments.length) return collection && collection.annotations || annotations;
    annotations = _
    return annotation;
  };

  annotation.accessors = function(_) {
    if (!arguments.length) return accessors;
    accessors = _;
    return annotation
  }

  annotation.editMode = function(_) {
    if (!arguments.length) return editMode;
    editMode = _
    return annotation
  }

  return annotation;

};
