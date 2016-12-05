/*
Page View constructor
*/
function View(params) {
    this.parent = null;
    
    this.image = params.image;
    this.track = params.track;
    this.playState = params.playState;
    this.isVisible = params.visibility;
      
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
                bar1.style.backgroundColor = "white";          
                bar2.style.backgroundColor = "#FFD259";
                bar3.style.backgroundColor = "#FFD259";
                bar4.style.backgroundColor = "#FFD259";
                break;
            case 1:
                changingDiv.style.left = "-100%";
                bar1.style.backgroundColor = "#FFD259";
                bar2.style.backgroundColor = "white";
                bar3.style.backgroundColor = "#FFD259";
                bar4.style.backgroundColor = "#FFD259";
                break;
            case 2:
                changingDiv.style.left = "-200%";
                bar1.style.backgroundColor = "#FFD259";  
                bar2.style.backgroundColor = "#FFD259";
                bar3.style.backgroundColor = "white";
                bar4.style.backgroundColor = "#FFD259";
                break;
            case 3:
                changingDiv.style.left = "-300%";
                bar1.style.backgroundColor = "#FFD259";  
                bar2.style.backgroundColor = "#FFD259";
                bar3.style.backgroundColor = "#FFD259";
                bar4.style.backgroundColor = "white";
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

View.prototype.updatePauseState = function() {
    this.playState = "paused";
    this.image.style.opacity = ".50";
}

View.prototype.updatePlayState = function() {
    this.playState = "playing";
    this.image.style.opacity = "1";
}

View.prototype.handleAudio = function() {
    //handles audio from swipe to swipe
    if (this.track == null) {
        console.log("This element has no audio file");   
    }else if(this.playState == "paused") {
        //play track
        this.track.play();
        this.updatePlayState();
        //change button state
    } else {
        console.log("pause track");
        this.track.pause();
        this.updatePauseState();
        //change button state
    }
}
