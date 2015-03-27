/**************************************************************************
  By: Chris Jimenez
  Using GLSL to Write WebGL Shaders
  proj5.js

  ASSIGNMENT 5
   The first part is to extend your ray tracer so that it implements the 
   full Phong reflectance algorithm. Your scene should have multiple spheres 
   and multiple light sources, and the material of each sphere should have an
   Ambient, Diffuse and Specular component.
*************************************************************************/

/**
*  Normalize the length of a 3D vector
*/
function surfaceNormize(v) {
   var s = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
   v[0] /= s;
   v[1] /= s;
   v[2] /= s;
   return v;
}

// INFO ABOUT SHADING THE SURFACE. SPECULAR HAS BEEN ADDED.
//  each array for each light component is for each sphere(4 spheres)
//  had to play with the numbers to make it look realistic...
var ambient = [[1.0, 0.0, 0.0],
            [0.0, 0.005, 0.0],
               [0.0, 0.0, 1.0],
                  [0.05, 0.0, 0.05]];

var diffuse = [[0.9, 0.25, 0.25],
               [0.005, 0.05, 0.005],
                  [0.05, 0.05, 0.5],
                     [0.1, 0.001, 0.1]];
var specular = [[1, 0.7, 0.7],
               [0.7, 1, 0.7],
                  [0.7, 0.7, 1],
                     [1, 0.7, 1]];

// Direction and color of each light source
var lightDir = [[1, 0.5, 0.5], [0.0,0.0,0.5]];
var lightRGB = [[1, 1, 1], [1.0,1.0,1.0]];

// Make sure all light directions are unit length
for (var n = 0 ; n < lightDir.length; n++)
   lightDir[n] = surfaceNormize(lightDir[n]);


// sphere coordinates
var sphereCoords = [[340.0, 500.0, 40.0, 4000.0,
                  320.0, 320.0, 20.0, 3000.0,
                     500.0, 280.0, 20.0, 2000.0,
                        400.0, 20.0, 20.0, 1000.0]];

/**
*  Initialize tbe uniform shader variables.
*/
var initialize_gl = function(gl) {
   gl.u_ambient = gl.getUniformLocation(gl.prog, "u_ambient");
   gl.u_diffuse = gl.getUniformLocation(gl.prog, "u_diffuse");
   gl.u_specular = gl.getUniformLocation(gl.prog, "u_specular");
   gl.u_lightDir = gl.getUniformLocation(gl.prog, "u_lightDir");
   gl.u_lightRGB = gl.getUniformLocation(gl.prog, "u_lightRGB");
   gl.u_sphereCoords = gl.getUniformLocation(gl.prog, "u_sphereCoords");
};

/**
* At each animation frame, update hte values of my uniform shader variable.
*/
var update_gl = function(gl) {
   // generic L variable that will be used to concatentate passed in matrices...
   // pass ambient matrix..
      var L = [];
      for (var n = 0 ; n < ambient.length ; n++){
         L = L.concat(ambient[n]);
      }
      gl.uniform3fv(gl.u_ambient, new Float32Array(L));

   // pass diffuse matrix...
   var L = [];
      for (var n = 0 ; n < diffuse.length ; n++){
         L = L.concat(diffuse[n]);
      }
      gl.uniform3fv(gl.u_diffuse, new Float32Array(L));

   // pass specualr matrix...
   L = [];
      for (var n = 0 ; n < specular.length ; n++){
         L = L.concat(specular[n]);
      }
      gl.uniform3fv(gl.u_specular, new Float32Array(L));

   // pass light directions matrices...
      L = [];
      for (var n = 0 ; n < lightDir.length ; n++){
         L = L.concat(lightDir[n]);
      }
      gl.uniform3fv(gl.u_lightDir, new Float32Array(L));

   // pass light RGB's...
      L = [];
      for (var n = 0 ; n < lightRGB.length ; n++){
         L = L.concat(lightRGB[n]);
      }
      gl.uniform3fv(gl.u_lightRGB, new Float32Array(L));

   // pass the sphere coords..
      L = [];
      for (var n = 0 ; n < sphereCoords.length ; n++){
         L = L.concat(sphereCoords[n]);
      }
      gl.uniform4fv(gl.u_sphereCoords, new Float32Array(L));
}

/**
* Vertex shaders runs once per triangle vertex.
*/
var vertexShader = [
,' attribute   vec3 a_pos;'
,'  varying    vec3 v_pos;'
,'   void main() {'
,'      gl_Position = vec4(a_pos, 1.0);'
,'      v_pos = a_pos;'
,'   }'
].join('\n');


/**
* Fragment shader runs once per pixel fragment.
*/
var fragmentShader = [
,'  precision mediump float;'
,'  uniform float u_pixelSize;'
,'  uniform float u_time;'

// three color comonents...
,'  uniform vec3  u_ambient[4];'
,'  uniform vec3  u_diffuse[4];'
,'  uniform vec3  u_specular[4];'

// light dir and RGB vals
,'  uniform vec3  u_lightDir[2];'
,'  uniform vec3  u_lightRGB[2];'

// sphere coordinates
,'  uniform vec4  u_sphereCoords[4];'

,'  uniform vec3  u_mouse;'
,'  varying vec3  v_pos;'

/**
* function that returns t the distance along the ray
* that takes three arguments: a ray origin V, a ray 
* direction W, and a vec4 containing the cx,cy,cz,r of the sphere.
*/
,' float distAlongRay(vec4 v, vec4 w, vec4 sphere){'
//    calculate b & c for ray distance calulation....
,'    float b = dot((v - sphere), w);'
,'    float c = dot((v - sphere), (v - sphere)) - pow(sphere.w, 2.0);'

//    if result is imaginary
,'    if((b * b) - c < 0.0){'
,'       return 10000.0;'
,'    }else{'
,'       return -b - sqrt(b*b-c);'
,'    }'
,' }'

/**
* MAIN function
*/
,' void main() {'

//    missVal is the value that is returned when the ray misses
//       100000.0 is an arbitrary number...
,'       float missVal = 1000.0;'

//    set up ray origin...
//    origin is located at (320.0, 320.0, focal_length)
,'    float focalLength = 1000.0 ;' //0.2* sin(u_time);'
,'    vec4 rayOrigin = vec4(320.0, 320.0, focalLength, 1.0);'

//    calculate unit length direction vector...
,'    vec4 relativeVector = gl_FragCoord - rayOrigin;'
,'    vec4 unitLengthDirVec = relativeVector/ sqrt(dot(relativeVector, relativeVector));'

//       BACKGROUND PIXELS ARE JUST DARK BLUE.
,'      vec3 final_color = vec3(0.0, 0.0, 0.005);'

,'    vec3 incidentVec = -1.0 * unitLengthDirVec.xyz;'


//    display spheres...
//    FIRST SPHERE------------------------------------------------------------------------------------------
,'    if(distAlongRay(rayOrigin, unitLengthDirVec, u_sphereCoords[0]) < missVal){'

,'       vec3 surfaceNorm = normalize(vec3(((gl_FragCoord.x - u_sphereCoords[0].x)/u_sphereCoords[0].w),'
,'                                  ((gl_FragCoord.y - u_sphereCoords[0].y)/u_sphereCoords[0].w),'
,'                                     ((gl_FragCoord.z - u_sphereCoords[0].z)/u_sphereCoords[0].w)));'
//       calulate reflection vector...
//       R = (2 x N x (N . I)) - I
,'       vec3 reflectionVec = (2.0 * surfaceNorm * dot(surfaceNorm, incidentVec)) - incidentVec;'

//       add ambient to final color
,'       final_color = u_ambient[0];'

//       calculate diffuse component..
,'          vec3 diffuse = max(0.0, dot(surfaceNorm, u_lightDir[0])) * u_lightRGB[0] +'
,'                      max(0.0, dot(surfaceNorm, u_lightDir[1])) * u_lightRGB[1];'
,'          final_color += u_diffuse[0] * diffuse;'

//       calculate specular component..
,'       float s = 200.0;'
,'       vec3 specular = pow(dot(reflectionVec, u_lightDir[0]), s) * u_lightRGB[0] +'
,'                      pow(dot(reflectionVec, u_lightDir[1]), s) * u_lightRGB[1];'

,'          final_color +=  u_specular[0] * specular;'


//    SECOND SPHERE----------------------------------------------------------------------------------
,'    }else if(distAlongRay(rayOrigin, unitLengthDirVec, u_sphereCoords[1]) < missVal){'

,'       vec3 surfaceNorm = normalize(vec3(((gl_FragCoord.x - u_sphereCoords[1].x)/u_sphereCoords[1].w),'
,'                                  ((gl_FragCoord.y - u_sphereCoords[1].y)/u_sphereCoords[1].w),'
,'                                     ((gl_FragCoord.z - u_sphereCoords[1].z)/u_sphereCoords[1].w)));'
//       calulate reflection vector...
//       R = (2 x N x (N . I)) - I
,'       vec3 reflectionVec = (2.0 * surfaceNorm * dot(surfaceNorm, incidentVec)) - incidentVec;'

//       add ambient to final color
,'       final_color = u_ambient[1];'

//       calculate diffuse component..
,'          vec3 diffuse = max(0.0, dot(surfaceNorm, u_lightDir[0])) * u_lightRGB[0] +'
,'                      max(0.0, dot(surfaceNorm, u_lightDir[1])) * u_lightRGB[1];'

,'          final_color += u_diffuse[1] * diffuse;'

//       calculate specular component..
,'       float s = 100.0;'
,'       vec3 specular = pow(dot(reflectionVec, u_lightDir[0]), s)* u_lightRGB[0] +'
,'                      pow(dot(reflectionVec, u_lightDir[1]), s) * u_lightRGB[1];'

,'          final_color +=  u_specular[1] * specular;'

//    THIRD SPHERE------------------------------------------------------------------------------------
,'    }else if(distAlongRay(rayOrigin, unitLengthDirVec, u_sphereCoords[2]) < missVal){'

,'       vec3 surfaceNorm = normalize(vec3(((gl_FragCoord.x - u_sphereCoords[2].x)/u_sphereCoords[2].w),'
,'                                  ((gl_FragCoord.y - u_sphereCoords[2].y)/u_sphereCoords[2].w),'
,'                                     ((gl_FragCoord.z - u_sphereCoords[2].z)/u_sphereCoords[2].w)));'
//       calulate reflection vector...
//       R = (2 x N x (N . I)) - I
,'       vec3 reflectionVec = (2.0 * surfaceNorm * dot(surfaceNorm, incidentVec)) - incidentVec;'

//       add ambient to final color
,'       final_color = u_ambient[2];'

//       calculate diffuse component..
,'          vec3 diffuse = max(0.0, dot(surfaceNorm, u_lightDir[0])) * u_lightRGB[0] +'
,'                      max(0.0, dot(surfaceNorm, u_lightDir[1])) * u_lightRGB[1];'

,'          final_color += u_diffuse[2] * diffuse;'

//       calculate specular component..
,'       float s = 200.0;'
,'       vec3 specular = pow(dot(reflectionVec, u_lightDir[0]), s) * u_lightRGB[0] +'
,'                      pow(dot(reflectionVec, u_lightDir[1]), s) * u_lightRGB[1];'

,'          final_color +=  u_specular[2] * specular;'

//    FOURTH SPHERE----------------------------------------------------------------------------
,'    }else if(distAlongRay(rayOrigin, unitLengthDirVec, u_sphereCoords[3]) < missVal){'

,'       vec3 surfaceNorm = normalize(vec3(((gl_FragCoord.x - u_sphereCoords[3].x)/u_sphereCoords[3].w),'
,'                                  ((gl_FragCoord.y - u_sphereCoords[3].y)/u_sphereCoords[3].w),'
,'                                     ((gl_FragCoord.z - u_sphereCoords[3].z)/u_sphereCoords[3].w)));'
//       calulate reflection vector...
//       R = (2 x N x (N . I)) - I
,'       vec3 reflectionVec = (2.0 * surfaceNorm * dot(surfaceNorm, incidentVec)) - incidentVec;'

//       add ambient to final color
,'       final_color = u_ambient[3];'

//       calculate diffuse component..
,'          vec3 diffuse = max(0.0, dot(surfaceNorm, u_lightDir[0])) * u_lightRGB[0] +'
,'                      max(0.0, dot(surfaceNorm, u_lightDir[1])) * u_lightRGB[1];'

,'          final_color += u_diffuse[3] * diffuse;'

//       calculate specular component..
,'       float s = 200.0;'
,'       vec3 specular = pow(dot(reflectionVec, u_lightDir[0]), s) * u_lightRGB[0] +'
,'                      pow(dot(reflectionVec, u_lightDir[1]), s) * u_lightRGB[1];'

,'          final_color +=  u_specular[3] * specular;'

,'    }'

//       gamma correction
,'      gl_FragColor = vec4(pow(final_color, vec3(.45,.45,.45)), 1.0);'
,'   }'
].join('\n');

// START GL PROGRAM
start_gl("proj5", vertexShader, fragmentShader);
