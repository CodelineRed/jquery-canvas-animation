# Upgrade from 1.0 to 2.0

## HTML/CSS Ratios
old
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

new
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

## Canvas Animation Config

| Old                             | New                               |
| ------------------------------- | --------------------------------- |
| infinity: true                  | infinite: true                    |
| fontawesomeVersion: null        | faVersion: null                   |
| controlsWrapper: '.controls'    | controlsWrapper: '.jca-controls'  |
| backwardButton: '.backward'     | backwardButton: '.jca-backward'   |
| playButton: '.play'             | playButton: '.jca-play'           |
| pauseButton: '.pause'           | pauseButton: 'jca-.pause'         |
| resetButton: '.reset'           | resetButton: '.jca-reset'         |
| forwardButton: '.forward'       | forwardButton: '.jca-forward'     |
| fullscreenButton: '.fullscreen' | expandButton: '.jca-expand'       |
| classDone: 'done'               | classDone: 'jca-done'             |
| classWait: 'wait'               | classWait: 'jca-wait'             |
| classForward: 'forward'         | classForward: 'jca-forward'       |
| classBackward: 'backward'       | classBackward: 'jca-backward'     |
| classWrap: 'canvas-animation'   | classWrap: 'jca-canvas-animation' |

old
```js
{
    controlsTemplate:
        '<div class="controls">' +
            '<div class="backward #BACKWARD#"></div>' +
            '<div class="play #PLAY#"></div>' +
            '<div class="pause #PAUSE#"></div>' +
            '<div class="reset #RESET#"></div>' +
            '<div class="forward #FORWARD#"></div>' +
            '<div class="fullscreen #FULLSCREEN#"></div>' +
        '</div>'
}
```

new
```js
{
    controlsTemplate:
        '<div class="jca-controls">' +
            '<div class="jca-backward"></div>' +
            '<div class="jca-play"></div>' +
            '<div class="jca-pause"></div>' +
            '<div class="jca-reset"></div>' +
            '<div class="jca-forward"></div>' +
            '<div class="jca-expand"></div>' +
            '<div class="jca-edit"></div>' +
        '</div>'
}
```