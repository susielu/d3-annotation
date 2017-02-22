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
- **disable ([string])**: takes the values 'connector', 'subject', and 'textBox' pass them in this array if you want to disable those parts from rendering
- **textBox (object)**: TODO: come back to finish this thought
- **connector (object)**: Some connectors such as the curve connector require additional paramters to set up the annotation
- **subject (object)**: Some subjects such as the circle require additional parameters to set up the annotation

annotation.**accessors({ x: function, y: function })**

Functions that would map the .data attribute of your annotation to x and y positions. In the example below 

Example: 
<pre><code>//Sample .data for an annotation 
//{date: "2-Jan-08", close: 194.84}

const parseTime = d3.timeParse("%d-%b-%y");

d3.annotation().accessors({ 
  x: d => x(parseTime(d.date)), 
  y: d => y(d.close)
})
</code></pre>

annotation.**accessorsInverse({ &lt;x property mapping&gt;: function,  &lt;y property mapping&gt;: function })**

The inverse of the accessor function. If you are given x, y coordinates, how to get back to the original data properties 

Example (goes with example from the accessors function): 
<pre><code>//Sample .data for an annotation 
//{date: "2-Jan-08", close: 194.84}

const timeFormat = d3.timeFormat("%d-%b-%y")

d3.annotation().accessorsInverse({ 
  date: d => timeFormat(x.invert(d.x)),
  close: d => y.invert(d.y) 
})
</code></pre>

annotation.**editMode(boolean)**

If this is true, then the annotation will create handles for parts of the annotation that are draggable. You can style these handles with the <code>circle.handle</code> selector. If you are hooking this up to a button, you will need to run the update function below, after changing the editMode.

annotation.**update()**

Redraws all of the annotations. Typcially used to reflect updated settings, including changing the positioning of annotations. Example in [Layout - Encircling Annotation](#encircle).

annotation.**json()**

You can run this in the developer console and it will print out the current annotation settings and copy them to your clipboard.

annotation.**collection()**

Access to the collection of annotations with the instantiated types.

