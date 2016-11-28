import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';

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
          data = _ref.data,
          type = _ref.type;
      classCallCheck(this, Annotation);

      //super() calls parent's constructor
      this.x = x || 0;
      this.y = y || 0;
      this.dx = dx || 0;
      this.dy = dy || 0;
      this.text = text;
      this.title = title;
      this.type = type;
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
      key: "offset",
      get: function get() {
        return { x: this.dx, y: this.dy };
      },
      set: function set(_ref3) {
        var x = _ref3.x,
            y = _ref3.y;

        this.dx = x;
        this.dy = y;
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

function manageEnter(a, d, type, className) {
    a.selectAll(type + '.' + className).data(d).enter().append(type).attr('class', className).merge(a);

    return a;
  }

  var drawEach = function drawEach(group, collection) {
    manageEnter(group, collection.annotations, 'g', 'annotation');
    group.selectAll('g.annotation').attr('transform', function (d) {
      var translation = d.translation;
      return 'translate(' + translation.x + ', ' + translation.y + ')';
    });

    return group.selectAll('g.annotation');
  };

  function dragstarted(d) {
    d3Selection.event.sourceEvent.stopPropagation();
    d3Selection.select(this).classed("dragging", true);
  }

  function dragged(d) {
    d.type.update(d3Selection.select(this), d);
  }

  function dragended(d) {
    d3Selection.select(this).classed("dragging", false);
  }

  var drawText = function drawText(a, d) {
    a.select('text.annotation-text').text(d.text);

    if (d.title) {
      a.select('text.annotation-title').text(d.title).attr('y', -10);
    }

    var bbox = a.select('g.annotation-text').node().getBBox();
    var textBBox = a.select('text.annotation-text').node().getBBox();

    a.select('text.annotation-text').attr('y', function (d) {
      if (d.title || d.dy && d.dy > 0) {
        return 5 + textBBox.height;
      }
      return -10;
    });

    return bbox;
  };

  var drawConnectorLine = function drawConnectorLine(a, d, bbox) {
    a.select('line.connector').attr('x2', -d.dx || 0).attr('y2', -d.dy || 0).attr('x1', function () {
      if (d.dx && d.dx < 0 && Math.abs(d.dx) > bbox.width / 2) {
        return bbox.width;
      }
    });
  };

  var drawUnderline = function drawUnderline(a, bbox) {
    a.select('line.underline').attr('x1', bbox.x).attr('x2', bbox.x + bbox.width);
  };

  var drawLine = function drawLine(a, d) {
    a.select('line.threshold').attr(d.x ? 'x1' : 'y1').attr(d.x ? 'x2' : 'y2');
  };

  var editable = function editable(a, editMode) {
    if (editMode) {
      a.call(d3Drag.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));
    }
  };

  var d3Callout = {
    draw: function draw(a, d, editMode) {
      manageEnter(a, [d], 'g', 'annotation-text');
      manageEnter(a.select('g.annotation-text'), [d], 'text', 'annotation-text');
      manageEnter(a.select('g.annotation-text'), [d], 'text', 'annotation-title');

      var textBBox = drawText(a, d);
      drawUnderline(manageEnter(a, [textBBox], 'line', 'underline'), textBBox);
      drawConnectorLine(manageEnter(a, [d], 'line', 'connector'), d, textBBox);
      editable(a, editMode);
    },
    update: function update(a, d) {
      var offset = d.offset;
      offset.x += d3Selection.event.dx;
      offset.y += d3Selection.event.dy;
      d.offset = offset;
      var translate = d.translation;
      a.attr('transform', function (d) {
        return 'translate(' + translate.x + ', ' + translate.y + ')';
      });

      var bbox = drawText(a, d);
      drawConnectorLine(a, d, bbox);
      drawUnderline(a, bbox);
    }
  };

  var d3XYThreshold = {
    draw: function draw(a, d, editMode) {
      console.log('here');
      drawLine(manageEnter(a, [d], 'line', 'threshold'));
    }
  };

  //TODO
  //const drawConnectorElbow = () => {}
  //Add text wraping option
  //Create threshold annotation
  //Create threshold range annotation
  //Example to use with divided line

var types = {    d3Callout: d3Callout,
    d3XYThreshold: d3XYThreshold
  };

function annotation() {
    //declare internal variables
    var annotations = [],
        collection = void 0,
        accessors = {},
        editMode = false,
        type = d3Callout;

    //drawing an annotation in d3
    var annotation = function annotation(selection) {
      var translatedAnnotations = annotations.map(function (a) {
        console.log('a', a);
        if (!a.x && a.data && accessors.x) {
          a.x = accessors.x(a.data);
        }
        if (!a.y && a.data && accessors.y) {
          a.y = accessors.y(a.data);
        }
        if (!a.type) {
          console.log('no type');a.type = type;
        }
        return new Annotation(a);
      });

      collection = new AnnotationCollection({
        annotations: translatedAnnotations,
        accessors: accessors
      });

      var annotationG = selection.selectAll('g').data([collection]);
      annotationG.enter().append('g').attr('class', 'annotations');

      var group = drawEach(selection.select('g.annotations'), collection);
      group.each(function (d) {
        d.type.draw(d3Selection.select(this), d, editMode);      });
    };

    //TODO: add in classprefix functionality
    annotation.type = function (_) {
      if (!arguments.length) return type;
      type = _;
      return annotation;
    };

    annotation.annotations = function (_) {
      if (!arguments.length) return collection && collection.annotations || annotations;
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

var index = {    annotation: annotation,
    annotationCallout: types.d3Callout,
    annotationXYThreshold: types.d3XYThreshold
  };

export default index;
//# sourceMappingURL=d3-annotation.mjs.map
