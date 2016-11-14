var AnnotationCollection = (function () {
    function AnnotationCollection(_a) {
        var annotations = _a.annotations;
        this.annotations = annotations;
    }
    Object.defineProperty(AnnotationCollection.prototype, "json", {
        get: function () {
            return this.annotations.map(function (a) { return a.json; });
        },
        enumerable: true,
        configurable: true
    });
    return AnnotationCollection;
}());
export default AnnotationCollection;
