/**************************************************************************
  By: Chris Jimenez
  Playing with the HTML5 Canvas
  proj7_1.js

  ASSIGNMENT 7
   Your assignment, due by class on Thursday November 6, is to just have fun 
   with making cool animations using the Canvas object. Go crazy with it, 
   make creatures and houses, science fiction landscapes, words and poetry, 
   pretty much anything you want. The key is to explore and try things out. 
   Our goal for the following week will be to start using the Canvas element 
   as a way of looking at the results of Matrix transformations and to start 
   to experiment with building shapes out of triangles, and then things will 
   get more serious.

   So take this opportunity to just play around and have fun while you can! :-)
*************************************************************************/

var mx = 0;
var my = 0;

/**
* Gets called repeatedly.
*/
proj7_1.animate = function(g) {

  //  Get canvas width and height
  var w = g.canvas.width;
  var h = g.canvas.height;
      
  // background
  g.fillStyle = 'rgb(100,100,100)';
  g.beginPath();
  g.moveTo(0,0);
  g.lineTo(w,0);
  g.lineTo(w,h);
  g.lineTo(0,h);
  g.fill();
    
  //  CREATE SECONDARY BACKGROUND
  //  var that holds the difference in size between
  //  the first bg and the second bg.
  var bgSizeDif = 50;

  g.fillStyle = 'rgb(100,0,100)';
  g.beginPath();
  g.moveTo(bgSizeDif,bgSizeDif);
  g.lineTo(w-bgSizeDif,bgSizeDif);
  g.lineTo(w-bgSizeDif,h-bgSizeDif);
  g.lineTo(bgSizeDif,h-bgSizeDif);
  g.fill();

  // set radius and time
  var radius = 10;
  var t = 0.5 + 2.5 * Math.sin(time);
  var k0 = 5 * t;
  
  // space between each rod
  var step = 7;
  
  // loop through whole cnavas
  for(var i = bgSizeDif; i < w - bgSizeDif; i = i + step){
    for(var j = bgSizeDif; j < h- bgSizeDif; j = j + step){
      g.fillStyle = 'rgb(255,0,0)';
      g.beginPath();
      g.moveTo(i, j);

      for (var k = k0 ; k <= k0 + 1 ; k++) {
        var x = radius * Math.cos(Math.atan((mx-i)/(my-j)) * k/2);
        var y = radius * Math.sin(Math.atan((mx-i)/(my-j)) * k/2);
        g.lineTo(i + x, j + y);
      }
      g.fill();
    }   
  } 
}
   
/**
* Event that occurs when a mouse touches down on the canvas.
*/
function click(e) {
  var pos = getMousePos(proj7_1, e);
  mx = pos.x;
  my = pos.y;
}
  
// add the event listener
window.addEventListener('mousedown', click, false);


/**
* Simple functio nthat gets the current mouse position.
*/
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  var x1 = evt.clientX-rect.left;
  var y1 = evt.clientY-rect.top;
  if(x1 > canvas.width) x1 = 0;
  if(y1 > canvas.height) y1 = 0;

  return {
    x:  x1,
    y:  y1
  };
}