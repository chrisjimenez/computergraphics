/**************************************************************************
 By: Chris Jimenez
 Using a List of Vertices and Triangular Faces to Draw 3D Shapes
 torus.js

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

//cretae matrix object
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
* Draw shape given vertices and faces.
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
* Build torus given inner and outer radius.
*/
function buildTorus(outterRadius, innerRadius){

  if(outterRadius < innerRadius){
    throw new Error("Outter radius is less than inner radius of the torus!. Cant render!");
  }

  var vertices = [];
  var faces = [];

  // create the list of vertices...
  for(var i = 0; i < M + 1; i++){
    var theta = 2 * Math.PI * i / M;

    for(var j = 0; j < N + 1; j++){
      var index = i + (M + 1) * j;
      var phi = 2 * Math.PI * j / N;

      var x = (outterRadius + innerRadius * Math.cos(theta)) * Math.cos(phi);
      var y = (outterRadius + innerRadius * Math.cos(theta)) * Math.sin(phi);
      var z = innerRadius * Math.sin(theta);

      vertices.push(new Vertex(x,y,z));
    }
  }

  // create the list of faces...
  for(var i = 0; i < M; i++){
    for(var j = 0; j < N; j++){

       var a =    i               * (N + 1) +  j;
       var b =    i               * (N + 1) + ((j + 1) % M);
       var c =    ((i + 1) % N)   * (N + 1) + ((j + 1) % M);
       var d =    ((i + 1) % N)   * (N + 1) +  j;

       faces.push( [ a, b, c ] );
       faces.push( [ c, d, a ] );
    }
  }

  // draw our shape!
  drawShape(vertices, faces);
}

/**
* Gets called repeatedly.
*/
torus.animate = function(_g) {

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

  //draw our Torus!
  buildTorus(0.5, 0.3);
}
