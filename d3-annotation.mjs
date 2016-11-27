import { select } from 'd3-selection';

var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

var Annotation = function () {
    function Annotation(_ref) {
      var x = _ref.x,
          y = _ref.y,
          dy = _ref.dy,
          dx = _ref.dx,
          text = _ref.text,
          title = _ref.title,
          data = _ref.data;
      classCallCheck(this, Annotation);

      //super() calls parent's constructor

      this.x = x || 0;
      this.y = y || 0;
      this.dx = dx || 0;
      this.dy = dy || 0;
      this.text = text;
      this.title = title;
      this.data = data || {};
    }

    createClass(Annotation, [{
      key: "position",
      get: function get() {
        return { x: this.x, y: this.y };
      },
      set: function set(_ref2) {
        var x = _ref2.x,
            y = _ref2.y;

        this.x = x;
        this.y = y;
      }
    }, {
      key: "translation",
      get: function get() {
        return {
          x: this.x + this.dx,
          y: this.y + this.dy
        };
      }
    }, {
      key: "json",
      get: function get() {
        return {
          x: this.x,
          y: this.y,
          dx: this.dx,
          dy: this.dy,
          text: this.text,
          title: this.title,
          data: this.data
        };
      }
    }]);
    return Annotation;
  }();

var AnnotationCollection = function () {
    function AnnotationCollection(_ref) {
      var annotations = _ref.annotations,
          accessors = _ref.accessors;
      classCallCheck(this, AnnotationCollection);

      this.annotations = annotations;
      this.accessors = accessors;
    }

    createClass(AnnotationCollection, [{
      key: "json",
      get: function get() {
        return this.annotations.map(function (a) {
          return a.json;
        });
      }

      // get annotations() {
      //   return
      // }

    }]);
    return AnnotationCollection;
  }();

function annotation() {    //declare internal variables
    var annotations = [],
        accessors = {},
        editMode = false,
        type = { draw: function draw() {} };

    //drawing an annotation in d3
    var annotation = function annotation(selection) {
      var translatedAnnotations = annotations.map(function (a) {
        if (!a.x && a.data && accessors.x) {
          a.x = accessors.x(a.data);
        }
        if (!a.y && a.data && accessors.y) {
          a.y = accessors.y(a.data);
        }
        return new Annotation(a);
      });

      var collection = new AnnotationCollection({
        annotations: translatedAnnotations,
        accessors: accessors
      });

      var annotationG = selection.selectAll('g').data([collection]);
      annotationG.enter().append('g').attr('class', 'annotations');

      type.draw && type.draw(selection.select('g.annotations'), collection, editMode);
    };

    //TODO: add in classprefix functionality
    annotation.type = function (_) {
      if (!arguments.length) return type;
      type = _;
      return annotation;
    };

    annotation.annotations = function (_) {
      if (!arguments.length) return annotations;
      annotations = _;
      return annotation;
    };

    annotation.accessors = function (_) {
      if (!arguments.length) return accessors;
      accessors = _;
      return annotation;
    };

    annotation.editMode = function (_) {
      if (!arguments.length) return editMode;
      editMode = _;
      return annotation;
    };

    return annotation;
  };

var drawEach = function drawEach(group, collection) {
    console.log('collection', collection, group);
    group.selectAll('g.annotation').data(collection.annotations)
    // console.log('annotations', group, collection, collection.annotations)
    // console.log('group data',annotations, annotations.data())

    .enter().append('g').attr('class', 'annotation').attr('transform', function (d) {
      console.log('d', d);
      var translation = d.translation;
      return 'translate(' + translation.x + ', ' + translation.y + ')';
    });

    return group;
  };

  var drawText = function drawText(a, d) {
    var text = a.selectAll('.annotation-text').data([d]);

    text.enter().append('text').attr('class', 'annotation-text');

    text.text(function (d) {
      return d.text;
    });

    var bbox = text.node().getBBox();

    // a.select('text.annotation-text')
    // .attr('y', d => {
    //   if (d.dy && d.dy > 0) {
    //     return 5 + bbox.height
    //   }
    //   return -10
    // })

    return bbox;
  };

  //TODO
  //const drawConnectorElbow = () => {}

  var d3Callout = {
    draw: function draw(g, collection, editMode) {
      var group = drawEach(g, collection);

      group.each(function (d) {
        console.log(d3Selection.select);
        var a = d3Selection.select(this);
        var textBBox = drawText(a, d);
        // drawUnderline(a, textBBox)
        // drawAnnotationLine(a, textBBox)
      });

      // if (editMode) {
      //   group.call(draggable)
      // }
    }

  };

var types = {    d3Callout: d3Callout
  };

var index = {    annotation: annotation,
    annotationCallout: types.d3Callout
  };

export default index;
//# sourceMappingURL=d3-annotation.mjs.map
