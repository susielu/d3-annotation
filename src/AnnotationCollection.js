export default class AnnotationCollection {

  constructor({ annotations, accessors }) {
    this.annotations = annotations
    this.accessors = accessors
  }

  get json() {
    return this.annotations.map(a => a.json)
  }
}
