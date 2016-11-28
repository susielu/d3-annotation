
export default class Annotation {
  constructor({ x, y, dy, dx, text, title, data, type }) {

    this.dx = dx || 0
    this.dy = dy || 0
    this.text = text
    this.title = title
    this.type = type
    this.data = data || {}
  }

  get offset() { return { x: this.dx, y: this.dy }}

  set offset({ x, y }) {
    this.dx = x
    this.dy = y
  }

  get json() { return {
      dx: this.dx,
      dy: this.dy,
      text: this.text,
      title: this.title,
      data: this.data
   }}
}

export class XYAnnotation extends Annotation {
  constructor({ x, y, dy, dx, text, title, data, type }){
    super({ dy, dx, text, title, data, type })

    this.x = x || 0
    this.y = y || 0
  }

  get position() { return { x: this.x, y: this.y }}

  set position({ x, y }) {
    this.x = x
    this.y = y
  }

  get translation() {
    return {
    x: this.x + this.dx,
    y: this.y + this.dy
  }}

  get json() {
    return Object.assign({}, super.json(), {
      x: this.x,
      y: this.y
    })
  }
}

export class ThresholdAnnotation extends Annotation {
  constructor({ x1, x2, y1, y2, dy, dx, text, title, data, type }){
    super({ dy, dx, text, title, data, type })

    this.x1 = x1 || 0
    this.x2 = x2 || 0
    this.y1 = y1 || 0
    this.y2 = y2 || 0
  }

  get json() {
    return Object.assign({}, super.json(), {
      x1: this.x1,
      x2: this.x2,
      y1: this.y1,
      y2: this.y2
    })
  }
}
