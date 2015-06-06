/***************************************************************************
*  By: Chris Jimenez
*  Playing with the HTML5 canvas pt. 2
*  custom3Dcode.js
* 
*  ASSIGNMENT 10
*   Your assignment, due by class on Thursday November 20, 
*   is to put together the previous two assignments to create an 
*   interesting animated scene with fun shapes.
*
*   For example, you might make a house, or a tree, or a person, 
*   or a dog or a car. Try to think of something that tells a little 
*   story (eg: the sun rises in the morning and the people wake up).
*   Scaled globes and cylinders are very good for making limbs of 
*   people and animals and trees.
*   
*   Have fun with it!!
*****************************************************************************/


/**
* Draw curve C
*/
function drawCurve(C) {
   g.beginPath();
   g.fillStyle = 'rgb(100, 100, 0)';
   for (var i = 0 ; i < C.length ; i++)
      if (i == 0)
    moveTo(C[i]);
      else
    lineTo(C[i]);
   g.stroke();
   g.fill();
   g.closePath();
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

// DRAW XYZ AXES.

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
* Build 3D shape, given a parametric function 
*/
function makeShape(nu, nv, func, extra) {
   var globe = [];
   for (var j = 0 ; j <= nv ; j++) {
      var v = j / nv;
      globe.push([]);
      for (var i = 0 ; i <= nu ; i++) {
         var u = i / nu;
         var p = func([u, v], extra);
         globe[j].push(p);
      }
   }
   return globe;
}

/**
* Render a parametric shape as a collection of four sided polygons
*/
function renderShape(shape) {
   var nj = shape.length;
   var ni = shape[0].length;
   for (var j = 0 ; j < nj-1 ; j++)
      for (var i = 0 ; i < ni-1 ; i++)
    drawCurve([ shape[j    ][i    ],
                shape[j + 1][i    ],
                shape[j + 1][i + 1],
                shape[j    ][i + 1] ]);
}