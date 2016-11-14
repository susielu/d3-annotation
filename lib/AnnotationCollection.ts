import Annotation from './Annotation'

export default class AnnotationCollection {
  annotations: Array<Annotation>

  constructor({ annotations}) {
    this.annotations = annotations
  }

  get json() {
    return this.annotations.map(a => a.json)
  }
}
