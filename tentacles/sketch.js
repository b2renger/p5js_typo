// réparer le clear
// ajuster les parametres, peut-être mettre quelques prests ?


var f;
var path;
var polys;
var drawing = false;
var gui, params;
var anchorX, anchorY;

var tentacles = [];

function preload(){
    // create new font
    f = new Rune.Font("../AvenirNextLTW01-Medium.woff")

    // function with callback to calculate paths etc.
    f.load(function(err){     
        path = f.toPath("p5*js", 0, 0, 400)
        polys = path.toPolygons({ spacing:2 })
        ready() 
    })

}

// when updating text or some of its parameters, this function is called on regenerate
function getPoints(){
     f.load(function(err){     
        path = f.toPath(params.message, 0, 0, params.size)
        polys = path.toPolygons({ spacing:params.spacing })
        
    })
     ready()
}

// update drawing boolean to tell that we are ready paths have loaded
function ready(){
    drawing = true;

    for (var i=0; i < polys.length ; i++){
           var poly = polys[i];

            for(var j = 0; j < poly.state.vectors.length; j++) {
                var vec = poly.state.vectors[j];

                tentacles.push(new Tentacle(vec.x,vec.y, color(255)));

            }
        }

}


function setup(){
    createCanvas(windowWidth,windowHeight)  
    background(0)

    // init all parameters
    params = new Parameters();
    // create dat.gui drawer
    gui = new dat.GUI();
    // gui setup
    var f1 = gui.addFolder('real-time parameters');
    var f2 = gui.addFolder('parameters that need regeneration of the path');

    gui.add(params, 'dispertion_effect')
    gui.add(params, 'orbiting_effect')
    gui.add(params, 'fireworks_effect')
    gui.add(params, 'spiky_effect')
    gui.add(params, 'curly_effect')

    f2.add(params, 'message');
    f2.add(params, 'spacing', 1, 25);
    f2.add(params, 'size', 100, 400);
    f2.add(params, 'regenerate');

    f1.addColor(params, 'background' );
    f1.addColor(params, 'color');
    
    f1.add(params, 'xoffset',0,windowWidth-300)
    f1.add(params, 'yoffset',0,windowHeight)

    gui.add(params, 'clear')
    gui.add(params, 'save')

    anchorX =  windowWidth/4;
    anchorY = windowHeight/2;
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



function Tentacle(x,y,color){
    this.x =x ;
    this.y =y;
    this.size = random(5,10);
    this.color = color;
    this.angle = random(360);
    this.radius = 0;
    this.noiseFactor = random(500);
    this.noiseMultiplicator = 5;

    this.draw = function(){

        this.radius += 1;
        this.angle = this.angle+ noise(this.noiseFactor,10)*this.noiseMultiplicator-this.noiseMultiplicator/2 ;
        this.size -= .070;
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
            this.size = random(5,10)   ;
        }
    }

    this.setNoiseM = function(val){
        this.noiseMultiplicator = val;
    }


}

var Parameters = function(){

    this.xoffset = 25
    this.yoffset = windowHeight/2

    this.message = 'p5*js';
    this.spacing = 20;
    this.size = 400;



    this.background = [0,0,0,0]; 

    this.color = [237,34,93,5];

    this.regenerate = function(){
        tentacles = [];
        background(this.background); 

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
        tentacles =[];
        this.background = [0,0,0]; 
        this.color = [237,34,93,255];
        this.spacing = 0.75;
        getPoints();

    }

     this.fireworks_effect = function(){
        background(0);
        tentacles =[];
        this.background = [0,0,0,15]; 
        this.color = [237,34,93,45];
        this.spacing = 1.5;
        getPoints();
    }


    this.spiky_effect = function(){
        background(0);
        tentacles =[];
        this.background = [0,0,0,0]; 
        this.color = [237,34,93,20  ];
        this.spacing = 5   ;
        getPoints();

    }

     this.curly_effect = function(){
        background(0);
        drawing = false;
        tentacles =[];
        this.background = [0,0,0,5  ]; 
        this.color = [237,34,93,60   ];
        this.spacing = 20   ;
        getPoints();

        for (var i = 0 ; i < tentacles.length ; i++){
            tentacles[i].setNoiseM(45);
        }

    }

     this.orbiting_effect = function(){
        background(0);
        drawing = false;
        tentacles =[];
        this.background = [0,0,0 ]; 
        this.color = [237,34,93];
        this.spacing = 5   ;
        getPoints();

        for (var i = 0 ; i < tentacles.length ; i++){
            tentacles[i].setNoiseM(180);
        }

    }

}
