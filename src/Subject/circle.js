import { circleHandles } from "../Handles"
import { arcBuilder } from "../Builder"
import { event } from "d3-selection"

export default ({ subjectData, type }) => {
  if (!subjectData.radius && !subjectData.outerRadius) {
    subjectData.radius = 20
  }

  let handles = []
  const c = arcBuilder({ data: subjectData, className: "subject" })
  if (type.editMode) {
    const h = circleHandles({
      r1: c.data.outerRadius || c.data.radius,
      r2: c.data.innerRadius,
      padding: subjectData.radiusPadding
    })

    const updateRadius = attr => {
      const r = subjectData[attr] + event.dx * Math.sqrt(2)
      subjectData[attr] = r
      type.redrawSubject()
      type.redrawConnector()
    }

    const cHandles = [
      {
        ...h.r1,
        drag: updateRadius.bind(
          type,
          subjectData.outerRadius !== undefined ? "outerRadius" : "radius"
        )
      }
    ]

    if (subjectData.innerRadius) {
      cHandles.push({ ...h.r2, drag: updateRadius.bind(type, "innerRadius") })
    }
    handles = type.mapHandles(cHandles)
  }

  c.attrs["fill-opacity"] = 0

  return { components: [c], handles }
}
