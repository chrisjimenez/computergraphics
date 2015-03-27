/***************************************************************************
*   By: Chris Jimenez
*   Using Matrix Operations
*   legs.js
* 
*   ASSIGNMENT 9
*   Your assignment, due by class on Thursday November 13, is to use your fully 
*   function implementation of matrices in place of the non-functioning one that 
*   is in the folder now.
****************************************************************************/


var w, h, g;

var m; 

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
* ANimate function gets called repeatedly
*/
legs.animate = function(_g) {
   g = _g;
   w = g.canvas.width;
   h = g.canvas.height;
   m = new Matrix4x4();

   g.fillStyle = 'rgb(200,240,255)';
   g.beginPath();
   g.moveTo(0, 0);
   g.lineTo(w, 0);
   g.lineTo(w, h);
   g.lineTo(0, h);
   g.lineTo(0, 0);
   g.fill();

   var myScale = .75 + .25 * Math.sin(10 * time);

   g.fillStyle = 'rgb(128,0,0)';
   g.strokeStyle = 'rgb(0,0,0)';

   // set up the legs
   m.identity();

   var turnAngle = Math.abs(Math.sin(time)/20) * Math.PI/2;

   // draw far leg first
   var side0 = turnAngle > 0 ? 0 :  1;
   var side1 = turnAngle > 0 ? 2 : -1;
   var dside = turnAngle > 0 ? 1 : -1;
   for (var side = side0 ; side != side1 ; side += dside) {

      g.beginPath();

      var sign = side == 0 ? -1 : 1;
      var theta = 3 * time + Math.PI * side;
      var bend1 = .3 + .3 * Math.sin(theta);
      var bend2 = .3 + .3 * Math.cos(theta);

      m.identity();
     m.rotateY(Math.PI + turnAngle);
      m.translate(0, .4 + .2 * bend2, .1 * sign);

      moveTo([0,0,0]);             // HIP

      m.rotateZ(bend1);
      m.translate(0, -.4, 0);
      lineTo([0,0,0]);             // KNEE

      m.rotateZ(-1 * bend2);
      m.translate(0, -.4, 0);
      lineTo([0,0,0]);             // ANKLE

      m.rotateZ(-bend1);
      m.translate(.1, 0, 0);
      lineTo([0,0,0]);             // TOE

      // draw fatstroke for leg border
      g.strokeStyle = 'rgb(0,0,0)';
      g.lineWidth = 40;
      g.stroke();

      // draw skinny stroke for inner leg
      g.strokeStyle = 'rgb(255,0,0)';
      g.lineWidth = 10;
      g.stroke();
   }

   m.rotateZ(1);
}