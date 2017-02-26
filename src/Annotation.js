
export default class Annotation {
  constructor({ x=0, y=0, dy=0, dx=0, data, type, subject, connector, note, 
    disable, id }) {

    this.dx = dx
    this.dy = dy 
    this.x = x 
    this.y = y
    this.id = id

    this.type = type
    this.data = data

    this.note = note || {}
    this.connector = connector || {}
    this.subject = subject || {}

    this.disable = disable || []
  }

  get offset() { return { x: this.dx, y: this.dy }}

  set offset({ x, y }) {
    this.dx = x
    this.dy = y
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
    const json = {
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy
    }

    if (this.data) json.data = this.data
    if (this.type) json.type = this.type

    if (Object.keys(this.connector).length > 0) json.connector = this.connector
    if (Object.keys(this.subject).length > 0) json.subject = this.subject
    if (Object.keys(this.note).length > 0) json.note = this.note
    
    return json
  }
}