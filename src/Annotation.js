
export default class Annotation {
  constructor({ x, y, dy, dx, text, title, data, type, subject, connector, textBox, 
    disable, id }) {

    this.dx = dx || 0
    this.dy = dy || 0
    this.x = x || 0
    this.y = y || 0
    this.id = id

    //TODO come and see if this makes sense for align and orientation
    // this.textBox
      this.text = text
      this.title = title
      //text padding
      //alignment
      //text wrap
   // this.connector
    //points
   // this.subject 
    //radius

    this.type = type
    this.data = data || {}
    // this.typeData = typeData || {}

    this.textBox = textBox || {}
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

    if (this.text) json.text = this.text 
    if (this.title) json.title = this.title
    if (this.data) json.data = this.data
    if (this.type) json.type = this.type

    if (Object.keys(this.connector).length > 0) json.connector = this.connector
    if (Object.keys(this.subject).length > 0) json.subject = this.subject
    if (Object.keys(this.textBox).length > 0) json.textBox = this.textBox
    
    return json
  }
}