## Let's Start

### CDN
Link to come.

### Include the file directly

You must include the [d3 library]("http://d3js.org/") before including the annotation file. Then you can add the compiled js file to your website

- [All annotations](https://github.com/susielu/d3-annotation/blob/master/d3-annotation.js)
- TODO: create minified version

### Using NPM

You can add d3-annotation as a node module by running

<pre><code>npm i d3-svg-annotation -S</code></pre>

### Setup

This is the basic usage pattern for using this library.

<pre>
<code>const labels = [{
  text: "Basic callout elow",
  data: {date: "18-Sep-09",	
    close: 185.02},
  dy: 37,
  dx: 42,
  type:  d3.annotationCalloutElbow
},
{
  text: "Adding in a curved annotation",
  data: {date: "18-Sep-09",	
    close: 185.02},
  dy: -137,
  dx: -142,
  type: d3.annotationCalloutCurve,
  typeData: { points: 3 }
}]

d3.annotation() 
  .annotations(labels)
  .accessors({ 
    x: d => x(parseTime(d.date)), 
    y: d => y(d.close) })
  .accessorsInverse({
    date: d => timeFormat(x.invert(d.x)),
    close: d => y.invert(d.y) })
  .editMode(true)

svg.append("g")
  .attr("class", "annotation-test")
  .call(makeAnnotations)
</code>
</pre>
