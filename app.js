// Sets up Argon for the site
var app = Argon.init();

// set up THREE.  Create a scene, a perspective camera and an object for the user's location
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var userLocation = new THREE.Object3D;

//Add camera to the scene
scene.add(camera);  

//Add user location to the scene
scene.add(userLocation); 

// The CSS3DArgonRenderer supports mono and stereo views, and 
// includes both 3D elements and a place to put things that appear 
// fixed to the screen (heads-up-display) 
var renderer = new THREE.CSS3DArgonRenderer();
app.view.element.appendChild(renderer.domElement);

// to easily control stuff on the display
var hud = new THREE.CSS3DArgonHUD();

// We put some elements in the index.html, for convenience. 
// Here, we retrieve the description box and move it to the 
// the CSS3DArgonHUD hudElements[0].  We only put it in the left
// hud since we'll be hiding it in stereo
var description = document.getElementById('description');

//Add description element to hud
hud.hudElements[0].appendChild(description);

app.view.element.appendChild(hud.domElement);

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

/* Create div elements in documents
*   sideOne: Side of div with title and year
*   sideTwo: Side of div with Artist and bio
*/
var side1 = document.createElement('div');
var side2 = document.createElement('div');

//Set class of side 1 and side 2 to "cssContent"
side1.className = "cssContent";
side2.className = "cssContent";


var side1Header = document.createElement("h3");
var hText1 = document.createTextNode("Title, 1900");

side1Header.appendChild(hText1);

var p1 = document.createElement("p");
p1.className = "ARDiv";

var textNode1 = document.createTextNode("This is the text for the description");
p1.appendChild(textNode1);

side1.appendChild(side1Header);
side1.appendChild(p1);


var side2Header = document.createElement("h3");
var hText2 = document.createTextNode("Arist Name");

side2Header.appendChild(hText2);

var p2 = document.createElement("p");
p2.className = "ARDiv";

var textNode2 = document.createTextNode("This is the text for the description");
p1.appendChild(textNode2);

side2.appendChild(side2Header);
side2.appendChild(p2);


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
var cssObjectSide1 = new THREE.CSS3DObject(side1);
var cssObjectSide2 = new THREE.CSS3DObject(side2);

// the width and height is used to align things.
cssObjectSide1.position.z = -0.50;
//cssObjectSide1.rotation.y = -Math.PI / 2;

/*
cssObjectSide2.position.x = -200.0;
cssObjectSide2.position.y = 0.0;
cssObjectSide2.position.z = 0.0;
cssObjectSide2.rotation.y = Math.PI / 2;
*/

userLocation.add(cssObjectSide1);
//userLocation.add(cssObjectSide2);

// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
app.updateEvent.addEventListener(function () {
    // get the position and orientation (the "pose") of the user
    // in the local coordinate frame.
    var userPose = app.context.getEntityPose(app.context.user);
    // assuming we know the user's pose, set the position of our 
    // THREE user object to match it
    if (userPose.poseStatus & Argon.PoseStatus.KNOWN) {
        userLocation.position.copy(userPose.position);
    }
});
// for the CSS renderer, we want to use requestAnimationFrame to 
// limit the number of repairs of the DOM.  Otherwise, as the 
// DOM elements are updated, extra repairs of the DOM could be 
// initiated.  Extra repairs do not appear to happen within the 
// animation callback.
var viewport = null;
var subViews = null;
var rAFpending = false;
app.renderEvent.addEventListener(function () {
    // only schedule a new callback if the old one has completed
    if (!rAFpending) {
        rAFpending = true;
        viewport = app.view.getViewport();
        subViews = app.view.getSubviews();
        window.requestAnimationFrame(renderFunc);
    }
});
// the animation callback.  
function renderFunc() {
    // if we have 1 subView, we're in mono mode.  If more, stereo.
    var monoMode = subViews.length == 1;
    rAFpending = false;
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    renderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);
    // there is 1 subview in monocular mode, 2 in stereo mode
    for (var _i = 0, subViews_1 = subViews; _i < subViews_1.length; _i++) {
        var subview = subViews_1[_i];
        // set the position and orientation of the camera for 
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera.  Use it, and then update the FOV of the 
        // camera from it (needed by the CSS Perspective DIV)
        camera.projectionMatrix.fromArray(subview.projectionMatrix);
        camera.fov = subview.frustum.fovy * 180 / Math.PI;
        // set the viewport for this view
        var _a = subview.viewport, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        renderer.setViewport(x, y, width, height, subview.index);
        // render this view.
        renderer.render(scene, camera, subview.index);
        // adjust the hud, but only in mono
        if (monoMode) {
            hud.setViewport(x, y, width, height, subview.index);
            hud.render(subview.index);
        }
    }
}

/* To use Vuforia with argon, the library must be initialized with a valid license key. The argon browser requires each web app to have an encrypted key. The code below initalizes vuforia using the encrtypted license. app.vuforia.isAvailable returns a promise that passes a boolean to the success function (app.vuforia.init)
*       
*   app.vuforia.isAvalailbe: 
    - checks to see if the web app platform supports vuforia
*       parameters: 
*       return: 
*           null if vuforia is not available
*
*   app.vuforia.init: 
*   - initializes argon with license key
*       parameter: encrypted license data object
*/ 

app.vuforia.isAvailable().then(function (available) {
    console.log("Checking Availablility");
    //vuforia not available on this platform
    if (!available) {
        console.warn("vuforia not available on this platform.");
        return;
    }


    app.vuforia.init({ 
        encryptedLicenseData: "-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP.js v2.3.2\nComment: http://openpgpjs.org\n\n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\n=JzEy\n-----END PGP MESSAGE-----"                      
    }).then(function (api) {
        // vuforia has been initialized. 
        console.log("Running Vuforia...");
        
        //Argon must download our vuforia dataset. The 
        api.objectTracker.createDataSet("A4Targets.xml").then( function(dataSet) {
            //Data has been successfully downloaded
            console.log("Data download successful");
            
            dataSet.load().then(function() {
                console.log("Data is loaded");
                
                //set up content for desired target
                var trackables = dataSet.getTrackables();
                
                var artPiece = app.context.subscribeToEntityById(trackables["Target"].id);
                
                //Create a THREE object to put on the trackable. We will add sideOne and sideTwo when the target is found
                
                var artPieceObject = new THREE.Object3D;
                scene.add(artPieceObject);
                
                //call updateEvent each time the 3D world is rendered, before render event
                
                app.contect.updateEvent.addEventListener(function() {
                    //Get local coordinates (pose) of our target
                    var targetPose = app.context.getEntityPose(artPiece);
                    
                    //If location is known, then the target is visible. Therefore we set the THRee object to the target's location and orientation
                    
                    if(targetPose.poseStatus & Argon.PoseStatus.known) {
                        artPieceObject.position.copy(targetPose.position); //copy location
                        
                        artPieceObject.quarternion.copy(targetPose.orientation);   //copy orientation
                        
                    }
                    
                    /*When the target is seen after not being scene, status is FOUND
                    *   Therefore, move object onto target
                    *
                    *When the target is lost after being seen, status is LOST
                    *   Therefore, remove object from target
                    *
                    */
                    
                    if(targetPose.poseStatus & Argon.PoseStatus.FOUND) {
                        artPieceObject.add(cssObjectSide1ne);
                        sideOne.position.z = 0;
                    
                    } else if(targetPose.poseStatus & Argon.PoseStatus.LOST) {
                        sideOne.position.z = -0.5;
                        userLocation.add(cssObjectSide1);
                    } 
                    
                })
            
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
