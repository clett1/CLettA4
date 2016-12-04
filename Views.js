/*
Page View constructor
*/
function View(params) {
    this.parent = null;
    
    this.image = params.image;
    this.track = params.track;
    this.playState = params.playState;
};

/*
Methods for View
*/

View.prototype.setFSM = function(startState, fsm) { 
    this.states = fsm;
    this.currentState = fsm[startState];
    
}

View.prototype.transitionAnimation = function() {
    //handle transition animation
}

View.prototype.makeTransition = function() {
    //handle transition 
}

View.prototype.handleAudio = function() {
    if(this.playState == "paused") {
        //play track
        this.track.play();
        this.playState = "playing";
    } else {
        this.track.pause();
        this.playState = "paused";
    }
}
