import { Annotation, AnnotationCollection } from 'viz-annotation'

//typescript declarations
interface Type { draw: Function }
interface Accessors { x?: (Object) => number, y?: (Object) => number }

interface d3Annotation {
  (): any
  annotations: (_: any[]) => d3Annotation | any[]
  accessors: (_: Accessors) => d3Annotation | any
  editMode: (_: boolean) => d3Annotation | boolean
  type: (_: Type) => d3Annotation | any
}

export default function annotation(){
//declare internal variables
let annotations = [],
  accessors: Accessors = {},
  editMode = false,
  type: Type = { draw: () => {} };

//drawing an annotation in d3
const annotation = <d3Annotation>function(selection){

  const translatedAnnotations = annotations
    .map(a => {
      if (!a.x && a.data && accessors.x){ a.x = accessors.x(a.data) }
      if (!a.y && a.data && accessors.y){ a.y = accessors.y(a.data) }
      return new Annotation(a)
    });


  const collection = new AnnotationCollection ({
    annotations,
    accessors
  })

  const annotationG = selection.selectAll('g').data([collection])
  annotationG.enter().append('g').attr('class', 'annotations')

  type.draw && type.draw(annotationG, collection, editMode)
}

//TODO: add in classprefix functionality
annotation.type = function(_) {
  if (!arguments.length) return type;
  type = _;
  return annotation;
}

annotation.annotations = function(_) {
  if (!arguments.length) return annotations;
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
