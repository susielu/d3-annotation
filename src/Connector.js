import { line, curveLinear } from "d3-shape"

const CLASS = "connector"

export const connectorLine = ({a, offset={x: 0, y: 0}, context, curve=curveLinear, bbox}) => {

    let x1 = a.x - offset.x,
      x2 = x1 + a.dx,
      y1 = a.y - offset.y,
      y2 = y1 + a.dy


    if (a.dx && bbox && bbox.width && a.dx < 0 && Math.abs(a.dx) > bbox.width/2) {
      x1 += bbox.width
    }

    const data = [[x1, y1], [x2, y2]]

    const lineGen = d3.line()
      .curve(curve)

    if (context) {
      lineGen.context(context)

      return {
        class: CLASS,
        pathMethods: lineGen
      }
    } else {
      return {
        type: "path",
        class: CLASS,
        attr: {
          d: line(data)
        }
      }
    }
}