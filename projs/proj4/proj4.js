/**************************************************************************
  By: Chris Jimenez
  Implementing a Ray Tracer part 2
  proj4.js

  ASSIGNMENT 4
   Your assignment, due by class on Thursday October 2, is to modify your 
   sphere tracing scene so that it starts to make use of arrays, using my 
   code example as a guide. There are a number of ways you can do this. 
   One is to specify your sphere data in your javascript, and then pass it 
   into your fragment shader each frame. Note that this will allow you to 
   start doing animation logic in your Javascript code, which is a good 
   place for it. The reason we are doing this is to give you practice with 
   more powerful GPU programming features, as we continue to learn more 
   about ray tracing. Feel free to think of other creative ways to use arrays 
   passed from Javascript into the fragment shader to make your assignment 
   more interesting.
*************************************************************************/


/**
* Function that gets calle once.
*/
var initialize_gl = function(gl) {
   gl.u_array1 = gl.getUniformLocation(gl.prog, "u_array1");
   gl.u_array2 = gl.getUniformLocation(gl.prog, "u_array2");
};

/*
   Notice that the number of items passed to a uniform needs to equal the size of that uniform.
   u_array1 is type float[4], so it needs 1 * 4 == 4 values.
   u_array2 is type  vec2[4], so it needs 2 * 4 == 8 values.
*/

/**
* Function that gets called every animation frame.
*/
var update_gl = function(gl) {
  //array of sphere coordinates...
  //total of 4 spheres therefore there are 16 entries(4 by 4)
  gl.uniform4fv(gl.u_array1, new Float32Array([340.0, 320.0, 40.0, 300.0,
                                    320.0, 200.0, 60.0, 500.0,
                                     280.0, 280.0, 20.0, 1000.0,
                                         340.0, 440.0, 200.0, 2000.0]));
  //color values....
   gl.uniform4fv(gl.u_array2, new Float32Array([0.75, 0.75, 0.75, 1.0,
                                    0.2, 0.1, 1.0, 1.0,
                                        0.5, 0.6, 1.0, 1.0,
                                            0.9, 0.1, 1.0, 0.60]));
}

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

//  sphere coordinates
,'  uniform vec4  u_array1[4];'

//  color of the spheres...
,'  uniform vec4  u_array2[4];'


/**
*  Function that returns t the distance along the ray that takes 
*  three arguments: a ray origin V, a ray direction W, and a vec4 
*  containing the cx,cy,cz,r of the sphere.
*/
,'  float distAlongRay(vec4 v, vec4 w, vec4 sphere){'

//    calculate b & c for ray distance calulation....
,'    float b = dot((v - sphere), w);'
,'    float c = dot((v - sphere), (v - sphere)) - pow(sphere.w, 2.0);'

//    if result is imaginary
,'    if((b * b) - c < 0.0){'
,'      return 10000.0;'
,'    }else{'
,'      return -b - sqrt(b*b-c);'
,'    }'
,'  }'

/**
* MAIN function
*/
,'  void main() {'

//    missVal is the value that is returned when the ray misses
//    100000.0 is an arbitrary number...
,'    float missVal = 10000.0;'

//    set up ray origin...
//    origin is located at (320.0, 320.0, focal_length)
//    the larger the focal length, the farther the "Camera"
//    is from the origin.
,'    float focalLength = 1000.0 ;'
,'    vec4 rayOrigin = vec4(320.0, 320.0, focalLength, 1.0);'


//    calculate unit length direction vector...
,'    vec4 relativeVector = gl_FragCoord - rayOrigin;'
,'    vec4 unitLengthDir = relativeVector/ sqrt(dot(relativeVector, relativeVector));'

//    location of the spheres w/ their radii
,'      vec4 final_color = vec4(0.0, 0.0, 0.020, 1.0); '


//    display color!..........................
//    if ray hits first sphere...
,'    if(distAlongRay(rayOrigin, unitLengthDir, u_array1[0]) < missVal){'
,'      final_color = u_array2[0];'

//    else if ray hits second sphere....
,'    }else if(distAlongRay(rayOrigin, unitLengthDir, u_array1[1]) < missVal){'
,'      final_color = u_array2[1];'

//    else if ray hits second sphere....
,'    }else if(distAlongRay(rayOrigin, unitLengthDir, u_array1[2]) < missVal){'
,'       final_color = u_array2[2];'

//    else if ray hits second sphere....
,'    }else if(distAlongRay(rayOrigin, unitLengthDir, u_array1[3]) < missVal){'
,'       final_color = u_array2[3];'

//    otherwise display the background color...
,'    }else{'
,'       final_color = vec4(0.0, 0.0, 0.020, 1.0);'
,'    }'
,'    gl_FragColor = final_color;'
,'}'                                  

].join('\n');

// START GL PROGRAM
start_gl("proj4", vertexShader, fragmentShader);
