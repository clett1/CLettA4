
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
var renderer = new THREE.CSS3DArgonRenderer();
app.view.element.appendChild(renderer.domElement);


// account for the pixel density of the device
//renderer.setPixelRatio(window.devicePixelRatio);

// to easily control stuff on the display
var hud = new THREE.CSS3DArgonHUD();

// We put some elements in the index.html, for convenience. 
// Here, we retrieve the description box and move it to the 
// the CSS3DArgonHUD hudElements[0].  We only put it in the left
// hud since we'll be hiding it in stereo
var description = document.getElementById('description');
hud.hudElements[0].appendChild(description);
app.view.element.appendChild(hud.domElement);

//var stats = new Stats();
//hud.hudElements[0].appendChild(stats.dom);

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

/** The next block of code creates the divs that will appear when the target is in sigh.
*   Styles for both divs can be found in style.css
*   Both divs belong to class "cssContent"
*   Paragraphs belong to class "ARParagraphs"
*
*   artInfo: div with information about the art
*       @artHeader: header for the artInfo div
*       @artHeaderText: text for header
*       @artPara: paragraph for artInfo div
*       @artParaText: text for paragraph

*   creatorInfo: div with information about the creator
*       @creatorHeader: header for the artInfo div
*       @creatorHeaderText: text for header
*       @creatorPara: paragraph for artInfo div
*       @creatorParaText: text for paragraph
*   
*/

//artInfo div, header, and paragraph declarations
var artInfo = document.createElement('div');
artInfo.className = "cssContent";

//header
var artHeader = document.createElement("h3");
var artHeaderText = document.createTextNode("Title, 1900");
    artHeader.appendChild(artHeaderText);

//paragraph
var artPara = document.createElement("p");
artPara.className = "ARParagraphs";
var artParaText = document.createTextNode("Description about art piece goes here. Short paragraph describing piece history/inspiration/etc.");
    artPara.appendChild(artParaText);

artInfo.appendChild(artHeader);
artInfo.appendChild(artPara);

//*****************************************

//creatorInfo div, header, and paragraph declarations
var creatorInfo = document.createElement('div');
creatorInfo.className = "cssContent";

//header
var creatorHeader = document.createElement("h3");
var creatorHeaderText = document.createTextNode("First Last");
    creatorHeader.appendChild(creatorHeaderText);

//paragraph
var creatorPara = document.createElement("p");
creatorPara.className = "ARParagraphs";
var creatorParaText = document.createTextNode("Bio about artist. Short paragraph describing artist history/inspiration/etc.");
    creatorPara.appendChild(creatorHeaderText);

creatorInfo.appendChild(creatorHeader);
creatorInfo.appendChild(creatorPara);

var cssObjectArt = new THREE.CSS3DSprite(artInfo);

//cssObjectArt.position.x = 0;
//cssObjectArt.position.y = 0;
//cssObjectArt.position.z = -.5;
cssObjectArt.scale.set(.8, .8, .8);
//cssObjectArt.rotation.y = -Math.PI / 2;
//cssObjectArt.scale.set(1, 1, 1);
var cssObjectCreator = new THREE.CSS3DSprite(creatorInfo);

// the width and height is used to align things.


//userLocation.add(cssObjectArt); //add to user location

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
                        
                        ARProjectionObject.add(cssObjectArt);
                        cssObjectArt.position.z = 0;
                      
                    
                    } else if(targetPose.poseStatus & Argon.PoseStatus.LOST) {  
                        //Target is lost
                        console.log("Target Lost");
                        
                        cssObjectArt.position.z = -0.5;
                        userLocation.add(cssObjectArt);
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
