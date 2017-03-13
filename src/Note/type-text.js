

export default ({ noteData }) => {

  let components = []

  if (noteData.text) {
    text = {
      type: "text", 
      className: "noteText", 
      attrs: {
        text: noteData.text, 
        dy: "1.1em"
      }
    }
  }

  if (noteData.title) {
    title = {
      type: "text", 
      className: "noteText", 
      attrs: {
        text: noteData.text, 
        dy: "1em"
      }
    }

  }

  return { components }
}