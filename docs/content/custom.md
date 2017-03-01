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
