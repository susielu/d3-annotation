var browserify = require('browserify');
var fs = require('fs');
var path = require('path');
var markedify = require('markedify');
var marked = require('marked');
var babelify = require('babelify');
var highlight = require('highlight.js')

marked.setOptions({
  highlight: function(code, lang) {
    return highlight.highlight(lang, code).value;
  }
});

var renderer = new marked.Renderer();
var markedOptions = {
  renderer: renderer,
};

browserify(path.join(__dirname, 'docs.js'))
.transform(markedify, {marked: markedOptions})
.transform(babelify, {presets: ['es2015']})
.bundle()
.on('error', function(err) { console.log('ERROR: ' + err); })
.pipe(fs.createWriteStream(path.join(__dirname, 'docs-compiled.js')));
