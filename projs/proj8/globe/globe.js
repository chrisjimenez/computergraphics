/***************************************************************************
*  By: Chris Jimenez
*  Using Matrix Operations
*  globe.js
*
*  ASSIGNMENT 9
*  Your assignment, due by class on Thursday November 13, is to use your fully 
*  function implementation of matrices in place of the non-functioning one that 
*  is in the folder now.
****************************************************************************/

// Create matrix object...
var m = new Matrix4x4();  

// global vars for width height and canvas g
var w, h, g;

// DRAWS A CURVE GIVNE C ARRAY
function drawCurve(C) {
   g.beginPath();
   for (var i = 0 ; i < C.length ; i++)
      if (i == 0)
    moveTo(C[i]);
      else
    lineTo(C[i]);
   g.stroke();
}

function viewport(p) {
   return [ w/2 * p[0] + w/2, h/2 - p[1] * w/2 ];
}

function moveTo(p) {
   var q = m.transform(p);  // APPLY 3D MATRIX TRANFORMATION
   var xy = viewport(q);    // APPLY VIEWPORT TRANSFORM
   g.moveTo(xy[0], xy[1]);
}

function lineTo(p) {
   var q = m.transform(p);  // APPLY 3D MATRIX TRANFORMATION
   var xy = viewport(q);    // APPLY VIEWPORT TRANSFORM
   g.lineTo(xy[0], xy[1]);
}

/**
* Draws the XYZ axes
*/
function drawAxes() {
   g.strokeStyle = 'rgb(255,0,0)';
   g.beginPath();
   moveTo([ 0, 0, 0]);
   lineTo([ 1, 0, 0]);
   g.stroke();

   g.strokeStyle = 'rgb(0,200,0)';
   g.beginPath();
   moveTo([ 0, 0, 0]);
   lineTo([ 0, 1, 0]);
   g.stroke();

   g.strokeStyle = 'rgb(0,0,255)';
   g.beginPath();
   moveTo([ 0, 0, 0]);
   lineTo([ 0, 0, 1]);
   g.stroke();
}


function pointOnGlobe(u, v) {
   var phi = -Math.PI/2 + Math.PI * v;
   var theta = 2 * Math.PI * u;

   return [    Math.cos(phi) * Math.cos(theta),
               Math.cos(phi) * Math.sin(theta),
               Math.sin(phi) ];
   }

/**
* Animate function gets called repeatedly
*/
globe.animate = function(_g) {
   g = _g;
   w = g.canvas.width;
   h = g.canvas.height;

   // background
   g.fillStyle = 'rgb(200,240,255)';
   g.beginPath();
   g.moveTo(0, 0);
   g.lineTo(w, 0);
   g.lineTo(w, h);
   g.lineTo(0, h);
   g.lineTo(0, 0);
   g.fill();


   // animate the scene
   m.identity();
   m.rotateX(.1);
   m.rotateY(time);
   m.scale(.5);

   drawAxes();

   m.scale(.7 + .3 * Math.sin(4 * time), 0, 0);

   // draw shape in black
   g.strokeStyle = 'rgb(0,0,0)';


////////// SECOND VERSION OF DRAWING A GLOBE ////////////////

   // NOW WE HAVE MOVED ALL THE GLOBE MATH INSIDE FUNCTION "pointOnGlobe".
   // WE COULD REPLACE "pointOnGlobe()" WITH OTHER FUNCTIONS, TO CREATE
   // DIFFERENT PARAMETRIC SHAPES.
   var nu = 30;
   var nv = 10;

   for (var v = 0 ; v < 1 ; v += 1 / nv) {
      var curve = [];
      for (var u = 0 ; u <= 1 ; u += 1 / nu) {
         var p = pointOnGlobe(u, v);
         curve.push(p);
      }
      drawCurve(curve);
   }
}