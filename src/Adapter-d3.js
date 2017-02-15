import Annotation from './Annotation'
import AnnotationCollection from './AnnotationCollection'
import { newWithClass, d3Callout } from './Types-d3'
import { select } from 'd3-selection'

export default function annotation(){
  let annotations = [],
    collection,
    context,
    accessors= {},
    editMode = false,
    type= d3Callout;

  const annotation = function(selection){
    const translatedAnnotations = annotations
      .map(a => {
        if (!a.type) { a.type = type }
        if (a.type.init) { a = a.type.init(a, accessors) }

        return new Annotation(a)
      });


    collection = new AnnotationCollection ({
      annotations: translatedAnnotations,
      accessors
    })

    const annotationG = selection.selectAll('g').data([collection])
    annotationG.enter().append('g').attr('class', `annotations ${editMode ? "editable" : ""}`)
    
    const group = selection.select('g.annotations')
    newWithClass(group, collection.annotations, 'g', 'annotation')

    const annotation = group.selectAll('g.annotation')
        
    annotation 
      .each(function(d) {
        const a = select(this)
        const position = d.position

        const className = d.type.className && d.type.className()
        if (className){
          a.attr('class', `annotation ${className}`)
        }

        newWithClass(a, [d], 'g', 'annotation-connector')
        newWithClass(a, [d], 'g', 'annotation-subject')
        newWithClass(a, [d], 'g', 'annotation-textbox')
  
        const textbox = a.select('g.annotation-textbox')
        const offset = d.offset
        textbox.attr('transform', `translate(${offset.x}, ${offset.y})`)
        newWithClass(textbox, [d], 'text', 'annotation-text')
        newWithClass(textbox, [d], 'text', 'annotation-title')

        d.type = new d.type({ a, annotation: d, editMode})
        
        d.type.draw()
      })
  }

  annotation.json = function() {
    console.log('Annotations JSON', collection.json())
    return annotation
  }

  annotation.update = function(){
    collection.update()
    return annotation
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

  annotation.context = function(_) {
    if (!arguments.length) return context;
    context = _
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
    collection.editMode(editMode)
    return annotation
  }

  annotation.collection = function(_) {
    if (!arguments.length) return collection;
    collection = _
    return annotation
  }

  return annotation;

};


//Type adapter
//takes a prototype
//updates one of the functions with the desired properties
//returns the updated prototype that has extended the base prototype