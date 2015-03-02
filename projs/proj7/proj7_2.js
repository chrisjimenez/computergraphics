/**************************************************************************
  By: Chris Jimenez
  Playing with the HTML5 Canvas
  proj7_2.js

  ASSIGNMENT 7
   Your assignment, due by class on Thursday November 6, is to just have fun 
   with making cool animations using the Canvas object. Go crazy with it, 
   make creatures and houses, science fiction landscapes, words and poetry, 
   pretty much anything you want. The key is to explore and try things out. 
   Our goal for the following week will be to start using the Canvas element 
   as a way of looking at the results of Matrix transformations and to start 
   to experiment with building shapes out of triangles, and then things will 
   get more serious.

   So take this opportunity to just play around and have fun while you can! :-)
*************************************************************************/

/**
* Gets called repeatedly.
*/
proj7_2.animate = function(g) {

  // get width and height of canvas
  var w = g.canvas.width;
  var h = g.canvas.height;
     
  //  Fill the backgroudn with a solid color.
  g.fillStyle = 'rgb(255,48,48)';
  g.beginPath();
  g.moveTo(0,0);
  g.lineTo(w,0);
  g.lineTo(w,h);
  g.lineTo(0,h);
  g.fill();

  //  CREATE SECONDARY BACKGROUND
  //  var that holds the difference in size between
  //  the first bg and the second bg.
  var bgSizeDif = 50;

  //  SETUP SECONDARY BACKGROUND
  g.fillStyle = 'rgb(0,50,0)';
  g.beginPath();
  g.moveTo(bgSizeDif,bgSizeDif);
  g.lineTo(w-bgSizeDif,bgSizeDif);
  g.lineTo(w-bgSizeDif,h-bgSizeDif);
  g.lineTo(bgSizeDif,h-bgSizeDif);
  g.fill();
    
  //  var that holds the difference in size between
  //  the first bg and the circles.
  var bgSizeDif = 50;

  // Radius of the circles, abs needed since it could go neg
  var t =   0.5 + 1.25 * Math.abs(Math.sin(time%100000));

  //  space between each circle
  var step = 10;
	
  for(var i = bgSizeDif; i < w - bgSizeDif; i = i+step){
    for(var j = bgSizeDif; j < h - bgSizeDif; j = j+step){

      //  update radius based on canvas location
      //  closer to the middle, larger the radius....
      var distance = Math.sqrt(Math.pow(w/2 - i, 2) + Math.pow(h/2 - i, 2));
      var radius = Math.abs(w/2 - distance)/50 * t;
      
      //  create the circle!
      g.fillStyle = 'rgb(50, 200, 50)';
      g.beginPath();
      g.arc(i,j,radius,0,2 * Math.PI);
      g.stroke();
      g.fill();

    }
  }
}


