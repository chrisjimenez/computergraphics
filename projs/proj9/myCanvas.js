/**************************************************************************
  By: Chris Jimenez
  Creating a Story Using the HTML5 Canvas
  myCanvas.js

  ASSIGNMENT 8
   Your assignment, due by class on Thursday November 20, 
   is to put together the previous two assignments to create an 
   interesting animated scene with fun shapes.

   For example, you might make a house, or a tree, or a person, 
   or a dog or a car. Try to think of something that tells a little 
   story (eg: the sun rises in the morning and the people wake up).
   Scaled globes and cylinders are very good for making limbs of 
   people and animals and trees.
   
   Have fun with it!!
*************************************************************************/

var w, h, g;

// height of sidewalk and grass, sky ending
var height = 94;

/**
* Gets called repeatedly.
*/
myCanvas.animate = function(_g) {
   g = _g;
   w = g.canvas.width;
   h = g.canvas.height;

   // draw the ground
   drawGround();

   // draw the sky
   drawSky();

   // draw the character
   drawCharacter();

   // draw our enemy
   drawEnemy();
}