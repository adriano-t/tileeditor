
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

Math.clamp = function(x, min, max) {
    return x < min ? min : (x > max ? max : x);
};

window.addEventListener('resize', function() {
  selection.SetSize();
  editor.SetSize();
}, true);


window.addEventListener('load', function() {
  StartEditor();
}, true);

	
window.addEventListener('focus', function() {
});

window.addEventListener('blur', function() {
});

var $ = function( id ) { return document.getElementById( id ); };