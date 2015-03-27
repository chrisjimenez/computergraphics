/**************************************************************************
 By: Chris Jimenez
 Using a List of Vertices and Triangular Faces to Draw 3D Shapes
 cube.js

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

// create matrix object
var m = new Matrix4x4();

// Distance of camera along z-axis
var fl = 6.0; 

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

  // IF THE TRIANGLE IS BACKWARD FACING, DON'T RENDER IT.

  var area = 1;

  if (area > 0){
    drawCurve([ A, B, C, A ]);
  }
}

/**
* Gets called repeatedly.
*/
cube.animate = function(_g) {

  g = _g;
  w = g.canvas.width;
  h = g.canvas.height;

  // MAKE A GREEN BACKGROUND.
  g.fillStyle = 'rgb(61, 153, 46)';
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(w, 0);
  g.lineTo(w, h);
  g.lineTo(0, h);
  g.lineTo(0, 0);
  g.fill();


  // DRAW THIN LINES IN PURPLE.
  g.lineWidth = .3;
  g.strokeStyle = 'rgb(106, 39, 122)';

  // ANIMATE THE SCENE.
  m.identity();
  m.rotateX(.2);
  m.rotateY(-.7 + 0.3 * time);
  m.scale(.5);


  // LIST OF VERTICES...
  var vertices = [
    new Vertex(-1,-1,-1), new Vertex(1,-1,-1), new Vertex(-1,1,-1), new Vertex(1,1,-1),
        new Vertex(-1,-1, 1), new Vertex(1,-1,1), new Vertex(-1,1,1), new Vertex(1,1,1),

    new Vertex(-1,-1,-1), new Vertex(1,-1,-1), new Vertex(-1,1,-1), new Vertex(1,1,-1),
        new Vertex(-1,-1, 1), new Vertex(1,-1,1), new Vertex(-1,1,1), new Vertex(1,1,1),

    new Vertex(-1,-1,-1),new Vertex(1,-1,-1),new Vertex(-1,1,-1),new Vertex(1,1,-1),
        new Vertex(-1,-1, 1),new Vertex(1,-1,1),new Vertex(-1,1,1),new Vertex(1,1,1)
  ];



//  FACES WILL CONTAIN THE INDICES FOR THE 
//  VERTICES ARRAY ABOVE
// var faces = [
//    [ 0,  4,  6,  2], // negative x face
//    [ 1,  3,  7,  5], // positive x face
//    [ 8,  9, 13, 12], // negative y face
//    [10, 14, 15, 11], // positive y face
//    [16, 18, 19, 17], // negative z face
//    [20, 21, 23, 22], // positive z face
//    ];

  //  LIST OF FACES...
  var faces = [
          [  0,  4,  6 ], [  6,  2,  0],  // [ 0,  4,  6,  2]
          [  1,  3,  7 ], [  7,  5,  1],  // [ 1,  3,  7,  5]
          [  8,  9, 13 ], [ 13, 12,  8],  // [ 8,  9, 13, 12]
          [ 10, 14, 15 ], [ 15, 11, 10],  // [10, 14, 15, 11]
          [ 16, 18, 19 ], [ 19, 17, 16],  // [16, 18, 19, 17]
          [ 20, 21, 23 ], [ 23, 22, 20],  // [20, 21, 23, 22]
  ];

  // LEVEL OF RECURSIONS
  var nLevels = 4;

  //  DRAW EACH TRIANGLE!
  //  total of 12 faces
  for(var i = 0; i < faces.length; i++){
    
    // pull out each vertex
    var A = vertices[ faces[i][0] ];
    var B = vertices[ faces[i][1] ];
    var C = vertices[ faces[i][2] ];

    var tri = [A, B, C];

    // draw triangle
    renderTriangle(tri);
  }
}
