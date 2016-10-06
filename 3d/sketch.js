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
        polys = path.toPolygons({ spacing:50 })
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
    var f1 = gui.addFolder('real-time parameters');
    var f3 = gui.addFolder('camera controls');
    var f2 = gui.addFolder('parameters that need regeneration of the path');

   
    f2.add(params, 'message');
    f2.add(params, 'spacing', 2, 60);
    f2.add(params, 'size', 100, 400);
    f2.add(params, 'regenerate');

    f1.addColor(params, 'background' );
    f1.add(params, 'shape_type', { Cone: 0, Ellipsoid: 1, Torus: 2, Cylinder:3, Sphere: 4, Box:5, Plane:6 } );
    f1.add(params, 'shape_size',5,50)
    
    f3.add(cc, 'x_rotation', -PI/2,PI/2);
    f3.add(cc, 'y_rotation', -PI/2,PI/2);
    f3.add(cc, 'z_position', -1500,500);
    f3.add(cc, 'reset_camera');

   
    gui.add(params, 'save')

    anchorX =  0;
    anchorY = 0;
}


function draw(){
    background(params.background);
    //  orbitControl();

    var locY = (mouseX / height - 0.5) * (-2);
    var locX = (mouseY / width - 0.5) * 2;

    ambientLight(25);
    directionalLight(200, 0, 0, 0.55, 0.25, 0.25);
    pointLight(200, 0, 100, locX, locY, 0);
    pointLight(200, 100, 100, -locX, -locY, 0);

   if (drawing){
        push()
        translate(0,0   ,cc.z_position);

        rotateY(cc.x_rotation);
        rotateX(cc.y_rotation);
        
         for (var i=0; i < polys.length ; i++){
           var poly = polys[i];

            for(var j = 0; j < poly.state.vectors.length; j++) {

                for(var k = 0; k < 5; k++) {
                    push()
                    translate(-params.size,0,0)
                    var vec = poly.state.vectors[j];
                    translate(vec.x, vec.y,0)
    
                    rotateY((map(anchorX,0,windowWidth,-PI,PI)));
                    rotateX((map(anchorY,0,windowHeight,-PI,PI)));
                    
                    drawShape();
                    
                    pop()
                }

            }
        }  
        pop()
    }
}


function drawShape(){
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

function mouseDragged (){

    if (mouseX < windowWidth -300){
        anchorX =mouseX;
        anchorY = mouseY;
    }

}




var Parameters = function(){

    this.xoffset = -windowWidth/4
    this.yoffset = 0
    this.zoffset = -1000

    this.message = 'p5*js';
    this.spacing = 10;
    this.size = 400;
    this.shape_size = 25;  

    this.shape_type =0;

    this.background = [0,0,0]; 

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
