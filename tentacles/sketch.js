
var f;
var path;
var polys;
var drawing = false;
var gui, params;
var anchorX, anchorY;

var tentacles = [];

// this function loads a font, and create an array of polygons
// a polygon being itself an array of vectors with x/y coordinates
// in this example we want to create a new 'tentacle' on each point on the outline
// of the font path
function getPoints(){
    drawing = false;
    // create new font : we use rune
    console.log(params.font);
    f = new Rune.Font(params.font) 
    // load the font
    f.load(function(err){       
        path = f.toPath(params.message, 0, 0, params.size)
        polys = path.toPolygons({ spacing:params.spacing })
        tentacles = [];
        for (var i=0; i < polys.length ; i++){
            var poly = polys[i];
            for(var j = 0; j < poly.state.vectors.length; j++) {
                var vec = poly.state.vectors[j];
                tentacles.push(new Tentacle(vec.x,vec.y, params.tnoiseMultiplicator, params.tminRandom, params.tmaxRandom, params.tdimStep));
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
    
    // buttons for presets
    gui.add(params, 'dispertion_effect')
    gui.add(params, 'orbiting_effect')
    gui.add(params, 'bubbling_effect')
    gui.add(params, 'fireworks_effect')
    gui.add(params, 'spiky_effect')
    gui.add(params, 'curly_effect')

    // Configuration parameters
    // font selector
    f2.add(params, 'font', {Avenir : "../fonts/AvenirNextLTW01-Medium.woff", BlackOpsOne : "../fonts/Black_Ops_One/BlackOpsOne-Regular.ttf",
                            Comfortaa : "../fonts/Comfortaa/Comfortaa-Bold.ttf",
                            NovaMono : "../fonts/Nova_Mono/NovaMono.ttf", ShadowsIntoLight : "../fonts/Shadows_Into_Light/ShadowsIntoLight.ttf", 
                            Sniglet: "../fonts/Sniglet/Sniglet-ExtraBold.ttf",Tangerine : "../fonts/Tangerine/Tangerine_Bold.ttf",
                            UnicaOne : "../fonts/Unica_One/UnicaOne-Regular.ttf"});  
    f2.add(params, 'message');
    f2.add(params, 'spacing', 1, 25);
    f2.add(params, 'size', 100, 1000);
    f2.add(params, 'regenerate');

    f1.addColor(params, 'background' );
    f1.addColor(params, 'color');
    f1.add(params, 'xoffset',0,windowWidth-300)
    f1.add(params, 'yoffset',0,windowHeight)

    gui.add(params, 'clear')
    gui.add(params, 'save')

    anchorX =  windowWidth/4;
    anchorY = windowHeight/2;
    getPoints();
}


function draw(){
    noStroke();
    fill(params.background)
    rect(0,0,windowWidth,windowHeight)

   if (drawing){
        push()
        translate(params.xoffset, params.yoffset)
        strokeWeight(params.stroke_weight )
        stroke(params.color)
        for (var i = 0 ; i < tentacles.length ; i++){
            tentacles[i].draw();
        }
        pop()
    }
}

function mouseDragged(){
    if (mouseX < windowWidth-400){
        anchorX = mouseX
        anchorY = mouseY
    }
}


function Tentacle(x,y, noiseM, minRand, maxRand, dimStep){
    this.x =x ;
    this.y =y;

    this.minRandom = minRand;
    this.maxRandom = maxRand;

    this.dimStep = dimStep;
    this.size = random(this.minRandom,this.maxRandom);
    this.angle = random(360);
    this.radius = 0;
    this.noiseFactor = random(500);
    this.noiseMultiplicator = noiseM;

    this.draw = function(){

        this.radius += 1;
        this.angle = this.angle+ noise(this.noiseFactor,10)*this.noiseMultiplicator-this.noiseMultiplicator/2 ;
        this.size -= this.dimStep;
        this.noiseFactor += 0.005;

        fill(params.color);
        //  stroke(0);
        noStroke();
        var drawX = this.x + this.radius*cos(radians(this.angle));
        var drawY = this.y + this.radius*sin(radians(this.angle));
        ellipse(drawX, drawY, this.size, this.size);

        if (this.size < 0){
            this.angle = random(360);
            this.radius = 0;
            this.noiseFactor = random(500);
            this.size = random(this.minRandom,this.maxRandom)   ;
        }
    }

    this.setNoiseM = function(val){
        this.noiseMultiplicator = val;
    }
}


var Parameters = function(){

    this.font = "../fonts/AvenirNextLTW01-Medium.woff"
    this.message = 'p5*js';
    this.spacing = 20;
    this.size = 400;

    this.background = [0,0,0,0]; 
    this.color = [237,34,93,5];
    this.xoffset = windowWidth/3 - this.size/2  
    this.yoffset = windowHeight*2/3

    this.tnoiseMultiplicator = 5;   
    this.tminRandom = 5;
    this.tmaxRandom = 10;
    this.tdimStep = 0.07;

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

    this.dispertion_effect = function(){
        background(0);
        this.background = [0,0,0]; 
        this.color = [237,34,93,255];
        this.spacing = 0.75;  
        this.tnoiseMultiplicator = 5;
        this.tminRandom = 5;
        this.tmaxRandom = 10;
        this.tdimStep = 0.07;
        getPoints();  
    }

     this.fireworks_effect = function(){
        background(0);
        this.background = [0,0,0,15]; 
        this.color = [237,34,93,45];
        this.spacing = 1.5;
        this.tnoiseMultiplicator = 5;
        this.tminRandom = 5;
        this.tmaxRandom = 10;
        this.tdimStep = 0.07;
        getPoints();
    }


    this.spiky_effect = function(){
        background(0);
        this.background = [0,0,0,0]; 
        this.color = [237,34,93,20];
        this.spacing = 5 ;
        this.tnoiseMultiplicator = 5;
        this.tminRandom = 5;
        this.tmaxRandom = 10;
        this.tdimStep = 0.07;
        getPoints();
    }

    this.curly_effect = function(){
        background(0); 
        this.background = [0,0,0,0]; 
        this.color = [237,34,93,30   ];
        this.spacing = 20   ;
        this.tnoiseMultiplicator = 45;
        this.tminRandom = 5;
        this.tmaxRandom = 10;
        this.tdimStep = 0.07;
        getPoints();   
    }

    this.orbiting_effect = function(){
        background(0);
        this.background = [0,0,0 ]; 
        this.color = [237,34,93];
        this.spacing = 3   ;
        this.tnoiseMultiplicator = 90;
        this.tminRandom = 5;
        this.tmaxRandom = 20;
        this.tdimStep = 0.07;
        getPoints();
    }

    this.bubbling_effect = function(){
        background(0);
        this.background = [0,0,0 ]; 
        this.color = [237,34,93];
        this.spacing = 5   ;
        this.tnoiseMultiplicator = 5;
        this.tminRandom = 15;
        this.tmaxRandom = 35;
        this.tdimStep = 0.9;
        getPoints();
    }

}
