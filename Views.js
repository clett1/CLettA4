/*
Page View constructor
*/
function View(params) {
    this.parent = null;
    
    this.image = params.image;
    this.track = params.track;
    this.playState = params.playState;
    this.isVisible = params.visibility;
    
    //add event listener to image
    if(this.image != null) {
        this.image.addEventListener("touchstart", this.handleAudio.bind(this));
    
    }
};


/*
Methods for View
*/


View.prototype.transitionAnimation = function(newPosition, direction) {
    //handle transition animation
    
    if(direction == "right") {                      
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
    
    if(direction == "left") {                      
        changingDiv.classList.remove('rightSwipeTranslate');   
    } else {
        changingDiv.classList.remove('leftSwipeTranslate');
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
        this.track.play();
        this.playState = "playing";
        //change button state
    } else {
        console.log("pause track");
        this.track.pause();
        this.playState = "paused";
        //change button state
    }
}
