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
        encryptedLicenseData: "-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP.js v2.3.2\nComment: http://openpgpjs.org\n\n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\n=ofCo\n-----END PGP MESSAGE-----"
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
