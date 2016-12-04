function ARProjection(projectionDiv) {
    
    this.numViews = 0;
    this.currentView = null;
    this.views = [];
    this.startX = null;
    this.movingX = null;
    this.endX = null;
    this.xDifference = null;
    
    projectionDiv.addEventListener('touchstart', this.handleTouchStart.bind(this));
    
    projectionDiv.addEventListener('touchmove', this.handleTouchMove.bind(this));
    
    projectionDiv.addEventListener('touchend', this.handleTouchEnd.bind(this));
    

}

ARProjection.prototype.handleTouchStart = function(event) {
    
    this.startX = event.touches[0].clientX;
    
    //makeTransition(event.type);
}

ARProjection.prototype.handleTouchMove = function(event) {
    
    this.movingX = event.touches[0].clientX;
    
    //makeTransition
}

ARProjection.prototype.handleTouchEnd = function(event) {
    
    this.endX = this.movingX;
    this.xDifference = this.endX - this.startX;
    
    
    if(this.xDifference > 20) {
        //right swipe
        this.rightSwipe(this.xDifference);
        
    } else if(this.xDifference < -20){
        //left swipe
        this.leftSwipe(this.xDifference);
        
    } else {
        //xDifference = 0
    }
}

ARProjection.prototype.setFSM = function(startState, fsm) {
    this.states = fsm;
    this.currentState = fsm[startState];
}
/*
ARProjection.addView(view) {
    this.views.push(view);    
    this.numViews++;
    
    if(numViews == 1){
        this.currentView = view;
    }
}*/

ARProjection.prototype.swipedRight = function() {
        
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

ARProjection.prototype.swipedLeft = function() {
        
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

ARProjection.prototype.makeTransition = function() {
    //
}

/*
function View(params){
    this.image = params.image;
    this.track = params.track;
    this.playState = params.playState;
}*/
