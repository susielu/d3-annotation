export default class Annotation {
  constructor({
    x = 0,
    y = 0,
    nx,
    ny,
    dy = 0,
    dx = 0,
    color = "grey",
    data,
    type,
    subject,
    connector,
    note,
    disable,
    id,
    className
  }) {
    this._dx = nx !== undefined ? nx - x : dx
    this._dy = ny !== undefined ? ny - y : dy
    this._x = x
    this._y = y
    this._color = color
    this.id = id
    this._className = className || ""

    this._type = type || ""
    this.data = data

    this.note = note || {}
    this.connector = connector || {}
    this.subject = subject || {}

    this.disable = disable || []
  }

  updatePosition() {
    if (this.type.setPosition) {
      this.type.setPosition()
      if (
        this.type.subject &&
        this.type.subject.selectAll(":not(.handle)").nodes().length !== 0
      ) {
        this.type.redrawSubject()
      }
    }
  }

  clearComponents() {
    this.type.clearComponents && this.type.clearComponents()
  }

  get className() {
    return this._className
  }

  set className(className) {
    this._className = className
    if (this.type.setClassName) this.type.setClassName()
  }

  updateOffset() {
    if (this.type.setOffset) {
      this.type.setOffset()

      if (this.type.connector.selectAll(":not(.handle)").nodes().length !== 0) {
        this.type.redrawConnector()
      }

      this.type.redrawNote()
    }
  }

  get type() {
    return this._type
  }

  set type(type) {
    this._type = type
    this.clearComponents()
  }

  get x() {
    return this._x
  }
  set x(x) {
    this._x = x
    this.updatePosition()
  }

  get y() {
    return this._y
  }
  set y(y) {
    this._y = y
    this.updatePosition()
  }

  get color() {
    return this._color
  }
  set color(color) {
    this._color = color
    this.updatePosition()
  }

  get dx() {
    return this._dx
  }
  set dx(dx) {
    this._dx = dx
    this.updateOffset()
  }

  get dy() {
    return this._dy
  }
  set dy(dy) {
    this._dy = dy
    this.updateOffset()
  }

  set nx(nx) {
    this._dx = nx - this._x
    this.updateOffset()
  }

  set ny(ny) {
    this._dy = ny - this._y
    this.updateOffset()
  }

  get offset() {
    return { x: this._dx, y: this._dy }
  }

  set offset({ x, y }) {
    this._dx = x
    this._dy = y
    this.updateOffset()
  }

  get position() {
    return { x: this._x, y: this._y }
  }

  set position({ x, y }) {
    this._x = x
    this._y = y
    this.updatePosition()
  }

  get translation() {
    return {
      x: this._x + this._dx,
      y: this._y + this._dy
    }
  }

  get json() {
    const json = {
      x: this._x,
      y: this._y,
      dx: this._dx,
      dy: this._dy
    }

    if (this.data && Object.keys(this.data).length > 0) json.data = this.data
    if (this.type) json.type = this.type
    if (this._className) json.className = this._className

    if (Object.keys(this.connector).length > 0) json.connector = this.connector
    if (Object.keys(this.subject).length > 0) json.subject = this.subject
    if (Object.keys(this.note).length > 0) json.note = this.note

    return json
  }
}
