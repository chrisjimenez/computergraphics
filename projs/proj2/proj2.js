/**************************************************************************
  By: Chris Jimenez
  Using GLSL to Write WebGL Shaders part 2
  proj2.js

  ASSIGNMENT 2
	For next Thursday, September 18, your assignment is to adopt create interesting, 
	fun and colorful geometric shapes in your fragment shader. See if you can make 
	triangles, rectangles, diamond shapes, hexagons, ovals, and any other interesting shapes.

	Each shape should have a color.
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
*  Determines if the frag location is within
*  the rectangle given the center and the size of the rectangle
*/
,'	bool fragInsideSquare(vec2 center, float size){'
,'		return'
,'			gl_FragCoord.x > center.x - size/2.0'
,'	  		&& gl_FragCoord.x < center.x + size/2.0'
,'	  		&& gl_FragCoord.y > center.y - size/2.0'
,'	  		&& gl_FragCoord.y < center.y + size/2.0;'
,'	}'
	
	
/**
*  Function that creates the hexagons!
*/
,'	float hex(vec2 fragPoint, vec2 hexPosition, float radius){'
,'		vec2 v = hexPosition - fragPoint;'

		// 2D vectices of the sides of the hexagon
,'		vec2 topBottomSides = vec2(0.0, 1.0);'
,'		vec2 leftSides = vec2(0.5, 0.5);'
,'		vec2 rightSides = vec2(0.8, 0.5);'

		// This is important to actually create the hexagon since
		// the sides of the hexagons are the dot products of the 
		// vectors that create the side and the current coordinates of 
		// of the frag point with respect to the hexagon
,'		float dot1 = dot(abs(v), topBottomSides);'
,'		float dot2 = dot(abs(v), leftSides);'
,'		float dot3 = dot(abs(v), rightSides);'

,'		float dotMax = max(max(dot1, dot2), dot3);'

		// returns the linear mix using floor()	
		// this value will be used in gl_Fragcolor in main()
,'		return mix (0.0, 1.0, floor(radius - dotMax + 1.0));'
,'	}'
	
	// Simple functions similar to fragInsideSquare which
	// determines if the frag is inside the circle given
	// the center and the radius.
,'	bool fragInsideCircle(vec2 center, float radius){'
,'		return distance(gl_FragCoord.xy, center) < radius;'
,'	}'

/**
*	MAIN FUNCTION
*/
,'	void main() {'
		// This is simply the adjsuted frag coordinate
		// which I played aroudn with to get the hexagons
		// in the middle
,'		vec2 adjFragCoord = -2.0 + 2.0 * gl_FragCoord.xy / 320.0;'
		
		// the sin(u_time) allows the square+circle to change sizes
,'		float size = abs(sin(u_time))*160.0;'
		
		// center in this case is the middle of the canvas, 320 by 320
,'		vec2 center = vec2(320, 320);'
	
		// center.y is constantly changing as well, using u_time
,'		center.y = mod(100.0*u_time, float(1.2*640.0));'

		// The three hexagons are displayed by callign the hex function...
,'		vec3 hex = vec3(hex(adjFragCoord*1.5, vec2(tan(u_time)*0.8, 0.0), 1.4),'
,'						hex(adjFragCoord*1.5, vec2(tan(u_time)*0.5, 0.0), 1.4),'
,'							hex(adjFragCoord*1.5, vec2(0.0, 0.0), 1.4));'

		// if statements determine output of gl_fragColor...
		// This is what makes the square change colors as it moves up and down
,'		if(fragInsideSquare(center, size) && (size < 30.0)){'
,'	    	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);'
,'		}else if(fragInsideSquare(center, size) && (size < 50.0 && size > 30.0)){'
,'			gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);'
,'		}else if(fragInsideSquare(center, size) && (size > 50.0)){'
,'			gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);'
	
		//display the circle
,'		}else if(fragInsideCircle(vec2(320, 320), size)){'
,'	    	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);'
	
		//otherwise, display the hexagons!
,'		}else{'
,'			gl_FragColor = vec4(mix(vec3(0.0, 0.0, 0.0), hex, 1.0),1.0);'
,'		}'
,'}'

].join('\n');

// START GL PROGRAM
start_gl("proj2", vertexShader, fragmentShader);
