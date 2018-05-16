# jQuery Plugin - Canvas Animation

[**Demo page**](http://ca.insanitymeetshh.net)

## Available at [NPM](https://www.npmjs.com/package/jquery-canvas-animation)

```bash
$ npm i jquery-canvas-animation
```

## Documentation

HTML/CSS Ratios
```html
<div id="canvas" class="canvas-ratio-21by9">
    <!-- ... -->
</div>

<div id="canvas" class="canvas-ratio-16by9">
    <!-- ... -->
</div>

<div id="canvas" class="canvas-ratio-4by3">
    <!-- ... -->
</div>

<div id="canvas" class="canvas-ratio-2by1">
    <!-- ... -->
</div>

<div id="canvas" class="canvas-ratio-1by1">
    <!-- ... -->
</div>
```

JavaScript
```js
$('#canvas').canvasAnimation({
    steps: [
        {
            addClass: '',    // adds one or more classes to #canvas ('foo bar' adds 2 classes)
            removeClass: '', // remove one or more classes from #canvas ('foo bar' removes 2 classes)
            duration: 500,   // duration of this step (milliseconds, default: 500)
            pause: false     // pause animation at this point (boolean, default: false)
        }
    ],
    timeout: 0, // 0 = starts immediately the first step (milliseconds)
    resetDuration: 500, // time it takes to reset all animations (milliseconds)
    infinity: true, // if true: plays animation infinity
    autoplay: true, // if true: plays animation instantly
    controls: true, // if true: adds controls to canvas
    fontawesomeVersion: null, // fontawesome version (4 or 5)
    controlsWrapper: '.controls', // class of the controls wrapper
    backwardButton: '.backward', // class of step backward button
    playButton: '.play', // class of play button
    pauseButton: '.pause', // class of pause button
    resetButton: '.reset', // class of reset button
    forwardButton: '.forward', // class of step forward button
    fullscreenButton: '.fullscreen', // class of fullscreen button
    classDone: 'done', // is set if the animation is done
    classWait: 'wait', // is set if autoplay : false and animation is never played or user clicked on reset button
    classForward: 'forward', // is set if user clicked forward
    classBackward: 'backward', // is set if user clicked backward
    classWrap: 'canvas-animation',
    controlsTemplate:
        '<div class="controls">' +
            '<div class="backward #BACKWARD#"></div>' +
            '<div class="play #PLAY#"></div>' +
            '<div class="pause #PAUSE#"></div>' +
            '<div class="reset #RESET#"></div>' +
            '<div class="forward #FORWARD#"></div>' +
            '<div class="fullscreen #FULLSCREEN#"></div>' +
        '</div>',
    onPlay: null, // called before first animation step
    onDone: null, // called after last animation step
    onWait: null  // called if classWait was added
});
```

## Upcoming Features
* Web editor

**This software is in development. Could have bugs.**
