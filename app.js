
/// <reference path="../../typings/index.d.ts"/>
// set up Argon
var app = Argon.init();
// set up THREE.  Create a scene, a perspective camera and an object
// for the user's location
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var userLocation = new THREE.Object3D;
scene.add(camera);
scene.add(userLocation);

//CSS renderer
var cssRenderer = new THREE.CSS3DArgonRenderer();
//Create standard WebGLRenderer
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true
});

// account for the pixel density of the device
renderer.setPixelRatio(window.devicePixelRatio);
app.view.element.appendChild(renderer.domElement);

// to easily control stuff on the display
var hud = new THREE.CSS3DArgonHUD();

// We put some elements in the index.html, for convenience. 
// Here, we retrieve the description box and move it to the 
// the CSS3DArgonHUD hudElements[0].  We only put it in the left
// hud since we'll be hiding it in stereo
var description = document.getElementById('description');
hud.hudElements[0].appendChild(description);
app.view.element.appendChild(hud.domElement);

var stats = new Stats();
hud.hudElements[0].appendChild(stats.dom);
// Tell argon what local coordinate system you want.  The default coordinate
// frame used by Argon is Cesium's FIXED frame, which is centered at the center
// of the earth and oriented with the earth's axes.  
// The FIXED frame is inconvenient for a number of reasons: the numbers used are
// large and cause issues with rendering, and the orientation of the user's "local
// view of the world" is different that the FIXED orientation (my perception of "up"
// does not correspond to one of the FIXED axes).  
// Therefore, Argon uses a local coordinate frame that sits on a plane tangent to 
// the earth near the user's current location.  This frame automatically changes if the
// user moves more than a few kilometers.
// The EUS frame cooresponds to the typical 3D computer graphics coordinate frame, so we use
// that here.  The other option Argon supports is localOriginEastNorthUp, which is
// more similar to what is used in the geospatial industry
app.context.setDefaultReferenceFrame(app.context.localOriginEastUpSouth);


// creating 6 divs to indicate the x y z positioning
var divXpos = document.createElement('div');
var divXneg = document.createElement('div');

// programatically create a stylesheet for our direction divs
// and add it to the document
var style = document.createElement("style");
style.type = 'text/css';
document.head.appendChild(style);
var sheet = style.sheet;
sheet.insertRule("\n    .cssContent {\n        opacity: 0.5;\n        width: 100px;\n        height: 100px;\n        border-radius: 50%;\n        line-height: 100px;\n        fontSize: 20px;\n        text-align: center;\n         }\n", 0);
// Put content in each one  (should do this as a couple of functions)
// for X
divXpos.className = "cssContent";
divXpos.style.backgroundColor = "red";
divXpos.innerText = "Pos X = East";


var cssObjectXpos = new THREE.CSS3DObject(divXpos);
cssObjectXpos.position.set(100, 0, 0);
scene.add(cssObjectXpos);
//var cssObjectXneg = new THREE.CSS3DSprite(divXneg);
var argonTextObject = new THREE.Object3D();

//argonTextObject.add(cssObjectXpos);
argonTextObject.position.z = -0.50;
userLocation.add(argonTextObject);

/*
label3DObject.position.z = -.5;
userLocation.add(label3DObject);

// creating 6 divs to indicate the x y z positioning
var divXpos = document.createElement('div');
var divXneg = document.createElement('div');

// programatically create a stylesheet for our direction divs
// and add it to the document
var style = document.createElement("style");
style.type = 'text/css';
document.head.appendChild(style);
var sheet = style.sheet;
sheet.insertRule("\n    .cssContent {\n        opacity: 0.5;\n        width: 100px;\n        height: 100px;\n        border-radius: 50%;\n        line-height: 100px;\n        fontSize: 20px;\n        text-align: center;\n         }\n", 0);
// Put content in each one  (should do this as a couple of functions)
// for X
divXpos.className = "cssContent";
divXpos.style.backgroundColor = "red";
divXpos.innerText = "Pos X = East";
divXneg.className = "cssContent";
divXneg.style.backgroundColor = "red";
divXneg.innerText = "Neg X = West";

*/

/*

//cssObjectXpos.position.x = 0;
//cssObjectXpos.position.y = 0;
//cssObjectXpos.position.x = 0;

cssObjectXpos.scale.set(0.2, 0.2, 0.2);
//cssObjectXpos.position.set(0, 0, 0);

label3DObject.add(cssObjectXpos);


//userlocation.add(cssObjectXpos);

// create 6 CSS3DObjects in the scene graph.  The CSS3DObject object 
// is used by the CSS3DArgonRenderer. Because an HTML element can only
// appear once in the DOM, we need two elements to create a stereo view.
// The CSS3DArgonRenderer manages these for you, using the CSS3DObject.
// You can pass a single DIV to the CSS3DObject, which
// will be cloned to create a second matching DIV in stereo mode, or you
// can pass in two DIVs in an array (one for the left and one for the 
// right eyes).  If the content of the DIV does not change as the 
// application runs, letting the CSS3DArgonRenderer clone them is 
// simplest.  If it is changing, passing in two and updating both
// yourself is simplest.



// the width and height is used to align things.
//cssObjectXpos.position.x = 200.0;
//cssObjectXpos.position.y = 0.0;
/*
cssObjectXpos.position.x = 200;
cssObjectXpos.position.y = 0;
cssObjectXpos.position.z = 0;
cssObjectXpos.rotation.y = -Math.PI / 2;

cssObjectXneg.position.x = -200.0;
cssObjectXneg.position.y = 0.0;
cssObjectXneg.position.z = 0.0;
cssObjectXneg.rotation.y = Math.PI / 2;
*/
//no rotation need for this one
//userLocation.add(cssObjectXpos);
//userLocation.add(cssObjectXneg);

app.vuforia.isAvailable().then(function (available) {
    // vuforia not available on this platform
    if (!available) {
        console.warn("vuforia not available on this platform.");
        return;
    }

    app.vuforia.init({
        encryptedLicenseData: "-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP.js v2.3.2\nComment: http://openpgpjs.org\n\n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\n=NkXt\n-----END PGP MESSAGE-----"
    
    }).then(function (api) {
        // vuforia has been initialized. 
        console.log("Vuforia is ready for use");
        
        //Argon must download our vuforia dataset
        api.objectTracker.createDataSet("A4Targets.xml").then( function(dataSet) {
            //Data has been successfully downloaded
            console.log("Data download successful");
            
            //Load data set
            dataSet.load().then(function() {
                console.log("Data is loaded");
                
                //set up content for desired target
                var trackables = dataSet.getTrackables();
                
                /*
                *   We want to track a specific target. 
                *   Each target has a Cesium entity associated w/it. 
                *   Cesium entities reveal coordinates frame relative to the camera
                */
                var targetEntity = app.context.subscribeToEntityById(trackables["Target"].id);
                
                //Create a THREE object to put on the trackable. We will add sideOne and sideTwo when the target is found
                var ARProjectionObject = new THREE.Object3D;
                scene.add(ARProjectionObject);
                
                //call updateEvent each time the 3D world is rendered, before render event
                app.context.updateEvent.addEventListener(function() {
                    //Get local coordinates (pose) of our target
                    var targetPose = app.context.getEntityPose(targetEntity);
                    
                    //console.log(Argon.PoseStatus.known);
                    
                    //If location is known, then the target is visible. Therefore we set the THREE object to the target's location and orientation
                    if(targetPose.poseStatus & Argon.PoseStatus.KNOWN) {
                        //console.log("Target location found");
                        ARProjectionObject.position.copy(targetPose.position); //copy location 
                        ARProjectionObject.quaternion.copy(targetPose.orientation);   //copy orientation

                    }
                    
                    /*When the target is seen after not being seen, status is FOUND
                    *   Therefore, move object onto target
                    *
                    *When the target is lost after being seen, status is LOST
                    *   Therefore, remove object from target
                    */
                    
                    
                    if(targetPose.poseStatus & Argon.PoseStatus.FOUND) {
                        //Target has been found
                        console.log("Target Found");  
                        console.log(targetPose.poseStatus + " " + Argon.PoseStatus.FOUND);
                     
                        console.log(targetPose.position.x);
                        console.log(targetPose.position.y);
                        console.log(targetPose.orientation);
                        
                        ARProjectionObject.add(argonTextObject);
                        argonTextObject.position.z = 0;
                      
                    
                    } else if(targetPose.poseStatus & Argon.PoseStatus.LOST) {  
                        //Target is lost
                        console.log("Target Lost");
                        
                        argonTextObject.position.z = -0.5;
                        userLocation.add(argonTextObject);
                    } 
                });
            }).catch(function(err) {
                console.log("could not load dataset: " + err.message);
            });
            //activate the dataset
            api.objectTracker.activateDataSet(dataSet);
        });
    }).catch(function(err) {
        console.log("vuforia failed to initialize: " + err.message);
    });
});

app.context.updateEvent.addEventListener(function () {
    // get the position and orientation (the "pose") of the user
    // in the local coordinate frame.
    var userPose = app.context.getEntityPose(app.context.user);
    // assuming we know the user pose, set the position of our 
    // THREE user object to match it
    if (userPose.poseStatus & Argon.PoseStatus.KNOWN) {
        userLocation.position.copy(userPose.position);
    }
});

// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener(function () {
    // update the rendering stats
    stats.update();
    // if we have 1 subView, we're in mono mode.  If more, stereo.
    var monoMode = (app.view.getSubviews()).length == 1;
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var viewport = app.view.getViewport();
    renderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);
    // there is 1 subview in monocular mode, 2 in stereo mode    
    for (var _i = 0, _a = app.view.getSubviews(); _i < _a.length; _i++) {
        var subview = _a[_i];
        // set the position and orientation of the camera for 
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera. 
        camera.projectionMatrix.fromArray(subview.projectionMatrix);
        // set the viewport for this view
        var _b = subview.viewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        renderer.setViewport(x, y, width, height);
        // set the webGL rendering parameters and render this view
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        // adjust the hud, but only in mono
        if (monoMode) {
            hud.setViewport(x, y, width, height, subview.index);
            hud.render(subview.index);
        }
    }
});


