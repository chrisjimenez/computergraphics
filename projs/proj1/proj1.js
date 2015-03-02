/**************************************************************************
  By: Chris Jimenez
  Using GLSL to Write WebGL Shaders
  proj1.js

  ASSIGNMENT 1
	Your assignment is to write a more interesting version of the
	fragment shader program.  Try to have fun with it -- use "u_time"
	to create animated patterns, and "u_mouse" to make it responsive
	to a user's mouse gestures.
*************************************************************************/

/**
* Vertex shaders runs once per triangle vertex.
*/
var vertexShader = [
,'   attribute vec3 a_pos;'
,'   varying   vec3 v_pos;'
,'   void main() {'
,'      gl_Position = vec4(a_pos, 1.0);'
,'      v_pos = a_pos;'
,'   }'
].join('\n');

/**
* Fragment shader runs once per pixel.
*/
var fragmentShader = [
,'   precision mediump float;'
,'   uniform float u_pixelSize;'
,'   uniform float u_time;'
,'   uniform vec3  u_mouse;'
,'   varying vec3  v_pos;'
,'   void main() {'
,'		float x = gl_FragCoord.x  + u_mouse.x;'
,'		float y = gl_FragCoord.y + u_mouse.y;'
,'      gl_FragColor = vec4(vec3(sin(pow(x, 2.0) + pow(y, 2.0))/ mod(u_time, 1.0)), 1.0);'
,'   }'
].join('\n');

// START GL PROGRAM
start_gl("proj1", vertexShader, fragmentShader);