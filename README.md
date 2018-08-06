# jQuery Plugin - Canvas Animation

[**Demo page**](http://ca.insanitymeetshh.net)

## Available at [NPM](https://www.npmjs.com/package/jquery-canvas-animation)

```bash
$ npm i jquery-canvas-animation
```

## Documentation

HTML/CSS Ratios
The Canvas have to be an id attribute.
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

JavaScript ([jquery.canvas-animation.js](https://github.com/InsanityMeetsHH/jquery-canvas-animation/blob/master/src/js/jquery.canvas-animation.js))
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
    editorConfig: {
        enable : false // if true: show editor on page
    },
    fontawesomeVersion: null, // fontawesome version (4 or 5)
    controlsWrapper: '.jca-controls', // class of the controls wrapper
    backwardButton: '.jca-backward', // class of step backward button
    playButton: '.jca-play', // class of play button
    pauseButton: '.jca-pause', // class of pause button
    resetButton: '.jca-reset', // class of reset button
    forwardButton: '.jca-forward', // class of step forward button
    expandButton: '.jca-expand', // class of expand button
    editButton: '.jca-edit', // class of edit button
    classDone: 'jca-done', // is set if the animation is done
    classWait: 'jca-wait', // is set if autoplay : false and animation is never played or user clicked on reset button
    classForward: 'jca-forward', // is set if user clicked forward
    classBackward: 'jca-backward', // is set if user clicked backward
    classWrap: 'jca-wrap',
    controlsTemplate:
        '<div class="jca-controls">' +
            '<div class="jca-backward"></div>' +
            '<div class="jca-play"></div>' +
            '<div class="jca-pause"></div>' +
            '<div class="jca-reset"></div>' +
            '<div class="jca-forward"></div>' +
            '<div class="jca-expand"></div>' +
            '<div class="jca-edit"></div>' +
        '</div>',
    onPlay: null, // called before first animation step
    onDone: null, // called after last animation step
    onWait: null  // called if classWait was added
});
```

JavaScript ([jquery.canvas-animation-editor.js](https://github.com/InsanityMeetsHH/jquery-canvas-animation/blob/master/src/js/jquery.canvas-animation-editor.js))
```js
$('#canvas').canvasAnimationEditor({
    enable: false, // if true: show editor on page
    decimal: 2, // accuracy of numbers
    draggableItems: true, // jQuery UI Draggable is required for this feature
    labels: {
        top: 'top',
        left: 'left',
        width: 'width',
        height: 'height',
        newItemBlank: 'New Item (Blank)',
        newItemExt: 'New Item (Extended)',
        selectCss: 'Select CSS',
        selectHtml: 'Select HTML',
        removeItem: 'Remove Item',
        className: 'CSS class name',
        parentWidth: 'Parent width in px',
        parentHeight: 'Parent height in px',
        itemWidth: 'Item width in px',
        itemHeight: 'Item height in px',
        itemTop: 'Item offset top in px',
        itemLeft: 'Item offset left in px',
        confirmAppendPrepend: 'OK = append item / Cancel = prepend item'
    },
    template: '<div class="jca-editor">' +
        '<div class="jca-container">' +
            '<div class="jca-col jca-cord-dimension">' +
                '<div class="jca-box">' +
                    '<div class="jca-label jca-top"></div>' +
                    '<div class="jca-label jca-left"></div>' +
                    '<div class="jca-label jca-width"></div>' +
                    '<div class="jca-label jca-height"></div>' +
                    '<input type="number" step="0.01" name="jca_top" />' +
                    '<input type="number" step="0.01" name="jca_left" />' +
                    '<input type="number" step="0.01" name="jca_width" />' +
                    '<input type="number" step="0.01" name="jca_height" />' +
                '</div>' +
            '</div>' +
            '<div class="jca-col jca-selector-breadcrumb"></div>' +
            '<div class="jca-col">' +
                '<div id="jca-html"></div>' +
                '<div id="jca-css"></div>' +
            '</div>' +
            '<div class="jca-col">' +
                '<input type="button" name="jca_new_item" value=""/> <input type="button" name="jca_new_item_ext" value=""/><br/>' +
                '<input type="button" name="jca_html" value=""/> <input type="button" name="jca_css" value="Select CSS"/><br/>' +
                '<br/>' +
                '<input type="button" name="jca_remove_item" value=""/><br/>' +
            '</div>' +
        '</div>' +
    '</div>'
});
```

## Upcoming Features
* Processing of config.decimal
* Draggable Items

**This software is in development. Could have bugs.**
