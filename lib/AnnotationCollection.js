export default class AnnotationCollection {
  constructor({ annotations}) {
    this.annotations = annotations
  }

  get json() {
    return this.annotations.map(a => a.json)
  }
}
