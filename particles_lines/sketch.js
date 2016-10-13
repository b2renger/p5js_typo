
// update particles position on/off


var f;
var path;
var polys;
var drawing = false;
var gui, params;
var anchorX, anchorY;

var particles = [];

// this function loads a font, and create an array of polygons
// a polygon being itself an array of vectors with x/y coordinates
// in this example we want to create a new 'tentacle' on each point on the outline
// of the font path
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
                    particles.push(new Particle(random(0,windowWidth), random(0,windowHeight), vec.x,vec.y));
                   // particles.push(new Particle(random(0,windowWidth), random(0,windowHeight), vec.x,vec.y));
                   // particles.push(new Particle(random(0,windowWidth), random(0,windowHeight), vec.x,vec.y));
                    //particles.push(new Particle(random(0,windowWidth), random(0,windowHeight), vec.x,vec.y));
                    //particles.push(new Particle(random(0,windowWidth), random(0,windowHeight), vec.x,vec.y));
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
    f2.add(params, 'spacing', 1, 40);
    f2.add(params, 'size', 100, 1000);
    f2.add(params, 'regenerate');

    f1.addColor(params, 'background');
    f1.addColor(params, 'color');
    f1.add(params, 'strokeWeight',0.1,2);
    f1.add(params, 'threshold',10,150 );
    f1.add(params, 'show_particles');
    f1.add(params, 'xoffset',0,windowWidth-300)
    f1.add(params, 'yoffset',0,windowHeight)

    gui.add(params, 'preset0')
    gui.add(params, 'preset1')
    gui.add(params, 'preset2')
    gui.add(params, 'preset3')

    gui.add(params, 'save')

    getPoints();
}


function draw(){
    noStroke();
    fill(params.background)
    rect(0,0,windowWidth,windowHeight)

   if (drawing){

            for (var i = 0 ; i < particles.length ; i++){
                particles[i].update(); 
                 particles[i].check_bounds(); 
                if (params.show_particles)particles[i].draw();  
            }
    
            push()
            translate(params.xoffset, params.yoffset)
            strokeWeight(params.strokeWeight )
            stroke(params.color);

            for (var j=0; j < polys.length ; j++){ // get each polygon
                var poly = polys[j];      
                for(var k = 0; k < poly.state.vectors.length; k++) { // get each point of each polygon
                    var vec = poly.state.vectors[k];        
                    for (var i = 0 ; i < particles.length ; i++){
                        if (dist(particles[i].x-params.xoffset, particles[i].y-params.yoffset, vec.x, vec.y) < params.threshold){
                            line(particles[i].x-params.xoffset, particles[i].y-params.yoffset, vec.x, vec.y)
                        }
                    }
                }
            }
            pop()
    }

    if(mouseIsPressed && mouseX < windowWidth-300)  particles.push(new Particle(mouseX,mouseY,mouseX,mouseY));
}


function Particle(x,y,tx,ty){
    this.x =x ;
    this.y =y;
    this.size = 5;

    var r = random(1)
    var signe = 1
    if(r < 0.5){
        signe = -1
    }
    this.xspeed = signe * random(0.15,1.5)

    r = random(1)
    signe = 1
    if(r < 0.5){
        signe = -1
    }
    this.yspeed = signe * random(0.15,1.5)

    //this.xspeed = 0;
    //this.yspeed = 0;    

    this.xacc= 0;
    this.yacc =0;

    this.targetX = tx;
    this.targetY = ty;
   

    this.draw = function(){
        fill(params.color);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);        
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

        if (this.x < 0 || this.x> windowWidth){
            this.xspeed = - this.xspeed;   
        }
        else if (this.y<0 || this.y>windowHeight){
            this.yspeed = - this.yspeed;
        }

    }

    
}


var Parameters = function(){

    this.font = "../fonts/AvenirNextLTW01-Medium.woff"
    this.message = 'p5*js';
    this.spacing = 20;
    this.size = 600;

    this.background = [0,0,0,150]; 
    this.color = [237,34,93];
    this.strokeWeight = 0.51;
    this.threshold = 50;

    this.xoffset = windowWidth/3 - this.size
    this.yoffset = windowHeight*2/3

    this.show_particles = true;

   

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
        this.spacing = 20;
        this.size = 600;
        this.background = [0,0,0,150]; 
        this.color = [237,34,93];
        this.strokeWeight = 0.51;
        this.threshold = 50;
        this.show_particles =true;
        getPoints();
    }

    this.preset1 = function(){
        this.spacing = 40;
        this.size = 600;
        this.background = [0,0,0,5]; 
        this.color = [237,34,93];
        this.strokeWeight = 0.25;
        this.threshold = 75;
         this.show_particles =false;
        getPoints();
    }

    this.preset2 = function(){
        this.spacing = 8;
        this.size = 600;
        this.background = [0,0,0]; 
        this.color = [237,34,93];
        this.strokeWeight = 0.41;
        this.threshold = 85;
         this.show_particles =false;
        getPoints();
    }

    this.preset3 = function(){
        this.spacing = 4;
        this.size = 600;
        this.background = [0,0,0,50]; 
        this.color = [237,34,93];
        this.strokeWeight = 0.41;
        this.threshold = 25;
        this.show_particles = false;
        getPoints();
    }
}
