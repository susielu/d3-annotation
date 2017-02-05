export default class AnnotationCollection {

  constructor({ annotations, accessors }) {
    this.annotations = annotations
    this.accessors = accessors
  }

  get json() {
    return this.annotations.map(a => a.json)
  }

  get textNodes() {
    return this.annotations.map(a => a.type.getTextBBox())
  }

  get textNodesWithOrigins(){
    return this.annotations.map((a) => ({ ...a.type.getTextBBox(), startX: a.x, startY: a.y }))
  }

  placement() {
    //placement along a long
    //placement along a circle
    //collision detection
    //run in a series of functions
  }
}
