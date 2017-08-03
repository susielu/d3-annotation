<h2><a href="#in-practice">#</a>In Practice</h2>

All annotations are made of just three parts, a **note**, a **connector**, and a **subject**.

<img alt="Anatomy of an annotation" src="img/anatomy.png" />

They are the foundational blocks of this library.

### Customize the Subject by picking a base annotation

Settings for subject types are in the annotation object's <code>.subject</code>:

```js
const annotations = [{
  note: { label: "Hi"},
  x: 100, y 100,
  dy: 137, dx: 162,
  subject: { radius: 50, radiusPadding: 10 }
}]

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

**d3.annotationBadge**: this is the only base annotation that doesn't have a connector or note
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

```js
const annotations = [{
  note: { label: "Hi"},
  x: 100, y 100,
  dy: 137, dx: 162,
  type: d3.annotationCalloutElbow,
  connector: { end: "arrow" }
}]

d3.annotation().annotations(annotations)
```

Or if you want all of the annotations to have these settings create a custom type with
**d3.annotationCustomType(annotationType, typeSettings)**:

```js
const calloutWithArrow =
  d3.annotationCustomType(
    d3.annotationCalloutElbow,
    { connector: { end: "arrow" }}
  )

d3.annotation()
  .type(calloutWithArrow)
  .annotations([{
    text: "Plant paradise",
    data: { date: "18-Sep-09", close: 185.02 },
    dy: 37,
    dx: 42
  }])
  .editMode(true)
```
Both examples above produce the same results.


<h3 id="select"><a href="#select">#</a>Selecting Elements</h3>

- All of the visible shapes (aside from the edit handles) in the default annotations are **paths**
- There is an invisible rect (<code>rect.annotation-note-bg</code>) behind the text in the notes as a helper for more click area etc.
- Hierarchy of classes:
![Annotation classes](img/classes.png)
- Within the g.annotation-note-content there could be three additional elements: <code>text.annotation-note-label</code>, <code>text.annotation-note-title</code>, <code>rect.annotation-note-bg</code>

<h3 id="styles"><a href="#styles">#</a> Basic Styles</h3>

Now the library comes with default styles, read more about it in the [2.0 release](http://www.susielu.com/data-viz/d3-annotation-2) post.

Before v2, there were style sheets you needed to use: 

Available on [github](https://github.com/susielu/d3-annotation/blob/e7ba1e83f279a63e056964b080019d647f57e34c/d3-annotation.css).


<h3 id="tips"><a href="#tips">#</a>Tips</h3>

- In addition to the alignment settings for the note, you can also use the css `text-anchor` attribute to align the text within the note
- When you update the d3.annotation().type() you will need to use the call functionality again to set up the annotations with the new type. See the [Responsive with Types and Hover](#responsive) example
- You do not need to call d3.annotation().update() if you are only changing the position(x,y) or the offset(dx, dy). See the [Overlapping](#overlapping) example
- If you are importing custom fonts, you may notice the annotations don't load perfectly with text wrapping and alignment. To fix that you can use, `document.fonts.ready` to make sure the fonts are loaded first to reflect the custom font's spacing for all of the calculations. Here's an example:

```js
    document.fonts.ready.then(function(){
      d3.select("svg")
        .append("g")
        .attr("class", "annotation-group")
        .style('font-size', fontSize(ratio))
        .call(makeAnnotations)
    })
```
