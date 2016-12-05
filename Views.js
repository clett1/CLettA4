/*
Page View constructor
*/
function View(params) {
    this.parent = null;
    
    this.image = params.image;
    this.track = params.track;
    this.playState = params.playState;
    this.isVisible = params.visibility;
    this.controlButton = params.controlButton;
    
    //add event listener to image
    if(this.image != null) {
        this.image.addEventListener("touchstart", this.handleDoubleTouch.bind(this));
    
    }
};

View.prototype.handleDoubleTouch = function(event) {
    if(targetTouches.length == 2) {
        if(this.playState == "paused") {
            this.track.pause();
        
        } else {
            this.track.play();
        }
    
    }
}

/*
Methods for View
*/

View.prototype.setFSM = function(startState, fsm) { 
    this.states = fsm;
    this.currentState = fsm[startState];
}

View.prototype.transitionAnimation = function(newPosition, swipeValue) {
    //handle transition animation
    
    if(swipeValue == "right") {                      
        changingDiv.classList.add('rightSwipeTranslate');   
    } else {
        changingDiv.classList.add('leftSwipeTranslate');
    }
        
        switch(newPosition) {
            case 0:
                changingDiv.style.left = "0px";
                circle1.style.backgroundColor = "white";          
                circle2.style.backgroundColor = "darkgray";
                circle3.style.backgroundColor = "darkgray";
                circle4.style.backgroundColor = "darkgray";
                break;
            case 1:
                changingDiv.style.left = "-100%";
                circle1.style.backgroundColor = "darkgray";
                circle2.style.backgroundColor = "white";
                circle3.style.backgroundColor = "darkgray";
                circle4.style.backgroundColor = "darkgray";
                break;
            case 2:
                changingDiv.style.left = "-200%";
                circle1.style.backgroundColor = "darkgray";  
                circle2.style.backgroundColor = "darkgray";
                circle3.style.backgroundColor = "white";
                circle4.style.backgroundColor = "darkgray";
                break;
            case 3:
                changingDiv.style.left = "-300%";
                circle1.style.backgroundColor = "darkgray";  
                circle2.style.backgroundColor = "darkgray";
                circle3.style.backgroundColor = "darkgray";
                circle4.style.backgroundColor = "white";
                break;
            default:
                console.log("No change");
        }
    
    if(swipeValue == "right") {                      
        changingDiv.classList.remove('rightSwipeTranslate');   
    } else {
        changingDiv.classList.remove('leftSwipeTranslate');
    }
          
}

View.prototype.controlButtonPress = function(event) {
    //handles audio when control button is pressed
    console.log(this);
    console.log(this.isVisible);
    console.log("Button pressed");
    if(this.isVisble == "true") {
        console.log("this button can be pressed");
        this.handleAudio();
    }
}

View.prototype.makeTransition = function() {
    //handle transition 
}

View.prototype.handleAudio = function() {
    //handles audio from swipe to swipe
    if (this.track == null) {
        console.log("This element has no audio file");   
    }else if(this.playState == "paused") {
        //play track
        console.log("play track");
        this.track.play();
        console.log(this.track);
        this.playState = "playing";
        //change button state
    } else {
        console.log("pause track");
        this.track.pause();
        console.log(this.track);
        this.playState = "paused";
        //change button state
    }
}
