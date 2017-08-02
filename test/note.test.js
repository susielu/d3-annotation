import alignment from "../src/Note/alignment"
import { assign } from "./utils"

describe("Note-alignment", function() {
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

  it("stays if orientation is top", function() {
    a = alignment(set)
    expect(a.x).toEqual(-0)
    expect(a.y).toEqual(-50)

    a = alignment(
      assign(set, { orientation: "topBottom", offset: { x: 0, y: -100 } })
    )

    expect(a.x).toEqual(-0)
    expect(a.y).toEqual(-50)
  })

  it("stays if orientation is left", function() {
    a = alignment(assign(set, { orientation: "left" }))

    expect(a.x).toEqual(-100)
    expect(a.y).toEqual(0)
  })

  it("honors alignment", function() {
    a = alignment(assign(set, { align: "right" }))
    expect(a.x).toEqual(-100)
    expect(a.y).toEqual(-50)
  })

  it("honors padding", function() {
    a = alignment(assign(set, { padding: 20 }))

    expect(a.x).toEqual(-0)
    expect(a.y).toEqual(-70)

    a = alignment(assign(set, { padding: 20, orientation: "left" }))

    expect(a.x).toEqual(-120)
    expect(a.y).toEqual(0)
  })
})
