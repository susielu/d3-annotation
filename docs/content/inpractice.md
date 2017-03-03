<h2><a href="#in-practice">#</a>In Practice</h2>

All annotations are made of just three parts, a **note**, a **connector**, and a **subject**.

<img alt="Anatomy of an annotation" src="img/anatomy.png" />

They are the foundational blocks of this library.

### Customize the Subject by picking a base annotation

Settings for subject types are in the annotation object's <code>.subject</code>:

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
const annotations = [{ note: { label: "Hi"},
  x: 100, y 100,
  dy: 137, dx: 162,
  type: d3.annotationCalloutElbow,
  connector: { end: "arrow" }]
}

d3.annotation().annotations(annotations)
```

Or if you want all of the annotations to have these settings create a custom type with 
**d3.annotationCustomType(annotationType, typeSettings)**:

```js
const calloutWithArrow =
  d3.annotationCustomType(
    d3.annotationCalloutElbow,
    { connector:{ end: "arrow" }}
  )

d3.annotation()
  .type(calloutWithArrow)
  .annotations([{
      text: "Plant paradise",
      data: {date: "18-Sep-09",
      close: 185.02},
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

Available on [github](https://github.com/susielu/d3-annotation/blob/master/d3-annotation.css).


<h3 id="tips"><a href="#tips">#</a>Tips</h3>

- In addition to the alignment settings for the note, you can also use the css `text-anchor` attribute to align the text within the note
- When you update the d3.annotation().type() you will need to use the call functionality again to set up the annotations with the new type. See the [Responsive with Types and Hover](#responsive) example
- You do not need to call d3.annotation().update() if you are only changing the position(x,y) or the offset(dx, dy). See the [Overlapping](#overlapping) example

<h3 id="tooltips"><a href="#tooltips">#</a>Example: Tooltips</h3>

[![Annotation tooltip]](img/tooltip.png)](https://bl.ocks.org/susielu/63269cf8ec84497920f2b7ef1ac85039)

<h3 id="responsive"><a href="#responsive">#</a>Example: Responsive with Types and Hover</h3>

Example showing how to dynamically change anntation types
<a href="https://bl.ocks.org/susielu/974e41473737320f8db5ae711ded8542">
<img src="img/resize.png"/></a>

<h3 id="overlapping"><a href="#overlapping">#</a>Example: Overlapping</h3>

Moving annotations algorithmically to prevent overlap using rect collision 
[![Annotation overalapping]](img/overlapping.png)](https://bl.ocks.org/emeeks/625641430adead4bd7dbc9c1ab3f5102)

<h3 id="encircle"><a href="#encircle">#</a>Example: Encircling</h3>

Annotations following a set of points using d3.packEnclose 
[![Annotation encircling]](img/encircle.png)](https://bl.ocks.org/susielu/24ad9f80b9b681ce967f6005a03384f3)

<h3 id="circle-pack"><a href="#circle-pack">#</a>Example: Reimagining the Circle Pack</h3>

Remake of the circle pack with annotations as the exterior circles
[![Annotation circle pack]](img/circle-pack.png)](https://bl.ocks.org/emeeks/762b3694269a46151f73f6bc48be6d1c)

<h3 id="map"><a href="#map">#</a>Example: Map with Tooltips and Edit Mode</h3>

A map with tooltips, double-click to enable/disable editMode
[![Annotation map]](img/map-edit-mode.jpg)](https://bl.ocks.org/Fil/17fc857c3ce36bf8e21ddefab8bc9af4)