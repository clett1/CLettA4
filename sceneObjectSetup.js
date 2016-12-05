var holdUpTrack = new Audio('audio/holdup.mp3');
//holdUpTrack = new WebAudioAPISound("audio/holdup.mp3", {loop: true});
holdUpTrack.onloadstart = function() {
   console.log("Audio load starting");
};
holdUpTrack.onloadeddata = function() {
  console.log("HoldUp load complete"); 
};

var KMagicTrack = new Audio('audio/24KMagic.mp3');
KMagicTrack.onloadstart = function() {
   console.log("KMagic load starting");
};
KMagicTrack.onloadeddata = function() {
  console.log("KMagicTrack load complete"); 
};

var calvinHarrisTrack = new Audio('audio/thisiswhatyoucamefor.mp3');
calvinHarrisTrack.onloadstart = function() {
   console.log("Calvin harris load starting");
};
calvinHarrisTrack.onloadeddata = function() {
  console.log("Calvin Harris track load complete"); 
};

/** The next block of code creates the div element that will appear when the target is found.
   Styles for both divs can be found in style.css
   Both divs belong to class "contentContainer"
   Paragraphs belong to class "ARParagraphs"
    projectionDiv: div to hold artInfo, creatorInfo, and circleContainer
    staticDiv: static div held in projection div (swipable region)
       
    changingDiv: div to hold all screens
    
    titleView: div to hold title and description
        @titleHeader: header for the titleView div
        @titleHeaderText: text for header
        @titlePara: paragraph for titleView div
        @titleParaText: text for paragraph
    
    creatorInfo: div with information about the creator
           @creatorHeader: header for the artInfo div
           @creatorHeaderText: text for header
           @creatorPara: paragraph for artInfo div
           @creatorParaText: text for paragraph
       circleContainer: div with circles for screen state
           @circle1: indicator for left side
           @circle2: indicator for right side
*/
var allElements = document.createElement('div');
allElements.className = "allElementsContainer";

var projectionDiv = document.createElement('div');
projectionDiv.className = "projectionContainer";

var staticDiv = document.createElement('div');
staticDiv.className = "infoDiv";

var changingDiv = document.createElement("div");
changingDiv.className = "swipeDiv";

//****************circle cointainer****************
//Circles at the bottom of the div to indicate screen state
var statusContainer = document.createElement("div");
var bar1 = document.createElement("div");
var bar2 = document.createElement("div");
var bar3 = document.createElement("div");
var bar4 = document.createElement("div");

statusContainer.className = "statusContainer";
bar1.className = "statusDivs";
bar2.className = "statusDivs";
bar3.className = "statusDivs";
bar4.className = "statusDivs";

statusContainer.appendChild(bar1);
statusContainer.appendChild(bar2);
statusContainer.appendChild(bar3);
statusContainer.appendChild(bar4);

bar1.style.backgroundColor = "white";

var arrowContainer = document.createElement('div');
arrowContainer.className = "arrowDiv";

var leftArrow = document.createElement('div');
var rightArrow = document.createElement('div');

leftArrow.className = "leftArrow";
rightArrow.className = "rightArrow";

arrowContainer.appendChild(leftArrow);
arrowContainer.appendChild(rightArrow);
   
//**************** first view ****************
var titleDiv = document.createElement('div');
titleDiv.className = "contentContainer";

var titleHeader = document.createElement("h3");
var titleHeaderText = document.createTextNode("Courtney's Mix");
titleHeader.appendChild(titleHeaderText);

var titlePara = document.createElement("p");
titlePara.className= "ARParagraphs";
var titleParaText = document.createTextNode("Welcome to my playlist. This is a complitation of some of my favorite songs of 2016");
titlePara.appendChild(titleParaText);

titleDiv.appendChild(titleHeader);
titleDiv.appendChild(titlePara);
        
var titleView = new View({
    image: null,
    track: null,
    playState: null,
    visibility: "false"
});


//**************** second view ****************
var page2 = document.createElement("div");
page2.className = "contentContainer";
var holdUp = document.createElement("img");
holdUp.setAttribute("src", "holdup.png");

holdUp.onload = function() {
    page2.appendChild(holdUp);
}

var secondView = new View ({
    image: holdUp,
    track: holdUpTrack,
    playState: "paused",
    visibility: "false"
}); 


//**************** third view ****************
var page3 = document.createElement("div");
page3.className = "contentContainer";
var KMagic = document.createElement("img");
KMagic.setAttribute("src", "24KMagic.png");

KMagic.onload = function() {
    page3.appendChild(KMagic);
}

var thirdView = new View ({
    image: KMagic,
    track: KMagicTrack,
    playState: "paused",
    visibility: "false"
}); 

//**************** fourth view ****************
var page4 = document.createElement("div");
page4.className = "contentContainer";
var calvinHarris = document.createElement("img");
calvinHarris.setAttribute("src", "calvinharris.png");

calvinHarris.onload = function() {
    page4.appendChild(calvinHarris);
}

var fourthView = new View ({
    image: calvinHarris,
    track: calvinHarrisTrack,
    playState: "paused",
    visibility: "false"
});


/*
circle1.addEventListener("touchstart", titleView.controlButtonPress.bind(titleView));
circle2.addEventListener("touchstart", secondView.controlButtonPress.bind(secondView));
circle3.addEventListener("touchstart", thirdView.controlButtonPress.bind(thirdView));
circle4.addEventListener("touchstart", fourthView.controlButtonPress.bind(fourthView));
*/

changingDiv.appendChild(titleDiv);
changingDiv.appendChild(page2);
changingDiv.appendChild(page3);
changingDiv.appendChild(page4);

//Append all divs to projection Div
staticDiv.appendChild(changingDiv);

projectionDiv.appendChild(statusContainer);
projectionDiv.appendChild(staticDiv);

allElements.appendChild(projectionDiv);
allElements.appendChild(arrowContainer);

//Create new cssObject Div
var cssObjectPlaylist = new THREE.CSS3DSprite(allElements);

//Create new AR Projection
var projection = new ARProjection(leftArrow, rightArrow, projectionDiv);

projection.addView(titleView);
projection.addView(secondView);
projection.addView(thirdView);
projection.addView(fourthView);

projection.currentView = projection.views[0];
projection.views[0].isVisible = "true";
//set view to the first page


/*  This block of code contains the code for the Finite State Machine. This FSM controls AR Projections 
*/
/*
var startState = 'hidden';
var currentState = ARProjectionFSM[startState];
var ARProjectionFSM = {
    'hidden': {
        'targetseen': {
            actions: [{func: function(){
                //set current view
                projection.currentView = projection.views[0];
            }}],
            endState: 'visible'
        }
    },
    
    'visible': {
        'touchstart':{
            actions: [{func: function(){
                console.log("Div has been pressed");
            }}],
            
            endState: 'beingTouched'
        }, 
    },
            
    'touchedDown': {
        
        "touchmove": {
            actions: [{func: logMovement}],
            endState: "touchedDown"
        },
        
        "touchend": {
            "swipedRight": {
                predicate: function(projection.xDifference) {
                    return xDifference > 20
                },
                actions: [{func: swipedRight}],
                endState: "visible",
            },
            
            "swipedLeft": {
                predicate: function(xDifference){
                    return xDifference < -30
                },
                actions: [{func: swipedLeft}],
                endState: "visible"
            }
        }    
    }
};*/
