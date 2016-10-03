
var f;
var path;
var polys;
var drawing = false;
var gui, params;
var anchorX, anchorY;

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
        ready()
    })
}

// update drawing boolean to tell that we are ready paths have loaded
function ready(){
    drawing = true;
}


function setup(){
    createCanvas(windowWidth,windowHeight)  
    background(255)

    // init all parameters
    params = new Parameters();
    // create dat.gui drawer
    gui = new dat.GUI();
    // gui setup
    var f1 = gui.addFolder('real-time parameters');
    var f2 = gui.addFolder('parameters that need regeneration of the path');

    f2.add(params, 'message');
    f2.add(params, 'spacing', 1, 25);
    f2.add(params, 'size', 100, 400);
    f2.add(params, 'regenerate');

    f1.addColor(params, 'background', { Black: 0, White: 255 } );
    f1.addColor(params, 'color');
    f1.add(params, 'stroke_weight', 0.1, 15);
    f1.add(params, 'xoffset',0,windowWidth-300)
    f1.add(params, 'yoffset',0,windowHeight)

    gui.add(params, 'save')

    anchorX =  windowWidth/4;
    anchorY = windowHeight/2;
}


function draw(){

    background(params.background)

    if (drawing){
        push()
        translate(params.xoffset, params.yoffset)
 
        strokeWeight(params.stroke_weight )
        stroke(params.color)


        for (var i=0; i < polys.length ; i++){
           var poly = polys[i];

            for(var j = 0; j < poly.state.vectors.length; j++) {
                var vec = poly.state.vectors[j];
                line(anchorX-params.xoffset , anchorY-params.yoffset, vec.x, vec.y);
            }

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


var Parameters = function(){

    this.xoffset = 25
    this.yoffset = windowHeight/2

    this.message = 'p5*js';
    this.spacing = 2;
    this.size = 400;

    
    this.stroke_weight = 1;
    this.opacity = 55;

    this.background = [0,0,0]; 

    this.color = [237,34,93,55];

    this.regenerate = function(){
        getPoints();
    }

    this.save = function(){
        saveCanvas()
    }

}
