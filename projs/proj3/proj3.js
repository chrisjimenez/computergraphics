/**************************************************************************
  By: Chris Jimenez
  Implementing a Ray Tracer
  proj3.js

  ASSIGNMENT 3
	Your assignment, due by class on Thursday September 25, is to 
	implement a very simple ray tracer, and show that you can trace a ray 
	to a scene that contains two spheres. The result should look something 
	like a circular disk. I recommend encoding each sphere as a vec4, with 
	the first three components of the vec4 storing the center point (cx,cy,cz) 
	of the sphere, and the fourth component storing the sphere's radius r. I 
	strongly recommend that you implement a function in your fragment shader 
	that takes three arguments: a ray origin V, a ray direction W, and a vec4 
	containing the cx,cy,cz,r of the sphere. Your function should return the 
	value of t -- the distance along the ray -- where the nearest intersection 
	occurs between the ray and the sphere. If your ray misses the sphere entirely, 
	you can return a very large positive number, such as 10000.0. Each time your 
	program is called, you will need to form a ray for that pixel, then trace the 
	ray to each of the two spheres. If your ray hits both spheres, then the one 
	"in front" is the one with the smaller value of t. I suggest you color the 
	background one color, and each of the two spheres a different color. Position 
	your spheres so that the rendered scene will show one sphere with a larger value 
	of cz (in other words, nearer to the camera) partly obscuring the other sphere.
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
,'  precision mediump float;'
,'  uniform float u_pixelSize;'
,'  uniform float u_time;'
,'  uniform vec3  u_mouse;'
,'  varying vec3  v_pos;'


/**
* Function that returns t the distance along the ray that takes three arguments: a ray origin V, a ray 
* direction W, and a vec4 containing the cx,cy,cz,r of the sphere.
*/
,'	float distAlongRay(vec4 v, vec4 w, vec4 sphere){'

//		calculate b & c for ray distance calulation....
,'		float b = dot((v - sphere), w);'
,'		float c = dot((v - sphere), (v - sphere)) - pow(sphere.w, 2.0);'

//		if result is imaginary
,'		if((b * b) - c < 0.0){'
,'			return 10000.0;'
,'		}else{'
,'			return -b - sqrt(b*b-c);'
,'		}'
,'	}'

/**
* MAIN 
*/ 
,'	void main() {'

//		set up ray origin...
//		origina is located at (320.0, 320.0, focal_length)
,'		float focalLength = 100.0;'
,'		vec4 rayOrigin = vec4(320.0, 320.0, focalLength, 1.0);'

//		calculate unit length direction vector...
,'		vec4 relativeVector = vec4(gl_FragCoord.x, gl_FragCoord.y, 0.0, 1.0) - rayOrigin;'
,'		vec4 unitLengthDir = relativeVector/ sqrt(dot(relativeVector, relativeVector));'

//		location of the spheres w/ their radii
,'		vec4 sphere1 = vec4(340.0, 320.0, 40.0, 300.0);'
,'		vec4 sphere2 = vec4(310.0, 320.0, 60.0, 400.0);'

//		display color!..........................
//		if ray hits first sphere...
,'		if(distAlongRay(rayOrigin, unitLengthDir, sphere1) < 10000.0){'
,'			gl_FragColor = vec4(0.75, 0.75, 0.75, 1.0);'

//		else if ray hits second sphere....
,'		}else if(distAlongRay(rayOrigin, unitLengthDir, sphere2) < 10000.0){'
,'			gl_FragColor = vec4(0.2, 0.1, 1.0, 1.0);'

//		otherwise display the background color...
,'		} else {'
,'			gl_FragColor = vec4(0.0, 0.0, 0.020, 1.0); '
,'		}'
,'}'																	

].join('\n');

// START GL PROGRAM
start_gl("proj3", vertexShader, fragmentShader);
