const md = require('marked');
const contents = require('./content/contents.md')
const introduction = require('./content/introduction.md')
const anatomy = require('./content/anatomy.md')
const start = require('./content/start.md')
const types = require('./content/types.md')
const layout = require('./content/layout.md')
const extend = require('./content/extend.md')
const thanks = require('./content/thanks.md')
const highlight = require('highlight.js')
// md.setOptions({
//   highlight: function (code) {
//     console.log('in highlight')
//     return require('highlight.js').highlightAuto(code).value;
//   }
// })

document.getElementById('toc1').innerHTML = md(contents);
document.getElementById('slide-out').innerHTML = '<li><a class="header">d3-annotation</a></li><li><div class="divider"></div></li>' + md(contents)
document.getElementById('introduction').innerHTML = md(introduction);
document.getElementById('anatomy').innerHTML = md(anatomy);
document.getElementById('start').innerHTML = md(start);

console.log('start', md(start))
document.getElementById('types').innerHTML = md(types);
document.getElementById('layout').innerHTML = md(layout);
document.getElementById('extend').innerHTML = md(extend);
document.getElementById('thanks').innerHTML = md(thanks);

$(document).ready(function(){
    $('.scrollspy').scrollSpy();
    $('.button-collapse').sideNav();
    $('.toc').pushpin({
      top: 140,
      offset: 0
    });

    highlight.initHighlightingOnLoad();
});