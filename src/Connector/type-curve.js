import { lineBuilder } from '../Builder'
import { event } from 'd3-selection'
import { lineSetup } from './type-line'
import { curveCatmullRom } from 'd3-shape'
import { pointHandle } from '../Handles'

export default ({ type, connectorData, subjectType }) => {

  if (!connectorData) { connectorData = {} }
  if (!connectorData.points || typeof connectorData.points === "number") { 
    connectorData.points = createPoints(type.annotation.offset, connectorData.points) 
  }
  if (!connectorData.curve) { connectorData.curve = curveCatmullRom }

  let handles = []

  if (type.editMode) {
    const cHandles = connectorData.points
      .map((c,i) => ({...pointHandle({cx: c[0], cy: c[1]}), index: i}))

    const updatePoint = (index) => {      
      connectorData.points[index][0] += event.dx
      connectorData.points[index][1] += event.dy
      type.redrawConnector()
    }
  
    handles = type.mapHandles(cHandles
      .map(h => ({ ...h.move, drag: updatePoint.bind(type, h.index)})))

  }

  let data = lineSetup({ type, subjectType })
  data = [data[0], ...connectorData.points, data[1]]
  const components = [lineBuilder({ data, curve: connectorData.curve, className: "connector" })]

  return { components , handles }
}

const createPoints = function ( offset, anchors=2) {
  const diff = { x: offset.x/(anchors + 1), y: offset.y/(anchors + 1) }
  const p = []

  let i = 1 
  for (; i <= anchors; i++) {
    p.push([diff.x*i + i%2*20, diff.y*i - i%2*20])
  }
  return p
}