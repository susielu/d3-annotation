export default class AnnotationCollection {

  constructor({ annotations, accessors, accessorsInverse, ids }) {
    this.accessors = accessors
    this.accessorsInverse = accessorsInverse

    if (ids) {
      this.annotations = annotations.map((d, i) => {
        d.id = ids(d, i)
        return d
      })
    } else {
      this.annotations = annotations
    }

  }

  clearTypes() {
    this.annotations.forEach(d => {
      d.type = undefined
      d.subject = {}
      d.connector = {}
      d.textBox = {}
    })
  }

  update() { this.annotations.forEach(d => d.type.update())}

  editMode(editMode) { this.annotations.forEach(a => {
      if (a.type) {
        a.type.editMode = editMode
        a.type.updateEditMode()
      }
    })
  }

  updateDisable(disable) {
    this.annotations.forEach(a => {
      a.disable = disable
      if (a.type){
        disable.forEach(d => {
          if (a.type[d]){
          a.type[d].remove && a.type[d].remove()
          a.type[d] = undefined
          }
        })
      }
    })
  }

  get json() { 
    return this.annotations.map(a => {      
      const json = a.json
      if (this.accessorsInverse){
        json.data = {}
        Object.keys(this.accessorsInverse).forEach(k => {
          json.data[k] = this.accessorsInverse[k]({ x: a.x, y: a.y})
        })
      }
      return json
    })
  }

  //TODO: should all annotations have a key?
  //If so what would that help? could that map to priority? 
  //

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
