export default class AnnotationCollection {

  constructor({ annotations, accessors }) {
    this.annotations = annotations
    this.accessors = accessors
  }

  update() { this.annotations.forEach(d => d.type.update())}

  editMode() { this.annotations.forEach(a => a.type.editMode = editMode)}

  get json() { return this.annotations.map(a => a.json)}

  get textNodes(){
    return this.annotations.map(a => ({ ...a.type.getTextBBox(), startX: a.x, startY: a.y }))
  }

  //TODO: come back and rethink if a.x and a.y are applicable in all situations
  get connectorNodes() {
    return this.annotations.map(a => ({ ...a.type.getConnectorBBox(), startX: a.x, startY: a.y}))
  }

  get subjectNodes() {
    return this.annotations.map(a => ({ ...a.type.getSubjectBBox(), startX: a.x, startY: a.y}))
  }

  get annotationNodes() {
    return this.annotations.map(a => ({ ...a.type.getAnnotationBBox(), startX: a.x, startY: a.y}))
  }
}
