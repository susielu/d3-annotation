import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { curveCatmullRom } from 'd3-shape'
import { Annotation } from './Annotation'
import { connectorLine, connectorArrow } from './Connector'
import { textBoxLine, textBoxSideline } from './TextBox'
import { subjectLine, subjectCircle } from './Subject'
import { lineBuilder, arcBuilder } from './Builder'
import { pointHandle, circleHandles, rectHandles, lineHandles, addHandles } from './Handles'

class Type {
  constructor({ a, annotation, editMode, textWrap, textPadding, dispatcher }) {
    this.a = a
    this.textBox = annotation.disable.indexOf("textBox") === -1 && a.select('g.annotation-textbox')
    this.connector = annotation.disable.indexOf("connector") === -1 && a.select('g.annotation-connector')
    this.subject = annotation.disable.indexOf("subject") === -1 && a.select('g.annotation-subject')

    if (dispatcher){
      if (this.textBox){
        this.textBox
        .on("mouseover.annotations", () => {
          dispatcher.call("textboxover", this.textBox, annotation)})
        .on("mouseout.annotations", () => dispatcher.call("textboxout", this.textBox, annotation))
        .on("click.annotations", () => dispatcher.call("textboxclick", this.textBox, annotation))
      }

      if (this.connector){
        this.connector
        .on("mouseover.annotations", () => dispatcher.call("connectorover", this.connector, annotation))
        .on("mouseout.annotations", () => dispatcher.call("connectorout", this.connector, annotation))
        .on("click.annotations", () => dispatcher.call("connectorclick", this.connector, annotation))
      }

      if (this.subject){
        this.subject.on("mouseover.annotations", () => dispatcher.call("subjectover", this.subject, annotation))
        .on("mouseout.annotations", () => dispatcher.call("subjectout", this.subject, annotation))
        .on("click.annotations", () => dispatcher.call("subjectclick", this.subject, annotation))
      }
    }
  
    this.annotation = annotation
    this.editMode = editMode
    this.textWrap = textWrap
    this.textPadding = textPadding
  }

  static init(annotation, accessors) {
    if (!annotation.x && annotation.data && accessors.x){
      annotation.x = accessors.x(annotation.data)
    }
    if (!annotation.y && annotation.data && accessors.y){
      annotation.y = accessors.y(annotation.data)
    }
    return annotation
  }

  updateEditMode () {
    this.a.selectAll('circle.handle')
      .remove()
  }

  updateTextWrap (textWrap) {
    this.textWrap = textWrap
    this.drawText()
  }

  drawOnSVG (a, builders) {
    if (!Array.isArray(builders)){
      builders = [ builders ]
    }

    builders
      .filter(b => b)
      .forEach(({ type, className, attrs}) => {
        newWithClass(a, [this.annotation], type, className)
        const el = a.select(`${type}.${className}`) 
        const attrKeys = Object.keys(attrs)


        attrKeys.forEach(attr => {
          el.attr(attr, attrs[attr])
        })
      })
  }

  getTextBBox() { return bboxWithoutHandles(this.textBox, '.annotation-text, .annotation-title')}
  getConnectorBBox() { return bboxWithoutHandles(this.connector)}
  getSubjectBBox() { return bboxWithoutHandles(this.subject)}
  getAnnotationBBox() { return bboxWithoutHandles(this.a)}

  drawText() {
    if (this.textBox){

      let titleBBox = { height: 0 }
      const text = this.a.select('text.annotation-text')
      const wrapLength = this.annotation.textBox && this.annotation.textBox.wrap || this.textWrap ||  120

      if (this.annotation.title){
        const title = this.a.select('text.annotation-title')
        title.text(this.annotation.title)
          .attr('dy', '1.1em')
        title.call(wrap, wrapLength)
        titleBBox = title.node().getBBox()
      }

      text.text(this.annotation.text)
        .attr('dy', '1em')
      text.call(wrap, wrapLength)

      const textBBox = text.node().getBBox()
      text.attr('y', titleBBox.height * 1.1 || 3)
    }
  }

  drawSubject (context) {

    if (this.editMode){
      const h = pointHandle({})

      addHandles({
        group: this.subject,
        handles: this.mapHandles([{ ...h.move, drag: this.dragSubject.bind(this)}])
      })
    }

    const type = context.type
    switch (type) {
      case "circle":
        
        const subjectData = this.annotation.subject

        if (!subjectData.radius && !subjectData.outerRadius ){
          this.annotation.subject.radius = 20
        }
        const c = subjectCircle(context);

        if (this.editMode){
          const h = circleHandles({
            r1: c.data.outerRadius || c.data.radius,
            r2: c.data.innerRadius,
            padding: this.annotation.subject.radiusPadding
          })

          const updateRadius = (type) => {      
            const r = subjectData[type] + event.dx*Math.sqrt(2)
            subjectData[type] = r
            this.customization()
          }

          const updateRadiusPadding = () => {
            const rpad = subjectData.radiusPadding + event.dx
            subjectData.radiusPadding = rpad
            this.customization()
          }

          const handles = [{ ...h.move, drag: this.dragSubject.bind(this)},
            {...h.padding, drag : updateRadiusPadding.bind(this)},
            { ...h.r1, drag: updateRadius.bind(this, subjectData.outerRadius !== undefined ? 'outerRadius': 'radius')}
            ]

          if (subjectData.innerRadius){
            handles.push({ ...h.r2, drag: updateRadius.bind(this, 'innerRadius')})
          }

          //TODO add handles when there is an inner radius and outer radius
          addHandles({
            group: this.subject,
            handles: this.mapHandles(handles)
          })
        }
        return c
    case "threshold":
      return subjectLine(context)

    case "badge":


      const radius = 18
      const innerRadius = 13
      const x = 18
      const y = 18
      const transform = `translate(${x}, ${y})`
      const circlebg = arcBuilder({ ...context, className: 'subject', data: { radius} }) 
      circlebg.attrs.transform = transform

      const circle = arcBuilder({ ...context, className: 'subject-ring', data: { outerRadius: radius, innerRadius} })
      circle.attrs.transform = transform

      const pointer = lineBuilder({ ...context, className: 'subject-pointer',
      data: [[0, 0], [x, 0], [0, y], [0, 0]]
      })
    
    
      return [pointer, circlebg, circle]
    }
 }

  drawConnector (context) {
    
    // connector types 
    // can send, elbow, curve, or nothing defaults to straight line
    const type = context.type
    switch (type) {
      case "curve": 
        const createPoints = function(anchors=2){
              const offset = this.annotation.offset
              const diff = { x: offset.x/(anchors + 1), y: offset.y/(anchors + 1) }
              const p = []

              let i = 1 
              for (; i <= anchors; i++){
                p.push([diff.x*i + i%2*20, diff.y*i - i%2*20])
              }
              return p
        }.bind(this)

        if (!this.annotation.connector){ this.annotation.connector = {} }
        if (!this.annotation.connector.points || typeof this.annotation.connector.points === "number"){ 
          this.annotation.connector.points = createPoints(this.annotation.connector.points) 
        }
        if (!this.annotation.connector.curve){ this.annotation.connector.curve = curveCatmullRom }

        context.points = this.annotation.connector.points 
        context.curve = this.annotation.connector.curve

        if (this.editMode) {
          let handles = context.points
            .map((c,i) => ({...pointHandle({cx: c[0], cy: c[1]}), index: i}))

        const updatePoint = (index) => {      
            this.annotation.connector.points[index][0] += event.dx
            this.annotation.connector.points[index][1] += event.dy
            this.customization()
        }

        addHandles({
            group: this.connector,
            handles: this.mapHandles(handles
              .map(h => ({ ...h.move, drag: updatePoint.bind(this, h.index)})))
        })
        break;
      }
      case "elbow":
        context.elbow = true

      default: 
        if (this.editMode){
          addHandles({ group: this.connector, handles: []})
        }

    }


    let line = connectorLine(context)

    // connector end 
    const endType = context.end
    switch (endType){
      case "arrow":
        const dataLength = line.data.length
      
        context.start = line.data[1]
        context.end = line.data[0]
        
        line = [line, connectorArrow(context)]
        break;
      case "dot":
        const circle = arcBuilder({ ...context, className: 'connector-dot', data: { radius: 3} })
        circle.attrs.transform = `translate(${line.data[0][0]}, ${line.data[0][1]})`
        line = [line, circle]
        break;
    }

    return line;
  }

  drawTextBox (context) {
    const offset = this.annotation.offset
    const tData = this.annotation.textBox
    const padding = tData.padding || this.textPadding || 5
    
    const lineType = context.lineType

    let orientation = tData.orientation || context.orientation || 'topBottom'
    let align = tData.align || context.align || 'dynamic'

    let x = -context.bbox.x 
    let y = -context.bbox.y
    let decorators = []

    const leftRightDyanmic = () => {
      if (align == "dynamic" || align == "left" || align == "right"){
         if (offset.y < 0){ 
              align = "top" 
            } else {
              align = "bottom"
            } 
      }
    }

    const topBottomDynamic = () => {
      if (align == "dynamic" || align == "top" || align == "bottom"){
        if (offset.x < 0){
            align = "right"
          } else {
            align = "left"
          }      
        }
    }
        
    if(lineType){

      if (lineType == "vertical") {
        orientation = "leftRight"
        leftRightDyanmic()
        decorators.push(textBoxSideline({...context, align }))
      } else if (lineType == "horizontal") {
        orientation = "topBottom"        
        topBottomDynamic()
        decorators.push(textBoxLine({ ...context, align }) )
      }
    }

    if (orientation === 'topBottom' ){
      topBottomDynamic()
      if (offset.y < 0){ 
        y -= (context.bbox.height + padding)
     } else {
       y += padding
     }

      if (align === "middle") {
        x -= context.bbox.width/2
      } else if (align === "right" ) {
        x -= (context.bbox.width)
      } 

    } else if (orientation === 'leftRight'){
      leftRightDyanmic()
      if (offset.x < 0){ 
        console.log('in x left')
        x -= (context.bbox.width + padding) 
      } else {
        x += padding
      }

       if (align === "middle") {
          y -= context.bbox.height/2
       } else if (align === "top" ){
          y -= (context.bbox.height )
       }
    } 

    this.textBox.attr('transform', `translate(${offset.x}, ${offset.y})`)
    this.textBox.select('g.annotation-textwrapper').attr('transform', `translate(${x}, ${y})`)

    if (this.editMode) {

      addHandles({
        group: this.textBox,
        handles: this.mapHandles([{ x: 0, y: 0, drag: this.dragTextBox.bind(this)}])
      })
    }

    return decorators
  }

  customization(bbox=this.getTextBBox()) {
    const annotation = this.annotation
    const context = { annotation, bbox }

    //Extend with custom annotation components
    this.subject && this.drawOnSVG( this.subject, this.drawSubject(context))
    this.connector && this.drawOnSVG( this.connector, this.drawConnector(context))
    this.textBox && this.drawOnSVG( this.textBox, this.drawTextBox(context))
  }  
  
  draw() {
    this.drawText()
    this.update()
  }

  update() {
    const position = this.annotation.position 
    this.a.attr('transform', `translate(${position.x}, ${position.y})`)
    this.customization()
  }

  dragstarted() { event.sourceEvent.stopPropagation(); this.a.classed("dragging", true) }
  dragended() { this.a.classed("dragging", false)}

  dragSubject() {
    const position = this.annotation.position
    position.x += event.dx
    position.y += event.dy
    this.annotation.position = position
    this.update()
  }

  dragTextBox() {
    const offset = this.annotation.offset
    offset.x += event.dx
    offset.y += event.dy
    this.annotation.offset = offset
    this.customization()
  }

  mapHandles(handles) {
    return handles.filter(h => h.x !== undefined && h.y !== undefined)
    .map(h => ({ ...h, 
      start: this.dragstarted.bind(this), end: this.dragended.bind(this) }))
  }
}

export const customType = (initialType, typeSettings, init) => {
  return class customType extends initialType {
    constructor (settings) {
      super(settings)
      this.typeSettings = typeSettings
    }

    static init(annotation, accessors){ 
      super.init(annotation, accessors); 
      if (init) {
        annotation = init(annotation, accessors) 
      }
      return annotation
    }

    static className(){ return typeSettings.className || initialType.className()}

    drawSubject(context){
       return super.drawSubject({ ...context, ...typeSettings.subject, ...this.typeSettings.subject })
    }

    drawConnector(context){
      return super.drawConnector({ ...context, ...typeSettings.connector, ...this.typeSettings.connector })
    }

    drawTextBox(context){
      return super.drawTextBox({ ...context, ...typeSettings.textBox, ...this.typeSettings.textBox })
    }
  }
}

export const d3Label = customType(Type, {
  className: "label", 
  textBox: { align: "middle"}
})


export const d3Callout = customType(Type, {
  className: "callout",
  textBox: { lineType: "horizontal" }
})

export const d3CalloutElbow = customType(d3Callout, {
  className: "callout elbow",
  connector: { type: "elbow" }
})

export const d3CalloutCircle = customType(d3CalloutElbow, {
  className: "callout circle",
  subject: { type: "circle"}
})

export const d3CalloutCurve = customType(d3Callout, {
  className: "callout curve",
  connector: { type: "curve" }
})

export const d3Badge = customType(d3CalloutElbow, {
  className: "badge",
  subject: { type: "badge"}
})

export const d3XYThreshold = customType(d3Callout, {
  className: "xythreshold",
  subject: { type: "threshold" }
  }, (annotation, accessors) => {
      //TODO: come back to here to check assumptions being made
      if (!annotation.x && (annotation.subject.y1 || annotation.subject.y2) && annotation.data && accessors.x){
        annotation.x = accessors.x(annotation.data)
      }

      if (!annotation.y && (annotation.subject.x1 || annotation.subject.x2) && annotation.data && accessors.y){
        annotation.y = accessors.y(annotation.data)
      }

      return annotation
    }
  )

export const newWithClass = (a, d, type, className) => {
  const group = a.selectAll(`${type}.${className}`).data(d)
  group.enter()
    .append(type)
    .merge(group)
    .attr('class', className)

  group.exit().remove()
  return a
}

//Text wrapping code adapted from Mike Bostock
const wrap = (text, width) => {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = .2, //ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")) || 0,
        tspan = text.text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("x", 0)
          .attr("dy", lineHeight + dy + "em").text(word);
      }
    }
  });
}

const bboxWithoutHandles = (selection, selector=':not(.handle)') => {
  if (!selection){
    return { x: 0, y: 0, width: 0, height: 0}
  }

  return selection.selectAll(selector).nodes().reduce((p, c) => {
        const bbox = c.getBBox()
        p.x = Math.min(p.x, bbox.x)
        p.y = Math.min(p.y, bbox.y)
        p.width = Math.max(p.width, bbox.width)
        p.height += bbox.height
        return p
      }, { x: 0, y: 0, width: 0, height: 0});
}

export default {
  d3Label,
  d3Callout,
  d3CalloutElbow,
  d3CalloutCurve,
  d3CalloutCircle,
  d3XYThreshold,
  d3Badge,
  customType
}
