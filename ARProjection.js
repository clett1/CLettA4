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

ARProjection.prototype.addView = function(view) {
    this.views.push(view);
    view.parent = this;
}

ARProjection.prototype.handleTouchStart = function(event) {
    
    if(event.targetTouches.length == 1){
        //trigger swipe event
        this.startX = event.touches[0].clientX;
        
    } else if (event.targetTouches.length == 2) {
        //trigger audio
        console.log("play/pause track");
        if(this.currentView == null){
            //no current view do nothing
        } else {
            //there is a current view
            if(this.currentView.track == null){
                //there is no track for this view. do nothing
            } else {
                this.currentView.handleAudio();
            }
        }   
    }
}

ARProjection.prototype.handleTouchMove = function(event) {
    
    if(event.targetTouches.length == 1){
        //trigger target touches
        this.movingX = event.touches[0].clientX;

    } else if(event.targetTouches == 2){
        //may skip audio
    }
    
    //makeTransition
}

ARProjection.prototype.handleTouchEnd = function(event) {
    
    this.endX = this.movingX;
    this.xDifference = this.endX - this.startX;
    
    
    if(this.xDifference > 20) {
        //right swipe
        this.swipedRight(this.xDifference);
        
    } else if(this.xDifference < -20){
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
/*
ARProjection.addView(view) {
    this.views.push(view);    
    this.numViews++;
    
    if(numViews == 1){
        this.currentView = view;
    }
}*/

ARProjection.prototype.swipedRight = function() {
        
    var currentScreen = this.currentView;
    
    console.log("currentScreen "+ this.currentView);
    var viewPos = this.views.indexOf(this.currentView);
    
    console.log("view positon " + viewPos);
    if(currentScreen == this.views[0]) {
        //nothing can happen
    } else {
        //switch current views
        viewPos--;
        newPos = viewPos;
        this.currentView = this.views[newPos];
        
        console.log("new position "+ newPos);
        
        changingDiv.classList.add('rightSwipeTranslate');
        
        switch(newPos) {
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
            default:
                console.log("No change");
        }
        
        //remove transiton
        changingDiv.classList.remove('rightSwipeTranslate');      
    }
 
   
}

ARProjection.prototype.swipedLeft = function() {
        
    var currentScreen = this.currentView;
    var viewPos = this.views.indexOf(currentScreen);
    console.log("view position "+ viewPos);
    if(currentScreen == this.views[3]) {
        //nothing can happen
    } else {
        //switch current views
        viewPos++;
        var newPos = viewPos;
        this.currentView = this.views[newPos];
        
        changingDiv.classList.add('leftSwipeTranslate');
        console.log("new position "+newPos);
        switch(newPos) {
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
        
        //remove transiton
        changingDiv.classList.remove('leftSwipeTranslate');      
    }
}

ARProjection.prototype.makeTransition = function() {
    //
}


