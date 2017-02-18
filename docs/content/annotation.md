## API 

**d3.annotation()**

annotation.**annotations([JSON])**

Pass an array of JSON objects with annotation properties: 
- **text (string)**
- **title (string)**

![Annotation JSON](img/json.png)

- **x (number)**: pixels, to place the subject and one end of the connector
- **y (number)**: pixels, to place the subject and one end of the connector
- **data (object)**: If you also pass accessor functions, you can give data instead of x, y coordinates for placing your annotations
- **dy (number)**: pixels, to place the textBox and one end of the connector
- **dx (number)**: pixels, to place the textBox and one end of the connector
- **type ([annotation type](#annotation-types))**: defaults to [d3.annotationCallout](#annotation-callout) 
- **disable ([string])**: takes the values 'connector', 'subject', and 'textBox' pass them in this array if you want to disable those parts from rendering
- **typeData (object)**: specific settings that certain TODO come back and specify types types will require for rendering


annotation.**type(annotation type class)**

Uses this as the default type if there isn't one specified for that annotation in the JSON object.

annotation.**accessors({ x: function, y: function })**

annotation.**editMode(boolean)**

annotation.**update()**

annotation.**json()**

**TODO figure out what to do here**

annotation.**collection(annotation collection class)**

You can pass it a new annotation collection class. If there are not arguments it will return the current annotation collection class. 

