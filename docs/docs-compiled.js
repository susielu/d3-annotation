(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "<h2 id=\"anatomy-of-an-annotation\">Anatomy of an Annotation</h2>\n<p>All annotations are made of just three parts, a <strong>note</strong>, a <strong>connector</strong>, and a <strong>subject</strong>.</p>\n<p><img src=\"img/anatomy.png\" alt=\"Anatomy of an annotation\"></p>\n<p>They are the foundational blocks of this library.</p>\n";
},{}],2:[function(require,module,exports){
module.exports = "<h2 id=\"api\">API</h2>\n<p><strong>d3.annotation()</strong></p>\n<p>annotation.<strong>annotations([ objects ])</strong></p>\n<p>Pass an array of objects with annotation properties:</p>\n<ul>\n<li><strong>id</strong>: This can be anything that will help you filter and parse your annotations</li>\n</ul>\n<p><img src=\"img/json.png\" alt=\"Annotation JSON\"></p>\n<ul>\n<li><strong>x (number:pixels)</strong>: Position of the subject and one end of the connector</li>\n<li><strong>y (number:pixels)</strong>: Position of the subject and one end of the connector</li>\n<li><strong>data (object)</strong>: If you also set accessor functions, you can give data instead of x, y coordinates for placing your annotations</li>\n<li><strong>dy (number:pixels)</strong>: Position of the note and one end of the connector</li>\n<li><strong>dx (number:pixels)</strong>: Position of the note and one end of the connector</li>\n<li><strong>disable ([string])</strong>: takes the values &#39;connector&#39;, &#39;subject&#39;, and &#39;note&#39; pass them in this array if you want to disable those parts from rendering</li>\n<li><strong>note (object)</strong>: You can specify a title and label property here. All of the annotation types that come with d3-annotation have built in functionality to take the title and the label and add them to the note, however the underlying system is composable in a way that you could customize the note to contain any type of content</li>\n<li><strong>connector (object)</strong>: Some connectors such as the curve connector require additional paramters to set up the annotation</li>\n<li><strong>subject (object)</strong>: Some subjects such as the circle require additional parameters to set up the annotation</li>\n</ul>\n<p>TODO: come back, does this make sense to be renamed as &#39;mapping&#39;\nannotation.<strong>accessors({ x: function, y: function })</strong></p>\n<p>Functions that would map the .data attribute of your annotation to x and y positions. In the example below</p>\n<p>Example:</p>\n<pre><code class=\"lang-js\"><span class=\"hljs-comment\">//Sample .data for an annotation</span>\n<span class=\"hljs-comment\">//{date: \"2-Jan-08\", close: 194.84}</span>\n\n<span class=\"hljs-keyword\">const</span> parseTime = d3.timeParse(<span class=\"hljs-string\">\"%d-%b-%y\"</span>);\n\nd3.annotation().accessors({\n  x: d =&gt; x(parseTime(d.date)),\n  y: d =&gt; y(d.close)\n})\n</code></pre>\n<p>annotation.<strong>accessorsInverse({ &lt;x property mapping&gt;: function,  &lt;y property mapping&gt;: function })</strong></p>\n<p>The inverse of the accessor function. If you are given x, y coordinates, how to get back to the original data properties</p>\n<p>Example (goes with example from the accessors function):</p>\n<pre><code class=\"lang-js\"><span class=\"hljs-comment\">//Sample .data for an annotation</span>\n<span class=\"hljs-comment\">//{date: \"2-Jan-08\", close: 194.84}</span>\n\n<span class=\"hljs-keyword\">const</span> timeFormat = d3.timeFormat(<span class=\"hljs-string\">\"%d-%b-%y\"</span>)\n\nd3.annotation().accessorsInverse({\n  date: d =&gt; timeFormat(x.invert(d.x)),\n  close: d =&gt; y.invert(d.y)\n})\n</code></pre>\n<p>annotation.<strong>editMode(boolean)</strong></p>\n<p>If this is true, then the annotation will create handles for parts of the annotation that are draggable. You can style these handles with the <code>circle.handle</code> selector. If you are hooking this up to a button, you will need to run the update function below, after changing the editMode.</p>\n<p>annotation.<strong>update()</strong></p>\n<p>Redraws all of the annotations. Typcially used to reflect updated settings. If you are only updating the position (x, y) or the offset (dx, dy) you do not need to call this afterwards. Example in <a href=\"#encircle\">Layout - Encircling Annotation</a>.</p>\n<p>annotation.<strong>json()</strong></p>\n<p>You can run this in the developer console and it will print out the current annotation settings and copy them to your clipboard. Please note that in the console each annotation will also include the type that you&#39;ve associated with it.</p>\n<p>annotation.<strong>collection()</strong></p>\n<p>Access to the collection of annotations with the instantiated types.</p>\n";
},{}],3:[function(require,module,exports){
module.exports = "<ul>\n<li><a href=\"#introduction\">Introduction</a></li>\n<li><a href=\"#anatomy\">Anatomy</a></li>\n<li><a href=\"#setup\">Setup</a></li>\n<li><a href=\"#annotation\">API</a></li>\n<li><a href=\"#types\">Types</a></li>\n<li><a href=\"#custom\">Customizing Types</a></li>\n<li><a href=\"#styles\">Style Helpers</a></li>\n<li><a href=\"#in-practice\">In Practice</a></li>\n<li><a href=\"#extend\">Extending Types</a></li>\n<li><a href=\"#Notes\">Notes</a></li>\n</ul>\n";
},{}],4:[function(require,module,exports){
module.exports = "<h2 id=\"customizing-types\">Customizing Types</h2>\n<p><strong>d3.annotationCustomType(annotationType, typeSettings)</strong></p>\n<p>There are some basic settings you can use with the annotations above to customize an annotation type.</p>\n<pre><code class=\"lang-js\"><span class=\"hljs-keyword\">const</span> typeSettings = {\n  connector: { type: <span class=\"hljs-string\">\"arrow\"</span> }\n}\n\n<span class=\"hljs-keyword\">const</span> calloutWithArrow =\n  d3.annotationCustomType(\n    d3.annotationCalloutElbow,\n    typeSettings\n  )\n\nd3.annotation()\n  .annotations([{\n      text: <span class=\"hljs-string\">\"Plant paradise\"</span>,\n      data: {date: <span class=\"hljs-string\">\"18-Sep-09\"</span>,\n      close: <span class=\"hljs-number\">185.02</span>},\n      dy: <span class=\"hljs-number\">37</span>,\n      dx: <span class=\"hljs-number\">42</span>,\n      <span class=\"hljs-comment\">//Your custom type</span>\n      type: calloutWithArrow\n    }])\n  .editMode(<span class=\"hljs-literal\">true</span>)\n</code></pre>\n";
},{}],5:[function(require,module,exports){
module.exports = "<h2 id=\"extending-annotation-types\">Extending Annotation Types</h2>\n<h3 id=\"javascript-classes\">Javascript Classes</h3>\n<p>The underlying structure for the annotations and types are built with es6 JavaScript classes. To make your own custom type you can take any of the base types and extend them. </p>\n<h3 id=\"static-functions\">Static Functions</h3>\n<p><strong>STATIC className</strong></p>\n<p>A class that return a string for the class name you want to give your custom type.</p>\n<p><strong>STATIC init</strong></p>\n<p>An init function that is looped through</p>\n<p>Example, default init function</p>\n<p>Exampe, xyThreshold init function</p>\n<h3 id=\"drawing-functions\">Drawing Functions</h3>\n<p>These functions have a context parameter. Context is an object with gives you access to the annotation with all of its properties, and the relevant bounding box. </p>\n<p><strong>drawNote(context)</strong></p>\n<p><strong>drawNoteContent(context)</strong></p>\n<p><strong>drawConnector(context)</strong></p>\n<p><strong>drawSubject(context)</strong></p>\n<h3 id=\"overall-code-structure\">Overall Code structure</h3>\n<p><strong>Annotation Class</strong></p>\n<p>Each annotation is an instantiation of this class.</p>\n<p>Reference the <a href=\"https://github.com/susielu/d3-annotation/blob/master/src/Annotation.js\">souce code</a> for the full set of properties and functions. Most relevant properties: </p>\n<ul>\n<li>dx</li>\n<li>dy</li>\n<li>x</li>\n<li>y</li>\n<li>data</li>\n<li>offset: returns the dx, and dy, values as an object {x, y}</li>\n<li>position: returns the x, and y, values as an object {x, y}</li>\n</ul>\n<p><strong>Annotation Collection Class</strong></p>\n<p>When you run d3.annotation() it creates all of the annotations you pass it as Annotation Class instances and places them into an array as part of an Annotation Collection.</p>\n<p><strong>Types Class</strong></p>\n<p>Each of the annotation types is created </p>\n";
},{}],6:[function(require,module,exports){
module.exports = "<h2 id=\"in-practice\">In Practice</h2>\n<p>Here are some helpful tips for using this library and some examples to learn from. </p>\n<ul>\n<li>All of the shapes (aside from the edit handles) in the default annotations are paths </li>\n<li>In addition to the alignment settings for the note, you can also use the css <code>text-anchor</code> attribute to align the text within the note</li>\n<li>When you update the d3.annotation().type() you will need to use the call functionality again to set up the annotations with the new type. See the <a href=\"#responsive\">Responsive with Types and Hover</a> example</li>\n<li>You do not need to call d3.annotation().update() if you are only changing the position(x,y) or the offset(dx, dy). See the <a href=\"#overlapping\">Overlapping</a> example</li>\n</ul>\n<h3 id=\"responsive\">Responsive with Types and Hover</h3>\n<a href=\"https://bl.ocks.org/susielu/974e41473737320f8db5ae711ded8542\"><img src=\"img/resize.png\"/></a>\n\n<h3 id=\"overlapping\">Overlapping</h3>\n\n<p><h3 id=\"encircle\">Encircling</h3>\n<a href=\"https://bl.ocks.org/susielu/24ad9f80b9b681ce967f6005a03384f3\"><img src=\"img/encircle.png\" alt=\"Annotation encircling]\"></a></p>\n";
},{}],7:[function(require,module,exports){
module.exports = "<h2 id=\"introduction\">Introduction</h2>\n<p>Annotations <strong>establish context, and direct our users to insights and anomalies</strong>. So why are annotations so few and far between in visualizations on the web? Because <strong>implementing them is difficult.</strong></p>\n<p><strong>But it shouldn&#39;t be.</strong> </p>\n<p>Use d3-annotation with built-in annotation types, or extend it to make custom annotations. It is made for <a href=\"https://github.com/d3/d3/blob/master/CHANGES.md\">d3-v4</a> in SVG. </p>\n<p>I would love your help to make more <a href=\"#in-practice\">examples</a> and <a href=\"#types\">annotation types</a>. Contact me through <a href=\"https://www.github.com/susielu/d3-annotation\">github</a> or <a href=\"https://www.twitter.com/DataToViz\">twitter</a> to collaborate.</p>\n";
},{}],8:[function(require,module,exports){
module.exports = "<h2 id=\"notes\">Notes</h2>\n<ul>\n<li>Mike Bostock d3</li>\n<li>Prior Art</li>\n<li>Google Fonts</li>\n<li>Materialize</li>\n</ul>\n";
},{}],9:[function(require,module,exports){
module.exports = "<h2 id=\"setup\">Setup</h2>\n<h3 id=\"include-the-file-directly\">Include the file directly</h3>\n<p>You must include the <a href=\"http://d3js.org/\">d3 library</a> before including the annotation file. Then you can add the compiled js file to your website</p>\n<ul>\n<li><a href=\"https://github.com/susielu/d3-annotation/blob/master/d3-annotation.js\">Unminified</a></li>\n<li><a href=\"https://github.com/susielu/d3-annotation/blob/master/d3-annotation.min.js\">Minified</a></li>\n</ul>\n<h3 id=\"using-npm\">Using NPM</h3>\n<p>You can add d3-annotation as a node module by running</p>\n<pre><code class=\"lang-bash\">npm i d3-svg-annotation -S\n</code></pre>\n";
},{}],10:[function(require,module,exports){
module.exports = "<h2 id=\"style-helpers\">Style helpers</h2>\n<p>Basic styles to use for the annotations available on <a href=\"https://github.com/susielu/d3-annotation/blob/master/d3-annotation.css\">github</a>.</p>\n<p>Hierarchy of classes:\n<img src=\"img/classes.png\" alt=\"Annotation classes\"></p>\n";
},{}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

(function (factory) {

  // Find the global object for export to both the browser and web workers.
  var globalObject = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window || (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self;

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  if (typeof exports !== 'undefined') {
    factory(exports);
  } else if (globalObject) {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    globalObject.hljs = factory({});

    // Finally register the global hljs with AMD.
    if (typeof define === 'function' && define.amd) {
      define([], function () {
        return globalObject.hljs;
      });
    }
  }
})(function (hljs) {
  // Convenience variables for build-in objects
  var ArrayProto = [],
      objectKeys = Object.keys;

  // Global internal variables used within the highlight.js library.
  var languages = {},
      aliases = {};

  // Regular expressions used throughout the highlight.js library.
  var noHighlightRe = /^(no-?highlight|plain|text)$/i,
      languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
      fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

  var spanEndTag = '</span>';

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };

  // Object map that is used to escape some common HTML characters.
  var escapeRegexMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  /* Utility functions */

  function escape(value) {
    return value.replace(/[&<>]/gm, function (character) {
      return escapeRegexMap[character];
    });
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }

  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }

  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    match = languagePrefixRe.exec(classes);
    if (match) {
      return getLanguage(match[1]) ? match[1] : 'no-highlight';
    }

    classes = classes.split(/\s+/);

    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];

      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }

  function inherit(parent) {
    // inherit(parent, override_obj, override_obj, ...)
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);

    for (key in parent) {
      result[key] = parent[key];
    }objects.forEach(function (obj) {
      for (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3) offset += child.nodeValue.length;else if (child.nodeType === 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return original[0].offset < highlighted[0].offset ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:
       if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;
       ... which is collapsed to:
      */
      return highlighted[0].event === 'start' ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {
        return ' ' + a.nodeName + '="' + escape(a.value) + '"';
      }
      result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join('') + '>';
    }

    function close(node) {
      result += '</' + tag(node) + '>';
    }

    function render(event) {
      (event.event === 'start' ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream === original && stream.length && stream[0].offset === processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function expand_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function (variant) {
        return inherit(mode, { variants: null }, variant);
      });
    }
    return mode.cached_variants || mode.endsWithParent && [inherit(mode)] || [mode];
  }

  function compileLanguage(language) {

    function reStr(re) {
      return re && re.source || re;
    }

    function langRe(value, global) {
      return new RegExp(reStr(value), 'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : ''));
    }

    function compileMode(mode, parent) {
      if (mode.compiled) return;
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords) {
        var compiled_keywords = {};

        var flatten = function flatten(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase();
          }
          str.split(' ').forEach(function (kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
          });
        };

        if (typeof mode.keywords === 'string') {
          // string
          flatten('keyword', mode.keywords);
        } else {
          objectKeys(mode.keywords).forEach(function (className) {
            flatten(className, mode.keywords[className]);
          });
        }
        mode.keywords = compiled_keywords;
      }
      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
        }
        if (!mode.begin) mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
        if (mode.end) mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end) mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal) mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance == null) mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function (c) {
        return expand_mode(c === 'self' ? mode : c);
      }));
      mode.contains.forEach(function (c) {
        compileMode(c, mode);
      });

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators = mode.contains.map(function (c) {
        return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
      }).concat([mode.terminator_end, mode.illegal]).map(reStr).filter(Boolean);
      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : { exec: function exec() /*s*/{
          return null;
        } };
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:
   - relevance (int)
  - value (an HTML string with highlighting markup)
   */
  function highlight(name, value, ignore_illegals, continuation) {

    function subMode(lexeme, mode) {
      var i, length;

      for (i = 0, length = mode.contains.length; i < length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      var classPrefix = noPrefix ? '' : options.classPrefix,
          openSpan = '<span class="' + classPrefix,
          closeSpan = leaveOpen ? '' : spanEndTag;

      openSpan += classname + '">';

      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      var keyword_match, last_index, match, result;

      if (!top.keywords) return escape(mode_buffer);

      result = '';
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match = top.lexemesRe.exec(mode_buffer);

      while (match) {
        result += escape(mode_buffer.substring(last_index, match.index));
        keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }

    function processSubLanguage() {
      var explicit = typeof top.subLanguage === 'string';
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }

      var result = explicit ? highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) : highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      result += top.subLanguage != null ? processSubLanguage() : processKeywords();
      mode_buffer = '';
    }

    function startNewMode(mode) {
      result += mode.className ? buildSpan(mode.className, '', true) : '';
      top = Object.create(mode, { parent: { value: top } });
    }

    function processLexeme(buffer, lexeme) {

      mode_buffer += buffer;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      var new_mode = subMode(lexeme, top);
      if (new_mode) {
        if (new_mode.skip) {
          mode_buffer += lexeme;
        } else {
          if (new_mode.excludeBegin) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
            mode_buffer = lexeme;
          }
        }
        startNewMode(new_mode, lexeme);
        return new_mode.returnBegin ? 0 : lexeme.length;
      }

      var end_mode = endOfMode(top, lexeme);
      if (end_mode) {
        var origin = top;
        if (origin.skip) {
          mode_buffer += lexeme;
        } else {
          if (!(origin.returnEnd || origin.excludeEnd)) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (origin.excludeEnd) {
            mode_buffer = lexeme;
          }
        }
        do {
          if (top.className) {
            result += spanEndTag;
          }
          if (!top.skip) {
            relevance += top.relevance;
          }
          top = top.parent;
        } while (top !== end_mode.parent);
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '');
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }

      if (isIllegal(lexeme, top)) throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme;
      return lexeme.length || 1;
    }

    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = '',
        current;
    for (current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result;
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match,
          count,
          index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match) break;
        count = processLexeme(value.substring(index, match.index), match[0]);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for (current = top; current.parent; current = current.parent) {
        // close dangling modes
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance: relevance,
        value: result,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message && e.message.indexOf('Illegal') !== -1) {
        return {
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:
   - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)
   */
  function highlightAuto(text, languageSubset) {
    languageSubset = languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset.filter(getLanguage).forEach(function (name) {
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:
   - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers
   */
  function fixMarkup(value) {
    return !(options.tabReplace || options.useBR) ? value : value.replace(fixMarkupRe, function (match, p1) {
      if (options.useBR && match === '\n') {
        return '<br>';
      } else if (options.tabReplace) {
        return p1.replace(/\t/g, options.tabReplace);
      }
      return '';
    });
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
        result = [prevClassName.trim()];

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs');
    }

    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }

    return result.join(' ').trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);

    if (isNotHighlighted(language)) return;

    if (options.useBR) {
      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);

    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called) return;
    initHighlighting.called = true;

    var blocks = document.querySelectorAll('pre code');
    ArrayProto.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false);
    addEventListener('load', initHighlighting, false);
  }

  function registerLanguage(name, language) {
    var lang = languages[name] = language(hljs);
    if (lang.aliases) {
      lang.aliases.forEach(function (alias) {
        aliases[alias] = name;
      });
    }
  }

  function listLanguages() {
    return objectKeys(languages);
  }

  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.inherit = inherit;

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*';
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/
  };
  hljs.COMMENT = function (begin, end, inherits) {
    var mode = hljs.inherit({
      className: 'comment',
      begin: begin, end: end,
      contains: []
    }, inherits || {});
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: 'doctag',
      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE + '(' + '%|em|ex|ch|rem' + '|vw|vh|vmin|vmax' + '|cm|mm|in|pt|pc|px' + '|deg|grad|rad|turn' + '|s|ms' + '|Hz|kHz' + '|dpi|dpcm|dppx' + ')?',
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//, end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [hljs.BACKSLASH_ESCAPE, {
      begin: /\[/, end: /\]/,
      relevance: 0,
      contains: [hljs.BACKSLASH_ESCAPE]
    }]
  };
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };

  return hljs;
});

},{}],12:[function(require,module,exports){
'use strict';

var hljs = require('./highlight');

module.exports = hljs;

},{"./highlight":11}],13:[function(require,module,exports){
'use strict';

var contents = require('./content/contents.md');
var introduction = require('./content/introduction.md');
var anatomy = require('./content/anatomy.md');
var start = require('./content/start.md');
var annotation = require('./content/annotation.md');
var styles = require('./content/styles.md');
var custom = require('./content/custom.md');
var inpractice = require('./content/inpractice.md');
var extend = require('./content/extend.md');
var notes = require('./content/notes.md');
var highlight = require('./custom-highlightjs-build');

document.getElementById('toc1').innerHTML = contents;
document.getElementById('slide-out').innerHTML = '<li><a class="header">d3-annotation</a></li><li><div class="divider"></div></li>' + contents;
document.getElementById('introduction').innerHTML = introduction;
document.getElementById('anatomy').innerHTML = anatomy;
document.getElementById('setup').innerHTML = start;

document.getElementById('annotation').innerHTML = annotation;
document.getElementById('styles').innerHTML = styles;
document.getElementById('custom').innerHTML = custom;
document.getElementById('in-practice').innerHTML = inpractice;
document.getElementById('extend').innerHTML = extend;
document.getElementById('notes').innerHTML = notes;

$(document).ready(function () {
  $('.scrollspy').scrollSpy();
  $('.button-collapse').sideNav();
  $('.toc').pushpin({
    top: 140,
    offset: 0
  });

  $('.collapsible').collapsible();

  var defaultSettings = {
    className: "custom",
    subject: {},
    connector: {},
    note: {}
  };

  var typeSettings = JSON.parse(JSON.stringify(defaultSettings));

  var currentType = d3.annotationLabel;
  var typeKey = "annotationLabel";
  var curve = "curveCatmullRom";
  var points = 2;

  var types = {
    annotationLabel: {
      typeSettings: {
        note: { align: "middle", orientation: "topBottom" },
        connector: { type: "line" }
      },
      summary: "A centered label annotation"
    },
    annotationCallout: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "line" }
      },
      summary: "Adds a line along the note"
    },
    annotationCalloutElbow: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Keeps connector at 45 and 90 degree angles"
    },
    annotationCalloutCircle: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Subject options: radius, innerRadius, outerRadius, ",
      summaryCont: "radiusPadding",
      subject: {
        radius: 50,
        radiusPadding: 5
      }
    },
    annotationCalloutRect: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Subject options: width, height, rx, ry",
      subject: {
        width: -50,
        height: 100,
        ry: -50
      }
    },
    annotationCalloutCurve: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "curve" }
      },
      summary: "Connector options: curve, ",
      summaryCont: "points(array of [x,y]s or number)"
    },
    annotationXYThreshold: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Subject options: x1, x2 or y1, y2",
      subject: {
        x1: 0,
        x2: 1000
      }
    },
    annotationBadge: {
      typeSettings: {
        note: { align: "dynamic", lineType: "horizontal" },
        connector: { type: "elbow" }
      },
      summary: "Subject options: radius, text",
      subject: {
        radius: 14,
        text: "A"
      }
    }
  };

  var editMode = true;
  var textWrap = 120;
  var padding = 5;

  var annotation = {
    note: { label: "Longer text to show text wrapping",
      title: "Annotations :)" },
    x: 150,
    y: 170,
    dy: 117,
    dx: 162
  };
  window.makeAnnotations = d3.annotation().editMode(editMode).type(currentType).annotations([annotation]);

  d3.selectAll('.icons .options a').on('click', function () {

    var type = d3.event.target.attributes['data-section'].value;
    var value = d3.event.target.attributes['data-setting'].value;
    d3.selectAll('[data-section="' + type + '"]').classed('active', false);

    d3.selectAll('[data-section="' + type + '"][data-setting="' + value + '"]').classed('active', true);

    if (type === "note:lineType") {
      if (value === "none") {
        d3.selectAll(".icons .orientation").classed('hidden', false);
      } else {
        d3.selectAll(".icons .orientation").classed('hidden', true);
      }
    }

    if (type === "note:lineType" && value === "vertical" || type === "note:orientation" && value === "leftRight") {
      d3.selectAll("[data-section='note:align'].horizontal").classed('hidden', true);
      d3.selectAll("[data-section='note:align'].vertical").classed('hidden', false);
    } else if (type === "note:lineType" && value === "horizontal" || type === "note:orientation" && value === "topBottom") {
      d3.selectAll("[data-section='note:align'].vertical").classed('hidden', true);
      d3.selectAll("[data-section='note:align'].horizontal").classed('hidden', false);
    }

    type = type.split(':');

    if (value === "none") {

      delete typeSettings[type[0]][type[1]];
      if (type[0] == "connector" && type[1] == "type") {
        makeAnnotations.disable(['connector']);
        makeAnnotations.update();
      }
    } else {

      if (type[0] == "connector" && type[1] == "type") {
        var connectorTypes = ['annotationCallout', 'annotationCalloutElbow', 'annotationCalloutCurve'];
        if (connectorTypes.indexOf(typeKey) !== -1) {
          if (value == "line") {
            typeKey = 'annotationCallout';
          } else if (value == "elbow") {
            typeKey = 'annotationCalloutElbow';
          } else if (value == "curve") {
            typeKey = 'annotationCalloutCurve';
          }

          d3.selectAll('.icons .presets img').classed('active', false);

          d3.selectAll('[data-type="' + typeKey + '"]').classed('active', true);
        } else {
          typeSettings[type[0]][type[1]] = value;
        }

        if (value == "curve") {
          d3.select('#curveButtons').classed('hidden', false);
        } else if (typeKey !== 'annotationCalloutCurve') {
          d3.select('#curveButtons').classed('hidden', true);
        }

        makeAnnotations.disable([]);
        makeAnnotations.update();
      } else {
        typeSettings[type[0]][type[1]] = value;
      }
    }

    currentType = d3.annotationCustomType(d3[typeKey], typeSettings);

    updateAnnotations();
    sandboxCode();
  });

  d3.selectAll('.icons .presets img').on('click', function () {
    typeKey = d3.event.target.attributes['data-type'].value;
    currentType = d3[typeKey];

    d3.selectAll('.icons .presets img').classed('active', false);

    d3.selectAll('[data-type="' + typeKey + '"]').classed('active', true);

    typeSettings = JSON.parse(JSON.stringify(defaultSettings));

    if (typeKey == "annotationBadge") {
      d3.select("li.options").classed("hidden", true);
    } else {
      d3.select("li.options").classed("hidden", false);
    }

    //set options
    var options = types[typeKey].typeSettings;

    d3.selectAll('.icons .options a').classed('active', false);

    d3.select('.icons a[data-section="note:align"][data-setting="' + options.note.align + '"]').classed('active', true);

    if (options.note.lineType) {
      d3.select('.icons a[data-section="note:lineType"][data-setting=' + options.note.lineType + ']').classed('active', true);
      d3.selectAll(".icons .orientation").classed('hidden', true);
    } else {
      d3.select('.icons a[data-section="note:lineType"][data-setting="none"]').classed('active', true);
      d3.selectAll(".icons .orientation").classed('hidden', false);
      d3.select(".icons .orientation a").classed('active', true);
    }

    d3.select('.icons a[data-section="connector:end"]').classed('active', true);

    d3.select('.icons a[data-section="connector:type"][data-setting=' + options.connector.type + ']').classed('active', true);

    if (typeKey == "annotationCalloutCurve") {
      d3.select('#curveButtons').classed('hidden', false);
    } else {
      d3.select('#curveButtons').classed('hidden', true);
    }

    updateAnnotations();
    sandboxCode();
  });

  d3.select('#editmode').on('change', function () {

    editMode = d3.event.target.checked;

    makeAnnotations.editMode(editMode);
    makeAnnotations.update();

    sandboxCode();
  });

  d3.select('#textWrap').on('change', function () {
    textWrap = parseInt(d3.event.target.value);
    makeAnnotations.textWrap(textWrap).update();
  });

  d3.select('#padding').on('change', function () {
    padding = parseInt(d3.event.target.value);
    makeAnnotations.notePadding(padding).update();
  });

  d3.selectAll('#curveButtons ul.curves li a').on('click', function () {
    curve = d3.event.target.attributes['data-curve'].value;

    updateAnnotations({ connector: { curve: d3[curve], points: points } });
    sandboxCode();
  });

  d3.selectAll('#curveButtons ul.points li a').on('click', function () {
    points = parseInt(d3.event.target.attributes['data-points'].value);

    updateAnnotations({ connector: { curve: d3[curve], points: points } });
    sandboxCode();
  });

  d3.select(".sandbox").append("g").attr("class", "sandbox-annotations").call(makeAnnotations);

  var updateAnnotations = function updateAnnotations(newSettings) {
    d3.select(".sandbox g.sandbox-annotations").remove();

    var subject = types[typeKey].subject;
    makeAnnotations.type(currentType, { subject: subject, connector: newSettings && newSettings.connector });

    d3.select(".sandbox").append("g").attr("class", "sandbox-annotations").call(makeAnnotations);

    d3.select(".sandbox .type").text('d3.' + typeKey);

    d3.select(".sandbox .summary").text(types[typeKey].summary);

    d3.select(".sandbox .summaryCont").text(types[typeKey].summaryCont || "");
  };

  //change the text to have the right position for the annotation

  var sandboxCode = function sandboxCode() {

    var editModeText = editMode ? '  .editMode(true)\n' : '';

    var typeText = 'const type = ';

    if (JSON.stringify(typeSettings) == JSON.stringify(defaultSettings)) {
      typeText += 'd3.' + typeKey + '\n';
    } else {
      var json = JSON.parse(JSON.stringify(typeSettings));

      if (Object.keys(json.subject).length === 0) {
        delete json.subject;
      }

      if (Object.keys(json.connector).length === 0) {
        delete json.connector;
      }
      if (Object.keys(json.note).length === 0) {
        delete json.note;
      }
      typeText += 'd3.annotationCustomType(\n' + ('  d3.' + typeKey + ', \n') + ('  ' + JSON.stringify(json).replace(/,/g, ',\n    ')) + ')\n';
    }

    var disableText = '';

    if (makeAnnotations.disable().length !== 0) {
      disableText = '  //could also be set in the a disable property\n  //of the annotation JSON\n' + ('  .disable(' + JSON.stringify(makeAnnotations.disable()) + ')\n');
    }

    var textWrapText = '';

    if (textWrap !== 120) {
      textWrapText = '  //also can set and override in the note.wrap property\n  //of the annotation JSON\n' + ('  .textWrap(' + textWrap + ')');
    }

    var paddingText = '';

    if (padding !== 5) {
      paddingText = '  //also can set and override in the note.padding property\n  //of the annotation JSON\n' + ('  .notePadding(' + padding + ')');
    }

    var curveText = '';
    if ((typeKey == "annotationCalloutCurve" || typeSettings.connector.type == "curve") && (curve !== 'curveCatmullRom' || points !== 2)) {
      curveText = '        connector: {\n' + (curve !== 'curveCatmullRom' ? '          curve: d3.' + curve : '') + (points !== 2 && curve !== 'curveCatmullRom' ? ',\n' : '') + (points !== 2 ? '          points: ' + points : '') + '\n' + '        }';
    }

    var subjectText = '';
    if (typeKey === "annotationCalloutCircle") {
      subjectText = '        subject: {\n' + '          radius: 50,\n' + '          radiusPadding: 5,\n' + '        }\n';
    } else if (typeKey == "annotationXYThreshold") {
      subjectText = '        subject: {\n' + '          x1: 0,\n' + '          x2: 500,\n' + '        }\n';
    } else if (typeKey == "annotationBadge") {
      subjectText = '        subject: {\n' + '          text: "A",\n' + '          radius: 14,\n' + '        }\n';
    }

    d3.select("#sandbox-code code").text(typeText + '\n' + 'const annotations = [{\n' + '        notes: { label: "Longer text to show text wrapping",\n' + '          title: "Annotations :)" },\n' + '        //can use x, y directly instead of data\n' + '        data: {date: "18-Sep-09", close: 185.02},\n' + '        dy: 137,\n' + ('        dx: 162' + (curveText !== '' || subjectText !== '' ? ',' : '') + '\n') + curveText + (subjectText !== '' && curveText !== '' ? ',\n' : '') + subjectText + '      }]\n' + '\n' + 'const parseTime = d3.timeParse("%d-%b-%y")\n' + 'const timeFormat = d3.timeFormat("%d-%b-%y")\n' + '\n' + '//Skipping setting domains for sake of example\n' + 'const x = d3.scaleTime().range([0, 800])\n' + 'const y = d3.scaleLinear().range([300, 0])\n' + '\n' + 'const makeAnnotations = d3.annotation()\n' + editModeText + disableText + textWrapText + paddingText + '  .type(type)\n' + '  //accessors & accessorsInverse not needed\n' + '  //if using x, y in annotations JSON\n' + '  .accessors({\n' + '    x: d => x(parseTime(d.date)),\n' + '    y: d => y(d.close)\n' + '  })\n' + '  .accessorsInverse({\n' + '     date: d => timeFormat(x.invert(d.x)),\n' + '     close: d => y.invert(d.y)\n' + '  })\n' + '  .annotations(annotations)\n' + '\n' + 'd3.select("svg")\n' + '  .append("g")\n' + '  .attr("class", "annotation-test")\n' + '  .call(makeAnnotations)\n');

    $('#sandbox-code code, #sandbox-code-with-scales code').each(function (i, block) {
      highlight.highlightBlock(block);
    });
  };

  sandboxCode();
});

},{"./content/anatomy.md":1,"./content/annotation.md":2,"./content/contents.md":3,"./content/custom.md":4,"./content/extend.md":5,"./content/inpractice.md":6,"./content/introduction.md":7,"./content/notes.md":8,"./content/start.md":9,"./content/styles.md":10,"./custom-highlightjs-build":12}]},{},[13]);
