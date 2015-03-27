/***************************************************************************
*   By: Chris Jimenez
*   Using Matrix Operations
*   doughnut.js
* 
*   ASSIGNMENT 9
*   Your assignment, due by class on Thursday November 13, is to use your fully 
*   function implementation of matrices in place of the non-functioning one that 
*   is in the folder now.
*****************************************************************************/

var w, h, g;

// create matrix object
var m = new Matrix4x4();

/**
*  Draw a curve on the 2D canvas
*/
function drawCurve(C) {
   g.beginPath();
   for (var i = 0 ; i < C.length ; i++)
      if (i == 0)
         moveTo(C[i]);
      else
         lineTo(C[i]);
   g.stroke();
}

/**
* Converts 3D coordinates to 2D canvas pixels
*/
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
*  Draw XYZ axes
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

/**
* Compute point on globe given [u.v]
*/
function pointOnGlobe(uv) {
   var u = uv[0];
   var v = uv[1];
   var phi = -Math.PI/2 + Math.PI * v;
   var theta = 2 * Math.PI * u;
   return [ Math.cos(phi) * Math.cos(theta),
            Math.cos(phi) * Math.sin(theta),
            Math.sin(phi)];
}

/**
* COmpute point on a torus given [u,v]
*/
function pointOnBagel(uv, r) {
   if (r === undefined)
      r = 0.2;

   var theta = 2 * Math.PI * uv[0];
   var phi   = 2 * Math.PI * uv[1];

   return [ (1 + r * Math.cos(phi)) * Math.cos(theta),
            (1 + r * Math.cos(phi)) * Math.sin(theta),
                 1+ r * Math.sin(phi) ];
}

// set mesh
var nu = 16 * 4;
var nv = 20 * 4;

/**
* Build a parametric 3D shape, given a parametric function func
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

// RENDER A PARAMETRIC SHAPE AS A COLLECTION OF FOUR SIDED POLYGONS.
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

var bagel = makeShape(nu, nv, pointOnBagel, 0.5);

/**
* Animate function gets called repeatedly
*/
doughnut.animate = function(_g) {
   g = _g;
   w = g.canvas.width;
   h = g.canvas.height;

   // background
   g.fillStyle = 'rgb(5,0,100)';
   g.beginPath();
   g.moveTo(0, 0);
   g.lineTo(w, 0);
   g.lineTo(w, h);
   g.lineTo(0, h);
   g.lineTo(0, 0);
   g.fill();

   // Animate the scene
   m.identity();
   m.rotateX(.5);
   m.rotateY(time / 3);
   m.scale(.3);

   // Create the shape
   var shape = makeShape(nu, nv, pointOnBagel, 0.6);

]   // Procedurally displace the shapes vertices
   for (var j = 0 ; j < shape.length ; j++)
      for (var i = 0 ; i < shape[j].length ; i++) {
         var p = shape[j][i];
         var r = 1 + 0.1 * Math.sin(10 * p[0] + 3 * time)* Math.sin(10 * p[1] + 3 * time);
         p[0] *= r;
         p[1] *= r;
         p[2] *= r;
      }

   // draw shape in black
   g.strokeStyle = 'rgb(0,255,10)';
   renderShape(shape);
}