/**************************************************************************
 By: Chris Jimenez
 Using a List of Vertices and Triangular Faces to Draw 3D Shapes
 octahedron.js

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

var fl = 6.0; // DISTANCE OF CAMERA ALONG Z AXIS.

var M = 30; // from left to right
var N = 30; // from top to bottom

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

  // var a = viewport(transform(m, A));
  // var b = viewport(transform(m, B));
  // var c = viewport(transform(m, C));

  var area = 1;//computeArea([a, b, c]);

  if (area > 0){
    drawCurve([ A, B, C, A ]);
  }
}

/**
* Gets called repeatedly.
*/
function drawShape(vertices, faces){

  for(var i = 0; i < faces.length; i++){
    
    var A = vertices[ faces[i][0] ];
    var B = vertices[ faces[i][1] ];
    var C = vertices[ faces[i][2] ];

    var tri = [A, B, C];

    renderTriangle(tri);
  }
}

/**
* Draws the octahedron.
*/
function drawOctahedron(){
  // LIST OF VERTICES...
  var vertices = [

	    new Vertex(0,0,-1), new Vertex(0,-1,0), new Vertex(-1,0,0), new Vertex(1,0,0),
	        new Vertex(0,-1, 0), new Vertex(0,0,-1), new Vertex(-1,0,0), new Vertex(0,1,0),

	    new Vertex(0,0,-1), new Vertex(0,0,-1), new Vertex(0,1,0), new Vertex(1,0,0),
	        new Vertex(-1,0, 0), new Vertex(0,-1,0), new Vertex(0,0,1), new Vertex(0,0,1),

	    new Vertex(0,-1,0),new Vertex(1,0,0),new Vertex(0,0,1),new Vertex(0,1,0),
	        new Vertex(-1,0, 0),new Vertex(1,0,0),new Vertex(0,1,0),new Vertex(0,0,1)		
	];

// LIST OF TRIANGULAR FACES...
 var faces = [
          [  0,   1,    2 ]  , [  3,  4,    5],  
          [  6,   7,    8 ]  , [  9,  10,  11],  
          [  12,  13,   14 ] , [ 15,  16,  17],  
          [ 18,   19,   20 ] , [ 21,  22,  23],  
  ];

  // draw our shape!
  drawShape(vertices, faces);
}

/**
* Gets called repeatedly.
*/
octahedron.animate = function(_g) {

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
  m.scale(.6);

  // DRAW THE OCTAHEDRON!
  drawOctahedron();
}
