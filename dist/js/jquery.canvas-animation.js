(function($) {
    $.fn.canvasAnimation = function(config) {
        var thisCanvas = this;

        var config = $.extend({
            steps: [],
            timeout: 0, // 0 = starts immediately the first step (milliseconds)
            reset_duration: 500, // time it takes to reset all animations (milliseconds)
            infinity: true, // if true: plays animation infinity
            autoplay: true, // if true: plays animation instantly
            controls: true, // if true: adds controls to canvas
            controls_fa: null, // fontawesome version (4 or 5)
            controls_wrapper: '.controls', // class of the controls wrapper
            step_backward_button: '.step-backward', // class of step backward button
            play_button: '.play', // class of play button
            pause_button: '.pause', // class of pause button
            reset_button: '.reset', // class of reset button
            step_forward_button: '.step-forward', // class of step forward button
            fullscreen_button: '.fullscreen', // class of fullscreen button
            class_done: 'done', // is set if the animation is done
            class_wait: 'wait', // is set if autoplay : false and animation is never played or user clicked on reset button
            class_forward: 'forward', // is set if user clicked step-forward
            class_backward: 'backward', // is set if user clicked step-backward
            class_wrap: 'canvas-animation',
            controls_template:
                '<div class="controls">' +
                    '<div class="step-backward #STEPBACKWARD#"></div>' +
                    '<div class="play #PLAY#"></div>' +
                    '<div class="pause #PAUSE#"></div>' +
                    '<div class="reset #RESET#"></div>' +
                    '<div class="step-forward #STEPFORWARD#"></div>' +
                    '<div class="fullscreen #FULLSCREEN#"></div>' +
                '</div>',
            callback_play: null, // called before first animation step
            callback_done: null, // called after last animation step
            callback_wait: null  // called if class_wait was added
        }, config );
        var infinity = config.infinity;
        var animationTimeouts = [];
        var currentAnimationStep = -1;
        var lastStepTimeout;
        
        thisCanvas.wrap('<div class="' + config.class_wrap + '"></div>');
        
        switch (parseInt(config.controls_fa)) {
            case 4:
            case 5:
                // if is fontawesome version 4 or 5
                var ns = 'fa';
                
                if (parseInt(config.controls_fa) === 5) {
                    ns = 'fas';
                }
                
                config.controls_template = config.controls_template.replace('#STEPBACKWARD#', ns + ' fa-step-backward');
                config.controls_template = config.controls_template.replace('#PLAY#', ns + ' fa-play');
                config.controls_template = config.controls_template.replace('#PAUSE#', ns + ' fa-pause');
                config.controls_template = config.controls_template.replace('#RESET#', ns + ' fa-stop');
                config.controls_template = config.controls_template.replace('#STEPFORWARD#', ns + ' fa-step-forward');
                config.controls_template = config.controls_template.replace('#FULLSCREEN#', ns + ' fa-expand');
                break;
                
            default:
                config.controls_template = config.controls_template.replace('#STEPBACKWARD#', '');
                config.controls_template = config.controls_template.replace('#PLAY#', '');
                config.controls_template = config.controls_template.replace('#PAUSE#', '');
                config.controls_template = config.controls_template.replace('#RESET#', '');
                config.controls_template = config.controls_template.replace('#STEPFORWARD#', '');
                config.controls_template = config.controls_template.replace('#FULLSCREEN#', '');
        }
        
        // if controls enabled
        if (config.controls) {
            thisCanvas.closest('.' + config.class_wrap).append(config.controls_template);
        }
        
        /**
         * @returns {void}
         */
        var callCallback = function(callback) {
            // if callback is defined
            if (callback) {
                callback();
            }
        };
        
        /**
         * @returns {void}
         */
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
        
        /**
         * @returns {void}
         */
        var exitFullscreen = function() {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        };
        
        /**
         * @returns {void}
         */
        var play = function() {
            var timeout = config.timeout;
            animationTimeouts = [];
            
            if (thisCanvas.hasClass(config.class_done)) {
                reset();
            }
            
            if (thisCanvas.hasClass('forward')) {
                currentAnimationStep--;
            }
            
            // if has class done
            if (thisCanvas.hasClass(config.class_done)) {
                thisCanvas.removeClass(config.class_done);
                timeout += config.reset_duration;
            }
            
            thisCanvas.removeClass(config.class_wait);
            callCallback(config.callback_play);
            
            // play animation
            $.each(config.steps, function(key, value) {
                if (currentAnimationStep < key) {
                    var animationTimeout = setTimeout(function() {
                        currentAnimationStep = key;
                        thisCanvas.addClass(value.addClass);
                        thisCanvas.removeClass(value.removeClass);
                        
                        if (typeof value.pause === 'boolean' && value.pause === true) {
                            config.infinity = false;
                            stop(false);
                        }

                        // if is last step
                        if (config.steps.length - 1 === key) {
                            lastStep(value.duration);
                        }
                    }, timeout);
                    
                    if (typeof value.duration !== 'number') {
                        value.duration = 500;
                    }
                    
                    timeout += value.duration;
                    animationTimeouts.push(animationTimeout);
                }
            });
        };
        
        /**
         * @param {int} duration
         * @returns {void}
         */
        var lastStep = function(duration) {
            lastStepTimeout = setTimeout(function() {
                thisCanvas.addClass(config.class_done);
                if (!thisCanvas.hasClass(config.class_wait)) {
                    if (config.infinity) {
                        play();
                    } else {
                        callCallback(config.callback_done);
                    }
                }
            }, duration);
        };
        
        /**
         * @returns {void}
         */
        var reset = function() {
            // reset classes
            $.each(config.steps, function(key, value) {
                thisCanvas.removeClass(value.addClass);
            });
            currentAnimationStep = -1;
        };
        
        /**
         * @param {bool} callReset
         * @returns {void}
         */
        var stop = function(callReset) {
            // if animationSteps is not empty
            if (animationTimeouts.length > 0) {
                $.each(animationTimeouts, function(key, value) {
                    clearTimeout(animationTimeouts[key]);
                });
                
                if (callReset) {
                    reset();
                }
                
                thisCanvas.addClass(config.class_wait);
                callCallback(config.callback_wait);
                
                if (typeof lastStepTimeout !== 'undefined') {
                    clearTimeout(lastStepTimeout);
                }
            }
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
        
        // click on step backward
        thisCanvas.next(config.controls_wrapper).find(config.step_backward_button).click(function() {
            if (thisCanvas.hasClass(config.class_done) || thisCanvas.hasClass(config.class_wait)) {
                if (thisCanvas.hasClass(config.class_forward)) {
                    currentAnimationStep--;
                }
                
                thisCanvas.removeClass(config.class_forward);
                thisCanvas.addClass(config.class_backward);
                
                // if step not exist
                if (currentAnimationStep < 0) {
                    currentAnimationStep = config.steps.length;
                }
                
                // if is last step
                if (currentAnimationStep === config.steps.length) {
                    $.each(config.steps, function(key, value) {
                        thisCanvas.addClass(value.addClass);
                        thisCanvas.removeClass(value.removeClass);
                    });
                } else {
                    thisCanvas.removeClass(config.steps[currentAnimationStep].addClass);
                    thisCanvas.addClass(config.steps[currentAnimationStep].removeClass);
                }
                
                currentAnimationStep--;
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
            stop(false);
        });
        
        // click on reset
        thisCanvas.next(config.controls_wrapper).find(config.reset_button).click(function() {
            config.infinity = false;
            stop(true);
            reset();
            thisCanvas.removeClass(config.class_done);
            thisCanvas.addClass(config.class_wait);
            callCallback(config.callback_wait);
        });
        
        // click on step forward
        thisCanvas.next(config.controls_wrapper).find(config.step_forward_button).click(function() {
            if (thisCanvas.hasClass(config.class_done) || thisCanvas.hasClass(config.class_wait)) {
                if (thisCanvas.hasClass(config.class_backward)) {
                    currentAnimationStep++;
                }
                
                thisCanvas.addClass(config.class_forward);
                thisCanvas.removeClass(config.class_backward);
                
                // if step not exists
                if (currentAnimationStep > config.steps.length || currentAnimationStep === -1) {
                    currentAnimationStep = 0;
                }
                
                // if is last step
                if (currentAnimationStep === config.steps.length) {
                    reset();
                } else {
                    thisCanvas.addClass(config.steps[currentAnimationStep].addClass);
                    thisCanvas.removeClass(config.steps[currentAnimationStep].removeClass);
                }
                
                currentAnimationStep++;
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