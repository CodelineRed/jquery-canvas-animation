(function($) {
    $.fn.canvasAnimation = function(config) {
        var thisCanvas = this;

        var config = $.extend({
            steps : [],
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
        }, config );

        var callCallback = function(callback) {
            // if callback is defined
            if (callback) {
                callback();
            }
        };
        
        var enterFullscreen = function(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
        };
        
        var exitFullscreen = function() {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        };
        
        var play = function() {
            var timeout = config.timeout;
            reset();
            
            // if has class done
            if (thisCanvas.hasClass(config.class_done)) {
                thisCanvas.removeClass(config.class_done);
                timeout += config.reset_duration;
            }
            
            thisCanvas.removeClass(config.class_wait);
            callCallback(config.callback_play);
            
            // play animation
            $.each(config.steps, function(key, value) {
                setTimeout(function() {
                    thisCanvas.addClass(value.addClass);
                    thisCanvas.removeClass(value.removeClass);
                }, timeout);
                timeout += value.duration;

                // if is last step
                if (config.steps.length - 1 === key) {
                    setTimeout(function() {
                        thisCanvas.addClass(config.class_done);
                        callCallback(config.callback_done);
                    }, timeout);
                }
            });
        };
        
        var reset = function() {
            // reset classes
            $.each(config.steps, function(key, value) {
                thisCanvas.removeClass(value.addClass);
            });
        };
        
        // if is autoplay
        if (config.autoplay) {
            play();
        } else {
            thisCanvas.addClass(config.class_wait);
            callCallback(config.callback_wait);
        }

        // click on canvas
        thisCanvas.click(function() {
            if (thisCanvas.hasClass(config.class_done) || thisCanvas.hasClass(config.class_wait)) {
                play();
            }
        });
        
        // click on play
        thisCanvas.next(config.controls_wrapper).find(config.play_button).click(function() {
            if (thisCanvas.hasClass(config.class_done) || thisCanvas.hasClass(config.class_wait)) {
                play();
            }
        });
        
        // click on reset
        thisCanvas.next(config.controls_wrapper).find(config.reset_button).click(function() {
            if (thisCanvas.hasClass(config.class_done)) {
                reset();
                thisCanvas.addClass(config.class_wait);
                thisCanvas.removeClass(config.class_done);
                callCallback(config.callback_wait);
            }
        });

        // click on fullscreen
        thisCanvas.next(config.controls_wrapper).find(config.fullscreen_button).click(function() {
            enterFullscreen(thisCanvas[0]);
        });
    };
})(jQuery);