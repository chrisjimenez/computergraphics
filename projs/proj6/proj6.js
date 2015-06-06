/**************************************************************************
  By: Chris Jimenez
  Using GLSL to Write WebGL Shaders
  proj6.js

  ASSIGNMENT 6
    Your assignment, which is due before class on Thursday Oct 23, is to implement 
    ray reflection and a background color gradient, and also to incorporate noise-based 
    procedural texture into your scene. You can create multiple levels of ray reflection 
    by using a for loop in your fragment shader, but remember that the loop will 
    actually become unrolled by the compiler, so you can only "loop" for an 
    explicitly specified number of steps.
*************************************************************************/



/**
*  Normalize the length of the 3D vector.
*/
function surfaceNormize(v) {
   var s = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
   v[0] /= s;
   v[1] /= s;
   v[2] /= s;
   return v;
}

//  INFO ABOUT SHADING THE SURFACE. SPECULAR HAS BEEN ADDED.
//    each array for eahc light component is for each sphere(4 spheres)
//    had to play with the numbers to make it look realistic...
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

// Direction and color for each light source.
var lightDir = [[1, 0.5, 0.5], [0.0,0.0,0.5]];
var lightRGB = [[1, 1, 1], [1.0,1.0,1.0]];

// Make sure all light directions are unit length.
for (var n = 0 ; n < lightDir.length; n++)
   lightDir[n] = surfaceNormize(lightDir[n]);


// Sphere coordinates
var sphereCoords = [[340.0, 500.0, 40.0, 4000.0,
                  300.0, 250.0, 100.0, 3000.0,
                   500.0, 280.0, 20.0, 2000.0,
                    400.0, 100.0, 20.0, 1000.0]];

/**
* Initialize the uniform shader variables.
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
* At each animation frame, update the calues of the uniform shader varaibles.
*/
var update_gl = function(gl) {
  //  generic L variable that will be used to concatentate passed in matrices...
  //  pass ambient matrix..
  var L = [];
  for (var n = 0 ; n < ambient.length ; n++){
      L = L.concat(ambient[n]);
  }
  gl.uniform3fv(gl.u_ambient, new Float32Array(L));

  //  pass diffuse matrix...
  var L = [];
  for (var n = 0 ; n < diffuse.length ; n++){
      L = L.concat(diffuse[n]);
  }
  gl.uniform3fv(gl.u_diffuse, new Float32Array(L));

  //  pass specualr matrix...
  L = [];
  for (var n = 0 ; n < specular.length ; n++){
      L = L.concat(specular[n]);
  }
  gl.uniform3fv(gl.u_specular, new Float32Array(L));

  //  pass light directions matrices...
  L = [];
  for (var n = 0 ; n < lightDir.length ; n++){
      L = L.concat(lightDir[n]);
  }
  gl.uniform3fv(gl.u_lightDir, new Float32Array(L));

  //  pass light RGB's...
  L = [];
  for (var n = 0 ; n < lightRGB.length ; n++){
      L = L.concat(lightRGB[n]);
  }
  gl.uniform3fv(gl.u_lightRGB, new Float32Array(L));

  //  pass the sphere coords..
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
,'  attribute   vec3 a_pos;'
,'  varying     vec3 v_pos;'
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

//  three color comonents...
,'  uniform vec3  u_ambient[4];'
,'  uniform vec3  u_diffuse[4];'
,'  uniform vec3  u_specular[4];'

//  light dir and RGB vals
,'  uniform vec3  u_lightDir[2];'
,'  uniform vec3  u_lightRGB[2];'

//  sphere coordinates
,'  uniform vec4  u_sphereCoords[4];'


//  other..
,'  uniform vec3  u_mouse;'
,'  varying vec3  v_pos;'

//  CODE BY KEN PERLIN-------------------------------------------------------------------------------
,'   vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }'
,'   vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }'
,'   vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }'
,'   vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }'

//
,'   vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }'
//
,'   float noise(vec3 P) {'
,'      vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));'
,'      vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);'
,'      vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);'
,'      vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;'
,'      vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);'
,'      vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;'
,'      vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;'
,'      gx0 = fract(gx0); gx1 = fract(gx1);'
,'      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));'
,'      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));'
,'      gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);'
,'      gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);'
,'      vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),'
,'           g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),'
,'           g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),'
,'           g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);'
,'      vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));'
,'      vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));'
,'      g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;'
,'      g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;'
,'      vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),'
,'                         dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),'
,'                    vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),'
,'                         dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);'
,'      return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);'
,'   }'


,'   float noise(vec2 P) { return noise(vec3(P, 0.0)); }'


,'   float fractal(vec3 P) {'
,'      float f = 0., s = 1.;'
,'      for (int i = 0 ; i < 9 ; i++) {'
,'         f += noise(s * P) / s;'
,'         s *= 2.;'
,'         P = vec3(.866 * P.x + .5 * P.z, P.y + 100., -.5 * P.x + .866 * P.z);'
,'      }'
,'      return f;'
,'   }'

//
,'   float turbulence(vec3 P) {'
,'      float f = 0., s = 1.;'
,'      for (int i = 0 ; i < 9 ; i++) {'
,'         f += abs(noise(s * P)) / s;'
,'         s *= 2.;'
,'         P = vec3(.866 * P.x + .5 * P.z, P.y + 100., -.5 * P.x + .866 * P.z);'
,'      }'
,'      return f;'
,'   }'
//  -----------------------------------------------------------------------------------------------

/**
* Funal color with reflection given sphere coordinates.
*/
,' vec3 finalColorWithReflection(vec4 sphereCoords, vec3 incidentVec, vec3 a, vec3 d, vec3 s, vec3 norm){'

//       calulate reflection vector...
//       R = (2 x N x (N . I)) - I
,'       vec3 reflectionVec = (2.0 * norm * dot(norm, incidentVec)) - incidentVec;'

//       add ambient to final color
,'       vec3 color = a * turbulence(norm) * noise(norm);'

//       calculate diffuse component..
,'       vec3 diffuse = max(0.0, dot(norm, u_lightDir[0])) * u_lightRGB[0] +'
,'                      max(0.0, dot(norm, u_lightDir[1])) * u_lightRGB[1];'
,'       color += d * diffuse * 2.0 * turbulence(norm) * noise(norm);'

//       calculate specular component..
,'       float p = 200.0;'
,'       vec3 specular = pow(dot(reflectionVec, u_lightDir[0]), p) * u_lightRGB[0] +'
,'                       pow(dot(reflectionVec, u_lightDir[1]), p) * u_lightRGB[1];'

,'       color +=  s * specular ;'

,'       return color;'
,' }'


/**
* Function that returns t the distance along the ray
* that takes three arguments: a ray origin V, a ray 
* direction W, and a vec4 containing the cx,cy,cz,r of the sphere.
*/
,'  float distAlongRay(vec4 v, vec4 w, vec4 sphere){'
//    calculate b & c for ray distance calulation....
,'    float b = dot((v - sphere), w);'
,'    float c = dot((v - sphere), (v - sphere)) - pow(sphere.w, 2.0);'

//    if result is imaginary
,'    if((b * b) - c < 0.0){'
,'      return 100000.0;'
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
,'    float missVal = 100000.0;'

//    set up ray origin...
//    origin is located at (320.0, 320.0, focal_length)
,'    float focalLength = 1000.0 ;' //0.2* sin(u_time);'
,'    vec4 rayOrigin = vec4(320.0, 320.0, focalLength, 1.0);'

//    CALCULATE UNIT LENGTH VECTOR
,'    vec4 relativeVector = gl_FragCoord - rayOrigin;'
,'    vec4 unitLengthDirVec = relativeVector/ sqrt(dot(relativeVector, relativeVector));'

//  BACKGROUND PIXELS ARE JUST DARK BLUE.
,'    vec3 final_color = vec3(0.57, 0.57, 0.57) * 0.00005*gl_FragCoord.y;'

//    CALCULATE INCIDENT VECTOR...     
,'    vec3 incidentVec = -1.0 * unitLengthDirVec.xyz;'

//    LOOP BASED ON NUMEBR OF GIVEN REFLECTIONS, IN THIS CASE ITS 10
,'    for(int i = 0 ; i < 10; i++){'
//       LOOP 4 TIMES, 4 BEING THE NUMBER OF SPHERES...
,'       for(int j = 0; j < 4; j++){'
,'          if(distAlongRay(rayOrigin, unitLengthDirVec, u_sphereCoords[j]) < missVal){'

,'             vec3 surfaceNorm = normalize(vec3(((gl_FragCoord.x - u_sphereCoords[j].x)/u_sphereCoords[j].w),'
,'                                                 ((gl_FragCoord.y - u_sphereCoords[j].y)/u_sphereCoords[j].w),'
,'                                                    ((gl_FragCoord.z - u_sphereCoords[j].z)/u_sphereCoords[j].w)));'

,'             final_color += finalColorWithReflection(u_sphereCoords[j], incidentVec, u_ambient[j], u_diffuse[j], u_specular[j], surfaceNorm);'

//             calculate new unit length direction...
,'             unitLengthDirVec = vec4((-2.0 * surfaceNorm * dot(surfaceNorm, unitLengthDirVec.xyz ) + unitLengthDirVec.xyz), 0.0);'

//             calcualte new ray origin... 
,'             rayOrigin = gl_FragCoord + (0.001) * unitLengthDirVec;'

,'          }'

,'       }'
,'    }'

//  DO GAMMA CORRECTION.
,'    gl_FragColor = vec4(pow(final_color, vec3(.40,.40,.40)), 1.0);'
,' }'


].join('\n');

// START GL PROGRAM
start_gl("proj6", vertexShader, fragmentShader);
