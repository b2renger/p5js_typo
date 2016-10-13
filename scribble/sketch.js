

var f;
var path;
var polys;
var drawing = false;
var gui, params;

var scribble;
var seed;


// this function loads a font, and create an array of polygons
// a polygon being itself an array of vectors with x/y coordinates
function getPoints(){
    drawing = false;
    // create new font : we use rune
    console.log(params.font);
    f = new Rune.Font(params.font) 
    // load the font
    f.load(function(err){     
        path = f.toPath(params.message, 0, 0, params.size) // this is a rune function
        polys = path.toPolygons({ spacing:params.spacing }) // this is anoteher handy function to get polygons coordinates
        // now we can draw
        drawing = true;
    })
}


function setup(){
    createCanvas(windowWidth,windowHeight)  
    background(0)

    // init all parameters
    params = new Parameters();
    // create dat.gui drawer
    gui = new dat.GUI();
    // gui setup
    var f2 = gui.addFolder('Configuration / Path generation');
    var f1 = gui.addFolder('real-time parameters');

    gui.add(params, 'preset0')
    gui.add(params, 'preset1')
    gui.add(params, 'preset2')
    gui.add(params, 'preset3')
    gui.add(params, 'preset4')  
   
     // Configuration parameters
    // font selector
    f2.add(params, 'font', {Avenir : "../fonts/AvenirNextLTW01-Medium.woff", BlackOpsOne : "../fonts/Black_Ops_One/BlackOpsOne-Regular.ttf",
                            Comfortaa : "../fonts/Comfortaa/Comfortaa-Bold.ttf",
                            NovaMono : "../fonts/Nova_Mono/NovaMono.ttf", ShadowsIntoLight : "../fonts/Shadows_Into_Light/ShadowsIntoLight.ttf", 
                            Sniglet: "../fonts/Sniglet/Sniglet-ExtraBold.ttf",Tangerine : "../fonts/Tangerine/Tangerine_Bold.ttf",
                            UnicaOne : "../fonts/Unica_One/UnicaOne-Regular.ttf"});  
    f2.add(params, 'message');
    f2.add(params, 'spacing', 1, 100);
    f2.add(params, 'size', 100, 1200);
    f2.add(params, 'regenerate');

    f1.addColor(params, 'background' );
    f1.addColor(params, 'color');
    f1.add(params, 'shape', {line : 0 , circle : 1 , rectangle :2})
    f1.add(params, 'shape_size', 10 ,500)
    f1.add(params, 'stroke_weight',0.5,20);

    f1.add(params, 'bowing',1,360);
    f1.add(params, 'roughness',1,25);
    f1.add(params, 'maxOffset',1,100);
    
    f1.add(params, 'xoffset',0,windowWidth-300)
    f1.add(params, 'yoffset',0,windowHeight)
    f1.add(params, 'autoregenerate')


    gui.add(params, 'clear')
    gui.add(params, 'save')

    scribble = new Scribble();
    seed = random(512) // to stabilize scribble

    getPoints();
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
                noFill()
                stroke(params.color);
                strokeWeight(params.stroke_weight);

                if(params.shape == 0){
                    scribble.scribbleLine(vec1.x,vec1.y, vec2.x, vec2.y);
                }
                else if (params.shape == 1){
                    scribble.scribbleEllipse(vec1.x, vec1.y,params.shape_size,params.shape_size);   
                }
                else if (params.shape == 2){
                    scribble.scribbleRect(vec1.x, vec1.y,params.shape_size,params.shape_size);
                }
            }
        }
        pop()
    }

    if (params.autoregenerate){
        if (frameCount % 15 == 0) seed = random(1000);
    }
}




var Parameters = function(){

    this.font = "../fonts/AvenirNextLTW01-Medium.woff"
    this.message = 'p5*js';
    this.spacing = 6;
    this.size = 400;

    this.shape_size = 50;
    this.autoregenerate = false;

    this.shape = 0;

    this.bowing = 313;
    this.roughness = 1;
    this.maxOffset = 3.2;
    this.stroke_weight = 1;

    this.background = [0,0,0]; 
    this.color = [237,34,93,150];
    this.xoffset = windowWidth/2 - this.size;
    this.yoffset = windowHeight/2  
  
    this.regenerate = function(){
        background(0);
        seed = random(1000)
        getPoints();
    }

    this.save = function(){
        saveCanvas()
    }

    this.clear = function(){
        background(0); 
    }

    this.preset0 = function(){
        background(0);
        seed = random(1000)
        this.spacing = 100;
        this.bowing = 1;
        this.roughness = 5;
        this.maxOffset = 1.2;
        this.stroke_weight = 1;
        this.shape_size = 0;
        this.autoregenerate = true;
        this.shape = 0;
        this.color = [237,34,93,150];
        getPoints();
    }


    this.preset1 = function(){
        background(0);
        seed = random(1000)
        this.spacing = 6;
        this.bowing = 313;
        this.roughness = 1;
        this.maxOffset = 3.2;
        this.stroke_weight = 3;
        this.shape_size = 50;
        this.shape = 0;
        this.color = [237,34,93,150];
        this.autoregenerate = false;
        getPoints();
    }

    this.preset2 = function(){
        background(0);
        seed = random(1000)
        this.spacing = 6;
        this.bowing = 1;
        this.roughness = 26;
        this.maxOffset = 1;
        this.stroke_weight = 0.5;
        this.shape_size = 50;
        this.shape = 0;
        this.color = [237,34,93,150];
        this.autoregenerate = false;
        getPoints();
    }

    this.preset3 = function(){
        background(0);
        seed = random(1000)
        this.spacing = 2;
        this.bowing = 1;
        this.roughness = 1;
        this.maxOffset = 1;
        this.stroke_weight = 10;
        this.shape_size = 100;
        this.shape = 2;
        this.autoregenerate = false;
        this.color = [237,34,93,2];
        getPoints();
    }

    this.preset4 = function(){
        background(0);
        seed = random(1000)
        this.spacing = 10;
        this.bowing = 1;
        this.roughness = 1;
        this.maxOffset = 1;
        this.stroke_weight = 0.5;
        this.shape_size = 100 ;
        this.shape = 1;
        this.autoregenerate = false;
        this.color = [237,34,93,150];
        getPoints();
    }




// presets
// sw : 4.2, bowing: 313, roughness:1, maxOFfset :3.2, spacing :6
// sw : 4.2, bowing: 313, roughness:1, maxOFfset :3.2, spacing :6
// 0.5 , 360,1,26,1
// carrés : spacing : 2 , strokW : 15,  tout le reste a 1 opacité 1 , shape size 100



}
