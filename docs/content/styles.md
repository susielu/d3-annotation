## Style helpers

The hierarchy of styles for each annotation:

- g: class annotations, adds editable class if editMode is true
  - per annotation, g: class annotation, and classes listed above per type 
  - g: class annotation-connector
  - g: class annotation-subject
  - g: class annotation-textbox, contains a g: class annotation-textwrapper, within that there are two text elements, a text with class annotation-text, and a text with class annotation-title

- handles for dragging are circle: class handle
