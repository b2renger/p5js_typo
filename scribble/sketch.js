

var f;
var path;
var polys;
var drawing = false;
var gui, params;

var scribble;
var seed;

// presets

// sw : 4.2, bowing: 313, roughness:1, maxOFfset :3.2, spacing :6
// 0.5 , 360,1,26,1


function preload(){
    // create new font
    f = new Rune.Font("../AvenirNextLTW01-Medium.woff")

    // function with callback to calculate paths etc.
    f.load(function(err){     
        path = f.toPath("p5*js", 0, 0, 400)
        polys = path.toPolygons({ spacing:6 })
        ready() 
    })

}

// when updating text or some of its parameters, this function is called on regenerate
function getPoints(){
     f.load(function(err){     
        path = f.toPath(params.message, 0, 0, params.size)
        polys = path.toPolygons({ spacing:params.spacing })

        console.log(path);
        console.log(polys);

        for (var i = 0 ; i < path.state.anchors.length ; i++){
         console.log(path.state.anchors[i].command)  
        }
    })
    ready()
}

// update drawing boolean to tell that we are ready paths have loaded
function ready(){
    drawing = true;

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

   


    f2.add(params, 'message');
    f2.add(params, 'spacing', 1, 100);
    f2.add(params, 'size', 100, 400);
    f2.add(params, 'regenerate');

    f1.addColor(params, 'background' );
    f1.addColor(params, 'color');
    f1.add(params, 'stroke_weight',0.5,20);

    f1.add(params, 'bowing',1,360);
    f1.add(params, 'roughness',1,50);
    f1.add(params, 'maxOffset',1,100);
    
    f1.add(params, 'xoffset',0,windowWidth-300)
    f1.add(params, 'yoffset',0,windowHeight)

    gui.add(params, 'clear')
    gui.add(params, 'save')

    anchorX =  windowWidth/4;
    anchorY = windowHeight/2;

    scribble = new Scribble();
    seed = random(512) // to stabilize scribble
}


function draw(){
    
    background(params.background)
    scribble.bowing = params.bowing;          // changes the bowing of lines
    scribble.roughness = params.roughness;       // changes the roughness of lines
    scribble.maxOffset = params.maxOffset;       // coordinates will get an offset, here you define the max offset
    randomSeed(seed);
   
   if (drawing){
        push()
        translate(params.xoffset, params.yoffset)
        strokeWeight(params.stroke_weight )
        stroke(params.color)

        for (var i=0; i < polys.length ; i++){
           var poly = polys[i];


            for(var j = 1; j < poly.state.vectors.length; j++) {
                var vec1 = poly.state.vectors[j];
                var vec2 = poly.state.vectors[j-1];
                stroke(params.color);
                strokeWeight(params.stroke_weight);
                scribble.scribbleLine(vec1.x,vec1.y, vec2.x, vec2.y);

               
            }
        }
        pop()
    }
}




var Parameters = function(){

    // sw : 4.2, bowing: 313, roughness:1, maxOFfset :3.2, spacing :6

    this.xoffset = 25
    this.yoffset = windowHeight/2   

    this.message = 'p5*js';
    this.spacing = 6;
    this.size = 400;

    this.bowing = 313;
    this.roughness = 1;
    this.maxOffset = 3.2;
    this.stroke_weight = 4;

    this.background = [0,0,0]; 
    this.color = [237,34,93,100];


    this.regenerate = function(){
        seed = random(1000)
        getPoints();
    }

    this.save = function(){
        saveCanvas()
    }
    this.clear = function(){
        background(0); 

    }


}
