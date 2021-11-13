(function($) {
    $.fn.canvasAnimation = function(config) {
        if (this.attr('id') === 'undefined') {
            alert('Canvas must have attribute "id".');
            return;
        }
        var thisCanvas = this;
        var animationTimeouts = [];
        var currentAnimationStep = -1;
        var lastStepTimeout;
        var config = $.extend(true, {}, {
            steps: [],
            timeout: 0, // 0 = starts immediately the first step (milliseconds)
            resetDuration: 500, // time it takes to reset all animations (milliseconds)
            infinite: true, // if true: plays animation infinite
            autoplay: true, // if true: plays animation instantly
            controls: true, // if true: adds controls to canvas
            canvasClick: true, // if true: animation starts by clicking on canvas
            editor: {
                enable: false, // if true: show editor on page
                wrapper: '.jca-editor-container' // editor wrapper class
            },
            useIcons: false, // use icons from an icon framework instead of css icons
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
            gotoButton: '.jca-goto', // class of goto button / add data-step="step-name"
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
        }, config );
        var infinite = config.infinite;
        var controlsTemplate = $(config.controlsTemplate);
        config.editor.enable = config.editor.enable && typeof $.fn.canvasAnimationEditor === 'function';
        
        thisCanvas.wrap('<div class="' + config.classWrap + '"></div>');
        
        if (config.useIcons) {
            $('html').addClass('jca-icons');
            controlsTemplate.find(config.backwardButton).append(config.icons.backward);
            controlsTemplate.find(config.playButton).append(config.icons.play);
            controlsTemplate.find(config.pauseButton).append(config.icons.pause);
            controlsTemplate.find(config.stopButton).append(config.icons.stop);
            controlsTemplate.find(config.forwardButton).append(config.icons.forward);
            controlsTemplate.find(config.expandButton).append(config.icons.expand);
            controlsTemplate.find(config.editorButton).append(config.icons.editor);
        }
        
        // if controls enabled
        if (config.controls) {
            // if editor is disabled
            if (!config.editor.enable) {
                controlsTemplate.find(config.editorButton).remove();
            }
            thisCanvas.closest('.' + config.classWrap).append(controlsTemplate.clone());
        }
        
        /**
         * @returns {undefined}
         */
        var callCallback = function(callback) {
            // if callback is defined
            if (callback) {
                callback();
            }
        };
        
        /**
         * @returns {undefined}
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
         * @returns {undefined}
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
         * @returns {undefined}
         */
        var play = function() {
            var timeout = config.timeout;
            animationTimeouts = [];
            
            if (thisCanvas.hasClass(config.classDone)) {
                reset();
            }
            
            if (thisCanvas.hasClass(config.classForward)) {
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
                            config.infinite = false;
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
         * @returns {undefined}
         */
        var lastStep = function(duration) {
            lastStepTimeout = setTimeout(function() {
                thisCanvas.addClass(config.classDone);
                if (!thisCanvas.hasClass(config.classWait)) {
                    if (config.infinite) {
                        play();
                    } else {
                        callCallback(config.onDone);
                    }
                }
            }, duration);
        };
        
        /**
         * @returns {undefined}
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
         * @returns {undefined}
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
        
        if (!config.editor.enable && config.canvasClick) {
            // click on canvas
            thisCanvas.click(function() {
                config.infinite = infinite;

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
            config.infinite = infinite;
            
            if (thisCanvas.hasClass(config.classDone) || thisCanvas.hasClass(config.classWait)) {
                play();
            }
        });
        
        // click on pause
        thisCanvas.next(config.controlsWrapper).find(config.pauseButton).click(function() {
            config.infinite = false;
            stop(false);
        });
        
        // click on reset
        thisCanvas.next(config.controlsWrapper).find(config.stopButton).click(function() {
            config.infinite = false;
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
        
        // if editor enabled
        if (config.editor.enable) {
            thisCanvas.canvasAnimationEditor(config.editor);
            
            // toggle edit bar
            thisCanvas.next(config.controlsWrapper).find(config.editorButton).click(function() {
                if ($(config.editor.wrapper).is(':visible')) {
                    $(config.editor.wrapper).hide();
                } else {
                    $(config.editor.wrapper).show();
                }
            });
        }
        
        // click on goto step
        thisCanvas.find(config.gotoButton).click(function() {
            if (thisCanvas.hasClass(config.classDone) || thisCanvas.hasClass(config.classWait)) {
                let thisGoto = this;
                $.each(config.steps, function(key, value) {
                    if (typeof value.name === 'string' && value.name === $(thisGoto).data('step')) {
                        thisCanvas.addClass(value.addClass);
                        thisCanvas.removeClass(value.removeClass);
                        return false;
                    }
                });
            }
        });
    };
})(jQuery);