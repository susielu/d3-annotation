import { circleHandles } from '../Handles'
import { lineBuilder } from '../Builder'
import { event } from 'd3-selection'

export default ({ subjectData, type}) => {
    if (!subjectData.width){ subjectData.width = 100 }
    if (!subjectData.height){ subjectData.height = 100 }
    if (subjectData.rx == undefined){ subjectData.rx = 0 }
    if (subjectData.ry == undefined){ subjectData.ry = 0 }


    let handles = []
    let { rx, ry, width, height } = subjectData

    const data = [[rx, ry], 
      [rx + width, ry], 
      [rx + width, ry + height], 
      [rx, ry + height],
      [rx, ry]]
    let rect = lineBuilder({ data, className : 'subject'})

    if (type.editMode){

      const updateWidth = (attr) => {  
        subjectData.width = -subjectData.rx + event.x
        type.redrawSubject()
      }

      const updateHeight = () => {
        subjectData.height = -subjectData.ry + event.y
        type.redrawSubject()
      }

      const updateXY = () => {
        subjectData.rx += event.dx
        subjectData.ry += event.dy
        type.redrawSubject()
      }

      const rHandles = [{ x: rx + width, y: ry + height/2, drag: updateWidth.bind(type) },
        { x: rx + width/2, y: ry + height, drag: updateHeight.bind(type) },
        { x: rx, y: ry, drag: updateXY.bind(type)}
      ]

      handles = type.mapHandles(rHandles)

    }

    return { components: [rect], handles }
}