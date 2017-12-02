var frameRate = 60;
var frameTimeMs = 1000.0 / frameRate;

class ScrollAnimator {
    complete = false;
    _interval = null;

    lastPosition : number;
    scrollPixelsPerSecond : number;

    constructor(public scrollTo : number, durationSeconds : number) {
        this.lastPosition = this.scrollY;

        let scrollDifference = scrollTo - this.lastPosition; 
        this.scrollPixelsPerSecond = scrollDifference / durationSeconds;
    }

    start() {
        if (this.complete) return;

        this._interval = window.setInterval(() => {
            if (!this.complete) {
                this.tick(frameTimeMs);
            }
        }, frameTimeMs);
    }

    stop() {
        if (this._interval && !this.complete) {
            this.complete = true;
            this._interval = null;
            window.clearInterval(this._interval);
        }
    }

    get scrollX() {
        return (typeof window.scrollX === "undefined") ? 
            window.pageXOffset : window.scrollX;
    }

    get scrollY() {
        return (typeof window.scrollY === "undefined") ? 
            window.pageYOffset : window.scrollY;
    }

    private tick(elapsedTimeMs) {
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
}

let currentAnimation : ScrollAnimator;

/**
 * A function that scrolls to a given Y coordinate gradually.
 */ 
export function animatedScrollTo(scrollToY : number, animationTimeSeconds : number) {
    // Cancel the previous scrolling operation if we need to start a new one
    if (currentAnimation) {
        currentAnimation.stop();
    }

    currentAnimation = new ScrollAnimator(scrollToY, animationTimeSeconds);
    currentAnimation.start();
}
