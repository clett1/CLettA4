/// <reference types="@argonjs/argon" />
/// <reference types="three" />
/// <reference types="dat-gui" />
/// <reference types="stats" />
// set up Argon
var app = Argon.init();
// set up THREE.  Create a scene, a perspective camera and an object
// for the user's location
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var userLocation = new THREE.Object3D();
scene.add(camera);
scene.add(userLocation);
// We use the standard WebGLRenderer when we only need WebGL-based content
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
// create a bit of animated 3D text that says "argon.js" to display 

var box = new THREE.Object3D();
//userLocation.add(box);

var loader = new THREE.TextureLoader();
loader.load("lemonade.png", function(texture) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var cube = new THREE.Mesh(geometry, material);
    cube.scale.set(70, 70, 70);
});

box.add(cube);

cube.addEventListener('touchstart', handleTouchStart, false);

cube.addEventListener('touchmove', handleTouchMove, false);

cube.addEventListener('touchend', handleTouchEnd, false);

var startX;
var movingX
var endX;


function handleTouchStart(event) {
    startX = event.touches[0].clientX;
    console.log(startX) 
    //makeTransition(event.type);
}

function handleTouchMove(event) {
    movingX = event.touches[0].clientX;
    //console.log(movingX);
}

function handleTouchEnd(event) {
    endX = movingX;
    var xDifference = endX - startX;
    
    console.log(xDifference);
    
    if(xDifference > 0) {
        //right swipe
        rightSwipe(xDifference);
        
    } else if(xDifference < 0){
        //left swipe
        leftSwipe(xDifference);
        
    } else {
        //xDifference = 0
    }
}

function rightSwipe(swipeLength){
     cube.rotate.x -= 90;   
}

function leftSwipe(swipeLength){
     cube.rotate.x += 90;   

}
    

app.vuforia.isAvailable().then(function (available) {
    // vuforia not available on this platform
    if (!available) {
        console.warn("vuforia not available on this platform.");
        return;
    }
    // tell argon to initialize vuforia for our app, using our license information.
    app.vuforia.init({
        encryptedLicenseData: "-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP.js v2.3.2\nComment: http://openpgpjs.org\n\n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\n=NkXt\n-----END PGP MESSAGE-----"
    }).then(function (api) {
        // the vuforia API is ready, so we can start using it.
        // tell argon to download a vuforia dataset.  The .xml and .dat file must be together
        // in the web directory, even though we just provide the .xml file url here 
        api.objectTracker.createDataSet("A4Targets.xml").then(function (dataSet) {
            // the data set has been succesfully downloaded
            // tell vuforia to load the dataset.  
            dataSet.load().then(function () {
                // when it is loaded, we retrieve a list of trackables defined in the
                // dataset and set up the content for the target
                var trackables = dataSet.getTrackables();
                // tell argon we want to track a specific trackable.  Each trackable
                // has a Cesium entity associated with it, and is expressed in a 
                // coordinate frame relative to the camera.  Because they are Cesium
                // entities, we can ask for their pose in any coordinate frame we know
                // about.
                var gvuBrochureEntity = app.context.subscribeToEntityById(trackables["Target"].id);
                // create a THREE object to put on the trackable
                var gvuBrochureObject = new THREE.Object3D;
                scene.add(gvuBrochureObject);
                // the updateEvent is called each time the 3D world should be
                // rendered, before the renderEvent.  The state of your application
                // should be updated here.
                app.context.updateEvent.addEventListener(function () {
                    // get the pose (in local coordinates) of the gvuBrochure target
                    var gvuBrochurePose = app.context.getEntityPose(gvuBrochureEntity);
                    // if the pose is known the target is visible, so set the
                    // THREE object to the location and orientation
                    if (gvuBrochurePose.poseStatus & Argon.PoseStatus.KNOWN) {
                        gvuBrochureObject.position.copy(gvuBrochurePose.position);
                        gvuBrochureObject.quaternion.copy(gvuBrochurePose.orientation);
                    }
                    // when the target is first seen after not being seen, the 
                    // status is FOUND.  Here, we move the 3D text object from the
                    // world to the target.
                    // when the target is first lost after being seen, the status 
                    // is LOST.  Here, we move the 3D text object back to the world
                    if (gvuBrochurePose.poseStatus & Argon.PoseStatus.FOUND) {
                       //Target Found
                       console.log("target found"); 
                        gvuBrochureObject.add(box);
                        box.position.set(0, 0, 0);              
                    }
                    else if (gvuBrochurePose.poseStatus & Argon.PoseStatus.LOST) {
                        //Target Lost
                        console.log("target lost");
                        gvuBrochureObject.remove(box);
                    }
                });
            }).catch(function (err) {
                console.log("could not load dataset: " + err.message);
            });
            // activate the dataset.
            api.objectTracker.activateDataSet(dataSet);
        });
    }).catch(function (err) {
        console.log("vuforia failed to initialize: " + err.message);
    });
});
// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
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
    // set the renderers to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var viewport = app.view.getViewport();
    renderer.setSize(viewport.width, viewport.height);
    // there is 1 subview in monocular mode, 2 in stereo mode    
    for (var _i = 0, _a = app.view.getSubviews(); _i < _a.length; _i++) {
        var subview = _a[_i];
        var frustum = subview.frustum;
        // set the position and orientation of the camera for 
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera. 
        camera.projectionMatrix.fromArray(subview.projectionMatrix);
        // set the viewport for this view
        var _b = subview.viewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        // set the webGL rendering parameters and render this view
        renderer.setViewport(x, y, width, height);
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
    }
});
