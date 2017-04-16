import annotation from './src/Adapter-d3'
import types from './src/Types-d3'

window.d3annotation = {}

d3annotation.annotation = annotation
d3annotation.annotationTypeBase = types.Type
d3annotation.annotationLabel = types.d3Label
d3annotation.annotationCallout = types.d3Callout
d3annotation.annotationCalloutCurve = types.d3CalloutCurve
d3annotation.annotationCalloutElbow = types.d3CalloutElbow
d3annotation.annotationCalloutCircle = types.d3CalloutCircle
d3annotation.annotationCalloutRect = types.d3CalloutRect
d3annotation.annotationXYThreshold = types.d3XYThreshold
d3annotation.annotationBadge = types.d3Badge
d3annotation.annotationCustomType = types.customType