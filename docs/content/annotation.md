## API

**d3.annotation()**

annotation.**annotations([ objects ])**

Pass an array of objects with annotation properties:

- **id**: This can be anything that will help you filter and parse your annotations

![Annotation JSON](img/json.png)
- **x (number:pixels)**: Position of the subject and one end of the connector
- **y (number:pixels)**: Position of the subject and one end of the connector
- **data (object)**: If you also set accessor functions, you can give data instead of x, y coordinates for placing your annotations
- **dy (number:pixels)**: Position of the note and one end of the connector
- **dx (number:pixels)**: Position of the note and one end of the connector
- **disable ([string])**: takes the values 'connector', 'subject', and 'note' pass them in this array if you want to disable those parts from rendering
- **note (object)**: You can specify a title and label property here. All of the annotation types that come with d3-annotation have built in functionality to take the title and the label and add them to the note, however the underlying system is composable in a way that you could customize the note to contain any type of content
- **connector (object)**: Some connectors such as the curve connector require additional paramters to set up the annotation
- **subject (object)**: Some subjects such as the circle require additional parameters to set up the annotation

TODO: come back, does this make sense to be renamed as 'mapping'
annotation.**accessors({ x: function, y: function })**

Functions that would map the .data attribute of your annotation to x and y positions. In the example below

Example:
```js
//Sample .data for an annotation
//{date: "2-Jan-08", close: 194.84}

const parseTime = d3.timeParse("%d-%b-%y");

d3.annotation().accessors({
  x: d => x(parseTime(d.date)),
  y: d => y(d.close)
})
```

annotation.**accessorsInverse({ &lt;x property mapping&gt;: function,  &lt;y property mapping&gt;: function })**

The inverse of the accessor function. If you are given x, y coordinates, how to get back to the original data properties

Example (goes with example from the accessors function):
```js
//Sample .data for an annotation
//{date: "2-Jan-08", close: 194.84}

const timeFormat = d3.timeFormat("%d-%b-%y")

d3.annotation().accessorsInverse({
  date: d => timeFormat(x.invert(d.x)),
  close: d => y.invert(d.y)
})
```
annotation.**editMode(boolean)**

If this is true, then the annotation will create handles for parts of the annotation that are draggable. You can style these handles with the <code>circle.handle</code> selector. If you are hooking this up to a button, you will need to run the update function below, after changing the editMode.

annotation.**update()**

Redraws all of the annotations. Typcially used to reflect updated settings. If you are only updating the position (x, y) or the offset (dx, dy) you do not need to call this afterwards. Example in [Layout - Encircling Annotation](#encircle).

annotation.**json()**

You can run this in the developer console and it will print out the current annotation settings and copy them to your clipboard. Please note that in the console each annotation will also include the type that you've associated with it.

annotation.**collection()**

Access to the collection of annotations with the instantiated types.
