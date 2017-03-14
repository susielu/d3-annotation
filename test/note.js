
const chai = require('chai')
const { expect } = chai
import alignment from '../src/Note/alignment'
import { assign } from './utils'

describe('Note-alignment', function () {
  const set = {
    bbox: {
      x: 0,
      y: 0, 
      width: 100,
      height: 50
    },
    orientation: "top"
  }
  let a

  it ('stays if orientation is top', function () {
    a = alignment(set)
    expect(a.x).to.equal(0)
    expect(a.y).to.equal(-50)

    a = alignment(assign(set, { orientation: "topBottom", offset: {x: 0, y: -100}}))

    expect(a.x).to.equal(0)
    expect(a.y).to.equal(-50)
  })

  it ('stays if orientation is left', function () {

    a = alignment(assign(set, { orientation: "left"}))

    expect(a.x).to.equal(-100)
    expect(a.y).to.equal(0)
  })

  it ('honors alignment', function () {
    a = alignment(assign(set, { align: "right" }))
    expect(a.x).to.equal(-100)
    expect(a.y).to.equal(-50)
  })
  

  it ('honors padding', function () {
    a = alignment(assign(set, { padding: 20 }))

    expect(a.x).to.equal(0)
    expect(a.y).to.equal(-70)

    a = alignment(assign(set, { padding: 20, orientation: "left" }))

    expect(a.x).to.equal(-120)
    expect(a.y).to.equal(0)
  })
  

})