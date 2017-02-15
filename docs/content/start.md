## Let's Start


### Include the file directly

You must include the [d3 library]("http://d3js.org/") before including the legend file. Then you can simply add the compiled js file to your website

### Using NPM

Already using d3? You can add d3-annotation as a node module by running

<pre><code>npm i d3-svg-annotation -S</cod></pre>

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
  //Adds handles to annotations so you
  //can drag them around
  .editMode(true)

svg.append("g")
  .attr("class", "annotation-test")
  .call(makeAnnotations)
</code>
</pre>
