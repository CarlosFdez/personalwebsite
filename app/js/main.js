/**
 * Written by Carlos Fernandez for use for simple website.
 * I could have made it even simpler if I used libraries but then it would have taken longer to load ohwell.
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
// a scrolling tag to them
function testHeaderScrolling() {
    var elements = document.getElementsByTagName("header");

    for (var i in elements) {
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


// remove loading from body at the very end of everything.
// idea from https://css-tricks.com/transitions-only-after-page-load/
removeClass(document.body, "loading");
