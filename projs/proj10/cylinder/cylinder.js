/**************************************************************************
 By: Chris Jimenez
 Using a List of Vertices and Triangular Faces to Draw 3D Shapes
 cylinder.js

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
cylinder.animate = function(_g) {
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
  m.rotateX(.4);
  m.rotateY(-.7 + 0.3 * time);
  m.scale(.7);

  // CYLINDER IS MADE UP THREE PARTS,
  // TOP CIRCLE. MID SECTION, BOTTOM CIRCLE

  // the lower the step, the higher
  // the number of triangles
  var step = 0.1;

  var height = 0.6;

  var radius = 0.3


  //  TOP.....TRIANGLE FAN AKA CIRCLE
  for(var i = 0; i < 2* Math.PI; i += step){

    var A = new Vertex(0, height, 0);
    var B = new Vertex(radius * Math.cos(i), height, radius * Math.sin(i));
    var C = new Vertex(radius * Math.cos(i+ step), height, radius * Math.sin(i+step));

    var tri = [A,B,C];
    renderTriangle(tri);
  }

//  MID SECTION,..TRIANGLE STRIP
  for(var i = 0; i < 2* Math.PI; i += step){

    var A = new Vertex(radius * Math.cos(i), -height, radius * Math.sin(i));
    var B = new Vertex(radius * Math.cos(i), height, radius * Math.sin(i));
    var C = new Vertex(radius * Math.cos(i+ step), -height, radius * Math.sin(i+step));

    var tri = [A,B,C];
    renderTriangle(tri);
  }

  //  BOTTOM.....TRIANGLE FAN AKA CIRCLE
  for(var i = 0; i < 2* Math.PI; i += step){

    var A = new Vertex(0, -height, 0);
    var B = new Vertex(radius * Math.cos(i), -height, radius * Math.sin(i));
    var C = new Vertex(radius * Math.cos(i+ step), -height, radius * Math.sin(i+step));

    var tri = [A,B,C];
    renderTriangle(tri);
  }

}
