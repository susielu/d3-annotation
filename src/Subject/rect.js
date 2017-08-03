import { lineBuilder } from "../Builder"
import { event } from "d3-selection"

export default ({ subjectData, type }) => {
  if (!subjectData.width) {
    subjectData.width = 100
  }
  if (!subjectData.height) {
    subjectData.height = 100
  }

  let handles = []
  let { width, height } = subjectData

  const data = [[0, 0], [width, 0], [width, height], [0, height], [0, 0]]
  let rect = lineBuilder({ data, className: "subject" })

  if (type.editMode) {
    const updateWidth = () => {
      subjectData.width = event.x
      type.redrawSubject()
      type.redrawConnector()
    }

    const updateHeight = () => {
      subjectData.height = event.y
      type.redrawSubject()
      type.redrawConnector()
    }

    const rHandles = [
      { x: width, y: height / 2, drag: updateWidth.bind(type) },
      { x: width / 2, y: height, drag: updateHeight.bind(type) }
    ]

    handles = type.mapHandles(rHandles)
  }
  rect.attrs["fill-opacity"] = 0.1
  return { components: [rect], handles }
}
