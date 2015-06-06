var turnAngle = Math.sin(time)/2 * Math.PI/2;

/**
* Draw the character.
*/
function drawCharacter(){

   var myScale = .75 + .25 * Math.sin(10 * time);

   // Math.sin(time)/2 fluctuates b/w -1.0 and 1.0
   // then mutliple that value with 90 degress or PI/2
   // so it fluctuates between -45 and 45 degrees
   var turnAngle = Math.sin(time)/2 * Math.PI/2;

   //LEGS
   drawLegs(turnAngle);

   //ARMS
   drawArms(turnAngle);

   //BODY
   drawBody(turnAngle);
}

/**
* Draw our characters body and face.
*/
function drawBody(turnAngle){

   // draw an upside triangle to represent bod
   m.identity();

   // jsut to move our fella lower
   m.translate(0, -0.1, 0);

   g.beginPath();

   // this makes it turn left to right
   // turnAngle removed
   m.rotateY(Math.PI/2 + turnAngle);

   moveTo([0.1,-0.45, 0.3]);             

   //top
   lineTo([0.1,-0.45, -0.3]);

   //left
   lineTo([0.1,-0.8, 0])

   //right
   lineTo([0.1,-0.45, 0.3])


   // DRAW THEM!
   g.strokeStyle = 'rgb(0,0,0)';
   g.lineWidth = 2;
   g.stroke();
   g.fillStyle ='rgb(200,0,50)';
   g.fill();
   g.closePath();


   //DRAW THE FACE!
   g.beginPath();

   moveTo([0.1,-0.55, -0.15]);  
   lineTo([0.1,-0.5, -0.02]); //left eye

   moveTo([0.1,-0.5, 0.02]);  
   lineTo([0.1,-0.55, 0.15]); //right eye

   moveTo([0.1,-0.65, -0.1]);  //mouth
   lineTo([0.1,-0.65, 0.1]);  
   lineTo([0.1,-0.7, 0.05]);  
   lineTo([0.1,-0.7, -0.05]);  
   lineTo([0.1,-0.65, -0.1]);  

   g.fillStyle = 'rgb(0,0,0)';
   g.fill();
   g.stroke();
   g.closePath();
}

/**
* Draw our characters arms.
*/
function drawArms(turnAngle){

   m.identity();

   // draw far leg first
   var side0 = turnAngle > 0 ? 0 :  1;
   var side1 = turnAngle > 0 ? 2 : -1;
   var dside = turnAngle > 0 ? 1 : -1;
   for (var side = side0 ; side != side1 ; side += dside) {
      
      g.beginPath();


      var sign = side == 0 ? -1 : 1;

      // MULTIPLE CHANGESH OW FAST THE LEGS "WALK"
      var theta = 6 * time + Math.PI * side;
      var bend1 = .3 + .3 * Math.sin(theta);
      var bend2 = .3 + .3 * Math.cos(theta);

      m.identity();

      // this makes it turn left to right
      m.rotateY(Math.PI/2 + turnAngle);

      // move the legs
      // the .1 here controls the hip movement...
      // .07 is the length of the hip
      // sign jsut controls hwich side
      m.translate(.1, -.7 +.1 * bend2, .2 * sign);


      moveTo([0,0, 0]);             // SHOULDER
      m.rotateZ(bend1);
      m.translate(0, -.1, 0);
      lineTo([0,0,0]);             // ELBOW

      m.rotateZ(2 * bend2);
      m.translate(0, -.1, 0);
      lineTo([0,0,0]);             // FOREARM


      // DRAW THEM!
      g.strokeStyle = 'rgb(0,0,0)';
      g.lineWidth = 4;
      g.stroke();

      g.closePath();
   }
}

/**
* Draw our characters legs.
*/
function  drawLegs(turnAngle){
   m.identity();

   // ALWAYS DRAW THE FAR LEG FIRST.

   var side0 = turnAngle > 0 ? 0 :  1;
   var side1 = turnAngle > 0 ? 2 : -1;
   var dside = turnAngle > 0 ? 1 : -1;
   for (var side = side0 ; side != side1 ; side += dside) {

      g.beginPath();

      var sign = side == 0 ? -1 : 1;

      // MULTIPLE CHANGESH OW FAST THE LEGS "WALK"
      var theta = 6 * time + Math.PI * side;
      var bend1 = .3 + .3 * Math.sin(theta);
      var bend2 = .3 + .3 * Math.cos(theta);

      m.identity();

      // this makes it turn left to right
      m.rotateY(Math.PI/2  + turnAngle);

      // move the legs
      // the .1 here controls the hip movement...
      // .07 is the length of the hip
      // sign jsut controls hwich side
      m.translate(.1, -.85 +.1 * bend2, .07 * sign);


      moveTo([0,0, 0]);             // HIP
      m.rotateZ(bend1);
      m.translate(0, -.1, 0);
      lineTo([0,0,0]);             // KNEE

      m.rotateZ(-2 * bend2);
      m.translate(0, -.1, 0);
      lineTo([0,0,0]);             // ANKLE

      m.rotateZ(-bend1);
      m.translate(.02, 0, 0);
      lineTo([0,0,0]);             // TOE

      // DRAW THEM!
      g.strokeStyle = 'rgb(0,0,0)';
      g.lineWidth = 4;
      g.stroke();

      g.closePath();
   }
}

/**
* Draw enemy.
*/
function drawEnemy(){
   // DRAW AN UPSIDE TRIANGLE TO REPRESENT THE BODY

   // angle by which the enemy is turning, same as character
   var turnAngle = Math.sin(time)/2 * Math.PI/2;

   m.identity();

   g.beginPath();
   // this makes it turn left to right
   // turnAngle removed
   m.rotateY(Math.PI/2 + turnAngle);
   m.translate(0, Math.sin(20*time)/8, 0);

   moveTo([-1.5, 0, 0.1]);             

   //top
   lineTo([-1.5, 0, -0.1]);

   //left
   lineTo([-1.5, 0.2, 0])

   //right
   lineTo([-1.5, 0, 0.1])


   // DRAW THEM!
   g.strokeStyle = 'rgb(200,0,0)';
   g.lineWidth = 2;
   g.stroke();
   g.fillStyle ='rgb(100,0,100)';
   g.fill();
   g.closePath();


   //DRAW THE FACE!
   g.beginPath();

   moveTo([-1.5, 0.15, -0.07]);  
   lineTo([-1.5, 0.1, -0.01]); //left eye

   moveTo([-1.5, 0.15, 0.07]);  
   lineTo([-1.5, 0.1, 0.01]); //right eye

   moveTo([-1.5, 0.05, -0.04]);  //mouth
   lineTo([-1.5, 0.05, 0.04]);  
   lineTo([-1.5, 0.03, 0.06]);  
   lineTo([-1.5, 0.03, -0.06]); 
   lineTo([-1.5, 0.05, -0.04]);  
 

   g.fillStyle = 'rgb(200,0,0)';
   g.fill();
   g.stroke();
   g.closePath();


   var side0 = turnAngle > 0 ? 0 :  1;
   var side1 = turnAngle > 0 ? 2 : -1;
   var dside = turnAngle > 0 ? 1 : -1;
   for (var side = side0 ; side != side1 ; side += dside) {
      
      g.beginPath();


      var sign = side == 0 ? -1 : 1;

      // MULTIPLE CHANGESH OW FAST THE LEGS "WALK"
      var theta = 6 * time + Math.PI * side;
      var bend1 = .3 + .3 * Math.sin(theta);
      var bend2 = .3 + .3 * Math.cos(theta);

      m.identity();

      // this makes it turn left to right
      m.rotateY(Math.PI/2 + turnAngle);

      // move the legs
      // the .1 here controls the hip movement...
      // .07 is the length of the hip
      // sign jsut controls hwich side
      m.translate(-1.5, .2 * bend2, .08 * sign);
      m.translate(0, Math.sin(20*time)/8, 0);



      moveTo([0,0, 0]);             // SHOULDER
      m.rotateZ(bend1);
      m.translate(0, -.1, 0);
      lineTo([0,0,0]);             // ELBOW

      m.rotateZ(2);
      m.translate(0, -.1, 0);
      lineTo([0,0,0]);             // FOREARM

      m.rotateZ(2);
      m.translate(0, .05, 0);
      lineTo([0,0,0]);             // FOREARM


      // DRAW THEM!
      g.strokeStyle = 'rgb(100,0,100)';
      g.lineWidth = 4;
      g.stroke();

      g.closePath();
   }
}






