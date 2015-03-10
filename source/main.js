/*jslint browser: true*/
define(['lodash', 'velocity'], function (_, Velocity) {
    'use strict';

    return {
        configure : configure,
        start : start,

        private : {
            config : {
                container : null,
                focusedSelector : '.focused',
                throttle : 200,
                moveFocusEvent : 'focus-gained',
                animate : true
            }
        },
        windowDimensions : {
            top : null,
            bottom : null,
            height : null,
            width : null,
            left : null,
            right : null
        }
    };

    function configure(options) {
        _.merge(this.private.config, options);

        return this;
    }

    function start() {
        if(!this.private.config.container) {
            console.log('You initialized scrollToFocused with no container.');
        }
        if(!this.private.config.container.nodeName) {
            this.private.config.container = document.querySelector(this.private.config.container);
        }

        this.private.windowDimensions = this.private.config.container.getBoundingClientRect();

        _startWatchingContainerForScrollEvents.call(this);
    }

    function _startWatchingContainerForScrollEvents() {
        this.private.config.container.addEventListener('focus-gained', _.throttle(_scrollToFocusedElement.bind(this), this.private.config.throttle));
    }

    function _scrollToFocusedElement() {
        var focusedElement = this.private.config.container.querySelector(this.private.config.focusedSelector),
            focusedElementsBoundingRect = focusedElement.getBoundingClientRect();

        if(focusedElementsBoundingRect.left < this.private.windowDimensions.left) { // focus is off the left side of window
            if(this.private.config.animate) {
                Velocity(focusedElement, 'scroll', {
                    container : this.private.config.container,
                    axis : 'x',
                    offset : focusedElementsBoundingRect.width / 2 * -1
                });
            } else {
                this.private.config.container.scrollLeft = this.private.config.container.scrollLeft - Math.abs(this.private.windowDimensions.left - focusedElementsBoundingRect.left) - focusedElementsBoundingRect.width / 2;
            }
        }
        if(focusedElementsBoundingRect.right > this.private.windowDimensions.right) { // focus is off the right side of window
            if(this.private.config.animate) {
                Velocity(focusedElement, 'scroll', {
                    container : this.private.config.container,
                    axis : 'x',
                    offset : (this.private.windowDimensions.width - focusedElementsBoundingRect.width * 1.5) * -1
                });
            } else {
                this.private.config.container.scrollLeft = this.private.config.container.scrollLeft + Math.abs(this.private.windowDimensions.width - focusedElementsBoundingRect.right) + focusedElementsBoundingRect.width / 2;
            }
        }
    }

});
