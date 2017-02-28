
export default class Annotation {
  constructor({ x=0, y=0, dy=0, dx=0, data, type, subject, connector, note, 
    disable, id }) {

    this._dx = dx
    this._dy = dy 
    this._x = x 
    this._y = y
    this.id = id

    this.type = type || ''
    this.data = data

    this.note = note || {}
    this.connector = connector || {}
    this.subject = subject || {}

    this.disable = disable || []
  }

  updatePosition(){
    if (this.type.setPosition) { 
      this.type.setPosition() 
      if (this.type.subject.selectAll(':not(.handle)').nodes().length !== 0) {
        this.type.redrawSubject()
      }
    }
  }

  updateOffset(){
    if (this.type.setOffset) {
      this.type.setOffset() 
            
      if (this.type.connector.selectAll(':not(.handle)').nodes().length !== 0) {
        this.type.redrawConnector()
      }

      this.type.redrawNote()
    }
  }

  get x() { return this._x }
  set x(x) { 
    this._x = x; 
    this.updatePosition()
  }

  get y() { return this._y }
  set y(y) { 
    this._y = y; 
    this.updatePosition()
  }

  get dx() { return this._dx }
  set dx(dx) { 
    this._dx = dx; 
    this.updateOffset()
  }

  get dy() { return this._dy }
  set dy(dy) { 
    this._dy = dy; 
    this.updateOffset()
  }

  get offset() { return { x: this._dx, y: this._dy }}

  set offset({ x, y }) {
    this._dx = x
    this._dy = y
    this.updateOffset()
  }

  get position() { return { x: this._x, y: this._y }}

  set position({ x, y }) {
    this._x = x
    this._y = y
    this.updatePosition()
  }

  get translation() {
    return {
    x: this._x + this._dx,
    y: this._y + this._dy
  }}

  get json() { 
    const json = {
      x: this._x,
      y: this._y,
      dx: this._dx,
      dy: this._dy
    }

    if (this.data && Object.keys(this.data).length > 0) json.data = this.data
    if (this.type) json.type = this.type

    if (Object.keys(this.connector).length > 0) json.connector = this.connector
    if (Object.keys(this.subject).length > 0) json.subject = this.subject
    if (Object.keys(this.note).length > 0) json.note = this.note
    
    return json
  }
}