
var f; // font
var path; // path of points from font
var polys; // polygon array from path
var drawing = false;
var gui, params; // gui objects
var anchorX, anchorY; // used make the shapes orientation follow the mouse 

var shapes = []; // store and array of 3D objects


// this function loads a font, and create an array of polygons
// a polygon being itself an array of vectors with x/y coordinates
// in this example we want to create a new 3D shape on each point on the outline
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

        shapes = []; // reset the shapes to populate a new array

        for (var i=0; i < polys.length ; i++){ // go through all the polygons
           var poly = polys[i];
           for(var j = 0; j < poly.state.vectors.length; j++) { // go through each point
                var vec = poly.state.vectors[j];
                shapes.push(new Shape(vec.x, vec.y, 0)) // create a new shape at the right spot in our array
            }
        }
        drawing = true;
    });
}


function setup(){
    createCanvas(windowWidth,windowHeight,WEBGL)  
    background(0)

    // init all parameters
    params = new Parameters();
    cc = new camControls();
    // create dat.gui drawer
    gui = new dat.GUI();
    // gui setup
    var f2 = gui.addFolder('configuration / path generation');
    var f1 = gui.addFolder('real-time parameters');
    var f3 = gui.addFolder('camera controls');

    // Configuration parameters
    // font selector
    f2.add(params, 'font', {Avenir : "../fonts/AvenirNextLTW01-Medium.woff", BlackOpsOne : "../fonts/Black_Ops_One/BlackOpsOne-Regular.ttf",
                            Comfortaa : "../fonts/Comfortaa/Comfortaa-Bold.ttf",
                            NovaMono : "../fonts/Nova_Mono/NovaMono.ttf", ShadowsIntoLight : "../fonts/Shadows_Into_Light/ShadowsIntoLight.ttf", 
                            Sniglet: "../fonts/Sniglet/Sniglet-ExtraBold.ttf",Tangerine : "../fonts/Tangerine/Tangerine_Bold.ttf",
                            UnicaOne : "../fonts/Unica_One/UnicaOne-Regular.ttf"});  
    f2.add(params, 'message').listen();
    f2.add(params, 'spacing', 1, 60).listen();
    f2.add(params, 'size', 100, 800).listen();
    f2.add(params, 'regenerate');

    // RT parameters
    // color selectors
    f1.addColor(params, 'background' ).listen();
    f1.add(params, 'shape_type', { Cone: 0, Ellipsoid: 1, Torus: 2, Cylinder:3, Sphere: 4, Box:5, Plane:6 } ).listen();
    f1.add(params, 'shape_size',5,50).listen();
    f1.add(params, 'alignement_x',-1000,0).listen();
    f1.add(params, 'alignement_y',-250,500).listen();
    f1.add(params, 'animation',{agregate : 0 , explode : 1}).listen();
    f1.add(params, 'animation_speed', 0.001, 0.15).listen();
    
    // Camera parameters
    f3.add(cc, 'x_rotation', -PI/2,PI/2);
    f3.add(cc, 'y_rotation', -PI/2,PI/2);
    f3.add(cc, 'z_position', -1500,500);
    f3.add(cc, 'reset_camera');

    // Save Button
    gui.add(params, 'save')

    // used for the camera
    anchorX =  0;
    anchorY = 0;

    getPoints();
}


function draw(){
    background(params.background);

    // light effect from p5js documentation ! http://p5js.org/examples/3d-multiple-lights.html
    var locY = (mouseX / height - 0.5) * (-2);
    var locX = (mouseY / width - 0.5) * 2;
    ambientLight(25);
    directionalLight(200, 0, 0, 0.55, 0.25, 0.25);
    pointLight(200, 0, 100, locX, locY, 0);
    pointLight(200, 100, 100, -locX, -locY, 0);

   if (drawing){
        push()
        // setup the matrix
        translate(0,0   ,cc.z_position);
        rotateY(cc.x_rotation);
        rotateX(cc.y_rotation);
        translate(params.alignement_x,params.alignement_y,0)
        for (var i = 0 ; i < shapes.length ; i++){
            push() // push a new matrix
            shapes[i].display(); // this will again use translate and rotate in the shape referential
            if(params.animation == 0){
                shapes[i].agregate();
            }
            else {
                shapes[i].explode();
            }
            pop() // restore the previous matrix
        }
    }
}



// handle shape rotation following the mouse
function mouseDragged (){
    if (mouseX < windowWidth -300){
        for (var i = 0 ; i < shapes.length ; i++){
            shapes[i].drag(mouseX,mouseY);
        }
    }
}

function Shape(x,y,z){

    // anchors from font path
    this.anchorx = x;
    this.anchory = y;
    this.anchorz = z;
    // current position
    this.x =x;
    this.y =y;
    this.z =z;
    // orientation of objects
    this.oriX = windowWidth*4/9;
    this.oriY = windowHeight*3/8;
    // target values for explode !
    this.targetX = random(-5000,5000)
    this.targetY = random(-5000,5000)
    this.targetZ = random(-5000,5000)

    // animate toward targets
    this.explode = function(){
        this.x = lerp(this.x,this.targetX, params.animation_speed);
        this.y = lerp(this.y,this.targetY, params.animation_speed);
        this.z = lerp(this.z,this.targetZ, params.animation_speed);
    }

    // animate towards anchors from font path
    this.agregate = function(){
        this.x = lerp(this.x,this.anchorx, params.animation_speed);
        this.y = lerp(this.y,this.anchory, params.animation_speed);
        this.z = lerp(this.z,this.anchorz, params.animation_speed);
    }

    // draw a shape at the right place with the right orientation
    this.display = function(){
        translate(this.x, this.y,this.z)
        // rotate the shapes according to mouse movements
        rotateY((map(this.oriX,0,windowWidth,-PI,PI)));
        rotateX((map(this.oriY,0,windowHeight,-PI,PI)));
        this.drawShape();
    }

    // change orientation according to mouse movements
    this.drag = function(x,y){
        this.oriX = x;
        this.oriY = y;
    }

    // actually draw the shape according to the one selected in the controls
    this.drawShape = function(){
        if(params.shape_type == 0){
             cone(params.shape_size,params.shape_size);
        }
        else if (params.shape_type == 1){
            ellipsoid(params.shape_size,params.shape_size, params.shape_size*4);
        }
        else if (params.shape_type == 2){
            torus(params.shape_size);      
        }
        else if (params.shape_type == 3){
            cylinder(params.shape_size,params.shape_size*2);
        }
        else if (params.shape_type == 4){
            sphere(params.shape_size);
        }
        else if (params.shape_type == 5){
            box(params.shape_size);
        }
        else if (params.shape_type == 6){
            plane(params.shape_size, params.shape_size);
        }
    }

}


// dat.gui parameters holding object
var Parameters = function(){

    this.xoffset = -windowWidth/2
    this.yoffset = 0
    this.zoffset = -1000

    this.font = "../fonts/AvenirNextLTW01-Medium.woff"
    this.message = 'p5*js';
    this.spacing = 10;
    this.size = 400;
    this.shape_size = 25;  

    this.shape_type =2;

    this.background = [0,0,0]; 
    this.alignement_x = -500
    this.alignement_y = 0

    this.animation = 0;
    this.animation_speed = 0.025;

    this.regenerate = function(){
        background(this.background); 
        getPoints();
    }

    this.save = function(){
        saveCanvas()
    }
    this.clear = function(){
        background(0); 
    }
}

// another one for camera
var camControls = function(){
  this.z_position = 0;
  this.x_rotation = 0;
  this.y_rotation = 0;

  this.reset_camera = function (){
     this.z_position = 0;
     this.x_rotation = 0;
     this.y_rotation = 0;
  }
}
