// Sets up Argon for the site
var app = Argon.init();

 

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

// set up THREE.  Create a scene, a perspective camera and an object for the user's location
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var userLocation = new THREE.Object3D;

//Add camera to the scene
scene.add(camera); 
//Add user location to the scene
scene.add(userLocation);


var cssRenderer = new THREE.CSS3DArgonRenderer();
var hud = new THREE.CSS3DArgonHUD();
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.setPixelRatio(window.devicePixelRatio);
// Assuming the z-orders are the same, the order of sibling elements
// in the DOM determines which content is in front (top->bottom = back->front)
app.view.element.appendChild(renderer.domElement);
app.view.element.appendChild(cssRenderer.domElement);
app.view.element.appendChild(hud.domElement);
// We put some elements in the index.html, for convenience. 
// Here, we retrieve them and move the information boxes to the 
// the CSS3DArgonHUD hudElement.


/*
//Add user location to the scene


*   CSS3DArgonRenderer: 
        Create a place to put elements that appear fixed to the screen
*   
*   CSS3DArgonHUD:
        Allows us to easily control things put on the display


var renderer = new THREE.CSS3DArgonRenderer();
app.view.element.appendChild(renderer.domElement);
var hud = new THREE.CSS3DArgonHUD();

//Put description element and add to hudElements. We put this here because it can be hidden
var description = document.getElementById('description');
hud.hudElements[0].appendChild(description);
app.view.element.appendChild(hud.domElement);*/






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
var cssObjectCreator = new THREE.CSS3Sprite(creatorInfo);

// the width and height is used to align things.


userLocation.add(cssObjectArt); //add to user location


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
        encryptedLicenseData: "-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP.js v2.3.2\nComment: http://openpgpjs.org\n\nwcFMA+gV6pi+O8zeARAAmBjlssr+rWkZey+6g/8vC9TAJag0RFUh2OkJ+D9R\nutHO2f/GYBfkWumwtvE5BRmIIif24IFoKeVpkUJ4Y5X0hV8eyRY+OQ5NbK+M\nLZuE7/sqr6ub8Uchk7GnFfc8mLU+8BVDRm0UokZqldPfQzZAmZ7el0x7QNh9\nPLrB7THa9uAf4vj55BmqPX4V6ldXejSEAv2x/uWpj+7ibI/N1MQUIdsgYjY0\nLIa+V8UTxGC7BKIsDaOw4/3z+afKE4KHdyoPq6cu5ye1WUHyuBxudJyajHd6\nKf4BnUq6WomziXJb+qlobNIzio3QED1L61yQoMCE+8L08jm3fTtKvedzrVTA\nMt44zPzTtwVveg4zUDQ3vtpiT1RDz6GOARnpEuuqwIfmmHiTRP5mKhTRzcAh\nAl9u1hHRflzQAvmpArlAMaZ2/TPvfdUQFC3ZVler6GJOglm4Iz9tTT7Egjma\npwqsSxqjkpDpPNQD0KeIhdJVzWgGc6Py6k51gzi9BNuugJqsB9I8w2/jZIMy\nS3TDpSCuM4nOppgcb3zfMf0VZYbBCsCl3FYauVciRppZ+Ybd1BmIYrV46oOr\nzr8kxz5ilEvBZhAni8VAr7nSkGTVVEMBj/VIWBpZaMixoseM5NluHfk3B5Cv\nkOrqhKRqfU4hiKq3ArCtjJ5S7opFzghVQA8OrAxE1pnBwU4DAGn1enGTza0Q\nB/9ZWiLKUhHuuIDBmEzVJ9QBWK4LJ/8KhG1+IqM9W6xjFYUbbbQrMW4ClvQc\nPCwhvHPFVFcK4hrx7vf2GdyItHdcD9Qv4A8AS9yeU+h8TSB1rFYrUEBR+T7z\ntSBniAVHTA+myDkNuRgs3r0yYxAz0vPssb670pyquwIP9YrSh/adkDdQroEI\nRUJk8l17nQNgEXWz+FthAzp0rR8YSQR63TP5RsH0cJi60q+gwlkZ4T2V2BR+\niV9Y9r/IKzk0u5m+3ea1+cKDJ1hG+00Jc+ZV/wRNhSoPBwFzcxtSpjlRVigh\nJSFnFhpcaY0y/TG3yYoO/1Lm+bFUEolD+uokCZ7iFMHgB/90CUlSFMx3r0WC\ngybK5z9HO9fRr2FJJs4NyjUewmID6YbRFOEQskGzc9jAZiSjgUQGUEf4cKQs\nvnX78qYGxSFHfgQzD0l41vrcOe3p+eYUdBGPKDIkcv8dus4P1izICRALxqjd\nbiOJwKaTSMum+uycVezy3EibqpIIKHpfiX+2PHWOJEt3DBA5BLEzTRFqQwDV\nr1CYbiwgbh8eZ75dMnfLDH7U5GKjpp2fo9IbAYOS/bH4iqB3XG/C3gu09r6y\n1Qt88jiajKlifRi8EvYO+NFoff3GY7xQhaFS/68TPJ/asRWSKtW/TGgmszrn\n7o8bEshXT7yQrFm/D9qIzTB85yH3wcFMA47tt+RhMWHyAQ/+LemT8frNBlQB\nWYp1TH06pmiwHKGlDgaH2pn29j47qZijo2rRHtYRrh/wiAGAnYNGzY6XykPo\nxUwBBSRRYjep+jiVjhK00sQg+66ZaB6bkJkd1n6Kho1hp41msV56i6s8E0Tv\nXjJ0Q5CzWet+0o8mxlMFTslwX+rQLRwD29pRtAwuodueCxr7sLUzpVvGPpE0\ntQ/s1ns0Sang5FqbGrndx5xKgq4SXUe9NiYukvd4P2MKaeMrd6acaBycC61D\n8vte+GNFJM+lXF9mGAbDhbqyyf/M/Bcw8B+LN780igz+LzmwZpDLIdKrt/Z/\nCZlbC9pFRnbti/ABghWSrzfWoiLWwdT4Pxe6+K50EDjH4k0YNfne3R2ZyStH\nzaBJj5892mM5f7vqe271vmC1z85DAGShWYdsZHFAkfg4WmIb4beLO2vbuKpO\nUw548YcgxrJ6u3PNmoPdlyOQcxHwPZwpNsfIAcz5JfQ8U3zC3VfszBnvcG/5\nBgwOlpEIjgETRus6is9vWJ6T3gzVT/n0Rv5Xft5PqDdzbiMNSg58ZSwJdkIa\nw+eJA5lyu+zyC0SI3YiIPH8yFyvYUQLl/e1YVu82ENB2zepo0lsY0sALXJc6\nlG/kvXtl+q3NqBQ76yIXzUbc0Tx/9mhq526KGPtIVD01tg+6NgrJLOoV+f6I\n3RwZ7x9IyFvSwSEBbCi+WWwcpvW7tXaw1x0B/IBJmFBG7YbrLmh08Wsjmkwz\nYUAl8znZ0atX8fQj/5u9nrn4FSYsgM3myWCDeZxPPTpj/TRalGjGAk6IXayc\nBEFK4pO8hHBszFMbKlMeWtvRNPMKklaiIzYd8yldZzAzLlh7v5OKUpO0RQd4\n+7PThyI83Ys3HzZPHUmxEvgmRLkC2U5wfZ38+Jo3/C68mnPLVL4kZPlvpe7t\n7WhSxxejfo01gHlMqgYSjPA9yX3lI+c/cVghDKQNLIYe2dKWpuT6xWU/mnBn\nFor1NRB+/DCj17lklH9LvsjYDLKwA1ibaipm+uyLC9m0RI2rcxKRrvwGVIZH\ntO3dNLOESScGsf4mU7tUVzU66UnLwFgGqUrtt1roogpGvVs8TBKU0OedavdD\ndQho5EjuzI38XJBUetLqFUN581OsXf3xqHZrrVrG8jHsrv0GlKu4cq5LIla0\nvl99WN0nTjfJ4tTKunTgCe+AAqL56UBT3xE/VFNfU7Az/Ex/8tQMP8K+VHS4\nHb34FpT+VEPYHZT7VXZuE15PkFbn+bykyz8d75hpNWFPdMGUMbPWW/+t7UWe\ncCu25REZFCYtpJ8vBH9QhVlL8HhY1lPRdUj+nUnxip9yJvefP+K/tMmt\n=NkXt\n-----END PGP MESSAGE-----"}).then(function (api) {
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
                    
                    //If location is known, then the target is visible. Therefore we set the THREE object to the target's location and orientation
                    if(targetPose.poseStatus & Argon.PoseStatus.known) {
                        ARProjectionObject.position.copy(targetPose.position); //copy location
                        
                        ARProjectionObject.quarternion.copy(targetPose.orientation);   //copy orientation
                        
                    }
                    
                    /*When the target is seen after not being scene, status is FOUND
                    *   Therefore, move object onto target
                    *
                    *When the target is lost after being seen, status is LOST
                    *   Therefore, remove object from target
                    *
                    */
                    
                    if(targetPose.poseStatus & Argon.PoseStatus.FOUND) {
                        //Target has been found
                        console.log("Target Found");
                        
                        ARProjectionObject.add(cssObjectArt);
                        cssObjectArt.position.z = 0.0;
                    
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

// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
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

// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener(function () {
    // set the renderers to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var viewport = app.view.getViewport();
    renderer.setSize(viewport.width, viewport.height);
    cssRenderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);
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
        // set the CSS rendering up, by computing the FOV, and render this view
        camera.fov = THREE.Math.radToDeg(frustum.fovy);
        cssRenderer.setViewport(x, y, width, height, subview.index);
        cssRenderer.render(scene, camera, subview.index);
        // set the webGL rendering parameters and render this view
        renderer.setViewport(x, y, width, height);
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        // adjust the hud
        hud.setViewport(x, y, width, height, subview.index);
        hud.render(subview.index);
    }
});
