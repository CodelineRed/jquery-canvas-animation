# jQuery Plugin - Canvas Animation

[**Demo page**](http://ca.insanitymeetshh.net)

## Documentation

```js
$('#canvas').canvasAnimation({
    steps : [
        // example steps
        {
            addClass : 'ca-1',
            duration : 800
        },
        {
            addClass : 'ca-2',
            duration : 800
        },
        {
            addClass : 'ca-3',
            duration : 800
        },
        {
            addClass : 'ca-4',
            duration : 500
        }
    ],
    timeout: 0, // 0 = starts immediately the first step (milliseconds)
    reset_duration: 500, // time it takes to reset all animations (milliseconds)
    autoplay : true,
    controls_wrapper: '.controls', // class of the controls wrapper
    play_button: '.play', // class of play button
    reset_button: '.reset', // class of reset button
    fullscreen_button: '.fullscreen', // class of fullscreen button
    class_done : 'done', // is set if the animation is done
    class_wait : 'wait', // is set if autoplay : false and animation is never played or user clicked on reset button
    callback_play: null, // called before first animation step
    callback_done: null, // called after last animation step
    callback_wait: null  // called if class_wait was added
});
```
