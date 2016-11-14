import { Annotation, AnnotationCollection } from 'viz-annotation';
export default function annotation() {
    //declare internal variables
    var annotations = [], accessors = {}, editMode = false, type = { draw: function () { } };
    //drawing an annotation in d3
    var annotation = function (selection) {
        var translatedAnnotations = annotations
            .map(function (a) {
            if (!a.x && a.data && accessors.x) {
                a.x = accessors.x(a.data);
            }
            if (!a.y && a.data && accessors.y) {
                a.y = accessors.y(a.data);
            }
            return new Annotation(a);
        });
        var collection = new AnnotationCollection({
            annotations: annotations,
            accessors: accessors
        });
        var annotationG = selection.selectAll('g').data([collection]);
        annotationG.enter().append('g').attr('class', 'annotations');
        type.draw && type.draw(annotationG, collection, editMode);
    };
    //TODO: add in classprefix functionality
    annotation.type = function (_) {
        if (!arguments.length)
            return type;
        type = _;
        return annotation;
    };
    annotation.annotations = function (_) {
        if (!arguments.length)
            return annotations;
        annotations = _;
        return annotation;
    };
    annotation.accessors = function (_) {
        if (!arguments.length)
            return accessors;
        accessors = _;
        return annotation;
    };
    annotation.editMode = function (_) {
        if (!arguments.length)
            return editMode;
        editMode = _;
        return annotation;
    };
    return annotation;
}
;
