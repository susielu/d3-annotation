import { lineBuilder } from '../Builder'


export default ({ subjectData, type }) => {
  const offset = type.annotation.position

  let x1 = (subjectData.x1 !== undefined ? subjectData.x1 : offset.x) - offset.x,
    x2 = (subjectData.x2 !== undefined ? subjectData.x2 : offset.x) - offset.x,
    y1 = (subjectData.y1 !== undefined ? subjectData.y1 : offset.y) - offset.y,
    y2 = (subjectData.y2 !== undefined ? subjectData.y2 : offset.y) - offset.y

  const data = [[x1, y1], [x2, y2]]
  return { components: [lineBuilder({ data, className : 'subject'})]}
}