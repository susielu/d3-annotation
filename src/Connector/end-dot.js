import { arcBuilder } from "../Builder"

export default ({ line, scale = 1 }) => {
  let dot = arcBuilder({
    className: "connector-end connector-dot",
    classID: "connector-end",
    data: { radius: 3 * scale }
  })
  dot.attrs.transform = `translate(${line.data[0][0]}, ${line.data[0][1]})`

  return { components: [dot] }
}
