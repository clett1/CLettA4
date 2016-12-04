window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
   
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

//header
var creatorHeader = document.createElement("h3");
var creatorHeaderText = document.createTextNode("First Last");
    creatorHeader.appendChild(creatorHeaderText);

//paragraph
var creatorPara = document.createElement("p");
creatorPara.className = "ARParagraphs";
var creatorParaText = document.createTextNode("Bio about artist. Short paragraph describing artist history/inspiration/etc.");
creatorPara.appendChild(creatorParaText);

var twitterData = document.createElement("a");
twitterData.setAttribute('href', "https://twitter.com/TwitterDev");
twitterData.className = "twitter-timeline";
console.log(twitterData);


/*
var twitterData = document.createElement('a');
twitterData.className = "twitter-timeline";
twitterData.href = "https://twitter.com/TwitterDev";
*/

/*
<a class="twitter-timeline"
  href=
  data-width="300"
  data-height="300">
Tweets by @TwitterDev
</a>
*/


creatorInfo.appendChild(creatorHeader);
creatorInfo.appendChild(twitterData);

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

projectionDiv.addEventListener('touchstart', handleTouchStart, false);
projectionDiv.addEventListener('touchmove', handleTouchMove, false);
projectionDiv.addEventListener('touchend', handleTouchEnd, false);

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
    
    if (visibleScreen == "right") {
        //this means right content is visible
        
        //add rightSwipeTranslate to the div for transition animation
        changingDiv.classList.add('rightSwipeTranslate');
        
        
        //move right content and replace with left content
        changingDiv.style.left = "0px";
        
        visibleScreen = "left";
        
        //right circle switch with left circle
        circle1.style.backgroundColor = "white";
        circle2.style.backgroundColor = "darkgray";    
        
        //remove transiton
        changingDiv.classList.remove('rightSwipeTranslate');

        
    } else {
        //bounce content to the right
    }
}

function leftSwipe(swipeLength){
    
    if (visibleScreen == "left") {
        //this means left content is visible
        
        //add rightSwipeTranslate to the div for transition animation
        changingDiv.classList.add('leftSwipeTranslate');
        
        //move left content and replace with 
        changingDiv.style.left = "-100%";

        visibleScreen = "right";
        //left circle switch with right circle        
        
        circle1.style.backgroundColor = "darkgray";
        circle2.style.backgroundColor = "white";

        //remove transiton
        changingDiv.classList.remove('leftSwipeTranslate');

        
    } else {
        //bounce content to the left
    }
}

/*  This block of code contains the code for the Finite State Machine. This FSM controls AR Projections 


var startState;
var currentState = ARProjectionFSM[startState];

var ARProjectionFSM = {
    
    'visible': {
        'touchstart':{
            
            actions: [{func: function(){
                console.log("Div has been pressed");
            }}],
            
            endState: 'touched'
        }, 
    },
            
    'touched': {
        'touchmove': {
            
            'swipedRight': {
            
                predicate: {
                    //is finger moving to the right?
                },
            
                actions: [{func: rightSwipe}],
            
                endState: 'visible'
        
            },
            
            'swipedLeft': {
                
                predicate: {
                //is finger moving to the left?
                },
            
                actions: [{func: leftSwipe}],
            
                endState: 'visible'
            
            }
        }  
    
    }
             
};


/*

make changing div 200% the container div, put both inside.
change its position as finger moves




*/
