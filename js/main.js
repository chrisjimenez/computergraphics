/*********************************************************************
*  main.js
* 
*  Contains all the animation and iframe creation
*********************************************************************/

var projectBlockTitles = ["Using GLSL to Write WebGL Shaders part 1",
"Using GLSL to Write WebGL Shaders part 2",
"Implementing a Ray Tracer part 1",
"Implementing a Ray Tracer part 2",
"Implementing the Phong Reflectance Algorithm",
"Implementing the Phong Reflectance Algorithm with Ray Reflectance & Background Gradient",
"Playing with the HTML5 Canvas part 1",
"Playing with the HTML5 Canvas part 2",
"Using Matrix Operations on the Canvas part 1",
"Using Matrix Operations on the Canvas part 2", 
"Using Matrix Operations on the Canvas part 3",
"Using a List of Vertices and Triangular Faces to Draw 3D Shapes part 1",
"Using a List of Vertices and Triangular Faces to Draw 3D Shapes part 2",
"Using a List of Vertices and Triangular Faces to Draw 3D Shapes part 3",
"Using a List of Vertices and Triangular Faces to Draw 3D Shapes part 4",
"Using a List of Vertices and Triangular Faces to Draw 3D Shapes part 5",
"Creating a Story Using the HTML5 Canvas"]

// check if doc is ready
$(document).ready(function(){
	
	var $projectList = $('.project-list');

	// create project blocks
	for(var i = 1; i <= 17; i++){

		var $newProjectBlock = $('<a class="fancybox fancybox.iframe" href="projs/proj'+i+'/proj'+i+'.html"><div></div></a>').addClass('project-block');
		$newProjectBlock.append('<img src = "projs/proj'+i+'/screenshot.png"></img>');
		$newProjectBlock.append('<p>'+projectBlockTitles[i-1]+'</p>')

		$projectList.append($newProjectBlock);
	}

	var $projectBlock = $('.fancybox')
	$projectBlock.fancybox();

	// expanding project block on hover
	$projectBlock.hover(function(){
		$(this)
			.stop(true,true)
			.animate({ 
	            margin: 0,
	            width: "+=20",
	            height: "+=20"

	        },'fast');
	}, 	
	function(){
		$(this)
			.stop(true,true)
			.animate({ 
	            margin: 10,
	            width: "-=20",
	            height: "-=20"
	        }, 'fast');
	});
});