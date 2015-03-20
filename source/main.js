/*jslint browser: true*/
define(['lodash', 'velocity'], function (_, Velocity) {
    'use strict';

    return {
        configure : configure,
        start : start,

        internal : {
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
        _.merge(this.internal.config, options);

        return this;
    }

    function start() {
        if(!this.internal.config.container) {
            console.log('You initialized scrollToFocused with no container.');
        }
        if(!this.internal.config.container.nodeName) {
            this.internal.config.container = document.querySelector(this.internal.config.container);
        }

        this.internal.windowDimensions = this.internal.config.container.getBoundingClientRect();

        _startWatchingContainerForScrollEvents.call(this);
    }

    function _startWatchingContainerForScrollEvents() {
        this.internal.config.container.addEventListener('focus-gained', _.throttle(_scrollToFocusedElement.bind(this), this.internal.config.throttle));
    }

    function _scrollToFocusedElement() {
        var focusedElement = this.internal.config.container.querySelector(this.internal.config.focusedSelector),
            focusedElementsBoundingRect = focusedElement.getBoundingClientRect();

        if(focusedElementsBoundingRect.left < this.internal.windowDimensions.left) { // focus is off the left side of window
            if(this.internal.config.animate) {
                Velocity(focusedElement, 'scroll', {
                    container : this.internal.config.container,
                    axis : 'x',
                    offset : focusedElementsBoundingRect.width / 2 * -1
                });
            } else {
                this.internal.config.container.scrollLeft = this.internal.config.container.scrollLeft - Math.abs(this.internal.windowDimensions.left - focusedElementsBoundingRect.left) - focusedElementsBoundingRect.width / 2;
            }
        }
        if(focusedElementsBoundingRect.right > this.internal.windowDimensions.right) { // focus is off the right side of window
            if(this.internal.config.animate) {
                Velocity(focusedElement, 'scroll', {
                    container : this.internal.config.container,
                    axis : 'x',
                    offset : (this.internal.windowDimensions.width - focusedElementsBoundingRect.width * 1.5) * -1
                });
            } else {
                this.internal.config.container.scrollLeft = this.internal.config.container.scrollLeft + Math.abs(this.internal.windowDimensions.width - focusedElementsBoundingRect.right) + focusedElementsBoundingRect.width / 2;
            }
        }
    }

});
