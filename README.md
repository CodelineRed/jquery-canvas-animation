# jQuery Plugin - Canvas Animation

[**Demo page**](http://ca.insanitymeetshh.net)

## Available at [NPM](https://www.npmjs.com/package/jquery-canvas-animation)

```bash
$ npm i jquery-canvas-animation
```

## What's new in version 2

### Editor
With JCA 2 comes a new written editor to your application.
To enable this feature you have to `editor: {enable: true}` in your canvas configuration and add `jquery.canvas-animation-editor.js` or replace `jquery.canvas-animation.js` with `jquery.canvas-animation.bundle.js` in your application.

### Draggable Items (Editor)
Draggable items is by default enabled. It works only with Editor and [jQuery UI Draggable](https://jqueryui.com/draggable/).

### Icon Framework
It is now possible to use every icon framework like [Fontawesome 5](https://fontawesome.com) for example.

### CSS Namespace
All html classes and ids starts with `jca-`.

### Bundle JS
The new file called `jquery.canvas-animation.bundle.js` includes `jquery.canvas-animation.min.js` and `jquery.canvas-animation-editor.min.js`

### SCSS and LESS variables
Now you can configure your css output in [SCSS](https://github.com/InsanityMeetsHH/jquery-canvas-animation/blob/master/src/scss/_variables.scss) and [LESS](https://github.com/InsanityMeetsHH/jquery-canvas-animation/blob/master/src/less/_variables.less).

## Documentation

HTML/CSS Ratios
The Canvas have to be an id attribute.
```html
<div id="canvas" class="jca-ratio-21by9">
    <!-- ... -->
</div>

<div id="canvas" class="jca-ratio-16by9">
    <!-- ... -->
</div>

<div id="canvas" class="jca-ratio-4by3">
    <!-- ... -->
</div>

<div id="canvas" class="jca-ratio-2by1">
    <!-- ... -->
</div>

<div id="canvas" class="jca-ratio-1by1">
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
    infinite: true, // if true: plays animation infinite
    autoplay: true, // if true: plays animation instantly
    controls: true, // if true: adds controls to canvas
    editor: {
        enable: false, // if true: show editor on page
        wrapper: '.jca-editor-layer' // editor wrapper class
    },
    useIcons: false, // use icons from an icon framework instead css icons
    icons: {
        backward: '<i class="fas fa-step-backward"></i>',
        play: '<i class="fas fa-play"></i>',
        pause: '<i class="fas fa-pause"></i>',
        stop: '<i class="fas fa-stop"></i>',
        forward: '<i class="fas fa-step-forward"></i>',
        expand: '<i class="fas fa-expand"></i>',
        editor: '<i class="fas fa-edit"></i>'
    },
    controlsWrapper: '.jca-controls', // class of the controls wrapper
    backwardButton: '.jca-backward', // class of step backward button
    playButton: '.jca-play', // class of play button
    pauseButton: '.jca-pause', // class of pause button
    stopButton: '.jca-stop', // class of reset button
    forwardButton: '.jca-forward', // class of step forward button
    expandButton: '.jca-expand', // class of expand button
    editorButton: '.jca-editor', // class of edit button
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
            '<div class="jca-stop"></div>' +
            '<div class="jca-forward"></div>' +
            '<div class="jca-expand"></div>' +
            '<div class="jca-editor"></div>' +
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
        newItem: 'New: ',
        newItemBlank: 'Blank',
        newItemExt: 'Extended',
        select: 'Select: ',
        selectCss: 'CSS',
        selectHtml: 'HTML',
        remove: 'Remove: ',
        removeItem: 'Item',
        removeStyle: 'Style',
        className: 'CSS class name',
        parentWidth: 'Parent width in px',
        parentHeight: 'Parent height in px',
        itemWidth: 'Item width in px',
        itemHeight: 'Item height in px',
        itemTop: 'Item offset top in px',
        itemLeft: 'Item offset left in px',
        confirmAppendPrepend: 'OK = append item / Cancel = prepend item',
        confirmRemoveItem: 'Are you sure to remove item?',
        confirmRemoveStyle: 'Are you sure to remove style?',
        alertCanvasId: 'Canvas needs attribute "id".'
    },
    template: '<div class="jca-editor-layer">' +
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
                '<span class="jca-new"></span><input type="button" name="jca_new_item" value=""/> <input type="button" name="jca_new_item_ext" value=""/><br/>' +
                '<span class="jca-select"></span><input type="button" name="jca_html" value=""/> <input type="button" name="jca_css" value=""/><br/>' +
                '<span class="jca-remove"></span><input type="button" name="jca_remove_item" value=""/> <input type="button" name="jca_remove_style" value=""/><br/>' +
            '</div>' +
        '</div>' +
    '</div>'
});
```

## Examples
* [HTML](https://github.com/InsanityMeetsHH/jquery-canvas-animation/blob/master/example/index.html)
* [CSS Canvas](https://github.com/InsanityMeetsHH/jquery-canvas-animation/blob/master/example/css/canvas.css)
* [CSS Animation](https://github.com/InsanityMeetsHH/jquery-canvas-animation/blob/master/example/css/animation.css)
* [JavaScript](https://github.com/InsanityMeetsHH/jquery-canvas-animation/blob/master/example/js/scripts.js)

**This software is in development. Could have bugs.**
