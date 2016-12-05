function ARProjection(projectionDiv) {
    
    this.numViews = 0;
    this.currentView = null;
    this.views = [];
    this.startX = null;
    this.movingX = null;
    this.endX = null;
    this.xDifference = null;
    this.swipeDirection = null;
    
    projectionDiv.addEventListener('touchstart', this.handleTouchStart.bind(this));
    
    projectionDiv.addEventListener('touchmove', this.handleTouchMove.bind(this));
    
    projectionDiv.addEventListener('touchend', this.handleTouchEnd.bind(this));
    

}

ARProjection.prototype.addView = function(view) {
    this.views.push(view);
    view.parent = this;
}

ARProjection.prototype.handleTouchStart = function(event) {
    
    if(event.targetTouches.length == 1){
        //trigger swipe event
        this.startX = event.touches[0].clientX;
        
    } else if (event.targetTouches.length == 2) {
        //Potentially add two-finger swipe event to skip through music  
    }
}

ARProjection.prototype.handleTouchMove = function(event) {
    
    if(event.targetTouches.length == 1){
        //trigger target touches
        this.movingX = event.touches[0].clientX;

    } else if(event.targetTouches == 2){
        //Potentially add two-finger swipe event to skip through music  
    }
    
    //makeTransition
}

ARProjection.prototype.handleTouchEnd = function(event) {
    
    this.endX = this.movingX;
    this.xDifference = this.endX - this.startX;
    
    
    if(this.xDifference > 60) {
        //right swipe
        this.swipedRight(this.xDifference);
        
    } else if(this.xDifference < -60){
        //left swipe
        this.swipedLeft(this.xDifference);
        
    } else {
        //xDifference = 0
    }
}

ARProjection.prototype.setFSM = function(startState, fsm) {
    this.states = fsm;
    this.currentState = fsm[startState];
}

ARProjection.prototype.swipedRight = function() {
    
    this.swipeDirection = "right"; 
    
    //current view position
    var viewPos = this.views.indexOf(this.currentView);
        
    if(currentScreen == this.views[0]) {
        //nothing can happen
    } else {
        //switch current views
        viewPos--;
        newPos = viewPos;
        this.currentView = this.views[newPos];
        this.currentView.transitionAnimation(newPos, swipeDirection);    
    }
}

ARProjection.prototype.swipedLeft = function() {
    
    this.swipeDirection = "left";
    
    //current view position
    var viewPos = this.views.indexOf(this.currentView);
    
    if(currentScreen == this.views[3]) {
        //nothing can happen
    } else {
        //switch current views
        viewPos++;
        var newPos = viewPos;
        this.currentView = this.views[newPos];
        this.currentView.transitionAnimation(newPos, swipeDirection);     
    }
}

ARProjection.prototype.makeTransition = function() {
    //
}
