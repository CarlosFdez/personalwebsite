"use strict";

/**
 * Written by Carlos Fernandez.
 * I could have made it even simpler if I used libraries but then it would have taken longer to load.
 */

// adds a class to an element if the element does not have the class
function addClass(element, className) {
    if ((element.className || "").indexOf(className) == -1) {
        element.className = ((element.className || "") + " " + className).trim();
    }
}

// removes a class to an element if the element has the class
function removeClass(element, className) {
    if ((element.className || "").indexOf(className) > -1) {
        element.className = (element.className || "").replace(className, "").trim();
    }
}

// Detect if the page has scrolled past any <header> elements and attach
// a "scrolling" class to the header if it has
function testHeaderScrolling() {
    var elements = document.getElementsByTagName("header");

    for (var i = 0; i < elements.length; i++) {
        var header = elements[i];
        var bottomEdge = header.offsetTop + header.offsetHeight;
        if (window.scrollY >= bottomEdge) {
            addClass(header, "scrolling");
        } else {
            removeClass(header, "scrolling");
        }
    }
}

// test for header scrolling on load and on scroll event
testHeaderScrolling();
window.addEventListener('scroll', function(e) {
    testHeaderScrolling();
});

// A function that scrolls to a given Y coordinate gradually.
// I could possibly make this generic but most animations should be CSS so I won't bother for now.
var scrollInfo = null;
function animatedScrollTo(scrollToY, animationTimeSeconds) {
    if (scrollInfo && scrollInfo._interval && !scrollInfo._complete) {
        scrollInfo._complete = true;
        window.clearInterval(scrollInfo._interval);
    }

    scrollInfo = {};
    scrollInfo.scrollTo = scrollToY;
    scrollInfo.lastPosition = window.scrollY; // store last position to handle subpixels
    scrollInfo.scrollDifference = scrollToY - window.scrollY;
    scrollInfo.scrollPixelsPerSecond = scrollInfo.scrollDifference / animationTimeSeconds;
    scrollInfo._complete = false;

    var _that = scrollInfo; // create a closure so we refer to this one until we rewrite it
    var waitTimeMs = 10;
    scrollInfo._interval = window.setInterval(function() {
        // this shouldn't happen but just in case
        if (_that._complete) {
            window.clearInterval(_that._interval);
            return;
        }

        // if the user manually scrolls, we need to manually correct lastPosition.
        // lastPosition exists to handle subpixels normally
        if (Math.abs(_that.lastPosition - window.scrollY) > 1) {
            _that.lastPosition = window.scrollY;
        }

        var amountToMove = _that.scrollPixelsPerSecond / 1000.0 * waitTimeMs;
        var newPosition = _that.lastPosition + amountToMove;

        // avoid overshoot
        if (amountToMove > 0) {
            // we're moving down, so don't go below (greater than) newPosition
            newPosition = Math.min(newPosition, scrollToY);
        } else {
            // we're moving up, so don't go above (less than) newPosition
            newPosition = Math.max(newPosition, scrollToY);
        }

        window.scrollTo(window.scrollX, newPosition);
        _that.lastPosition = newPosition;

        // check if we're done. If we are, complete it
        if (newPosition == scrollToY) {
            window.clearInterval(_that._interval);
            _that._complete = true;
        }
    }, waitTimeMs);
}

// attach an event to anything that performs a scroll
var elementsThatCauseScroll = document.getElementsByClassName("performScroll");
for (var i = 0; i < elementsThatCauseScroll.length; i++) {
    var element = elementsThatCauseScroll[i];
    element.addEventListener("click", function(evt) {
        // can't use the same element as outside
        var element = evt.currentTarget;

        // TODO: implement dynamic scrollTo. Right now the only existing one is to 0 so we do 0.
        animatedScrollTo(0, 0.1);

        evt.preventDefault();
    })
}

// remove "loading" from body at the very end of everything."
// idea from https://css-tricks.com/transitions-only-after-page-load/
window.setTimeout(function() {
    removeClass(document.body, "loading");
}, 0);
