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
    //vuforia not available on this platform
    if (!available) {
        console.warn("vuforia not available on this platform.");
        return;
    }


    app.vuforia.init({
        encryptedLicenseData: "-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP.js v2.3.2\nComment: http://openpgpjs.org\nwcFMA+gV6pi+O8zeAQ//XYThXY+Q5ajCe7wuXvXXwBhCCJy5gJxjXVlxqxJM\n5X56arLpLU7AqjY3dRyLo4Rw05g/0sjHLnSTu//wFDx8LYUxPjEXGoSDl1wZ\ncYobSmvai/Imu0B7P23F/ji2g7DODMkV0EIM7KR+OLZQaMDYATT5oNcMknL6\nm3xdH6tygxQ1ilK2B14R0+MrZ8kHnlNV3gFA8MTurUGBrvVbizXScto6Bx7H\n14TN+PC4g70gaTrMdmpf3X9MWSHs0/Q3gLKero6XrKdkYJAgXQHfEZy2ccV5\nNTWX9geEisciuviS/B0iQ0Z4/H9ixkzTId8IyOMjG3nbp+I8IOsb8zT9IS8Z\n6uWCLoO41dxOxUOW4km5MSGptqMFxcQDWu8F8jKWrL4n8mvYBq0a00X4dDIq\nZEQnJrZ2FT/9FO0FtTCHDgdbs7JqBVmO0MNb47kbuRl0DKkvbTB3vmzYIzcD\nemHxLK99ykDo/UXbqUBllwHHxBp1v/HFwSNbEy5HVIAy63aQx3BBjcaaA4my\n4xCtUsAuDv7umkW2D2JUOLjSAJCLca/XstvFbH1JYUnXfGHecNlUzOjxyKmF\nFtFJ/AJB9qfEAg37Uholz5IqrzmYz0R+w9EqSa0kwo6sYOosx11gD+1OYzhw\nlJBjfpY1S15PtBiw5YxEUWpxgxrcA7twWzu9I4dfs1rBwU4DAGn1enGTza0Q\nCACgmmHJ//uImq63a5EThn15J7Fl7gnToQO77a0B6maw12duE2oiK6u0OOWo\nXRtMnH2LaPVRvl52gVSWjgZntOTwU8uJhudRLrMsCof2wUheOkABkw+LPW9O\nmWE5fZ4ttt8KhP9fu12pvECu4jx/Tzv8BNKfSkOPZXAcPVzr9hYVxfE/eTe9\nwrPmpVptZ7L6u8UpNqgArGdrenQQZwErFyYEpANSHUdPN+sZF3WSqLI5iPK/\njT7lTV86G6ekjneiTh/yjLXoeOct8wCE3ijCEMcSumjP5ydwEQoP3lwUD9Ex\nuOBoUUNbCQ1j6mne98YQdd0S5wXw3CBOJ5VKsxJ0tV6GB/9fhzJyhhl0+/nq\njhA1VCoAAJnPYIVsNeHgnq3E9aYzthfATnGAMpfvqPsbSS71Z9pwXesd013W\nuOBJHXfB2lXl0maMoPcqoFzryucswYIhR/hV+ctzaNP76rYAEqlMWe7IICUo\ntw5NQdaGyJhXaosur1WJbPEgKw8Xu39ECtNTRHed8CNsMq1k9jPBBoexw3aH\nf/04gQijnCTaIMxZjOs1lTbUvoJo4IDQqYRqw+aJopWq1t3A/rR1Q4lLRw8o\nB6k7B90e6YwmYmHUZxV5xnBTVG9bL4gsB1IasbdbScs95p/LdhtThB59JDVH\nDzgMt4A2inOK2St7NeoAmjm236tpwcFMA47tt+RhMWHyARAA12zzCfotO13V\ntmo41Eh5WY/AdBs5GiuHq0mXvds+cMfFU+/V1nsUAXvwJfRzpi20Buz5iX8h\nWHNX0xiu6IHu413y/5OodbjMk7ZEw5K7lKUI7KBVN3Kuf0e0pMv3CcY7x8Yb\nJuC5n5I4PZlcgqX84/FmK7g4KfqVMHQN17Qqh5YAsigP/25Z1ytRynFLghE6\nh35K+viEzP2rdFZ5lJDqYlNQimyubDDtOELojIAUwHbinCQGSH7/eiUxJJCe\nNoDkZK+DNYHsLfNe/F2gA0zRRW60X3GD4/3B22NMN3W/o7fvdMxJgNu6xUb4\n0yfRu1ooeZ4MvgjL4H26x1t1ShM2K/GanLIX09b1LTH6fqjwSXJazKmQVDLw\neGBZPtHOgqRXZED+vWDG0ZVxEoFRlGAhiv0IU1ogbOGMX0bHszeIRlhFeTrz\nNNlxd5NzSdN3AWKPTOeBzMgCUtjlHByPHJOpEQgeYb0lB7ijNNuRC+RzuoV2\nJh6hy6EoMMTKwDvg7Lt9jKc9InApxify/JO2JEXj+QX7MM/qncd+2mbkOOe3\nSdhE3nvnfQTQoyK2QXb5qN+2TSLQtG2v8O8GGV4kiT58edfirAJrJhb/hOFT\nexLxnLzKAQBUnELd5DI/HHXfdJW7IhFG2sYgAVJYL6KBMar6cQzKdAeV18Q+\nfIFjn9/1i2jSwUcBeJ8eu6ZJvcPlaMWaBexH920RXWT07pP28BV3VYI2+acB\nFAbxp7Z+3wmX8qOARUuNEX/xOQMZ9oD3UGVU0aj7VXFCatMMHL2RpBL8hO5z\nUzXR74j2NO65rQfhGAOQ9qZp3t5JKRgNKa0w9z3b6QwNTT8RDQcAwRXAFal5\nFDPs6BsQebgv9cL7uMF2HSaIu5tU1ypyX/RI7j0QvyuqAGe6RQ5cUh50efkI\nHhLRU4P0PQGjgQAPT9JvxXUOyfoBSueYUbVcEuxUAVZqJQQkJjn0ATPV+PyG\ngMtlYNVr6x1j/6MmzWtH5/6jM4Ap1Pa+JXyAABDCCXwxdl8jXTdTf9S/7fgg\n8zv7/8CSYRrDEfRgQP+VgLoti4mxKxzS/p34trohdsmjdoKVkkRmu6Y26WUj\nZ2yNnwSdfQb8gXsbfWKR5RMz8Hv09HzzO647RcAtsbbrz2283K3iUiSovMyL\nPXSK8OXvhKObtAF1Ek1NjOxuVBs5tWq2RnoQ0/dsZI2H0ecEOBYKRlW2YVZ4\nl7v+bBjzXNJuzBnJGD5s7COXb0GbyafsIHX5HjjkpBPJ7G7kTsXKqFCUpi9A\nlR/eAmw7VgDkZE7Fz26B6GEss9txhnrWCgoUTFl3a9EE9I7M28rGpJq/TyiZ\nz6Ik0D3HjomqL9tETcTNv/5O90KJUrb5kMXDjtVirl0E5t4=\n=EKz2\n-----END PGP MESSAGE-----"
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
