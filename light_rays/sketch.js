
var f;
var path;
var polys;
var drawing = false;
var gui, params;
var anchorX, anchorY;


// this function loads a font, and create an array of polygons
// a polygon being itself an array of vectors with x/y coordinates
function getPoints(){
    drawing = false;
    // create new font : we use rune
    console.log(params.font);
    f = new Rune.Font(params.font) 
    // load the font
    f.load(function(err){       
        path = f.toPath(params.message, 0, 0, params.size)
        polys = path.toPolygons({ spacing:params.spacing })
        drawing = true;
    });
}


function setup(){
    createCanvas(windowWidth,windowHeight)  
    background(255)

    // init all parameters
    params = new Parameters();
    // create dat.gui drawer
    gui = new dat.GUI();
    // gui setup
    var f2 = gui.addFolder('configuration / path generation')
    var f1 = gui.addFolder('real-time parameters');

     // Configuration parameters
    // font selector
    f2.add(params, 'font', {Avenir : "../fonts/AvenirNextLTW01-Medium.woff", BlackOpsOne : "../fonts/Black_Ops_One/BlackOpsOne-Regular.ttf",
                            Comfortaa : "../fonts/Comfortaa/Comfortaa-Bold.ttf",
                            NovaMono : "../fonts/Nova_Mono/NovaMono.ttf", ShadowsIntoLight : "../fonts/Shadows_Into_Light/ShadowsIntoLight.ttf", 
                            Sniglet: "../fonts/Sniglet/Sniglet-ExtraBold.ttf",Tangerine : "../fonts/Tangerine/Tangerine_Bold.ttf",
                            UnicaOne : "../fonts/Unica_One/UnicaOne-Regular.ttf"});  
    f2.add(params, 'message');
    f2.add(params, 'spacing', 1, 25).listen();
    f2.add(params, 'size', 100, 1200).listen();
    f2.add(params, 'regenerate');

    // Drawing parameters
    f1.addColor(params, 'background').listen();
    f1.addColor(params, 'color').listen();
    f1.add(params, 'stroke_weight', 0.1, 15).listen();
    f1.add(params, 'xoffset',0,windowWidth-300).listen();
    f1.add(params, 'yoffset',0,windowHeight).listen();

    // button
    gui.add(params, 'save')

    anchorX =  windowWidth/4;
    anchorY = windowHeight/2;

    getPoints();
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

    this.font = "../fonts/AvenirNextLTW01-Medium.woff"
    this.message = 'p5*js';
    this.spacing = 2;
    this.size = 400;
 
    this.stroke_weight = 1;

    this.background = [0,0,0]; 
    this.color = [237,34,93,55];

    this.xoffset = 25
    this.yoffset = windowHeight/2

    this.regenerate = function(){
        getPoints();
    }

    this.save = function(){
        saveCanvas()
    }

}
