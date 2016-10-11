/*
 *
 * Wijmo Library 3.20162.103
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 * ----
 * Credits: Wijmo includes some MIT-licensed software, see copyright notices below.
 */
/// <reference path="../External/declarations/jquery.d.ts"/>
/// <reference path="../External/declarations/jquery.ui.d.ts"/>
/// <reference path="jquery.wijmo.wijutil.ts"/>
/*globals window*/
/*
* Wijmo Touch Utilities.
*
* Depends:
*	jquery.js
*
*/
jQuery.extend(jQuery.support, {
    isTouchEnabled: function () {
        if ($.browser.msie || navigator.userAgent.indexOf("Edge/") > 0) {
            return window.navigator.msMaxTouchPoints > 0 || window.navigator["maxTouchPoints"] > 0;
        } else {
            return "ontouchstart" in window || "ontouchend" in document;
        }
    }
});

/** Deprecated!!!
* @deprecated
*/
function wijmoApplyWijTouchUtilEvents($) {
    return $;
}

var wijmo;
(function (wijmo) {
    (function (_touch) {
        var $ = jQuery;

        var dataPropertyName = "virtualMouseBindings", touchTargetPropertyName = "virtualTouchID", virtualEventNames = "wijmouseover wijmousedown wijmousemove wijmouseup wijclick wijtap wijdoubletap wijtaphold wijmouseout wijmousecancel".split(" "), pointerEnabled = window.navigator["pointerEnabled"], isMsPointerEvent = (window.navigator.msPointerEnabled || pointerEnabled) && $.support.isTouchEnabled(), pointerOver = pointerEnabled ? "pointerover" : "MSPointerOver", pointerDown = pointerEnabled ? "pointerdown" : "MSPointerDown", pointerMove = pointerEnabled ? "pointermove" : "MSPointerMove", pointerUp = pointerEnabled ? "pointerup" : "MSPointerUp", pointerOut = pointerEnabled ? "pointerout" : "MSPointerOut", realEventNames = {
            "wijmouseover": (!isMsPointerEvent ? "mouseover" : pointerOver),
            "wijmousedown": (!isMsPointerEvent ? "mousedown" : pointerDown),
            "wijmousemove": (!isMsPointerEvent ? "mousemove" : pointerMove),
            "wijmouseup": (!isMsPointerEvent ? "mouseup" : pointerUp),
            "wijmouseout": (!isMsPointerEvent ? "mouseout" : pointerOut),
            "wijmousecancel": (!isMsPointerEvent ? "mousecancel" : "mousecancel"),
            "wijclick": (!isMsPointerEvent ? "click" : "MSGestureTap"),
            "wijdoubletap": (!isMsPointerEvent ? "dblclick" : "MSGestureDoubleTap"),
            "wijtaphold": (!isMsPointerEvent ? "gesturehold" : "MSGestureHold")
        }, touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" "), nativeEventProps = "clientX clientY pageX pageY screenX screenY".split(" "), mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [], mouseEventProps = $.event.props.concat(mouseHookProps), activeDocHandlers = {}, resetTimerID = 0, startX = 0, startY = 0, didScroll = false, clickBlockList = [], blockMouseTriggers = false, blockTouchTriggers = false, eventCaptureSupported = "addEventListener" in document, $document = $(document), nextTouchID = 1, lastTouchID = 0, touchStartEventM = (!isMsPointerEvent) ? "touchstart" : pointerDown, touchEndEventM = (!isMsPointerEvent) ? "touchend" : pointerUp, touchMoveEventM = (!isMsPointerEvent) ? "touchmove" : pointerMove, touchScrollEventM = "scroll";

        $.wijmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        };

        function getNativeEvent(event) {
            while (event && typeof event.originalEvent !== "undefined") {
                event = event.originalEvent;
            }
            return event;
        }

        function createVirtualEvent(event, eventType) {
            var t = event.type, oe, props, ne, prop, ct, touch, i, j, len;

            event = $.Event(event);
            event.nativeType = event.type;
            event.type = eventType;

            oe = event.originalEvent;
            props = $.event.props;

            // addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
            // https://github.com/jquery/jquery-mobile/issues/3280
            if (t.search(/^(mouse|click)/) > -1) {
                props = mouseEventProps;
            }

            // copy original event properties over to the new event
            // this would happen if we could call $.event.fix instead of $.Event
            // but we don't have a way to force an event to be fixed multiple times
            if (oe) {
                for (i = props.length, prop; i;) {
                    prop = props[--i];
                    event[prop] = oe[prop];
                }
            }

            // make sure that if the mouse and click virtual events are generated
            // without a .which one is defined
            if (t.search(/mouse(down|up)|click/) > -1 && !event.which) {
                event.which = 1;
            }

            ne = getNativeEvent(oe);

            for (j = 0, len = nativeEventProps.length; j < len; j++) {
                prop = nativeEventProps[j];
                if (event[prop] === undefined) {
                    event[prop] = ne[prop];
                }
            }

            if (t.search(/^touch/) !== -1) {
                t = ne.touches;
                ct = ne.changedTouches;
                touch = (t && t.length) ? t[0] : ((ct && ct.length) ? ct[0] : undefined);

                if (touch) {
                    for (j = 0, len = touchEventProps.length; j < len; j++) {
                        prop = touchEventProps[j];
                        event[prop] = touch[prop];
                    }
                }
            }

            return event;
        }

        function getVirtualBindingFlags(element) {
            var flags = {}, b, k;

            while (element) {
                b = $.data(element, dataPropertyName);

                for (k in b) {
                    if (b[k]) {
                        flags[k] = flags.hasVirtualBinding = true;
                    }
                }
                element = element.parentNode;
            }
            return flags;
        }

        function getClosestElementWithVirtualBinding(element, eventType) {
            var b;
            while (element) {
                b = $.data(element, dataPropertyName);

                if (b && (!eventType || b[eventType])) {
                    return element;
                }
                element = element.parentNode;
            }
            return null;
        }

        function enableTouchBindings() {
            blockTouchTriggers = false;
        }

        function disableTouchBindings() {
            blockTouchTriggers = true;
        }

        function enableMouseBindings() {
            lastTouchID = 0;
            clickBlockList.length = 0;
            blockMouseTriggers = false;

            // When mouse bindings are enabled, our
            // touch bindings are disabled.
            disableTouchBindings();
        }

        function disableMouseBindings() {
            // When mouse bindings are disabled, our
            // touch bindings are enabled.
            enableTouchBindings();
        }

        function startResetTimer() {
            clearResetTimer();
            resetTimerID = setTimeout(function () {
                resetTimerID = 0;
                enableMouseBindings();
            }, $.wijmouse.resetTimerDuration);
        }

        function clearResetTimer() {
            if (resetTimerID) {
                clearTimeout(resetTimerID);
                resetTimerID = 0;
            }
        }

        function triggerVirtualEvent(eventType, event, flags) {
            var ve;

            if ((flags && flags[eventType]) || (!flags && getClosestElementWithVirtualBinding(event.target, eventType))) {
                ve = createVirtualEvent(event, eventType);

                $(event.target).trigger(ve);
            }

            return ve;
        }

        function mouseEventCallback(event) {
            var touchID = $.data(event.target, touchTargetPropertyName), vEventName, k;
            if (!blockMouseTriggers && (!lastTouchID || lastTouchID !== touchID)) {
                vEventName = "wij" + event.type;
                for (k in realEventNames) {
                    if (realEventNames[k] === event.type) {
                        vEventName = k;
                    }
                }
                var ve = triggerVirtualEvent(vEventName, event);

                if (ve) {
                    if (ve.isDefaultPrevented()) {
                        event.preventDefault();
                    }
                    if (ve.isPropagationStopped()) {
                        event.stopPropagation();
                    }
                    if (ve.isImmediatePropagationStopped()) {
                        event.stopImmediatePropagation();
                    }
                }
            }
        }

        function handleTouchStart(event) {
            var touches = getNativeEvent(event).touches, target, flags, ne;

            if (touches && touches.length === 1 || isMsPointerEvent) {
                target = event.target;
                flags = getVirtualBindingFlags(target);
                if (flags.hasVirtualBinding) {
                    lastTouchID = nextTouchID++;
                    $.data(target, touchTargetPropertyName, lastTouchID);

                    clearResetTimer();
                    disableMouseBindings();
                    didScroll = false;
                    ne = getNativeEvent(event);
                    var t = ne.touches ? ne.touches[0] : ne;
                    startX = t.pageX;
                    startY = t.pageY;

                    triggerVirtualEvent("wijmouseover", event, flags);
                    triggerVirtualEvent("wijmousedown", event, flags);
                }
            }
        }

        function handleScroll(event) {
            if (blockTouchTriggers) {
                return;
            }

            if (!didScroll) {
                triggerVirtualEvent("wijmousecancel", event, getVirtualBindingFlags(event.target));
            }

            didScroll = true;
            startResetTimer();
        }

        function handleTouchMove(event) {
            if (blockTouchTriggers) {
                return;
            }

            var ne = getNativeEvent(event), t = ne.touches ? ne.touches[0] : ne, didCancel = didScroll, moveThreshold = $.wijmouse.moveDistanceThreshold;
            didScroll = didScroll || (Math.abs(t.pageX - startX) > moveThreshold || Math.abs(t.pageY - startY) > moveThreshold);
            var flags = getVirtualBindingFlags(event.target);

            if (didScroll && !didCancel) {
                triggerVirtualEvent("wijmousecancel", event, flags);
            }

            triggerVirtualEvent("wijmousemove", event, flags);
            startResetTimer();
        }

        function handleTouchEnd(event) {
            if (blockTouchTriggers) {
                return;
            }
            disableTouchBindings();

            var flags = getVirtualBindingFlags(event.target), ne, t;
            triggerVirtualEvent("wijmouseup", event, flags);
            if (!didScroll) {
                var ve = triggerVirtualEvent("wijclick", event, flags);
                if (ve && ve.isDefaultPrevented()) {
                    // The target of the mouse events that follow the touchend
                    // event don't necessarily match the target used during the
                    // touch. This means we need to rely on coordinates for blocking
                    // any click that is generated.
                    ne = getNativeEvent(event);
                    t = ne.changedTouches ? ne.changedTouches[0] : ne;
                    clickBlockList.push({
                        touchID: lastTouchID,
                        x: t.clientX,
                        y: t.clientY
                    });

                    // Prevent any mouse events that follow from triggering
                    // virtual event notifications.
                    blockMouseTriggers = true;
                }
            }
            triggerVirtualEvent("wijmouseout", event, flags);
            didScroll = false;

            startResetTimer();
        }

        function hasVirtualBindings(ele) {
            var bindings = $.data(ele, dataPropertyName), k;

            if (bindings) {
                for (k in bindings) {
                    if (bindings[k]) {
                        return true;
                    }
                }
            }
            return false;
        }

        function dummyMouseHandler() {
        }

        function getSpecialEventObject(eventType) {
            //var realType = eventType.substr(2); //qq
            var realType = realEventNames[eventType];
            return {
                setup: function (data, namespace) {
                    // If this is the first virtual mouse binding for this element,
                    // add a bindings object to its data.
                    if (!hasVirtualBindings(this)) {
                        $.data(this, dataPropertyName, {});
                    }

                    // If setup is called, we know it is the first binding for this
                    // eventType, so initialize the count for the eventType to zero.
                    var bindings = $.data(this, dataPropertyName);
                    bindings[eventType] = true;

                    // Some browsers, like Opera Mini, won't dispatch mouse/click events
                    // for elements unless they actually have handlers registered on them.
                    // To get around this, we register dummy handlers on the elements.
                    $(this).bind(realType, dummyMouseHandler);

                    var touchStartBound = false;

                    // For now, if event capture is not supported, we rely on mouse handlers.
                    if (eventCaptureSupported) {
                        // If this is the first virtual mouse binding for the document,
                        // register our touchstart handler on the document.
                        activeDocHandlers[touchStartEventM] = (activeDocHandlers[touchStartEventM] || 0) + 1;

                        if (activeDocHandlers[touchStartEventM] === 1) {
                            touchStartBound = true;
                            $document.bind(touchStartEventM, handleTouchStart).bind(touchEndEventM, handleTouchEnd).bind(touchMoveEventM, handleTouchMove).bind(touchScrollEventM, handleScroll);
                        }
                    }

                    if (!touchStartBound || touchStartEventM !== realType) {
                        // If this is the first virtual mouse event for this type,
                        // register a global handler on the document.
                        activeDocHandlers[eventType] = (activeDocHandlers[eventType] || 0) + 1;

                        if (activeDocHandlers[eventType] === 1) {
                            $document.bind(realType, mouseEventCallback);
                        }
                    }
                },
                teardown: function (data, namespace) {
                    // If this is the last virtual binding for this eventType,
                    // remove its global handler from the document.
                    --activeDocHandlers[eventType];

                    if (!activeDocHandlers[eventType]) {
                        $document.unbind(realType, mouseEventCallback);
                    }

                    if (eventCaptureSupported) {
                        // If this is the last virtual mouse binding in existence,
                        // remove our document touchstart listener.
                        --activeDocHandlers[touchStartEventM];

                        if (!activeDocHandlers[touchStartEventM]) {
                            $document.unbind(touchStartEventM, handleTouchStart).unbind(touchMoveEventM, handleTouchMove).unbind(touchEndEventM, handleTouchEnd).unbind(touchScrollEventM, handleScroll);
                        }
                    }

                    var $this = $(this), bindings = $.data(this, dataPropertyName);

                    // teardown may be called when an element was
                    // removed from the DOM. If this is the case,
                    // jQuery core may have already stripped the element
                    // of any data bindings so we need to check it before
                    // using it.
                    if (bindings) {
                        bindings[eventType] = false;
                    }

                    // Unregister the dummy event handler.
                    $this.unbind(realType, dummyMouseHandler);

                    // If this is the last virtual mouse binding on the
                    // element, remove the binding data from the element.
                    if (!hasVirtualBindings(this)) {
                        $this.removeData(dataPropertyName);
                    }
                }
            };
        }

        for (var i = 0; i < virtualEventNames.length; i++) {
            $.event.special[virtualEventNames[i]] = getSpecialEventObject(virtualEventNames[i]);
        }

        // Add a capture click handler to block clicks.
        // Note that we require event capture support for this so if the device
        // doesn't support it, we punt for now and rely solely on mouse events.
        if (eventCaptureSupported) {
            document.addEventListener("click", function (e) {
                var cnt = clickBlockList.length, target = e.target, x, y, ele, i, o, touchID;

                if (cnt) {
                    x = e.clientX;
                    y = e.clientY;
                    var threshold = $.wijmouse.clickDistanceThreshold;

                    // The idea here is to run through the clickBlockList to see if
                    // the current click event is in the proximity of one of our
                    // wijclick events that had preventDefault() called on it. If we find
                    // one, then we block the click.
                    //
                    // Why do we have to rely on proximity?
                    //
                    // Because the target of the touch event that triggered the wijclick
                    // can be different from the target of the click event synthesized
                    // by the browser. The target of a mouse/click event that is syntehsized
                    // from a touch event seems to be implementation specific. For example,
                    // some browsers will fire mouse/click events for a link that is near
                    // a touch event, even though the target of the touchstart/touchend event
                    // says the user touched outside the link. Also, it seems that with most
                    // browsers, the target of the mouse/click event is not calculated until the
                    // time it is dispatched, so if you replace an element that you touched
                    // with another element, the target of the mouse/click will be the new
                    // element underneath that point.
                    //
                    // Aside from proximity, we also check to see if the target and any
                    // of its ancestors were the ones that blocked a click. This is necessary
                    // because of the strange mouse/click target calculation done in the
                    // Android 2.1 browser, where if you click on an element, and there is a
                    // mouse/click handler on one of its ancestors, the target will be the
                    // innermost child of the touched element, even if that child is no where
                    // near the point of touch.
                    ele = target;

                    while (ele) {
                        for (i = 0; i < cnt; i++) {
                            o = clickBlockList[i];
                            touchID = 0;

                            if ((ele === target && Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold) || $.data(ele, touchTargetPropertyName) === o.touchID) {
                                // XXX: We may want to consider removing matches from the block list
                                //      instead of waiting for the reset timer to fire.
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                            }
                        }
                        ele = ele.parentNode;
                    }
                }
            }, true);
        }

        // add new event shortcuts
        $.each(("touchstart touchmove touchend orientationchange throttledresize " + "wijtap wijtaphold wijswipe wijswipeleft wijswiperight wijscrollstart wijscrollstop").split(" "), function (i, name) {
            $.fn[name] = function (fn) {
                return fn ? this.bind(name, fn) : this.trigger(name);
            };

            if ($.attrFn) {
                $.attrFn[name] = true;
            }
        });

        var supportTouch = ("ontouchend" in document), scrollEvent = "touchmove scroll", touchStartEvent = supportTouch ? "touchstart" : "mousedown", touchStopEvent = supportTouch ? "touchend" : "mouseup", touchMoveEvent = supportTouch ? "touchmove" : "mousemove", gesturestartEvent = supportTouch ? "gesturestart" : "gesturestart", gesturechangeEvent = supportTouch ? "gesturechange" : "gesturechange", gestureendEvent = supportTouch ? "gestureend" : "gestureend";
        if (isMsPointerEvent) {
            touchStartEvent = pointerDown;
            touchStopEvent = pointerUp;
            touchMoveEvent = pointerMove;
            gesturestartEvent = "MSGestureStart";
            gesturechangeEvent = "MSGestureChange";
            gestureendEvent = "MSGestureEnd";
        }

        function triggerCustomEvent(obj, eventType, event) {
            var originalType = event.type;
            event.nativeType = event.type;
            event.type = eventType;
            try  {
                $([obj]).trigger(event);
            } finally {
                event.type = originalType;
            }
        }

        // also handles scrollstop
        $.event.special.wijscrollstart = {
            enabled: true,
            setup: function () {
                var thisObject = this, $this = $(thisObject), scrolling, timer;

                function trigger(event, state) {
                    scrolling = state;
                    triggerCustomEvent(thisObject, scrolling ? "wijscrollstart" : "wijscrollstop", event);
                }

                // iPhone triggers scroll after a small delay; use touchmove instead
                $this.bind(scrollEvent, function (event) {
                    if (!$.event.special.wijscrollstart.enabled) {
                        return;
                    }

                    if (!scrolling) {
                        trigger(event, true);
                    }

                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        trigger(event, false);
                    }, 50);
                });
            }
        };

        // also handles taphold
        $.event.special.wijtap = {
            setup: function () {
                var thisObject = this, $this = $(thisObject);

                $this.bind("wijmousedown", function (event) {
                    if (event.which && event.which !== 1) {
                        return false;
                    }

                    var origTarget = event.target, origEvent = event.originalEvent, timer;

                    function clearTapTimer() {
                        clearTimeout(timer);
                    }

                    function clearTapHandlers() {
                        clearTapTimer();

                        $this.unbind("wijclick", clickHandler).unbind("wijmouseup", clearTapTimer);
                        $(document).unbind("wijmousecancel", clearTapHandlers);
                    }

                    function clickHandler(event) {
                        clearTapHandlers();

                        // ONLY trigger a 'tap' event if the start target is
                        // the same as the stop target.
                        if (origTarget == event.target) {
                            triggerCustomEvent(thisObject, "wijtap", event);
                        }
                    }

                    $this.bind("wijmouseup", clearTapTimer).bind("wijclick", clickHandler);
                    $(document).bind("wijmousecancel", clearTapHandlers);

                    timer = setTimeout(function () {
                        triggerCustomEvent(thisObject, "wijtaphold", $.Event("wijtaphold", { target: origTarget }));
                    }, 750);
                });
            }
        };

        // also handles swipeleft, swiperight
        $.event.special.wijswipe = {
            scrollSupressionThreshold: 10,
            durationThreshold: 1000,
            horizontalDistanceThreshold: 30,
            verticalDistanceThreshold: 75,
            setup: function () {
                var thisObject = this, $this = $(thisObject);
                $this.bind(touchStartEvent, function (event) {
                    var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event, start = {
                        time: (new Date()).getTime(),
                        coords: [data.pageX, data.pageY],
                        origin: $(event.target)
                    }, stop;

                    function moveHandler(event) {
                        if (!start) {
                            return;
                        }

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;

                        stop = {
                            time: (new Date()).getTime(),
                            coords: [data.pageX, data.pageY]
                        };

                        // prevent scrolling
                        if (Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.wijswipe.scrollSupressionThreshold) {
                            event.preventDefault();
                        }
                    }

                    $this.bind(touchMoveEvent, moveHandler).one(touchStopEvent, function (event) {
                        $this.unbind(touchMoveEvent, moveHandler);

                        if (start && stop) {
                            if (stop.time - start.time < $.event.special.wijswipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.wijswipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.wijswipe.verticalDistanceThreshold) {
                                start.origin.trigger("wijswipe").trigger(start.coords[0] > stop.coords[0] ? "wijswipeleft" : "wijswiperight"); //qq
                            }
                        }
                        start = stop = undefined;
                    });
                });
            }
        };

        // gesture events
        var gestureEventProps = "altKey ctrlKey metaKey rotation scale shiftKey target velocityX velocityY translationX translationY".split(" ");

        function preInitGestureEvent(elem, eventName) {
            if (isMsPointerEvent && !elem.__wijMSGesturePreInit) {
                // listen for MS gestures
                elem.__wijMSGesturePreInit = true;
                var msGesture = new MSGesture();
                msGesture.target = elem;
                elem.addEventListener(pointerDown, function (e) {
                    msGesture.addPointer(e.pointerId);
                }, false);
            }
        }

        function triggerGestureEvent(eventType, event) {
            var ve = createGestureEvent(event, eventType);

            $(event.target).trigger(ve);
            return ve;
        }

        function createGestureEvent(event, eventType) {
            var t = event.type, oe, props, ne, prop, ct, touch, i, j, len;
            oe = event.originalEvent;
            event = $.Event(event);
            event.nativeType = event.type;
            event.type = eventType;
            props = $.event.props;

            // copy original event properties over to the new event
            // this would happen if we could call $.event.fix instead of $.Event
            // but we don't have a way to force an event to be fixed multiple times
            if (oe) {
                for (i = props.length, prop; i;) {
                    prop = props[--i];
                    event[prop] = event[prop] || oe[prop];
                }
            }
            for (j = 0, len = gestureEventProps.length; j < len; j++) {
                prop = gestureEventProps[j];
                event[prop] = event[prop] || oe[prop];
            }

            if (isMsPointerEvent && event.rotation) {
                // automatically convert to degrees for metro:
                event.rotation = event.rotation * 360 / Math.PI;
            }
            return event;
        }

        $.event.special.wijgesturestart = {
            setup: function () {
                var thisObject = this, $this = $(thisObject);
                preInitGestureEvent(thisObject, "wijgesturestart");
                $this.bind(gesturestartEvent, function (event) {
                    triggerGestureEvent("wijgesturestart", event);
                });
            }
        };

        $.event.special.wijgesturechange = {
            setup: function () {
                var thisObject = this, $this = $(thisObject);
                preInitGestureEvent(thisObject, "wijgesturechange");
                $this.bind(gesturechangeEvent, function (event) {
                    triggerGestureEvent("wijgesturechange", event);
                });
            }
        };

        $.event.special.wijgestureend = {
            setup: function () {
                var thisObject = this, $this = $(thisObject);
                preInitGestureEvent(thisObject, "wijgestureend");
                $this.bind(gestureendEvent, function (event) {
                    triggerGestureEvent("wijgestureend", event);
                });
            }
        };

        //--
        (function ($, window) {
            // "Cowboy" Ben Alman
            var win = $(window), special_event, get_orientation, last_orientation, initial_orientation_is_landscape, initial_orientation_is_default, portrait_map = { "0": true, "180": true };

            // It seems that some device/browser vendors use window.orientation values 0 and 180 to
            // denote the "default" orientation. For iOS devices, and most other smart-phones tested,
            // the default orientation is always "portrait", but in some Android and RIM based tablets,
            // the default orientation is "landscape". The following code attempts to use the window
            // dimensions to figure out what the current orientation is, and then makes adjustments
            // to the to the portrait_map if necessary, so that we can properly decode the
            // window.orientation value whenever get_orientation() is called.
            //
            // Note that we used to use a media query to figure out what the orientation the browser
            // thinks it is in:
            //
            //     initial_orientation_is_landscape = $.mobile.media("all and (orientation: landscape)");
            //
            // but there was an iPhone/iPod Touch bug beginning with iOS 4.2, up through iOS 5.1,
            // where the browser *ALWAYS* applied the landscape media query. This bug does not
            // happen on iPad.
            if ("orientation" in window && "onorientationchange" in window) {
                // Check the window width and height to figure out what the current orientation
                // of the device is at this moment. Note that we've initialized the portrait map
                // values to 0 and 180, *AND* we purposely check for landscape so that if we guess
                // wrong, , we default to the assumption that portrait is the default orientation.
                // We use a threshold check below because on some platforms like iOS, the iPhone
                // form-factor can report a larger width than height if the user turns on the
                // developer console. The actual threshold value is somewhat arbitrary, we just
                // need to make sure it is large enough to exclude the developer console case.
                var ww = window.innerWidth || $(window).width(), wh = window.innerHeight || $(window).height(), landscape_threshold = 50;

                initial_orientation_is_landscape = ww > wh && (ww - wh) > landscape_threshold;

                // Now check to see if the current window.orientation is 0 or 180.
                initial_orientation_is_default = portrait_map[window.orientation];

                // If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
                // if the initial orientation is portrait, but window.orientation reports 90 or -90, we
                // need to flip our portrait_map values because landscape is the default orientation for
                // this device/browser.
                if ((initial_orientation_is_landscape && initial_orientation_is_default) || (!initial_orientation_is_landscape && !initial_orientation_is_default)) {
                    portrait_map = { "-90": true, "90": true };
                }
            }

            $.event.special.orientationchange = special_event = {
                setup: function () {
                    // If the event is supported natively, return false so that jQuery
                    // will bind to the event using DOM methods.
                    if (("orientation" in window && "onorientationchange" in window) && $.mobile.orientationChangeEnabled) {
                        return false;
                    }

                    // Get the current orientation to avoid initial double-triggering.
                    last_orientation = get_orientation();

                    // Because the orientationchange event doesn't exist, simulate the
                    // event by testing window dimensions on resize.
                    win.bind("throttledresize", handler);
                },
                teardown: function () {
                    // If the event is not supported natively, return false so that
                    // jQuery will unbind the event using DOM methods.
                    if (("orientation" in window && "onorientationchange" in window) && $.mobile.orientationChangeEnabled) {
                        return false;
                    }

                    // Because the orientationchange event doesn't exist, unbind the
                    // resize event handler.
                    win.unbind("throttledresize", handler);
                },
                add: function (handleObj) {
                    // Save a reference to the bound event handler.
                    var old_handler = handleObj.handler;

                    handleObj.handler = function (event) {
                        // Modify event object, adding the .orientation property.
                        event.orientation = get_orientation();

                        // Call the originally-bound event handler and return its result.
                        return old_handler.apply(this, arguments);
                    };
                }
            };

            // If the event is not supported natively, this handler will be bound to
            // the window resize event to simulate the orientationchange event.
            function handler() {
                // Get the current orientation.
                var orientation = get_orientation();

                if (orientation !== last_orientation) {
                    // The orientation has changed, so trigger the orientationchange event.
                    last_orientation = orientation;
                    win.trigger("orientationchange");
                }
            }

            // Get the current page orientation. This method is exposed publicly, should it
            // be needed, as jQuery.event.special.orientationchange.orientation()
            $.event.special.orientationchange.orientation = get_orientation = function () {
                var isPortrait = true, elem = document.documentElement;

                // prefer window orientation to the calculation based on screensize as
                // the actual screen resize takes place before or after the orientation change event
                // has been fired depending on implementation (eg android 2.3 is before, iphone after).
                // More testing is required to determine if a more reliable method of determining the new screensize
                // is possible when orientationchange is fired. (eg, use media queries + element + opacity)
                if ("orientation" in window && "onorientationchange" in window) {
                    // if the window orientation registers as 0 or 180 degrees report
                    // portrait, otherwise landscape
                    isPortrait = portrait_map[window.orientation];
                } else {
                    isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
                }

                return isPortrait ? "portrait" : "landscape";
            };
        })(jQuery, window);

        // throttled resize event
        (function () {
            $.event.special.throttledresize = {
                setup: function () {
                    $(this).bind("resize", handler);
                },
                teardown: function () {
                    $(this).unbind("resize", handler);
                }
            };

            var throttle = 250, handler = function () {
                curr = (new Date()).getTime();
                diff = curr - lastCall;

                if (diff >= throttle) {
                    lastCall = curr;
                    $(this).trigger("throttledresize");
                } else {
                    if (heldCall) {
                        clearTimeout(heldCall);
                    }

                    // Promise a held call will still execute
                    heldCall = setTimeout(handler, throttle - diff);
                }
            }, lastCall = 0, heldCall, curr, diff;
        })();

        $.each({
            wijscrollstop: "wijscrollstart",
            wijtaphold: "wijtap",
            wijswipeleft: "wijswipe",
            wijswiperight: "wijswipe"
        }, function (event, sourceEvent) {
            $.event.special[event] = {
                setup: function () {
                    $(this).bind(sourceEvent, $.noop);
                }
            };
        });

        // wijslider inherit jQuery UI slider widget,
        // then the touch event won't be fired in jQuery UI slider widget,
        // so copy the ui.mouse code from jquery ui and add touch event support.
        if ($.ui && $.ui.mouse) {
            var mouseHandled = false, eventPrefix = "";
            if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                eventPrefix = "wij";
            }
            $(document).bind(eventPrefix + "mouseup", function () {
                mouseHandled = false;
            });

            $.ui.mouse.prototype._mouseInit = function () {
                var that = this;

                this.element.bind(eventPrefix + "mousedown." + this.widgetName, function (event) {
                    return that._mouseDown(event);
                }).bind(eventPrefix + "click." + this.widgetName, function (event) {
                    if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                        $.removeData(event.target, that.widgetName + ".preventClickEvent");
                        event.stopImmediatePropagation();
                        return false;
                    }
                });

                this.started = false;
            }, $.ui.mouse.prototype._mouseDestroy = function () {
                this.element.unbind("." + this.widgetName);
                if (this._mouseMoveDelegate) {
                    $(document).unbind(eventPrefix + "mousemove." + this.widgetName, this._mouseMoveDelegate).unbind(eventPrefix + "mouseup." + this.widgetName, this._mouseUpDelegate);
                }
            };

            $.ui.mouse.prototype._mouseDown = function (event) {
                // don't let more than one widget handle mouseStart
                if (mouseHandled) {
                    return;
                }

                // we may have missed mouseup (out of window)
                (this._mouseStarted && this._mouseUp(event));

                this._mouseDownEvent = event;

                var that = this, touchEnabled = $.support.isTouchEnabled && $.support.isTouchEnabled(), btnIsLeft = (event.which === 1) || touchEnabled, targetCancel = false, elIsCancel = false;
                if (event.target.nodeName) {
                    targetCancel = $(event.target).closest(this.options.cancel).length > 0;
                }

                // event.target.nodeName works around a bug in IE 8 with
                // disabled inputs (#7620)
                // elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
                elIsCancel = (typeof this.options.cancel === "string" && targetCancel);

                if ((!btnIsLeft || elIsCancel || !this._mouseCapture(event))) {
                    return true;
                }
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) {
                    this._mouseDelayTimer = setTimeout(function () {
                        that.mouseDelayMet = true;
                    }, this.options.delay);
                }

                if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                    this._mouseStarted = (this._mouseStart(event) !== false);
                    if (!this._mouseStarted) {
                        event.preventDefault();
                        return true;
                    }
                }

                // Click event may never have fired (Gecko & Opera)
                if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
                    $.removeData(event.target, this.widgetName + ".preventClickEvent");
                }

                // these delegates are required to keep context
                this._mouseMoveDelegate = function (event) {
                    return that._mouseMove(event);
                };
                this._mouseUpDelegate = function (event) {
                    return that._mouseUp(event);
                };
                $(document).bind(eventPrefix + "mousemove." + this.widgetName, this._mouseMoveDelegate).bind(eventPrefix + "mouseup." + this.widgetName, this._mouseUpDelegate);

                event.preventDefault();

                mouseHandled = true;
                return true;
            };

            $.ui.mouse.prototype._mouseUp = function (event) {
                $(document).unbind(eventPrefix + "mousemove." + this.widgetName, this._mouseMoveDelegate).unbind(eventPrefix + "mouseup." + this.widgetName, this._mouseUpDelegate);

                if (this._mouseStarted) {
                    this._mouseStarted = false;

                    if (event.target === this._mouseDownEvent.target) {
                        $.data(event.target, this.widgetName + ".preventClickEvent", true);
                    }

                    this._mouseStop(event);
                }

                return false;
            };
        }
    })(wijmo.touch || (wijmo.touch = {}));
    var touch = wijmo.touch;
})(wijmo || (wijmo = {}));

