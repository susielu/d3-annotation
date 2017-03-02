## In Practice


- All of the shapes (aside from the edit handles) in the default annotations are paths 
- In addition to the alignment settings for the note, you can also use the css `text-anchor` attribute to align the text within the note
- When you update the d3.annotation().type() you will need to use the call functionality again to set up the annotations with the new type. See the [Responsive with Types and Hover](#responsive) example
- You do not need to call d3.annotation().update() if you are only changing the position(x,y) or the offset(dx, dy). See the [Overlapping](#overlapping) example

Basic styles to use for the annotations available on [github](https://github.com/susielu/d3-annotation/blob/master/d3-annotation.css).

Hierarchy of classes:
![Annotation classes](img/classes.png)

## Customizing Types

**d3.annotationCustomType(annotationType, typeSettings)**

There are some basic settings you can use with the annotations above to customize an annotation type.


```js
const typeSettings = {
  connector: { type: "arrow" }
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
```



<h3 id="responsive">Responsive with Types and Hover</h3>
<a href="https://bl.ocks.org/susielu/974e41473737320f8db5ae711ded8542"><img src="img/resize.png"/></a>

<h3 id="overlapping">Overlapping</h3>

<h3 id="encircle">Encircling</h3>
[![Annotation encircling]](img/encircle.png)](https://bl.ocks.org/susielu/24ad9f80b9b681ce967f6005a03384f3)
