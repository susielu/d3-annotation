## In Practice

Here are some helpful tips for using this library and some examples to learn from. 

- All of the shapes (aside from the edit handles) in the default annotations are paths 
- In addition to the alignment settings for the note, you can also use the css `text-anchor` attribute to align the text within the note
- When you update the d3.annotation().type() you will need to use the call functionality again to set up the annotations with the new type. See the [Responsive with Types and Hover](#responsive) example
- You do not need to call d3.annotation().update() if you are only changing the position(x,y) or the offset(dx, dy). See the [Overlapping](#overlapping) example


<h3 id="responsive">Responsive with Types and Hover</h3>
<a href="https://bl.ocks.org/susielu/974e41473737320f8db5ae711ded8542"><img src="img/resize.png"/></a>

<h3 id="overlapping">Overlapping</h3>

<h3 id="encircle">Encircling</h3>
[![Annotation encircling]](img/encircle.png)](https://bl.ocks.org/susielu/24ad9f80b9b681ce967f6005a03384f3)
