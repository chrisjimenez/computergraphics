/*******************************************************************
  By: Chris Jimenez
  Assignment 10 submission
  Playing with the HTML5 canvas pt. 2
  3dCode.js
 
  ASSIGNMENT 11
   Your assignment, due by class on Thursday November 20, 
   is to put together the previous two assignments to create an 
   interesting animated scene with fun shapes.

   For example, you might make a house, or a tree, or a person, 
   or a dog or a car. Try to think of something that tells a little 
   story (eg: the sun rises in the morning and the people wake up).
   Scaled globes and cylinders are very good for making limbs of 
   people and animals and trees.
   
   Have fun with it!!
******************************************************************/

var fl = 6.0; // DISTANCE OF CAMERA ALONG Z AXIS.


/**
* Draw XYZ axes.
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
* DRAW A CURVE ON THE 2D CANVAS.
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

// COMPUTE THE AREA OF A POLYGON.
function computeArea(P) {
  var area = 0;
  for (var i = 0 ; i < P.length ; i++) {
    var j = (i + 1) % P.length;
    var a = P[i];
    var b = P[j]; 

    area += (a[0] - b[0]) * (a[1] + b[1]);
  }

  return area / 2;
}

// MATRICES DON'T WORK WITH VERTICES, SO WE NEED A WRAPPER FUNCTION.
function transform(m, p) {
  var q = m.transform([ p.x, p.y, p.z ]);
  return new Vertex(q[0], q[1], q[2]);
}

// PROCEDURAL DISPLACEMENT TEXTURE.
function blobby(x, y, z) {
  return .1 * Math.sin(10*x) * Math.sin(10*y) * Math.sin(10*z + 5 * time);
}

// VIEWPORT CONVERTS FROM 3D COORDS TO 2D CANVAS PIXELS.
function viewport(p) {
  var x = p.x;
  var y = p.y;
  var z = p.z;

  // APPLY PERSPECTIVE.

  z = fl / (fl - z);
  x *= z;
  y *= z;

  return [ w/2 * x + w/2, h/2 - y * w/2 ];
}

function moveTo(p) {
  var q = transform(m, p);  // APPLY 3D MATRIX TRANFORMATION
  var xy = viewport(q);    // APPLY VIEWPORT TRANSFORM
  g.moveTo(xy[0], xy[1]);
}

function lineTo(p) {
  var q = transform(m, p);  // APPLY 3D MATRIX TRANFORMATION
  var xy = viewport(q);    // APPLY VIEWPORT TRANSFORM
  g.lineTo(xy[0], xy[1]);
}

function pointOnGlobe(u, v) {
   var phi = -Math.PI/2 + Math.PI * v;
   var theta = 2 * Math.PI * u;

   return [    Math.cos(phi) * Math.cos(theta),
               Math.cos(phi) * Math.sin(theta),
               Math.sin(phi) ];
}

// INFLATE THE SHAPE.
function inflate(p) {
  var x = p.x, y = p.y, z = p.z;
  var r = Math.sqrt(x * x + y * y + z * z);
  return new Vertex(p.x / r, p.y / r, p.z / r);
}

// RETURN A NEW VERTEX WHICH IS THE MIDPOINT OF TWO GIVEN VERTICES.
function midpoint(a, b) {
   return new Vertex( (a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2 );
}

// SUBDIVIDE A TRIANGLE, RECURSIVELY.
function subdivide(tri, nLevels) {
  var a = tri[0];
  var b = tri[1];
  var c = tri[2];

  //DECREASE THE LEVEL AND CHECK IF IT IS LESS THAN 0
  if (--nLevels < 0) {
    renderTriangle( [ inflate(a), inflate(b), inflate(c) ]);
  }else{
    var d = midpoint(a, b);
    var e = midpoint(b, c);
    var f = midpoint(c, a);

    subdivide([a,d,f], nLevels);
    subdivide([d,b,e], nLevels);
    subdivide([c,f,e], nLevels);
    subdivide([d,e,f], nLevels);
  }
}