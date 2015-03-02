//  Chris Jimenez
//	Assignment 7 submission
//
//  matrix4x4.js
//  MATRIX CLASS OF OPERATIONS WHICH INCLUDE THE FOLLOWING METHODS:
//	-identity()
//	-translate(a,b,c)
//	-rotateX(a)
//	-rotateY(a)
//	-rotateZ(a)
//	-scale(a,b,c)



/*************************************
	CONSTRUCTOR FUNCTION
*************************************/
function Matrix4x4 () {

	// CREATE MATRIX...
    this.matrix = [ 	[1.0, 0.0, 0.0, 0.0],
             			[0.0, 1.0, 0.0, 0.0],
             			[0.0, 0.0, 1.0, 0.0],
             			[0.0, 0.0, 0.0, 1.0] ];


    /***************************************
	identity() 
		RETURNS THE IDENTITY MATRIX
	****************************************/
    this.identity = function(){
    	//	loop through matrix object, set each
		//	diag element to 1

		this.matrix = [	[1.0,	0,		0,		0],
						[0,		1.0,	0,		0],
						[0,		0,		1.0,	0],
						[0,		0,		0,		1.0]];
	
    }

	/***************************************
	matrixMult() 
		RETURNS THE IDENTITY MATRIX
		a and b are 4 by 4 matrices....
	****************************************/
	this.matrixMult = function(firstMatrix, secondMatrix){
	/*	first check if the number of 
		columns of the first matrix a is 
		the same as the number of rows 
		of the second matrix (OR VECTOR) b.*/

		var resultMatrix = [];

		var resultWidth = secondMatrix[0].length;	//second matrix columns
        var resultHeight = firstMatrix.length;		//first matrix rows

	    //iterating through first matrix rows
	    for (var row = 0; row < resultHeight; row++) {
	        resultMatrix[row] = [];
	        //iterating through second matrix columns
	        for (var column = 0; column < resultWidth; column++) { 
	            var sum = 0;
	            //calculating sum of pairwise products
	            for (var index = 0; index < firstMatrix[0].length; index++) {
	                sum += firstMatrix[row][index] * secondMatrix[index][column];
	            }
	            resultMatrix[row][column] = sum;
	        }
	    }

    	return resultMatrix;
	}





	/*****************************************
	translate() 
		args: a, b, c
		TRANSLATE THE GIVEN MATRIX		
	******************************************/
	this.translate = function(a, b, c){
		//	create internal transformation matrix...
		var tranMatrix = [	[1.0, 0.0, 0.0, a],
							[0.0, 1.0, 0.0, b],
							[0.0, 0.0, 1.0, c],
							[0.0, 0.0, 0.0, 1.0]];

		//	matrix multiply wiht Matrix object...
		this.matrix = this.matrixMult(this.matrix, tranMatrix);
	}


	/******************************************
	scale() function(s)
		SCALES MATRIX B Y GIVEN SINGLE VALUE
		OR THREE VALUES
	********************************************/

	this.scale = function(a){

		//	create internal transformation matrix...
		var tranMatrix = [	[a, 0.0, 0.0, 0.0],
							[0.0, a, 0.0, 0.0],
							[0.0, 0.0, a, 0.0],
							[0.0, 0.0, 0.0, 1.0]];

		//	matrix multiply wiht Matrix object...
		this.matrix = this.matrixMult(this.matrix, tranMatrix);
	}

	/******************************************
	transform() function
		args: p is a 3-point vector in space
		3D transform a givne point 
	********************************************/
	this.transform = function(p){
			p.push(1);
		

		var resultP = [];

		for(var row = 0; row < this.matrix.length; row++){
			var sum = 0;
        	for (var index = 0; index < this.matrix[0].length; index++) {
            	sum += this.matrix[row][index] * p[index];
        	}
        	resultP[row] = sum;
		}
    	

		return resultP;
	}



	/****************************************
	rotateX() 
		ROTATES THE GIVEN MATRIX A BY THE 
		X-AXIS
	*****************************************/
	this.rotateX = function(a){
		//	create internal transformation matrix...
		var tranMatrix = [	[1.0, 0.0, 			0.0, 			0.0],
							[0.0, Math.cos(a), 	Math.sin(-a), 	0.0],
							[0.0, Math.sin(a), 	Math.cos(a), 	0.0],
							[0.0, 0.0, 			0.0, 			1.0]];

		//	matrix multiply wiht Matrix object...
		this.matrix = this.matrixMult(this.matrix, tranMatrix);
	}


	/****************************************
	rotateY() 
		ROTATES THE GIVEN MATRIX A BY THE 
		Y-AXIS
	*****************************************/
	this.rotateY = function(a){
		//	create internal transformation matrix...
		var tranMatrix = [	[Math.cos(a), 	0.0, 	Math.sin(a),	0.0],
							[0.0, 			1.0, 	0.0,			0.0],
							[Math.sin(-a), 	0.0, 	Math.cos(a), 	0.0],
							[0.0, 			0.0, 	0.0, 			1.0]];

		//	matrix multiply wiht Matrix object...
		this.matrix = this.matrixMult(this.matrix, tranMatrix);
	};


	/****************************************
	rotateZ() 
		ROTATES THE GIVEN MATRIX A BY THE 
		Z-AXIS
	*****************************************/
	this.rotateZ = function(a){
		//	create internal transformation matrix...
		var tranMatrix = [	[Math.cos(a), 	Math.sin(-a), 	0.0, 	0.0],
							[Math.sin(a), 	Math.cos(a), 	0.0, 	0.0],
							[0.0, 			0.0, 			1.0, 	0.0],
							[0.0, 			0.0, 			0.0, 	1.0]];

		//	matrix multiply wiht Matrix object...
		this.matrix = this.matrixMult(this.matrix, tranMatrix);
	};
}