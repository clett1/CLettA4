function ARProjection(leftArrow, rightArrow) {
    
    this.numViews = 0;
    this.currentView = null;
    this.views = [];
    this.startX = null;
    this.movingX = null;
    this.endX = null;
    this.xDifference = null;
    this.moveDirection = null;
    
    leftArrow.addEventListener('touchstart', this.leftArrowClicked.bind(this));
    
    rightArrow.addEventListener('touchstart', this.rightArrowClicked.bind(this));
}

ARProjection.prototype.addView = function(view) {
    this.views.push(view);
    view.parent = this;
}

ARProjection.prototype.rightArrowClicked = function(event) {
    
    this.moveDirection = "right"; 
    
    //current view position
    var viewPos = this.views.indexOf(this.currentView);
        
    if(this.currentView == this.views[3]) {
        //nothing can happen
    } else {
        //switch current views
        this.views[viewPos].isVisible = "false";
        
        if(this.views[viewPos].track != null) {
            this.views[viewPos].track.pause(); 
            this.views[viewPos].playState = "paused";
        }
        
        viewPos++;
        var newPos = viewPos;
        this.currentView = this.views[newPos];
        
        this.views[newPos].isVisible = "true";
        //must start initial play here because audio events in mobile need user click event to load
        this.views[newPos].track.play();
        this.views[newPos].playState = "playing";
        this.currentView.transitionAnimation(newPos, this.moveDirection);    
    }
}

ARProjection.prototype.leftArrowClicked = function(event) {
    
    this.moveDirection = "left";
    
    //current view position
    var viewPos = this.views.indexOf(this.currentView);
    
    if(this.currentView == this.views[0]) {
        //nothing can happen
    } else {
        //switch current views
        this.views[viewPos].isVisible = "false";
        
        if(this.views[viewPos].track != null) {
            this.views[viewPos].track.pause();   
        }
        
        viewPos--;
        var newPos = viewPos;
        this.currentView = this.views[newPos];        
        this.views[newPos].isVisible = "true";
        this.views[newPos].track.play();
        this.currentView.transitionAnimation(newPos, this.moveDirection);     
    }
}

