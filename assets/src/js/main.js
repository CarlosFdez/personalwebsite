"use strict";

/**
 * Written by Carlos Fernandez.
 * I could have made it even simpler if I used libraries but then it would have taken longer to load.
 */

// A function that scrolls to a given Y coordinate gradually.
// I could possibly make this generic but most other animations should be CSS instead so I won't bother for now.
var scrollInfo = null;
function animatedScrollTo(scrollToY, animationTimeSeconds) {
    // Cancel the previous scrolling operation if we need to start a new one
    if (scrollInfo && scrollInfo._interval && !scrollInfo.complete) {
        scrollInfo.complete = true;
        window.clearInterval(scrollInfo._interval);
    }

    // Calculate how long the wait interval is for the given FPS
    var frameRate = 60;
    var frameTimeMs = 1000.0 / frameRate;

    // Replace scrollInfo with a new object that represents the current scroll operation
    scrollInfo = {};
    scrollInfo.scrollTo = scrollToY;
    scrollInfo.lastPosition = window.scrollY; // store last position to handle subpixels
    scrollInfo.scrollDifference = scrollInfo.scrollTo - window.scrollY; 
    scrollInfo.scrollPixelsPerSecond = scrollInfo.scrollDifference / animationTimeSeconds;
    scrollInfo.complete = false;
    scrollInfo.tick = function(elapsedTimeMs) {
        if (this.complete) return;

        var amountToMove = (this.scrollPixelsPerSecond / 1000.0) * elapsedTimeMs;
        var newPosition = this.lastPosition + amountToMove;

        // clip animation (avoid overshooting). If increasing we use min, if decreasing we use max.
        var clipFunction = (amountToMove > 0) ? Math.min : Math.max;
        newPosition = clipFunction(newPosition, this.scrollTo);

        window.scrollTo(window.scrollX, newPosition);
        this.lastPosition = newPosition;

        // check if we're done. If we are, complete it
        if (newPosition == this.scrollTo) {
            this.complete = true;
        }
    }

    // create a closure so we always refer to this scrollInfo one until we rewrite it
    var localScrollInfo = scrollInfo; 
    localScrollInfo._interval = window.setInterval(function() {
        localScrollInfo.tick(frameTimeMs);

        if (localScrollInfo.complete) {
            window.clearInterval(localScrollInfo._interval);
            return;
        }
    }, frameTimeMs);
}

// attach an event to anything that performs a scroll
var elementsThatCauseScroll = document.getElementsByClassName("performScroll");
for (var i = 0; i < elementsThatCauseScroll.length; i++) {
    var element = elementsThatCauseScroll[i];
    element.addEventListener("click", function(evt) {
        // TODO: check element to calculate position. Right now the only existing one is to 0 so we hardcode 0.
        var position = 0;
        var duration = 0.1;
        animatedScrollTo(position, duration);

        evt.preventDefault();
    })
}
