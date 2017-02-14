const md = require('marked');
const contents = require('./content/contents.md')
const introduction = require('./content/introduction.md')
const anatomy = require('./content/anatomy.md')
const start = require('./content/start.md')
const types = require('./content/types.md')
const layout = require('./content/layout.md')
const extend = require('./content/extend.md')
const thanks = require('./content/thanks.md')

document.getElementById('toc1').innerHTML = md(contents);
document.getElementById('slide-out').innerHTML = '<li><a class="header">d3-annotation</a></li><li><div class="divider"></div></li>' + md(contents)
document.getElementById('introduction').innerHTML = md(introduction);
document.getElementById('anatomy').innerHTML = md(anatomy);
document.getElementById('start').innerHTML = md(start);
document.getElementById('types').innerHTML = md(types);
document.getElementById('layout').innerHTML = md(layout);
document.getElementById('extend').innerHTML = md(extend);
document.getElementById('thanks').innerHTML = md(thanks);

$(document).ready(function(){
      $('.scrollspy').scrollSpy();
    $(".button-collapse").sideNav();

  console.log('in ready')
    $('.toc').pushpin({
      top: 140,
      offset: 0
    });
});