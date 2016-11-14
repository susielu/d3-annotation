
export default function annotation(){

// declare interal variables

//drawing an annotation in d3
function annotation(selection){

}

//example functions
annotation.title = function(_) {
  if (!arguments.length) return title;
  title = _;
  return annotation;
};

annotation.on = function(){
  var value = legendDispatcher.on.apply(legendDispatcher, arguments)
  return value === legendDispatcher ? annotation : value;
}

return annotation;

};
