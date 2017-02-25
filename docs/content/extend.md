## Extending Annotation Types

### Javascript Classes

The underlying structure for the annotations and types are built with es6 JavaScript classes. To make your own custom type you can take any of the base types and extend them. 

### Static Functions

**STATIC className**

A class that return a string for the class name you want to give your custom type.

**STATIC init**

An init function that is looped through

Example, default init function

Exampe, xyThreshold init function

### Drawing Functions
These functions have a context parameter. Context is an object with gives you access to the annotation with all of its properties, and the relevant bounding box. 

**drawNote(context)**

**drawNoteContent(context)**

**drawConnector(context)**

**drawSubject(context)**

### Overall Code structure

**Annotation Class**

Each annotation is an instantiation of this class.

Reference the [souce code](https://github.com/susielu/d3-annotation/blob/master/src/Annotation.js) for the full set of properties and functions. Most relevant properties: 

- dx
- dy
- x
- y
- data
- offset: returns the dx, and dy, values as an object {x, y}
- position: returns the x, and y, values as an object {x, y}


**Annotation Collection Class**

When you run d3.annotation() it creates all of the annotations you pass it as Annotation Class instances and places them into an array as part of an Annotation Collection.

**Types Class**

Each of the annotation types is created 
