
export default class Annotation {
  constructor({ x, y, dy, dx, text, title, data, dataX, dataY }) {
    //super() calls parent's constructor
    this.x = x || 0
    this.y = y || 0
    this.dx = dx || 0
    this.dy = dy || 0
    this.text = text
    this.title = title
    this.data = data
    this.dataX = dataX
    this.dataY = dataY
  }

  get position() {
    return { x: this.x, y: this.y }
  }

}
