/**
* Draws the ground on the canvas.
*/
function drawGround(){
    drawGrass();
    drawSideWalk();
}

/**
* Draws the grass.
*/
function drawGrass(){
    g.beginPath();
    g.rect(0, h-height, w, height);

    var grd = g.createLinearGradient(0, h-height, 0, h);
    grd.addColorStop(0,"rgb(0,20,0)");
    grd.addColorStop(0.3,'rgb(0,200,0)');

    g.fillStyle = grd;
    g.fill();
    g.closePath();
}

/**
* Draws the sidewalk.
*/
function drawSideWalk(){
    m.identity();

    m.rotateX(.1)
    m.rotateY(-Math.sin(time)/3);

    g.beginPath();
    m.translate(0, -1.015, 0)

    // bottom left point
    moveTo([-0.3, 0, 0]);  

    // bottom       
    lineTo([0.3, 0, 0]);

    //  right
    lineTo([0.05, 0, -3]);

    //  top 
    lineTo([-0.05, 0, -3]);

    //  left  
    lineTo([-0.3, 0, 0]);  

    // DRAW!

    // gradient
    var grd = g.createLinearGradient(0, h-height - 4, 0, h);
    grd.addColorStop(0,'rgb(10,10,10)');
    grd.addColorStop(0.3,'rgb(100,100,100)');


    g.strokeStyle = 'rgb(0,0,0)';
    g.lineWidth = 2;
    g.stroke();

    g.fillStyle = grd;
    g.fill();
    g.closePath();
}

/**
* Draw the sky + the run
*/
function drawSky(){
    g.beginPath();

    // gradient willl be used to set up the horizon
    var grd = g.createLinearGradient(0,h-height, 0, 0);
    grd.addColorStop(0,'rgb(0,50,100)');
    grd.addColorStop(0.1,'rgb(0,100,200)');

    g.rect(0,0,w, h-height)

    g.fillStyle = grd;
    g.fill();
    g.closePath();

    // Draw our sun!
    drawSun();
}

/**
* Function draws the sun in the scene.
*/
function drawSun(){

    // Radial cragient is used to replicate the sun
    var grd = g.createRadialGradient(Math.sin(time)*w, 70, 5, Math.sin(time)*w, 60, 100);
    grd.addColorStop(0.2, "white");
    grd.addColorStop(0.6, 'rgb(0,100,200)');
    g.fillStyle = grd;
    g.fillRect(Math.sin(time)*w + -200, 0, Math.sin(time)*w + 200, 200);
}