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
- **type (d3annotationType)**: Type for this annotation. Recommended to set the base type at the d3.annotation().type() property and using this only if you want to some additional types in the array
- **disable ([string])**: takes the values 'connector', 'subject', and 'note' pass them in this array if you want to disable those parts from rendering
- **note (object)**: You can specify a title and label property here. All of the annotation types that come with d3-annotation have built in functionality to take the title and the label and add them to the note, however the underlying system is composable in a way that you could customize the note to contain any type of content. You can also use this to overwrite the default note properties (align, orientation, lineType, wrap, padding) in the type. For example if on one of the notes you wanted to align it differently.
- **connector (object)**: Some connectors such as the curve connector require additional parameters to set up the annotation. You can also use this to overwrite the default connector properties (type, end) in the type. For example if you wanted to add an arrow to the end of some of the annotations in the array you could add <code>{ end: "arrow" }</code> to this connector property on the relevant annotations.
- **subject (object)**: Some subjects such as the circle require additional parameters to set up the annotation. 

You can also then use this function to get the current annotations.


annotation.**accessors({ x: function, y: function })**

Functions that would map the .data attribute of your annotation to x and y positions.

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

The inverse of the accessor function. If you are given x, y coordinates, how to get back to the original data properties. Only for the x and y accessors.

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

If this is true, then the annotation will create handles for parts of the annotation that are draggable. You can style these handles with the <code>circle.handle</code> selector. If you are hooking this up to a button, you will need to run the update function below, after changing the editMode. TODO add example

annotation.**update()**

Redraws all of the annotations. Typcially used to reflect updated settings. If you are only updating the position (x, y) or the offset (dx, dy) you do not need to call this afterwards. Example in [Layout - Encircling Annotation](#encircle).

annotation.**updatedAccessors()**

Example in [Responsive with Types and Hover](#responsive)

annotation.**type( d3annotationType )**
You can pass different types into the annotation objects themselves, but you can also set a default type here. If you want to change the type, you will need to re-call the d3.annotation function on your element to recreate the annotations with the new type. Example in [Responsive with Types and Hover](#responsive)


annotation.**json()**

You can run this in the developer console and it will print out the current annotation settings and copy them to your clipboard. Please note that in the console each annotation will also include the type that you've associated with it.

annotation.**collection()**

Access to the collection of annotations with the instantiated types.

annotation.**textWrap()**

annotation.**notePadding()**

annotation.**disables()**
