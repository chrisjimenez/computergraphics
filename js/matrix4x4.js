/*********************************************************************
*  Chris Jimenez
*
*  matrix4x4.js
*  MATRIX CLASS OF OPERATIONS WHICH INCLUDE THE FOLLOWING METHODS:
*   -identity()
*   -translate(a,b,c)
*   -rotateX(a)
*   -rotateY(a)
*   -rotateZ(a)
*   -scale(a,b,c)
*********************************************************************/

function Matrix4x4 () {

    // CREATE MATRIX...
    this.matrix = [     [1.0, 0.0, 0.0, 0.0],
                        [0.0, 1.0, 0.0, 0.0],
                        [0.0, 0.0, 1.0, 0.0],
                        [0.0, 0.0, 0.0, 1.0] ];

    /**
    *  identity() 
    *    RETURNS THE IDENTITY MATRIX
    */
    this.identity = function(){

        //  loop through matrix object, set each
        //  diag element to 1
        this.matrix = [ [1.0, 0.0, 0.0, 0.0],
                        [0.0, 1.0, 0.0, 0.0],
                        [0.0, 0.0, 1.0, 0.0],
                        [0.0, 0.0, 0.0, 1.0]];
    }


    /**
    *  matrixMult()
    *    Returns the result of of multipling two matrices.
    *    firstMatrix and secondMatrix    
    */
    this.matrixMult = function(firstMatrix, secondMatrix){

        var resultMatrix = [];

        var resultWidth = secondMatrix[0].length;   //second matrix columns
        var resultHeight = firstMatrix.length;      //first matrix rows

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
  

    /**
    *  translate()
    *    translates the matrix m given the a,b,c parameters
    */
    this.translate = function(a, b, c){
        //  create internal transformation matrix...
        var tranMatrix = [  [1.0, 0.0, 0.0, a],
                            [0.0, 1.0, 0.0, b],
                            [0.0, 0.0, 1.0, c],
                            [0.0, 0.0, 0.0, 1.0]];

        //  matrix multiply wiht Matrix object...
        this.matrix = this.matrixMult(this.matrix, tranMatrix);
    }

    /**
    *  scale9)
    *    scales matrix by given value a
    */
    this.scale = function(a){

        //  create internal transformation matrix...
        var tranMatrix = [  [a, 0.0, 0.0, 0.0],
                            [0.0, a, 0.0, 0.0],
                            [0.0, 0.0, a, 0.0],
                            [0.0, 0.0, 0.0, 1.0]];

        //  matrix multiply wiht Matrix object...
        this.matrix = this.matrixMult(this.matrix, tranMatrix);
    }


    /**
    *  transform()
    *    3D transform given p, a 3-point vector in space
    */
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


    /**
    *  rotateX()
    *    rotates the matrix m by a by the x-axis
    */
    this.rotateX = function(a){
        //  create internal transformation matrix...
        var tranMatrix = [  [1.0, 0.0,          0.0,            0.0],
                            [0.0, Math.cos(a),  Math.sin(-a),   0.0],
                            [0.0, Math.sin(a),  Math.cos(a),    0.0],
                            [0.0, 0.0,          0.0,            1.0]];

        //  matrix multiply wiht Matrix object...
        this.matrix = this.matrixMult(this.matrix, tranMatrix);
    }


    /**
    *  rotateY()
    *    rotates the matrix m by a by the y-axis
    */
    this.rotateY = function(a){
        //  create internal transformation matrix...
        var tranMatrix = [  [Math.cos(a),   0.0,    Math.sin(a),    0.0],
                            [0.0,           1.0,    0.0,            0.0],
                            [Math.sin(-a),  0.0,    Math.cos(a),    0.0],
                            [0.0,           0.0,    0.0,            1.0]];

        //  matrix multiply wiht Matrix object...
        this.matrix = this.matrixMult(this.matrix, tranMatrix);
    };


    /**
    *  rotateZ()
    *    rotates the matrix m by a by the z-axis
    */
    this.rotateZ = function(a){
        //  create internal transformation matrix...
        var tranMatrix = [  [Math.cos(a),   Math.sin(-a),   0.0,    0.0],
                            [Math.sin(a),   Math.cos(a),    0.0,    0.0],
                            [0.0,           0.0,            1.0,    0.0],
                            [0.0,           0.0,            0.0,    1.0]];

        //  matrix multiply wiht Matrix object...
        this.matrix = this.matrixMult(this.matrix, tranMatrix);
    };
}