## In Practice

All annotations are made of just three parts, a **note**, a **connector**, and a **subject**.

<img alt="Anatomy of an annotation" src="img/anatomy.png" />

They are the foundational blocks of this library.

### Customize the Subject by picking a base annotation

All of the settings for these subject types are set in the annotation object's <code>.subject</code>

Example: 
```js
const annotations = [{ note: { label: "Hi"},
  x: 100, y 100,
  dy: 137, dx: 162
  subject: { radius: 50, radiusPadding: 10 }]
}

d3.annotation().annotations(annotations)
```
**d3.annotationCalloutCircle**
- radius or outerRadius and innerRadius: Number, pixels
- radiusPadding: Number, pixels

**d3.annotationCalloutRect**
- width: Number, pixels
- height: Number, pixels

**d3.annotationXYThreshold**
- x1, x2 or y1, y2: Number, pixels

**d3.annotationBadge** note this is the only base annotation that doesn't have a connector or note
- text: String
- radius: Number, pixels
- x: "left" or "right"
- y: "top" or "bottom"

**No subject**
- d3.annotationLabel
- d3.annotationCallout
- d3.annotationCalloutElbow
- d3.annotationCalloutCurve

### Customize the Connector and Note

The Options panel in the [Annotation Types UI](#types) exposes all of the options for connectors and notes. So the "Line Type" in the UI maps to <code>{ connector: { lineType : "horizontal" } }</code>

There are two ways to customize the connectors and notes. You can either change these properties per annotation: 

Example: 
```js
const annotations = [{ note: { label: "Hi"},
  x: 100, y 100,
  dy: 137, dx: 162
  connector: { type: "elbow" }]
}

d3.annotation().annotations(annotations)
```

Or if you want all of the annotations to have these settings create a custom type with 
**d3.annotationCustomType(annotationType, typeSettings)**

Example:
```js
const calloutWithArrow =
  d3.annotationCustomType(
    d3.annotationCalloutElbow,
    { connector:{ end: "arrow" }}
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
```

### Selecting Elements
- All of the visible shapes (aside from the edit handles) in the default annotations are **paths**
- There is an invisible rect behind the text in the notes as a helper for more click area etc.

**Hierarchy of classes**
![Annotation classes](img/classes.png)

Within the g.annotation-note-content there could be three additional elements: 
- text.annotation-note-label
- text.annotation-note-title
- rect.annotation-note-bg

### Basic styles 
Available on [github](https://github.com/susielu/d3-annotation/blob/master/d3-annotation.css).


### Tips
- In addition to the alignment settings for the note, you can also use the css `text-anchor` attribute to align the text within the note
- When you update the d3.annotation().type() you will need to use the call functionality again to set up the annotations with the new type. See the [Responsive with Types and Hover](#responsive) example
- You do not need to call d3.annotation().update() if you are only changing the position(x,y) or the offset(dx, dy). See the [Overlapping](#overlapping) example

<h3 id="responsive">Example: Responsive with Types and Hover</h3>
<a href="https://bl.ocks.org/susielu/974e41473737320f8db5ae711ded8542"><img src="img/resize.png"/></a>

<h3 id="overlapping">Example: Overlapping</h3>

<h3 id="encircle">Example: Encircling</h3>
[![Annotation encircling]](img/encircle.png)](https://bl.ocks.org/susielu/24ad9f80b9b681ce967f6005a03384f3)
