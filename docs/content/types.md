## API & Annotation Types

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
- **disable ([string])**: takes the values 'connector', 'subject', and 'textBox' pass them in this array if you want to disable those annotation components from rendering
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


<h3 id="annotation-types">Annotation Types</h3>

<p id="annotation-label">**d3.annotationLabel**</p>

<svg class="example" id="annotation-label-example"></svg>

<p id="annotation-callout">**d3.annotationCallout**</p>

**d3.annotationCalloutElbow**

**d3.annotationCalloutCurve**

**d3.annotationXYThreshold**

**d3.annotationCalloutCircle**

**d3.annotationCalloutRect**


### Customizing Types

**d3.annotationCustomType(annotationType, typeSettings)**

There are some basic settings you can use with the annotations above to customize an annotation type.


<pre>
<code>const typeSettings = {
  connector: { arrow: true }
}

const calloutWithArrow = 
  d3.annotationCustomType(
    d3.annotationCalloutElbow, 
    typeSettings
  )

d3.annotation() 
  .annotations([{
      text: "Plant paradise",
      data: {date: "18-Sep-09",	
      close: 185.02},
      dy: 37,
      dx: 42,
      //Your custom type
      type: calloutWithArrow 
    }])
  .editMode(true)
</code>
</pre>

