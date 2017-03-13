
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


  it ('stays if orientation is top', function () {
    let a = alignment(set)
    expect(a.x).to.equal(0)
    expect(a.y).to.equal(-50)

    a = alignment(assign(set, { orientation: "topBottom"}))

    expect(a.x).to.equal(0)
    expect(a.y).to.equal(0)
  })

  it ('stays if orientation is left', function () {

    a = alignment(assign(set, { orientation: "left"}))

    expect(a.x).to.equal(100)
    expect(a.y).to.equal(0)
  })

  it ('honors padding', function () {
    let a = alignment(assign(set, { padding: 20 }))

    expect(a.x).to.equal(0)
    expect(a.y).to.equal(-70)
  })

})