(function($) {
    $.fn.canvasAnimation = function(config) {
        var thisCanvas = this;

        var config = $.extend({
            steps : [],
            timeout: 0, // 0 = starts immediately the first step (milliseconds)
            reset_duration: 500, // time it takes to reset all animations (milliseconds)
            infinity: true, // if true: plays animation infinity
            autoplay: true, // if true: plays animation instantly
            controls: true, // if true: adds controls to canvas
            controls_fa: null, // fontawesome version (4 or 5)
            controls_wrapper: '.controls', // class of the controls wrapper
            play_button: '.play', // class of play button
            pause_button: '.pause', // class of pause button
            reset_button: '.reset', // class of reset button
            fullscreen_button: '.fullscreen', // class of fullscreen button
            class_done: 'done', // is set if the animation is done
            class_wait: 'wait', // is set if autoplay : false and animation is never played or user clicked on reset button
            class_wrap: 'canvas-animation',
            controls_template:
                '<div class="controls">' +
                    '<div class="play #PLAY#"></div>' +
                    '<div class="pause #PAUSE#"></div>' +
                    '<div class="reset #RESET#"></div>' +
                    '<div class="fullscreen #FULLSCREEN#"></div>' +
                '</div>',
            callback_play: null, // called before first animation step
            callback_done: null, // called after last animation step
            callback_wait: null  // called if class_wait was added
        }, config );
        var infinity = config.infinity;
        
        thisCanvas.wrap('<div class="' + config.class_wrap + '"></div>');
        
        switch (parseInt(config.controls_fa)) {
            case 4:
            case 5:
                // if is fontawesome version 4 or 5
                var ns = 'fa';
                
                if (parseInt(config.controls_fa) === 5) {
                    ns = 'fas';
                }
                
                config.controls_template = config.controls_template.replace('#PLAY#', ns + ' fa-play');
                config.controls_template = config.controls_template.replace('#PAUSE#', ns + ' fa-pause');
                config.controls_template = config.controls_template.replace('#RESET#', ns + ' fa-stop');
                config.controls_template = config.controls_template.replace('#FULLSCREEN#', ns + ' fa-expand');
                break;
                
            default:
                config.controls_template = config.controls_template.replace('#PLAY#', '');
                config.controls_template = config.controls_template.replace('#PAUSE#', '');
                config.controls_template = config.controls_template.replace('#RESET#', '');
                config.controls_template = config.controls_template.replace('#FULLSCREEN#', '');
        }
        
        // if controls enabled
        if (config.controls) {
            thisCanvas.closest('.' + config.class_wrap).append(config.controls_template);
        }

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
                        if (config.infinity) {
                            play();
                        } else {
                            callCallback(config.callback_done);
                        }
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
            config.infinity = infinity;
            
            if (thisCanvas.hasClass(config.class_done) || thisCanvas.hasClass(config.class_wait)) {
                play();
            }
        });
        
        // click on play
        thisCanvas.next(config.controls_wrapper).find(config.play_button).click(function() {
            config.infinity = infinity;
            
            if (thisCanvas.hasClass(config.class_done) || thisCanvas.hasClass(config.class_wait)) {
                play();
            }
        });
        
        // click on pause
        thisCanvas.next(config.controls_wrapper).find(config.pause_button).click(function() {
            config.infinity = false;
        });
        
        // click on reset
        thisCanvas.next(config.controls_wrapper).find(config.reset_button).click(function() {
            config.infinity = false;
            
            if (thisCanvas.hasClass(config.class_done)) {
                reset();
                thisCanvas.addClass(config.class_wait);
                thisCanvas.removeClass(config.class_done);
                callCallback(config.callback_wait);
            }
        });

        // click on fullscreen
        thisCanvas.next(config.controls_wrapper).find(config.fullscreen_button).click(function() {
//            enterFullscreen(document.documentElement);
            enterFullscreen(thisCanvas[0]);
//            enterFullscreen(thisCanvas.closest('.' + config.class_wrap)[0]);
        });
    };
})(jQuery);