/**************************************************************************
 By: Chris Jimenez
 Using a List of Vertices and Triangular Faces to Draw 3D Shapes
 myCanvas.js

 Assingment 10
    For Thursday, December 4, your assignment is to figure out how to 
    describe various 3D shapes as a list of vertices and a list of 
    triangular faces.

    Shapes you should do this for are: cylinder, sphere, cube 
    (which I already showed you how to do, above), octahedron, torus.

    You can try other shapes as well if you are feeling ambitious. 
    For example, can you make a shape that looks like a house? An animal? 
    A tree? 3D letters?Remember, your triangles all need to be oriented 
    counterclockwise, when viewed from the outside of the shape.

    Try making an interesting animated scene using your vertices/faces 
    shapes.
*************************************************************************/

var w, h, g;

var m = new Matrix4x4();

/**
* Vertex object
*/
function Vertex(x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.scale = function(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
  }
}


/**
* Render one triangle
*/
function renderTriangle(tri) {
  var A = tri[0];
  var B = tri[1];
  var C = tri[2];

  // add procedural texture.
  A.scale(1 + blobby(A.x, A.y, A.z));
  B.scale(1 + blobby(B.x, B.y, B.z));
  C.scale(1 + blobby(C.x, C.y, C.z));


  var a = viewport(transform(m, A));
  var b = viewport(transform(m, B));
  var c = viewport(transform(m, C));

  var area = 1;

  if (area > 0){
    drawCurve([ A, B, C, A ]);
  }
}

/**
* Gets called repeatedly.
*/
myCanvas.animate = function(_g) {

  g = _g;
  w = g.canvas.width;
  h = g.canvas.height;

  // Draw the background
  g.fillStyle = 'rgb(61, 153, 46)';
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(w, 0);
  g.lineTo(w, h);
  g.lineTo(0, h);
  g.lineTo(0, 0);
  g.fill();


  // sraw thin lines
  g.lineWidth = .5;
  g.strokeStyle = 'rgb(106, 39, 122)';

  // animate the scene
  m.identity();
  m.rotateY(-.2 + 0.3 * time);
  m.rotateZ(-.2 + 0.3 * time);
  m.rotateX(-.2 + 0.3 * time);

  m.scale(.7);

  // levels of recursion
  var nLevels = Math.sin(3 *time) * 5;

  subdivide([ new Vertex(-1,0, 0), new Vertex(0,-1,0), new Vertex( 0,0,-1) ], nLevels);
  subdivide([ new Vertex( 0,0,-1), new Vertex(0,-1,0), new Vertex( 1,0, 0) ], nLevels);
  subdivide([ new Vertex( 0,0,-1), new Vertex(0, 1,0), new Vertex(-1,0, 0) ], nLevels);
  subdivide([ new Vertex( 1,0, 0), new Vertex(0, 1,0), new Vertex( 0,0,-1) ], nLevels);
  subdivide([ new Vertex( 0,0, 1), new Vertex(0,-1,0), new Vertex(-1,0, 0) ], nLevels);
  subdivide([ new Vertex( 1,0, 0), new Vertex(0,-1,0), new Vertex( 0,0, 1) ], nLevels);
  subdivide([ new Vertex(-1,0, 0), new Vertex(0, 1,0), new Vertex( 0,0, 1) ], nLevels);
  subdivide([ new Vertex( 0,0, 1), new Vertex(0, 1,0), new Vertex( 1,0, 0) ], nLevels);
}
