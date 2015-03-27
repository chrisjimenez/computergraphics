/*********************************************************************
*  canvas.js
* 
*  Contains a couple functions to set up WebGL
*********************************************************************/

// A browser-independent way to call a callback function every 1/60 second.
window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback) { window.setTimeout(callback, 1000 / 60); }; })();

/**
* Prepare all canvases for animated drawing
*/
function g_start() {
  var all = document.getElementsByTagName("*");
  for (var i = 0 ; i < all.length ; i++)
      if (all[i].tagName == "CANVAS")
   g_startCanvas(all[i].id );
}

/**
* Prepare one canvas for animated drawing
*/
function g_startCanvas(canvasName) {

  var canvas = document.getElementById(canvasName);

  // get the canvass 2D drawing context
  canvas.g = canvas.getContext('2d');
  var g = canvas.g;
  g.canvas = canvas;

  // osme defaults
  g.textHeight = 12;
  g.lineCap = "round";
  g.lineJoin = "round";

  // if a setup function is defined, call it
  if (canvas.setup !== undefined) {
     g.clearRect(0, 0, canvas.width, canvas.height);
     canvas.setup();
  }

  g_tick(canvas);
}

/**
* Function loops repeatedly, calling the animate function
*/
var g_tick = function(canvas) {

  // if an animate function is defined, call it
  if (canvas.animate !== undefined) {

     // COMPUTE THE TIME, IN SECONDS, SINCE PAGE LOADED.

     time = (new Date()).getTime() / 1000 - startTime;

     // CLEAR THE BACKGROUND EVERY FRAME BEFORE CALLING USER'S ANIMATE FUNCTION.

     canvas.g.clearRect(0, 0, canvas.width, canvas.height);
     canvas.animate(canvas.g);

     requestAnimFrame(function() { g_tick(canvas); });
  }
}

var time, startTime = (new Date()).getTime() / 1000;
   