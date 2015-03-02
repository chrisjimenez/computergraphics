
   // BROWSER INDEPENDENT WAY TO RUN A FUNCTION AFTER SOME DELAY.

   window.requestAnimFrame = (function(callback) {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function(callback) { window.setTimeout(callback, 1000 / 60); }; })();

   // PREPARE ALL CANVASES FOR ANIMATED DRAWING.

   function g_start() {
      var all = document.getElementsByTagName("*");
      for (var i = 0 ; i < all.length ; i++)
          if (all[i].tagName == "CANVAS")
	     g_startCanvas(all[i].id );
   }

   // PREPARE ONE CANVAS FOR ANIMATED DRAWING.

   function g_startCanvas(canvasName) {

      // USE CANVAS NAME TO GET THE CANVAS FROM THE DOCUMENT.

      var canvas = document.getElementById(canvasName);

      // GET THE CANVAS'S 2D DRAWING CONTEXT.

      canvas.g = canvas.getContext('2d');
      var g = canvas.g;
      g.canvas = canvas;

      // SET SOME DEFAULTS TO MAKE A NICE DRAWING STYLE.

      g.textHeight = 12;
      g.lineCap = "round";
      g.lineJoin = "round";

      // IF USER HAS DEFINED A SETUP FUNCTION, CALL IT NOW.

      if (canvas.setup !== undefined) {
         g.clearRect(0, 0, canvas.width, canvas.height);
         canvas.setup();
      }

      g_tick(canvas);
   }

   // FUNCTION THAT LOOPS REPEATEDLY, CALLING USER'S ANIMATE FUNCTION EACH TIME.

   var g_tick = function(canvas) {

      // IF USER HAS DEFINED AN ANIMATE FUNCTION, CALL IT.

      if (canvas.animate !== undefined) {

         // COMPUTE THE TIME, IN SECONDS, SINCE PAGE LOADED.

         time = (new Date()).getTime() / 1000 - startTime;

         // CLEAR THE BACKGROUND EVERY FRAME BEFORE CALLING USER'S ANIMATE FUNCTION.

         canvas.g.clearRect(0, 0, canvas.width, canvas.height);
         canvas.animate(canvas.g);

	 // CALL THIS g_tick() FUNCTION AGAIN.

         requestAnimFrame(function() { g_tick(canvas); });
      }
   }

   var time, startTime = (new Date()).getTime() / 1000;
   
