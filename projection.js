/** The next block of code creates the div element that will appear when the target is found.
*   Styles for both divs can be found in style.css
*   Both divs belong to class "contentContainer"
*   Paragraphs belong to class "ARParagraphs"
*
    projectionDiv: div to hold artInfo, creatorInfo, and circleContainer
*
*       staticDiv: static div held in projection div (swipable region)
*       
*       hangingDiv: div to hold artInfo and creatorInfo
*
*       artInfo: div with information about the art
*           @artHeader: header for the artInfo div
*           @artHeaderText: text for header
*           @artPara: paragraph for artInfo div
*           @artParaText: text for paragraph
*       creatorInfo: div with information about the creator
*           @creatorHeader: header for the artInfo div
*           @creatorHeaderText: text for header
*           @creatorPara: paragraph for artInfo div
*           @creatorParaText: text for paragraph
*
*       circleContainer: div with circles for screen state
*           @circle1: indicator for left side
*           @circle2: indicator for right side
*   
*/

var projectionDiv = document.createElement('div');
projectionDiv.className = "projectionContainer";

var staticDiv = document.createElement('div');
staticDiv.className = "infoDiv";

var changingDiv = document.createElement("div");
changingDiv.className = "swipeDiv";

//**************** circle container ****************
//Circles at the bottom of the div to indicate screen state
var circleContainer = document.createElement("div");
var circle1 = document.createElement("div");
var circle2 = document.createElement("div");

circleContainer.className = "circleContainer";
circle1.className = "circles";
circle2.className = "circles";

circleContainer.appendChild(circle1);
circleContainer.appendChild(circle2);

circle1.style.backgroundColor = "white";

//**************** artInfo ****************
//artInfo div, header, and paragraph declarations
var artInfo = document.createElement('div');
artInfo.className = "contentContainer";

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


//**************** creatorInfo ****************
//creatorInfo div, header, and paragraph declarations

var creatorInfo = document.createElement('div');
creatorInfo.className = "contentContainer";

var lemonadeAlbum = document.createElement("img");
lemonadeAlbum.setAttribute("src", "lemonade.png");
lemonadeAlbum.onload = function() {
    creatorInfo.appendChild(lemonadeAlbum);

}


//*********************************************

changingDiv.appendChild(artInfo);
changingDiv.appendChild(creatorInfo);


staticDiv.appendChild(changingDiv); 
projectionDiv.appendChild(staticDiv);
projectionDiv.appendChild(circleContainer);

//Create 
var cssObjectArt = new THREE.CSS3DSprite(projectionDiv);

//this is a property of projectionDiv
var visibleScreen = "left";

cssObjectArt.scale.set(.8, .8, .8);

var track1 = new Audio('Beyonce-Audio/01 Pray You Catch Me.mp3');


function playAudio(){
    track1.play();
}



/*  This block of code contains the code for the Finite State Machine. This FSM controls AR Projections 
*/
/*
var startState;
var currentState = ARProjectionFSM[startState];

var ARProjectionFSM = {
    
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
                predicate: function(xDifference) {
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
};
    */    
        
        
