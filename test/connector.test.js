import endArrow from "../src/Connector/end-arrow"

describe("Connector-end-arrow", function() {
  it("gives back points for an arrow", function() {
    const arrow = endArrow({
      annotation: {
        x: 331,
        y: 186,
        dx: 36,
        dy: -41,
        position: { x: 331, y: 186 }
      }
    })

    expect(arrow.components.length).toEqual(1)

    const { data } = arrow.components[0]
    expect(data).toEqual([
      [0, 0],
      [8.413665914342925, -5.404648543783771],
      [4.271165980593775, -9.041965558783025],
      [0, 0]
    ])
  })
})
