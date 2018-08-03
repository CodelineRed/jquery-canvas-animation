(function($) {
    $.fn.canvasAnimationEditor = function(config) {
        var thisCanvas = this;
        $('*', thisCanvas).click(function() {
            thisCanvas.hide();
            $('*', thisCanvas).removeClass('jca-active-element');
            $('[name="jca_top"]').val(parseFloat($(this).css('top')));
            $('[name="jca_left"]').val(parseFloat($(this).css('left')));
            $('[name="jca_width"]').val(parseFloat($(this).css('width')));
            $('[name="jca_height"]').val(parseFloat($(this).css('height')));
            $(this).addClass('jca-active-element');
            thisCanvas.show();
        });
    };
})(jQuery);
(function($) {
    $.fn.canvasAnimation = function(config) {
        var thisCanvas = this;

        var config = $.extend({
            steps: [],
            timeout: 0, // 0 = starts immediately the first step (milliseconds)
            resetDuration: 500, // time it takes to reset all animations (milliseconds)
            infinity: true, // if true: plays animation infinity
            autoplay: true, // if true: plays animation instantly
            controls: true, // if true: adds controls to canvas
            editor: true, // if true: show editor on page
            fontawesomeVersion: null, // fontawesome version (4 or 5)
            controlsWrapper: '.jca-controls', // class of the controls wrapper
            backwardButton: '.jca-backward', // class of step backward button
            playButton: '.jca-play', // class of play button
            pauseButton: '.jca-pause', // class of pause button
            resetButton: '.jca-reset', // class of reset button
            forwardButton: '.jca-forward', // class of step forward button
            expandButton: '.jca-expand', // class of expand button
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
                '</div>',
            onPlay: null, // called before first animation step
            onDone: null, // called after last animation step
            onWait: null  // called if classWait was added
        }, config );
        var infinity = config.infinity;
        var animationTimeouts = [];
        var currentAnimationStep = -1;
        var lastStepTimeout;
        var controlsTemplate = $(config.controlsTemplate);
        
        thisCanvas.wrap('<div class="' + config.classWrap + '"></div>');
        
        switch (parseInt(config.fontawesomeVersion)) {
            case 4:
            case 5:
                // if is fontawesome version 4 or 5
                var ns = 'fa';
                
                if (parseInt(config.fontawesomeVersion) === 5) {
                    ns = 'fas';
                }
                
                $('html').addClass('jca-fontawesome');
                controlsTemplate.find(config.backwardButton).append('<i class="' + ns + ' fa-step-backward"></i>');
                controlsTemplate.find(config.playButton).append('<i class="' + ns + ' fa-play"></i>');
                controlsTemplate.find(config.pauseButton).append('<i class="' + ns + ' fa-pause"></i>');
                controlsTemplate.find(config.resetButton).append('<i class="' + ns + ' fa-stop"></i>');
                controlsTemplate.find(config.forwardButton).append('<i class="' + ns + ' fa-step-forward"></i>');
                controlsTemplate.find(config.expandButton).append('<i class="' + ns + ' fa-expand"></i>');
                break;
                
            default:
                break;
        }
        
        // if controls enabled
        if (config.controls) {
            thisCanvas.closest('.' + config.classWrap).append(controlsTemplate.clone());
        }
        
        // if editor enabled
        if (config.editor) {
            thisCanvas.canvasAnimationEditor();
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
            
            if (thisCanvas.hasClass(config.classDone)) {
                reset();
            }
            
            if (thisCanvas.hasClass(config.forwardButton.substring(1))) {
                currentAnimationStep--;
            }
            
            // if has class done
            if (thisCanvas.hasClass(config.classDone)) {
                thisCanvas.removeClass(config.classDone);
                timeout += config.resetDuration;
            }
            
            thisCanvas.removeClass(config.classWait);
            callCallback(config.onPlay);
            
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
                thisCanvas.addClass(config.classDone);
                if (!thisCanvas.hasClass(config.classWait)) {
                    if (config.infinity) {
                        play();
                    } else {
                        callCallback(config.onDone);
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
                
                thisCanvas.addClass(config.classWait);
                callCallback(config.onWait);
                
                if (typeof lastStepTimeout !== 'undefined') {
                    clearTimeout(lastStepTimeout);
                }
            }
        };
        
        // if is autoplay
        if (config.autoplay) {
            play();
        } else {
            thisCanvas.addClass(config.classWait);
            callCallback(config.onWait);
        }
        
        if (!config.editor) {
            // click on canvas
            thisCanvas.click(function() {
                config.infinity = infinity;

                if (thisCanvas.hasClass(config.classDone) || thisCanvas.hasClass(config.classWait)) {
                    play();
                }
            });
        }
        
        // click on step backward
        thisCanvas.next(config.controlsWrapper).find(config.backwardButton).click(function() {
            if (thisCanvas.hasClass(config.classDone) || thisCanvas.hasClass(config.classWait)) {
                if (thisCanvas.hasClass(config.classForward)) {
                    currentAnimationStep--;
                }
                
                thisCanvas.removeClass(config.classForward);
                thisCanvas.addClass(config.classBackward);
                
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
        thisCanvas.next(config.controlsWrapper).find(config.playButton).click(function() {
            config.infinity = infinity;
            
            if (thisCanvas.hasClass(config.classDone) || thisCanvas.hasClass(config.classWait)) {
                play();
            }
        });
        
        // click on pause
        thisCanvas.next(config.controlsWrapper).find(config.pauseButton).click(function() {
            config.infinity = false;
            stop(false);
        });
        
        // click on reset
        thisCanvas.next(config.controlsWrapper).find(config.resetButton).click(function() {
            config.infinity = false;
            stop(true);
            reset();
            thisCanvas.removeClass(config.classDone);
            thisCanvas.addClass(config.classWait);
            callCallback(config.onWait);
        });
        
        // click on step forward
        thisCanvas.next(config.controlsWrapper).find(config.forwardButton).click(function() {
            if (thisCanvas.hasClass(config.classDone) || thisCanvas.hasClass(config.classWait)) {
                if (thisCanvas.hasClass(config.classBackward)) {
                    currentAnimationStep++;
                }
                
                thisCanvas.addClass(config.classForward);
                thisCanvas.removeClass(config.classBackward);
                
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
        thisCanvas.next(config.controlsWrapper).find(config.expandButton).click(function() {
//            enterFullscreen(document.documentElement);
            enterFullscreen(thisCanvas[0]);
//            enterFullscreen(thisCanvas.closest('.' + config.classWrap)[0]);
        });
    };
})(jQuery);