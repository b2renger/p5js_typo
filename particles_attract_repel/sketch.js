


var f;
var path;
var polys;
var drawing = false;
var gui, params;
var anchorX, anchorY;

var particles = [];

// this function loads a font, and create an array of polygons
// a polygon being itself an array of vectors with x/y coordinates
function getPoints(){
    drawing = false;
    // create new font : we use rune
    console.log(params.font);
    f = new Rune.Font(params.font) 
    particles = [];
    // load the font
    f.load(function(err){       
        path = f.toPath(params.message, 0, 0, params.size)
        polys = path.toPolygons({ spacing:params.spacing })

        for (var j=0; j < polys.length ; j++){ // get each polygon
                var poly = polys[j];      
                for(var k = 0; k < poly.state.vectors.length; k++) { // get each point of each polygon
                    var vec = poly.state.vectors[k];       
                    particles.push(new Particle(random(0-params.xoffset,windowWidth-params.xoffset), random(0-params.yoffset,windowHeight-params.yoffset), vec.x,vec.y));
                }
        }
        drawing= true;
    });
}


function setup(){
    createCanvas(windowWidth,windowHeight)  
    background(0)

    // init all parameters
    params = new Parameters();
    // create dat.gui drawer
    gui = new dat.GUI();
    // gui setup
    var f2 = gui.addFolder('configuration / path generation');
    var f1 = gui.addFolder('real-time parameters');
    
    // Configuration parameters
    // font selector
    f2.add(params, 'font', {Avenir : "../fonts/AvenirNextLTW01-Medium.woff", BlackOpsOne : "../fonts/Black_Ops_One/BlackOpsOne-Regular.ttf",
                            Comfortaa : "../fonts/Comfortaa/Comfortaa-Bold.ttf",
                            NovaMono : "../fonts/Nova_Mono/NovaMono.ttf", ShadowsIntoLight : "../fonts/Shadows_Into_Light/ShadowsIntoLight.ttf", 
                            Sniglet: "../fonts/Sniglet/Sniglet-ExtraBold.ttf",Tangerine : "../fonts/Tangerine/Tangerine_Bold.ttf",
                            UnicaOne : "../fonts/Unica_One/UnicaOne-Regular.ttf"});  
    f2.add(params, 'message');
    f2.add(params, 'spacing', 2, 40).listen();
    f2.add(params, 'size', 100, 1000).listen();
    f2.add(params, 'regenerate');

    f1.addColor(params, 'background').listen();
    f1.addColor(params, 'color').listen();
    f1.add(params, 'particle_size',5,20).listen();
    f1.add(params, 'repulsion_threshold',10,500 ).listen();
    f1.add(params, 'xoffset',0,windowWidth-300).listen();
    f1.add(params, 'yoffset',0,windowHeight).listen();

    gui.add(params, 'preset0').listen();
    gui.add(params, 'preset1').listen();

    gui.add(params, 'clear')
    gui.add(params, 'save')

    getPoints();
}


function draw(){
    noStroke();
    fill(params.background)
    rect(0,0,windowWidth,windowHeight)

   if (drawing){

             push()
                translate(params.xoffset, params.yoffset)
                strokeWeight(params.strokeWeight )
                stroke(params.color);
            for (var i = 0 ; i < particles.length ; i++){
                particles[i].attract(); 
                particles[i].repulse(mouseX,mouseY);
                particles[i].check_bounds();  
                particles[i].update(); 
                particles[i].draw();  
            }
            pop();
        }

}


function Particle(x,y,tx,ty){
    this.x =x ;
    this.y =y;
    this.size = random(1,5);

    var r = random(1)
    var signe = 1
    if(r < 0.5){
        signe = -1
    }
    this.xspeed = signe * random(1,2)

    r = random(1)
    signe = 1
    if(r < 0.5){
        signe = -1
    }
    this.yspeed = signe * random(1,2)

    //this.xspeed = 0;
    //this.yspeed = 0;    

    this.xacc= 0;
    this.yacc =0;

    this.targetX = tx;
    this.targetY = ty;
   

    this.draw = function(){
        fill(params.color);
        noStroke();
        ellipse(this.x, this.y, params.particle_size*this.size, params.particle_size*this.size);        
    }

    this.update = function(){
        this.xspeed += this.xacc
        this.yspeed += this.yacc

        this.x = this.x + this.xspeed
        this.y = this.y + this.yspeed

        this.xacc = 0;
        this.yacc = 0;

    }

    this.check_bounds = function(){
        // changer en une fonction de wrapping

        if (this.x < 0-params.xoffset || this.x> windowWidth-params.xoffset){
            this.xspeed = - this.xspeed;   
        }
        else if (this.y<0-params.yoffset || this.y>windowHeight-params.yoffset){
            this.yspeed = - this.yspeed;
        }

    }

    this.repulse = function(x,y){
        var vmouse = createVector(x-params.xoffset,y-params.yoffset)
        var vpos = createVector(this.x, this.y)
        var frict = createVector(this.xspeed,this.yspeed);

        frict.normalize();
        frict.mult(-1)
        frict.mult(0.05)
        this.xacc += frict.x;
        this.yacc += frict.y;

        if( dist(vmouse.x,vmouse.y, vpos.x, vpos.y)< params.repulsion_threshold){
            var dir = vpos.sub(vmouse);
            var d = dir.mag();
            dir.normalize();
            dir.mult(1);
            dir.div(1/d*d)
            dir.mult(0.5)
            this.xacc += dir.x;
            this.yacc += dir.y;
        }
    }

    this.attract = function(){
        var vtarget = createVector(this.targetX,this.targetY)
        var vpos = createVector(this.x, this.y)
        var frict = createVector(this.xspeed,this.yspeed);

        frict.normalize();
        frict.mult(-1)
        frict.mult(0.055)
        this.xacc += frict.x;
        this.yacc += frict.y;

       
        var dir = vpos.sub(vtarget);
        var d = dir.mag();
        dir.normalize();
        dir.mult(-1);
        dir.div(1/d*d)
        dir.div(5)
        this.xacc += dir.x;
        this.yacc += dir.y;
        
    }
}


var Parameters = function(){

    this.font = "../fonts/AvenirNextLTW01-Medium.woff"
    this.message = 'p5*js';
    this.spacing = 5;
    this.size = 400;

    this.background = [0,0,0,25 ]; 
    this.color = [237,34,93,5];
    this.particle_size = 10;
    this.repulsion_threshold = 150;

    this.xoffset = windowWidth/3 - this.size/2  
    this.yoffset = windowHeight/2

   

    this.regenerate = function(){
        background(0); 
        getPoints();
    }

    this.save = function(){
        saveCanvas()
    }

    this.clear = function(){
        background(0); 
    }

    this.preset0 = function(){
        this.spacing = 3;
        this.size = 400;

        this.background = [0,0,0,25]; 
        this.color = [237,34,93,8];
        this.particle_size = 10;
        this.repulsion_threshold = 150;
    }

    this.preset1 = function(){
        this.spacing = 10;
        this.size = 400;

        this.background = [0,0,0,50]; 
        this.color = [237,34,93];
        this.particle_size = 2;
        this.repulsion_threshold = 50;


    }
}
