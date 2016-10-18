
var f; // font
var path; // path of points from font
var polys; // polygon array from path
var drawing = false; 
var gui, params;

var spots = []; // an array to store our spotlights interactive objects


// this function loads a font, and create an array of polygons
// a polygon being itself an array of vectors with x/y coordinates
// in this example we will create a "spot" for each polygon from which
// lines will be casted towards the font outline path points.
function getPoints(){
    drawing = false;
    // create new font : we use rune
    console.log(params.font);
    f = new Rune.Font(params.font) 
    // load the font
    f.load(function(err){     
        path = f.toPath(params.message, 0, 0, params.size) // this is a rune function
        polys = path.toPolygons({ spacing:params.spacing }) // this is anoteher handy function to get polygons coordinates
        spots =[];
        // trying to make sense of where we are going to initialize our spots
        // we want one spotlight per polygon, we will take the average coordinates of each points
        for (var i=0; i < polys.length ; i++){
            var poly = polys[i]; // one polygon    
            var polysx=[]; // to store extracted x coordinates
            var polysy=[]; // to store extracted y coordinates
            for (var j = 0 ; j < poly.state.vectors.length ; j++){ // do the extraction
                polysx.push(poly.state.vectors[i].x)
                polysy.push(poly.state.vectors[i].y)
            }
            // calculate mean position
            var spotx = arrayMin(polysx)+ (arrayMax(polysx) - arrayMin(polysx))/2;
            var spoty = arrayMin(polysy)+ (arrayMax(polysy) - arrayMin(polysy))/2;
            // create a new SpotLight object
            spots.push(new SpotLight(spotx,spoty)); 
        }
        // now we can draw
        drawing = true;
    })
}


function setup(){
    createCanvas(windowWidth,windowHeight)  
    background(255)

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
    // entering a string
    f2.add(params, 'message');
    // sliders
    f2.add(params, 'spacing', 1, 25); 
    f2.add(params, 'size', 100, 800);
    f2.add(params, 'regenerate');

    // RT parameters
    // color selectors
    f1.addColor(params, 'background', { Black: 0, White: 255 } );
    f1.addColor(params, 'color');
    // sliders
    f1.add(params, 'stroke_weight', 0.1, 15);
    f1.add(params, 'xoffset',0,windowWidth-300)
    f1.add(params, 'yoffset',0,windowHeight)

    // saving button
    gui.add(params, 'save')

    // calcuate the points to draw according to parameters
    getPoints()

}


function draw(){

    background(params.background)

    if (drawing){
        push()
        translate(params.xoffset, params.yoffset)
        strokeWeight(params.stroke_weight )
        stroke(params.color)
        // do the drawing
        for (var i=0; i < polys.length ; i++){ // get each polygon
           var poly = polys[i];
           
            for(var j = 0; j < poly.state.vectors.length; j++) { // get each point of each polygon
                var vec = poly.state.vectors[j];
                line(  spots[i].x ,  spots[i].y , vec.x, vec.y); // draw a line beetween it's spotlight and itself
            }
        }      
        pop()
        
        // interact with spotlights
        for (var i = 0 ; i < spots.length ; i++){
            spots[i].interact(mouseX,mouseY);   
        }  
    }
}

// drag the spots around
function mouseDragged(){
    push();
    for (var i = 0 ; i < spots.length ; i++){
        spots[i].drag(mouseX,mouseY);
    }
    pop();
}


// an object to initiate the lines from, there will be one by polygon
// it's basically a handler of coordinate, with the possibility to drag
// them aroud the canvas
function SpotLight(x,y){
    this.x = x;
    this.y = y;

    this.interact = function(x,y){// over
       if (dist(this.x+params.xoffset, this.y+ params.yoffset, x, y )< 50){ 
            push();
            noFill();
            strokeWeight(1);
            stroke(255)
            translate(params.xoffset,params.yoffset);
            ellipse(this.x,this.y,25,25);
            fill(255)
            text("Drag Me",this.x-20,this.y- 30);
            pop();
       }

    }

    this.drag = function(x,y){ // actually drag
        if (dist(this.x+params.xoffset, this.y+params.yoffset, x, y )< 50){
            this.x = x -params.xoffset;
            this.y = y -params.yoffset;
        }
    }
}


// dat.gui parameters holding object
var Parameters = function(){

    this.xoffset = 25
    this.yoffset = windowHeight/2

    this.font = "../fonts/AvenirNextLTW01-Medium.woff"
    this.message = 'p5*js';
    this.spacing = 2;
    this.size = 400;

    this.background = [0,0,0]; 
    this.color = [237,34,93,255];
    this.stroke_weight = 0.45;

    this.regenerate = function(){
        getPoints();
    }

    this.save = function(){
        saveCanvas()
    }
}

// statistical functions get min and max values of an array of numbers
function arrayMax(array) {
  return array.reduce(function(a, b) {
    return Math.max(a, b);
  });
}

function arrayMin(array) {
  return array.reduce(function(a, b) {
    return Math.min(a, b);
  });
}
