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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
    /// <reference path="../External/declarations/jquery.mousewheel.d.ts" />
    /*globals window,document,jQuery*/
    /*
    * Depends:
    *  jquery.ui.core.js
    *  jquery.ui.widget.js
    *  jquery.ui.resizable.js
    *  jquery.ui.mouse.js
    *  jquery.wijmo.wijutil.js
    *
    */
    (function (superpanel) {
        var $ = jQuery;

        var wijsuperpanel_options = (function () {
            function wijsuperpanel_options() {
                /**
                * wijCSS.
                * @ignore
                */
                this.wijCSS = {
                    superpanelHeader: "wijmo-wijsuperpanel-header",
                    superpanelFooter: "wijmo-wijsuperpanel-footer",
                    superpanelHandle: "",
                    superpanelVBarbuttonTop: "",
                    superpanelVBarbuttonBottom: "",
                    superpanelHBarbuttonLeft: "",
                    superpanelHBarbuttonRight: "",
                    superpanelHBarContainer: "",
                    superpanelVBarContainer: "",
                    superpanelButton: "",
                    superpanelButtonLeft: "",
                    superpanelButtonRight: "",
                    superpanelButtonTop: "",
                    superpanelButtonBottom: ""
                };
                /**
                * wijMobileCSS.
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-c"
                };
                /**
                * Selector option for auto self initialization.
                * This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijsuperpanel')";
                /** The value determines whether the wijsuperpanel can be resized.
                */
                this.allowResize = false;
                /** This value determines whether wijsuperpanel is automatically refreshed when the content size or wijsuperpanel size are changed.
                * Set this value to true if you load images in the wijsuperpanel without specifying their sizes.
                */
                this.autoRefresh = false;
                /** The animationOptions function determines whether or not the animation is shown. If true, it defines the animation effect and controls other aspects of the widget's animation, such as duration, queue, and easing.
                * @example
                * $('#superPanel').wijsuperpanel({
                *     animationOptions: {
                *         disabled: false,
                *         duration: 1000,
                *         easing: easeInQuad
                *     }
                *   });
                * @remarks
                * Set this options to null to disable animation.
                */
                this.animationOptions = {
                    /**
                    * This value determines whether to queue animation operations.
                    * @type {boolean}
                    */
                    queue: false,
                    /** This value determines whether to disable animation operations.
                    * @type {boolean}
                    */
                    disabled: false,
                    /** This value sets the animation duration of the scrolling animation.
                    * @type {number}
                    */
                    duration: 250,
                    /** Sets the type of animation easing effect that users experience as the panel is scrolled. You can create custom easing animations using jQuery UI Easings.
                    * @type {string}
                    */
                    easing: undefined
                };
                /** The hScrollerActivating event handler.
                * A function called when horizontal scrollbar is activating.
                * @event
                * @dataKey {string} direction The direction of the scrolling action.
                * Possible values: "v"(vertical) and "h"(horizontal).
                * @dataKey {object} targetBarLen The width of the horizontal scrollbar.
                * @dataKey {object} contentLength The width of the content.
                */
                this.hScrollerActivating = null;
                /**
                *This option contains horizontal scroller settings.
                */
                this.hScroller = {
                    /*
                    * This value determines the position of the horizontal scroll bar.
                    * @type {string}
                    * @remarks
                    * Possible options are "bottom" and "top".
                    * "bottom" - The horizontal scroll bar is placed at the bottom of
                    * the content area.
                    * "top" - The horizontal scroll bar is placed at the top of the
                    *content area.
                    */
                    scrollBarPosition: "bottom",
                    /** This value determines the visibility of the horizontal scroll bar.
                    * @type {string}
                    * @remarks
                    * Possible options are "auto", "visible" and "hidden".
                    * "auto" - Shows the scroll when needed.
                    * "visible" - The Scroll bar is always visible. It is disabled
                    * when not needed.
                    * "hidden" - The Scroll bar is hidden.
                    */
                    scrollBarVisibility: "auto",
                    /** This value determines the scroll mode of horizontal scrolling.
                    * @type {string}
                    * @remarks
                    * Possible options are "scrollBar", "buttons", "buttonsHover"
                    * and "edge".
                    * "scrollBar" - Scroll bars are used for scrolling.
                    * "buttons" - Scroll buttons are used for scrolling.
                    * Scrolling occurs only when scroll buttons are clicked.
                    * "buttonsHover" - Scroll buttons are used for scrolling.
                    * Scrolling occurs only when scroll buttons are hovered.
                    * "edge" - Scrolling occurs when the mouse is moving to the edge
                    * of the content area.
                    * Scroll modes can be combined with each other.
                    * For example, scrollMode: "scrollbar,scrollbuttons" will enable
                    * both a scrollbar and scroll buttons.
                    */
                    scrollMode: "scrollBar",
                    /** This value determines the horizontal scrolling position of
                    * wijsuperpanel.
                    * @type {number}
                    */
                    scrollValue: null,
                    /** This value sets the maximum value of the horizontal scroller.
                    * @type {number}
                    */
                    scrollMax: 100,
                    /** This value sets the minimum value of the horizontal scroller.
                    * @type {number}
                    */
                    scrollMin: 0,
                    /** This value sets the large change value of the horizontal scroller.
                    * @type {number}
                    * @remarks
                    * Wijsuperpanel will scroll a large change when a user clicks on the
                    * tracks of scroll bars or presses left or right arrow keys on the
                    * keyboard with the shift key down.
                    * When scrollLargeChange is null, wijsuperpanel will scroll
                    * the width of content.
                    */
                    scrollLargeChange: null,
                    /** This value sets the small change value of the horizontal scroller.
                    * @type {number}
                    * @remarks
                    * Wijsuperpanel will scroll a small change when a user clicks on
                    * the arrows of scroll bars, clicks or hovers scroll buttons,
                    * presses left or right arrow keys on keyboard,
                    * and hovers on the edge of wijsuperpanel.
                    * When scrollSmallChange is null, wijsuperpanel will scroll half of
                    * the width of content.
                    */
                    scrollSmallChange: null,
                    /** This value sets the minimum length, in pixel, of the horizontal
                    * scroll bar thumb button.
                    * @type {number}
                    */
                    scrollMinDragLength: 6,
                    /** This is an object that determines the increase button position.
                    * @type {object}
                    */
                    /* @remarks
                    * Please look at the options for jquery.ui.position.js for more info.
                    */
                    increaseButtonPosition: null,
                    /** This is an object that determines the decrease button position.
                    * @type {object}
                    */
                    decreaseButtonPosition: null,
                    /** This value sets the width, in pixels, of the horizontal hovering edge which will trigger the horizontal scrolling.
                    * @type {number}
                    */
                    hoverEdgeSpan: 20,
                    /** This number specifies the value to add to smallchange or largechange when scrolling the first step (scrolling from scrollMin).
                    * @type {number}
                    */
                    firstStepChangeFix: 0
                };
                /** This value determines whether wijsuperpanel provides keyboard scrolling support.
                */
                this.keyboardSupport = false;
                /** This value determines the time interval to call the scrolling function when doing continuous scrolling.
                */
                this.keyDownInterval = 100;
                /** This value determines whether wijsuperpanel has mouse wheel support.
                * @remarks
                * Mouse wheel plugin is needed to support this feature.
                */
                this.mouseWheelSupport = true;
                /** This value determines whether to fire the mouse wheel event when wijsuperpanel is scrolled to the end.
                */
                this.bubbleScrollingEvent = true;
                /** This option determines the behavior of the resizable widget. See the JQuery UI resizable options document for more information.
                * @type {object}
                */
                this.resizableOptions = {
                    handles: "all",
                    helper: "ui-widget-content wijmo-wijsuperpanel-helper"
                };
                /** Resized event handler. This function gets called when the resized event is fired.
                * @event
                */
                this.resized = null;
                /** This function gets called when the user stops dragging the thumb buttons of the scrollbars.
                * @event
                * @dataKey {string} dir The direction of the scrolling action.
                * Possible values: "v"(vertical) and "h"(horizontal).
                */
                this.dragStop = null;
                /** This function gets called after panel is painted.
                * @event
                */
                this.painted = null;
                /** Scrolling event handler. A function called before scrolling occurs.
                * @event
                * @dataKey {string} dir The direction of the scrolling action.
                * Possible values: "v"(vertical) and "h"(horizontal).
                * @dataKey {number} oldValue The scrollValue before scrolling occurs.
                * @dataKey {number} newValue The scrollValue after scrolling occurs.
                * @dataKey {object} beforePosition The position of content before scrolling occurs.
                */
                this.scrolling = null;
                /** Scroll event handler. This function is called before scrolling occurs.
                * @event
                * @dataKey {string} dir The direction of the scrolling action.
                * Possible values: "v"(vertical) and "h"(horizontal).
                * @dataKey {object} animationOptions TThe options of the animation which scrolling uses.
                * @dataKey {object} position The position of content after scrolling occurs.
                */
                this.scroll = null;
                /** Scrolled event handler. This function gets called after scrolling occurs.
                * @event
                * @dataKey {string} dir The direction of the scrolling action.
                * Possible values: "v"(vertical) and "h"(horizontal).
                * @dataKey {object} beforePosition The position of content before scrolling occurs.
                * @dataKey {object} afterPosition The position of content after scrolling occurs.
                */
                this.scrolled = null;
                /** This value determines whether to show the rounded corner of wijsuperpanel.
                * @type {boolean}
                */
                this.showRounder = true;
                /** A function called when the vertical scrollbar is activating.
                * @event
                * @dataKey {string} direction The direction of the scrolling action.
                * Possible values: "v"(vertical) and "h"(horizontal).
                * @dataKey {object} targetBarLen The width of the vertical scrollbar.
                * @dataKey {object} contentLength The width of the content.
                */
                this.vScrollerActivating = null;
                /** This option contains vertical scroller settings.
                */
                this.vScroller = {
                    /**
                    * This value determines the position of the vertical scroll bar.
                    * @type {String}
                    * @remarks
                    * Possible options are: "left", "right".
                    * "left" - The vertical scroll bar is placed at the
                    * left side of the content area.
                    * "right" - The vertical scroll bar is placed at the
                    * right side of the content area.
                    */
                    scrollBarPosition: "right",
                    /** This value determines the visibility of the vertical scroll bar.
                    * Default.: "auto".
                    * @type {string}
                    * @remarks
                    * Possible options are "auto", "visible" and "hidden".
                    * "auto" - Shows the scroll bar when needed.
                    * "visible" - Scroll bar will always be visible.
                    * It"s disabled when not needed.
                    * "hidden" - Scroll bar will be shown.
                    */
                    scrollBarVisibility: "auto",
                    /** This value determines the scroll mode of vertical scrolling.
                    * @type {string}
                    * @remarks
                    * Possible options are: "scrollBar", "buttons",
                    * "buttonsHover" and "edge".
                    * "scrollBar" - Scroll bars are used for scrolling.
                    * "buttons" - Scroll buttons are used for scrolling.
                    * Scrolling occurs only when scroll buttons are clicked.
                    * "buttonsHover" - Scroll buttons are used for scrolling.
                    * Scrolling occurs only when scroll buttons are hovered.
                    * "edge" - Scrolling occurs when the mouse is moving to
                    * the edge of the content area.
                    * Scroll modes can be combined with each other.
                    * For example, vScrollMode: "scrollbar,scrollbuttons" will enable
                    * both a scrollbar and scroll buttons.
                    */
                    scrollMode: "scrollBar",
                    /** This number determines the vertical scrolling position of
                    * wijsuperpanel.
                    * @type {number}
                    */
                    scrollValue: null,
                    /** This number sets the maximum value of the vertical scroller.
                    * @type {number}
                    */
                    scrollMax: 100,
                    /** This number sets the minimum value of the vertical scroller.
                    * @type {number}
                    */
                    scrollMin: 0,
                    /** This value sets the large change value of the vertical scroller.
                    * @type {number}
                    * @remarks
                    * wijsuperpanel will scroll a large change when a user clicks
                    * on the tracks of scroll bars or presses left or right arrow keys
                    * on the keyboard with the shift key down.
                    * When scrollLargeChange is null, wijsuperpanel
                    * will scroll the height of content.
                    */
                    scrollLargeChange: null,
                    /** This value sets the small change value of the vertical scroller.
                    * @type {number}
                    * @remarks
                    * wijsuperpanel will scroll a small change when a user clicks on the
                    * arrows of scroll bars, clicks or hovers scroll buttons, presses left
                    * or right arrow keys on keyboard, and hovers on the edge of
                    * wijsuperpanel.
                    * When scrollSmallChange is null, wijsuperpanel will scroll half of
                    * the height of content.
                    */
                    scrollSmallChange: null,
                    /** This value sets the minimum length, in pixel, of the vertical
                    * scroll bar thumb button.
                    * @type {number}
                    */
                    scrollMinDragLength: 6,
                    /** This object determines the increase button position.
                    * @type {object}
                    * @remarks
                    * Please look at the options for jquery.ui.position.js for more info.
                    */
                    increaseButtonPosition: null,
                    /** This object determines the decrease button position.
                    * @type {object}
                    * @remarks
                    * Please look at the options for jquery.ui.position.js for more info.
                    */
                    decreaseButtonPosition: null,
                    /** This value sets the width of the horizontal hovering edge which will trigger the vertical scrolling.
                    * @type {number}
                    */
                    hoverEdgeSpan: 20,
                    /** This number specifies the value to add to smallchange or largechange when scrolling the first step (scrolling from scrollMin).
                    * @type {number}
                    */
                    firstStepChangeFix: 0
                };
                /** Determines if use custom scrolling.
                */
                this.customScrolling = false;
                /** Determines if the native scroll events should be listened.
                */
                this.listenContentScroll = false;
            }
            return wijsuperpanel_options;
        })();

        /** @widget */
        var wijsuperpanel = (function (_super) {
            __extends(wijsuperpanel, _super);
            function wijsuperpanel() {
                _super.apply(this, arguments);
            }
            /**
            * Destroys wijsuperpanel widget and reset the DOM element.
            */
            wijsuperpanel.prototype.destroy = function () {
            };

            /**
            * Determine whether scoll the child DOM element to view
            * need to scroll the scroll bar
            * @param {DOMElement} child The child to scroll to.
            */
            wijsuperpanel.prototype.needToScroll = function (child1) {
            };

            /**
            * Scroll children DOM element to view.
            * @param {DOMElement} child The child to scroll to.
            */
            wijsuperpanel.prototype.scrollChildIntoView = function (child1) {
            };

            /**
            * Scroll to horizontal position.
            * @param {number} x The position to scroll to.
            * @param {bool} isScrollValue A value that indicates whether x is value or pixel.
            */
            wijsuperpanel.prototype.hScrollTo = function (x, isScrollValue) {
            };

            /**
            * Scroll to vertical position.
            * @param {number} y The position to scroll to.
            * @param {bool} isScrollValue A value that indicates whether y is value or pixel.
            */
            wijsuperpanel.prototype.vScrollTo = function (y, isScrollValue) {
            };

            /**
            * Convert pixel to scroll value.
            * For example, wijsuperpanel scrolled 50px
            * which is value 1 after conversion.
            * @param {number} px Length of scrolling.
            * @param {string} dir Scrolling direction. Options are: "h" and "v".
            */
            wijsuperpanel.prototype.scrollPxToValue = function (px, dir) {
            };

            /**
            * Convert scroll value to pixel.
            * For example, scroll value is 1
            * which makes wijsuperpanel scrolled 50px after conversion.
            * @param {number} scroll value.
            * @param {string} dir Scrolling direction. Options are: "h" and "v".
            */
            wijsuperpanel.prototype.scrollValueToPx = function (value, dir) {
            };

            /**
            * Scroll to the specified position.
            * which is value 1 after conversion.
            * @param {number} x Horizontal position to scroll to.
            * @param {number} y Vertical position to scroll to.
            * @param {bool} isScrollValue A value that indicates whether x, y are value or pixel.
            */
            wijsuperpanel.prototype.scrollTo = function (x, y, isScrollValue) {
            };

            /**
            * Refreshes wijsuperpanel.
            * Needs to be called after content being changed.
            * @returns {boolean} Returns true if it is successful, else returns false.
            */
            wijsuperpanel.prototype.refresh = function () {
            };

            /**
            * Refreshes wijsuperpanel.
            * Needs to be called after content being changed.
            * @returns {boolean} Returns true if it is successful, else returns false.
            */
            wijsuperpanel.prototype.paintPanel = function (unfocus) {
            };

            /**
            * Gets the content element of wijsuperpanel.
            * @example $("selector").wijsuperpanel("getContentElement");
            * @returns {jQuery}
            */
            wijsuperpanel.prototype.getContentElement = function () {
            };
            return wijsuperpanel;
        })(wijmo.wijmoWidget);
        superpanel.wijsuperpanel = wijsuperpanel;
        var superpanel_widget;
        if (!$.support.isTouchEnabled || !$.support.isTouchEnabled()) {
            var scrollerHandle = "wijmo-wijsuperpanel-handle", hbarContainerCSS = "wijmo-wijsuperpanel-hbarcontainer", vbarContainerCSS = "wijmo-wijsuperpanel-vbarcontainer", activeCss = "", innerElementHtml = "<div class='wijmo-wijsuperpanel-statecontainer'>" + "<div class='wijmo-wijsuperpanel-contentwrapper'>" + "<div class='wijmo-wijsuperpanel-templateouterwrapper'></div>" + "</div>" + "</div>", hbarHtml = "<div class='wijmo-wijsuperpanel-hbarcontainer {superpanelHBarContainer} {header}'>" + "<div class='wijmo-wijsuperpanel-handle {superpanelHandle} {stateDefault} {cornerAll}'>" + "<span class='{icon} {iconVGripSolid}'></span></div>" + "<div class='wijmo-wijsuperpanel-hbar-buttonleft {superpanelHBarbuttonLeft} {stateDefault} {cornerBL}'>" + "<span class='{icon} {iconArrowLeft}'></span></div>" + "<div class='wijmo-wijsuperpanel-hbar-buttonright {superpanelHBarbuttonRight} {stateDefault} {cornerBR}'>" + "<span class='{icon} {iconArrowRight}'></span></div>" + "</div>", vbarHtml = "<div class='wijmo-wijsuperpanel-vbarcontainer {superpanelVBarContainer} {header}'>" + "<div class='wijmo-wijsuperpanel-handle {superpanelHandle} {stateDefault} {cornerAll}'>" + "<span class='{icon} {iconHGripSolid}'></span></div>" + "<div class='wijmo-wijsuperpanel-vbar-buttontop {superpanelVBarbuttonTop} {stateDefault} {cornerTR}'>" + "<span class='{icon} {iconArrowUp}'></span></div>" + "<div class='wijmo-wijsuperpanel-vbar-buttonbottom {superpanelVBarbuttonBottom} {stateDefault} {cornerBR}'>" + "<span class='{icon} {iconArrowDown}'></span></div>" + "</div>", hButtons = "<div class='{stateDefault} wijmo-wijsuperpanel-button {superpanelButton} " + "wijmo-wijsuperpanel-buttonleft {superpanelButtonLeft}'><span class='{icon} {iconCaratLeft}'>" + "</span></div><div class='{stateDefault}" + " wijmo-wijsuperpanel-button {superpanelButton} wijmo-wijsuperpanel-buttonright {superpanelButtonRight}'>" + "<span class='{icon} {iconCaratRight}'></span></div>", vButtons = "<div class='{stateDefault} wijmo-wijsuperpanel-button {superpanelButton} " + " wijmo-wijsuperpanel-buttontop {superpanelButtonTop}'><span class='{icon} {iconCaratUp}'>" + "</span></div><div class='{stateDefault} wijmo-wijsuperpanel-button {superpanelButton}" + " wijmo-wijsuperpanel-buttonbottom {superpanelButtonBottom}'><span class='{icon} {iconCaratDown}'>" + " </span></div>";

            wijsuperpanel.prototype = $.extend(true, {}, $.Widget.prototype, {
                widgetEventPrefix: "wijsuperpanel",
                _setOption: function (key, value) {
                    var self = this, o = self.options, oldDisabled = self._isDisabled(), newDisabled, f = self._fields(), hd = f.hbarDrag, vd = f.vbarDrag, r = f.resizer;

                    // override existing
                    if (key === "animationOptions") {
                        value = $.extend(o.animationOptions, value);
                    } else if (key === "hScroller") {
                        if (value.scrollLargeChange !== undefined && value.scrollLargeChange !== null) {
                            self._autoHLarge = false;
                        }
                        value = $.extend(o.hScroller, value);
                        self._adjustScrollValue("h");
                        self.refresh();
                    } else if (key === "vScroller") {
                        if (value.scrollLargeChange !== undefined && value.scrollLargeChange !== null) {
                            self._autoVLarge = false;
                        }
                        self._adjustScrollValue("v");
                        value = $.extend(o.vScroller, value);
                        self.refresh();
                    } else if (key === "resizableOptions") {
                        value = $.extend(self.resizableOptions, value);
                    }
                    $.Widget.prototype._setOption.apply(self, arguments);
                    if ($.isPlainObject(value)) {
                        self.options[key] = value;
                    }
                    switch (key) {
                        case "allowResize":
                            self._initResizer();
                            break;
                        case "disabled":
                            newDisabled = this._isDisabled();
                            if (oldDisabled === newDisabled)
                                return;

                            if (newDisabled) {
                                this._innerDisable();
                            } else {
                                this._innerEnable();
                            }
                            break;
                        case "mouseWheelSupport":
                        case "keyboardSupport":
                            self._bindElementEvents(self, f, self.element, o);
                            break;
                    }
                    return self;
                },
                _innerDisable: function () {
                    this._toggleDisableSuperPanel(true);
                },
                _innerEnable: function () {
                    this._toggleDisableSuperPanel(false);
                },
                _toggleDisableSuperPanel: function (disabled) {
                    var self = this, o = self.options, f = self._fields(), hd = f.hbarDrag, vd = f.vbarDrag, r = f.resizer;

                    self.element.toggleClass("ui-state-disabled", !!disabled).attr("aria-disabled", disabled);
                    if (disabled) {
                        if (hd !== undefined) {
                            hd.draggable("disable");
                        }
                        if (vd !== undefined) {
                            vd.draggable("disable");
                        }
                        if (r) {
                            r.resizable("disable");
                        }
                    } else {
                        if (hd !== undefined) {
                            hd.draggable("enable");
                        }
                        if (vd !== undefined) {
                            vd.draggable("enable");
                        }
                        if (r) {
                            r.resizable("enable");
                        }
                    }
                },
                _create: function () {
                    var self = this, o = self.options;
                    o.vScroller.dir = "v";
                    o.hScroller.dir = "h";
                    self._initMarkup();

                    self.paintPanel(o.unfocus);
                    self._initResizer();
                    self._detectAutoRefresh();

                    if (o.listenContentScroll) {
                        self._listenContentScroll();
                    }

                    //update for visibility change
                    if (self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                        self.element.wijAddVisibilityObserver(function () {
                            if (self.element.wijRemoveVisibilityObserver) {
                                self.element.wijRemoveVisibilityObserver();
                            }
                            self.refresh();
                        }, "wijsuperpanel");
                    }
                    if (self._isDisabled()) {
                        self._toggleDisableSuperPanel(true, self.element);
                    }
                },
                _initMarkup: function () {
                    var css = this.options.wijCSS, reg = /\{(\w+?)\}/ig, callback = function (i, g1) {
                        return css[g1];
                    };
                    activeCss = css.stateActive;
                    hbarHtml = hbarHtml.replace(reg, callback);
                    vbarHtml = vbarHtml.replace(reg, callback);
                    hButtons = hButtons.replace(reg, callback);
                    vButtons = vButtons.replace(reg, callback);
                },
                _detectAutoRefresh: function () {
                    // register with auto fresh.
                    var self = this, panels = $.wijmo.wijsuperpanel.panels;
                    if (panels === undefined) {
                        panels = [];
                        $.wijmo.wijsuperpanel.panels = panels;
                    }
                    panels.push(self);

                    // start timer to monitor content.
                    if (self.options.autoRefresh) {
                        if (!$.wijmo.wijsuperpanel.setAutoRefreshInterval) {
                            $.wijmo.wijsuperpanel.setAutoRefreshInterval = self._setAutoRefreshInterval;
                            $.wijmo.wijsuperpanel.setAutoRefreshInterval();
                        }
                    }
                },
                _setAutoRefreshInterval: function () {
                    var interval = $.wijmo.wijsuperpanel.autoRereshInterval, panels = $.wijmo.wijsuperpanel.panels, intervalID;

                    intervalID = window.setInterval(function () {
                        window.clearInterval(intervalID);
                        var count = panels.length, toContinue = false, i, panel, mainElement, autoRefresh, wrapperEle, mark, wrapperChanged;
                        for (i = 0; i < count; i++) {
                            panel = panels[i];
                            mainElement = panel.element[0];
                            autoRefresh = panel.options.autoRefresh;
                            if (autoRefresh) {
                                toContinue = true;
                            }
                            wrapperEle = panel.getContentElement();
                            mark = panel._paintedMark;

                            wrapperChanged = !wrapperEle || (wrapperEle.is(":visible") && (mark === undefined || mark.width !== wrapperEle[0].offsetWidth || mark.height !== wrapperEle[0].offsetHeight || mark.mainWidth !== mainElement.offsetWidth || mark.mainHeight !== mainElement.offsetHeight));

                            if (autoRefresh && panel.element.is(":visible") && wrapperChanged) {
                                panel.paintPanel();
                            }
                        }
                        if (toContinue) {
                            window.setTimeout($.wijmo.wijsuperpanel.setAutoRefreshInterval, 0);
                        }
                    }, interval === undefined ? 500 : interval);
                },
                /**
                * Destroys wijsuperpanel widget and reset the DOM element.
                */
                destroy: function () {
                    var self = this, f = self._fields(), ele = self.element, buttons, templateWrapper, wijCSS = self.options.wijCSS;

                    // remove this widget from panels array.
                    $.wijmo.wijsuperpanel.panels = $.grep($.wijmo.wijsuperpanel.panels, function (value) {
                        return value !== self;
                    }, false);
                    if (!f.initialized) {
                        return;
                    }
                    if (self._radiusKey) {
                        self.element.css(self._radiusKey, "");
                    }
                    if (f.intervalID !== undefined) {
                        window.clearInterval(f.intervalID);
                        f.intervalID = undefined;
                    }

                    // destory widgets
                    if (f.resizer !== undefined) {
                        f.resizer.resizable("destroy");
                    }
                    if (f.hbarContainer !== undefined) {
                        f.hbarDrag.unbind("." + self.widgetName + "CustomDrag");
                        f.hbarDrag.remove();
                        f.hbarContainer.unbind("." + self.widgetName);
                    }
                    if (f.vbarContainer !== undefined) {
                        f.vbarDrag.unbind("." + self.widgetName + "CustomDrag");
                        f.vbarDrag.remove();
                        f.vbarContainer.unbind("." + self.widgetName);
                    }
                    ele.unbind("." + self.widgetName);
                    f.contentWrapper.unbind("." + self.widgetName);
                    $(document).unbind("." + self.widgetName + "CustomDrag");

                    buttons = f.stateContainer.find(">.wijmo-wijsuperpanel-button");
                    buttons.unbind("." + self.widgetName);
                    templateWrapper = f.templateWrapper;
                    templateWrapper.contents().each(function (index, e) {
                        ele.append(e);
                    });
                    f.stateContainer.remove();
                    if (f.tabindex) {
                        ele.removeAttr("tabindex");
                    }
                    ele.removeClass(["wijmo-wijsuperpanel", wijCSS.widget, wijCSS.content, wijCSS.cornerAll].join(' '));
                    $.Widget.prototype.destroy.apply(self, arguments);
                },
                _fields: function () {
                    var self = this, ele = self.element, key = self.widgetName + "-fields", d = self._fieldsStore;
                    if (d === undefined) {
                        d = {};
                        ele.data(key, d);
                        self._fieldsStore = d;
                    }
                    return d;
                },
                _hasMode: function (scroller, mode) {
                    var modes = scroller.scrollMode.split(",");
                    modes = $.map(modes, function (n) {
                        return $.trim(n).toLowerCase();
                    });

                    return $.inArray(mode.toLowerCase(), modes) > -1;
                },
                _bindElementEvents: function (self, f, ele, o) {
                    // mouse move only edge mode is used.
                    var hEdge = self._hasMode(o.hScroller, "edge"), vEdge = self._hasMode(o.vScroller, "edge"), wn = self.widgetName;

                    if (hEdge || vEdge) {
                        if (self._mousemoveBind === undefined) {
                            self._mousemoveBind = true;
                            ele.bind("mousemove." + wn, self, self._contentMouseMove);
                            ele.bind("mouseleave." + wn, null, function () {
                                self._clearInterval();
                            });
                        }
                    } else {
                        ele.unbind("mousemove", self._contentMouseMove);
                        self._mousemoveBind = undefined;
                    }

                    if (o.mouseWheelSupport) {
                        if (self._mouseWheelBind === undefined) {
                            self._mouseWheelBind = true;
                            ele.bind("mousewheel." + wn, self, self._panelMouseWheel);
                        }
                    } else {
                        ele.unbind("mousewheel", self._panelMouseWheel);
                        self._mouseWheelBind = undefined;
                    }

                    if (o.keyboardSupport) {
                        if (self._keyboardBind === undefined) {
                            self._keyboardBind = true;
                            ele.bind("keydown." + wn, self, self._panelKeyDown);
                        }
                    } else {
                        ele.unbind("keydown", self._panelKeyDown);
                        self._keyboardBind = undefined;
                    }
                },
                _dragStop: function (e, self, dir) {
                    // Handles mouse drag stop event of thumb button.
                    var data = {
                        dragHandle: dir
                    };
                    self._trigger("dragStop", e, data);
                },
                _contentMouseMove: function (e) {
                    // Handles mouse move event of content area.
                    // Edge hover scrolling is handled in this method.
                    if (e.data._isDisabled()) {
                        return;
                    }
                    var self = e.data, o = self.options, hScroller = o.hScroller, vScroller = o.vScroller, contentWrapper = $(e.currentTarget), f = self._fields(), hMode = self._hasMode(hScroller, "edge"), vMode = self._hasMode(vScroller, "edge"), mousePagePosition = {
                        X: e.pageX,
                        Y: e.pageY
                    }, off = contentWrapper.offset(), left = off.left, top = off.top, hEdge = hScroller.hoverEdgeSpan, vEdge = vScroller.hoverEdgeSpan, innerHeight = contentWrapper.innerHeight(), innerWidth = contentWrapper.innerWidth(), dir = "";

                    left = mousePagePosition.X - left;
                    top = mousePagePosition.Y - top;
                    self._clearInterval();
                    if (hMode) {
                        if (left < hEdge) {
                            dir = "left";
                        }
                        if (left > (innerWidth - hEdge)) {
                            dir = "right";
                        }
                    }
                    if (vMode) {
                        if (top < vEdge) {
                            dir = "top";
                        }
                        if (top > (innerHeight - vEdge)) {
                            dir = "bottom";
                        }
                    }
                    self._setScrollingInterval(f, dir, self, false);
                },
                _setScrollingInterval: function (f, dir, self, large) {
                    var o = self.options;
                    if (dir.length > 0) {
                        f.internalFuncID = window.setInterval(function () {
                            self._doScrolling(dir, self, large);
                        }, o.keyDownInterval);
                    }
                },
                _scrollButtonMouseOver: function (e) {
                    // Scroll buttons mouse over event handler.
                    var self = e.data, o = self.options, button = $(e.currentTarget);
                    if (self._isDisabled()) {
                        return;
                    }
                    if (!button.hasAllClasses(o.wijCSS.stateDisabled)) {
                        button.bind("mouseout." + self.widgetName, self, self._buttonMouseOut).bind("mousedown." + self.widgetName, self, self._buttonMouseDown).bind("mouseup." + self.widgetName, self, self._buttonMouseUp).addClass(o.wijCSS.stateHover);
                        self._buttonScroll(button, self, "buttonshover");
                    }
                },
                _buttonScroll: function (button, self, mode) {
                    // Do button scroll.
                    var dir = "", o = self.options, f = self._fields(), hMode = self._hasMode(o.hScroller, mode), vMode = self._hasMode(o.vScroller, mode);

                    if (button.hasClass("wijmo-wijsuperpanel-buttonleft") && hMode) {
                        dir = "left";
                    } else if (button.hasClass("wijmo-wijsuperpanel-buttonright") && hMode) {
                        dir = "right";
                    } else if (button.hasClass("wijmo-wijsuperpanel-buttontop") && vMode) {
                        dir = "top";
                    } else if (button.hasClass("wijmo-wijsuperpanel-buttonbottom") && vMode) {
                        dir = "bottom";
                    }

                    if (dir.length > 0) {
                        self._clearInterval();
                        self._doScrolling(dir, self, true);
                        self._setScrollingInterval(f, dir, self, true);
                    }
                },
                _listenContentScroll: function () {
                    var self = this, o = self.options, f = self._fields(), hbarContainer = f.hbarContainer, hbarDrag = f.hbarDrag, vbarContainer = f.vbarContainer, vbarDrag = f.vbarDrag, templateWrapper = f.templateWrapper, contentWrapper = f.contentWrapper, w = contentWrapper.width(), h = contentWrapper.height(), offset = templateWrapper && templateWrapper.offset(), ox = offset && offset.left, oy = offset && offset.top, contentWidth = f.contentWidth, contentHeight = f.contentHeight;

                    contentWrapper.bind("scroll", function (event) {
                        var pos = templateWrapper.position(), x = pos.left, y = pos.top;

                        contentWrapper.scrollTop(0).scrollLeft(0);
                        templateWrapper.css({
                            left: x,
                            top: y
                        });

                        if (x <= 0 && x > w - contentWidth) {
                            self._updateScrollValue(self.scrollPxToValue(-x, "h"), o.hScroller);
                            self._scrollDrag("h", hbarContainer, hbarDrag, true);
                        }

                        if (y <= 0 && y > h - contentHeight) {
                            self._updateScrollValue(self.scrollPxToValue(-y, "v"), o.vScroller);
                            self._scrollDrag("v", vbarContainer, vbarDrag, true);
                        }
                    });
                },
                _buttonMouseDown: function (e) {
                    var self = e.data, button = $(e.currentTarget), wijCSS = self.options.wijCSS;
                    if (self._isDisabled()) {
                        return;
                    }
                    if (!button.hasAllClasses(wijCSS.stateDisabled)) {
                        button.addClass(wijCSS.stateActive);
                        self._buttonScroll(button, self, "buttons");
                    }
                },
                _buttonMouseUp: function (e) {
                    var self = e.data, button = $(e.currentTarget);
                    button.removeClass(self.options.wijCSS.stateActive);
                    self._clearInterval();
                },
                _buttonMouseOut: function (e) {
                    var self = e.data, wijCSS = self.options.wijCSS, button = $(e.currentTarget);

                    button.unbind("mouseout", self._buttonMouseOut).unbind("mousedown", self._buttonMouseDown).unbind("mouseup", self._buttonMouseUp).removeClass(wijCSS.stateHover).removeClass(wijCSS.stateActive);
                    self._clearInterval();
                },
                _updateScrollValue: function (val, scroller) {
                    var ev = $.Event("scrollValueChanged");
                    scroller.scrollValue = val;

                    //TODO: add this event into options
                    this._trigger("scrollValueChanged", ev, scroller);
                },
                _panelKeyDown: function (e) {
                    // Key down handler.
                    var self = e.data, o = self.options, shift = e.shiftKey, keycode = e.keyCode, kCode = wijmo.getKeyCodeEnum();
                    if (!o.keyboardSupport || self._isDisabled()) {
                        return;
                    }

                    if (keycode === kCode.LEFT) {
                        self._doScrolling("left", self, shift);
                    } else if (keycode === kCode.RIGHT) {
                        self._doScrolling("right", self, shift);
                    } else if (keycode === kCode.UP) {
                        self._doScrolling("top", self, shift);
                    } else if (keycode === kCode.DOWN) {
                        self._doScrolling("bottom", self, shift);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                },
                _draggingInternal: function (data, self, scroller, originalElement) {
                    var dir = scroller.dir, h = dir === "h", key = h ? "left" : "top", left = data.position[key] - self._getScrollContainerPadding(key), track = self._getTrackLen(dir) - originalElement[h ? "outerWidth" : "outerHeight"](true), proportion = left / track, topValue = (scroller.scrollMax - scroller.scrollLargeChange + 1), v = proportion * topValue, arg, scrollValue, val;
                    if (v < scroller.scrollMin) {
                        v = scroller.scrollMin;
                    }
                    if (v > topValue) {
                        v = topValue;
                    }
                    arg = {
                        oldValue: scroller.scrollValue,
                        newValue: v,
                        dir: dir
                    };
                    if (!self._scrolling(true, self, arg)) {
                        // event is canceled in scrolling.
                        return;
                    }

                    if (self.customScroll) {
                        val = Math.abs(self.customScroll);
                        scrollValue = self.scrollPxToValue(val, scroller.dir);
                    }
                    self._updateScrollValue(scrollValue || v, scroller);
                    self.customScroll = undefined;

                    self._setDragAndContentPosition(true, false, dir, "dragging");
                },
                _dragging: function (e, data, self) {
                    var o = self.options, originalElement = $(e.target), p = originalElement.parent();
                    if (p.hasAllClasses(hbarContainerCSS)) {
                        self._draggingInternal(data, self, o.hScroller, originalElement);
                    } else {
                        self._draggingInternal(data, self, o.vScroller, originalElement);
                    }
                },
                _panelMouseWheel: function (e, delta) {
                    var self = e.data, o = self.options, originalElement, dir = "", onHbar, hScroller = o.hScroller, vScroller = o.vScroller, scrollEnd;
                    if (!o.mouseWheelSupport || self._isDisabled()) {
                        return;
                    }
                    originalElement = $(e.srcElement || e.originalEvent.target);
                    onHbar = originalElement.closest("." + hbarContainerCSS, self.element).size() > 0;
                    if (delta > 0) {
                        dir = onHbar ? "left" : "top";
                    } else {
                        dir = onHbar ? "right" : "bottom";
                    }

                    if (dir.length > 0) {
                        self._doScrolling(dir, self);
                    }
                    scrollEnd = false;
                    if (dir === "left") {
                        scrollEnd = !self.hNeedScrollBar || Math.abs(hScroller.scrollValue - hScroller.scrollMin) < 0.001;
                    }
                    if (dir === "right") {
                        scrollEnd = !self.hNeedScrollBar || Math.abs(hScroller.scrollValue - (hScroller.scrollMax - self._getHScrollBarLargeChange() + 1)) < 0.001;
                    }
                    if (dir === "top") {
                        scrollEnd = !self.vNeedScrollBar || Math.abs(vScroller.scrollValue - vScroller.scrollMin) < 0.001;
                    }
                    if (dir === "bottom") {
                        scrollEnd = !self.vNeedScrollBar || Math.abs(vScroller.scrollValue - (vScroller.scrollMax - self._getVScrollBarLargeChange() + 1)) < 0.001;
                    }
                    if (!scrollEnd || !o.bubbleScrollingEvent || dir === "left" || dir === "right") {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                },
                _documentMouseUp: function (e) {
                    var self = e.data.self, ele = e.data.ele;
                    ele.removeClass(self.options.wijCSS.stateActive);
                    self._clearInterval();
                    $(document).unbind("mouseup", self._documentMouseUp);
                },
                _scrollerMouseOver: function (e) {
                    var self = e.data, o = self.options, originalElement, ele = null, addhover = false;
                    if (self._isDisabled()) {
                        return;
                    }

                    //Fixed an issue in IE8, In IE8, the originalElement can't get by e.originalEvent.target
                    originalElement = $(e.srcElement || e.originalEvent.target || e.originalEvent.srcElement);

                    if (originalElement.hasAllClasses(o.wijCSS.stateDefault)) {
                        ele = originalElement;
                        addhover = true;
                    } else if (originalElement.parent().hasAllClasses(o.wijCSS.stateDefault)) {
                        ele = originalElement.parent();
                        addhover = true;
                    } else if (originalElement.hasAllClasses(vbarContainerCSS) || originalElement.hasAllClasses(hbarContainerCSS)) {
                        ele = originalElement;
                    }

                    if (ele) {
                        if (addhover) {
                            ele.addClass(o.wijCSS.stateHover);
                        }
                        ele.bind("mouseout." + self.widgetName, self, self._elementMouseOut);
                        ele.bind("mousedown." + self.widgetName, self, self._elementMouseDown);
                        ele.bind("mouseup." + self.widgetName, self, self._elementMouseUp);
                    }
                },
                _elementMouseUp: function (e) {
                    var ele = $(e.currentTarget);
                    ele.removeClass(activeCss);
                },
                _elementMouseDown: function (e) {
                    var ele = $(e.currentTarget), self = e.data, hbarDrag, vbarDrag, scrollDirection = "", large = false, active = false, pos, pos2, f;
                    if (self._isDisabled() || e.which !== 1) {
                        return;
                    }
                    if (ele.hasClass("wijmo-wijsuperpanel-vbar-buttontop")) {
                        scrollDirection = "top";
                        active = true;
                    } else if (ele.hasClass("wijmo-wijsuperpanel-vbar-buttonbottom")) {
                        scrollDirection = "bottom";
                        active = true;
                    } else if (ele.hasClass("wijmo-wijsuperpanel-hbar-buttonleft")) {
                        scrollDirection = "left";
                        active = true;
                    } else if (ele.hasClass("wijmo-wijsuperpanel-hbar-buttonright")) {
                        scrollDirection = "right";
                        active = true;
                    } else if (ele.hasAllClasses(scrollerHandle)) {
                        ele.addClass(activeCss);
                        return;
                    } else if (ele.hasAllClasses(hbarContainerCSS)) {
                        hbarDrag = ele.find("." + scrollerHandle);
                        pos = hbarDrag.offset();
                        if (e.pageX < pos.left) {
                            scrollDirection = "left";
                        } else {
                            scrollDirection = "right";
                        }
                        large = true;
                    } else if (ele.hasAllClasses(vbarContainerCSS)) {
                        vbarDrag = ele.find("." + scrollerHandle);
                        pos2 = vbarDrag.offset();
                        if (e.pageY < pos2.top) {
                            scrollDirection = "top";
                        } else {
                            scrollDirection = "bottom";
                        }
                        large = true;
                    }
                    self._clearInterval();
                    self._doScrolling(scrollDirection, self, large);
                    f = self._fields();
                    self._setScrollingInterval(f, scrollDirection, self, large);
                    if (active) {
                        ele.addClass(activeCss);
                    }
                    $(document).bind("mouseup." + self.widgetName, {
                        self: self,
                        ele: ele
                    }, self._documentMouseUp);
                },
                /**
                * Do scrolling.
                * @param {string} dir Scrolling direction. Options are: "left", "right", "top" and "bottom".
                * @param {boolean} large Whether to scroll a large change.
                */
                doScrolling: function (dir, large) {
                    this._doScrolling(dir, this, large);
                },
                _setScrollerValue: function (dir, scroller, smallChange, largeChange, isAdd, isLarge, self) {
                    var vMin = scroller.scrollMin, change = isLarge ? largeChange : smallChange, value = scroller.scrollValue, t = 0, vTopValue, firstStepChangeFix, data, scrollValue, val;
                    if (!value) {
                        value = vMin;
                    }
                    vTopValue = scroller.scrollMax - largeChange + 1;
                    if (value > vTopValue) {
                        value = vTopValue;
                    }
                    if (isAdd) {
                        if (Math.abs(value - vTopValue) < 0.001) {
                            self._clearInterval();
                            return false;
                        }
                        firstStepChangeFix = scroller.firstStepChangeFix;
                        t = value + change;
                        if (!isLarge && Math.abs(value - vMin) < 0.0001 && !isNaN(firstStepChangeFix)) {
                            t += firstStepChangeFix;
                        }
                        if (t > vTopValue) {
                            t = vTopValue;
                        }
                    } else {
                        if (Math.abs(value - vMin) < 0.001) {
                            self._clearInterval();
                            return false;
                        }
                        t = value - change;
                        if (t < 0) {
                            t = vMin;
                        }
                    }
                    data = {
                        oldValue: scroller.scrollValue,
                        newValue: t,
                        direction: dir,
                        dir: scroller.dir
                    };
                    if (!self._scrolling(true, self, data)) {
                        return false;
                    }

                    if (self.customScroll) {
                        val = Math.abs(self.customScroll);
                        scrollValue = self.scrollPxToValue(val, scroller.dir);
                    }
                    self._updateScrollValue(scrollValue || t, scroller);
                    self.customScroll = undefined;

                    return true;
                },
                _doScrolling: function (dir, self, large) {
                    // Does wijsuperpanel scrolling.
                    // <param name="dir" type="String">
                    // Scroll direction.
                    // Options are: "left", "right", "top" and "bottom".
                    // </param>
                    // <param name="self" type="jQuery">
                    // Pointer to the wijsuperpanel widget instance.
                    // </param>
                    // <param name="large" type="Boolean">
                    // Whether to scroll a large change.
                    // </param>
                    var o = self.options, vScroller = o.vScroller, hScroller = o.hScroller, vSmall = self._getVScrollBarSmallChange(), vLarge = self._getVScrollBarLargeChange(), hLarge = self._getHScrollBarLargeChange(), hSmall = self._getHScrollBarSmallChange();

                    if (dir === "top" || dir === "bottom") {
                        if (!self._setScrollerValue(dir, vScroller, vSmall, vLarge, dir === "bottom", large, self)) {
                            return;
                        }
                        dir = "v";
                    } else if (dir === "left" || dir === "right") {
                        if (!self._setScrollerValue(dir, hScroller, hSmall, hLarge, dir === "right", large, self)) {
                            return;
                        }
                        dir = "h";
                    }
                    self._setDragAndContentPosition(true, true, dir);
                },
                _disableButtonIfNeeded: function (self) {
                    // Disables scrolling buttons.
                    var f = self._fields(), o = self.options, buttonLeft = f.buttonLeft, buttonRight = f.buttonRight, buttonTop = f.buttonTop, buttonBottom = f.buttonBottom, hLargeChange, hMax, hValue, hScrollMin, vLargeChange, vMax, vValue, vScrollMin;
                    if (f.intervalID > 0) {
                        window.clearInterval(f.intervalID);
                    }

                    if (buttonLeft !== undefined) {
                        hLargeChange = self._getHScrollBarLargeChange();

                        hMax = o.hScroller.scrollMax - hLargeChange + 1;
                        hValue = o.hScroller.scrollValue;
                        hScrollMin = o.hScroller.scrollMin;

                        if (hValue === undefined) {
                            hValue = hScrollMin;
                        }
                        if (Math.abs(hValue - hScrollMin) < 0.001 || !f.hScrolling) {
                            buttonLeft.addClass(o.wijCSS.stateDisabled);
                        } else {
                            buttonLeft.removeClass(o.wijCSS.stateDisabled);
                        }

                        if (Math.abs(hValue - hMax) < 0.001 || !f.hScrolling) {
                            buttonRight.addClass(o.wijCSS.stateDisabled);
                        } else {
                            buttonRight.removeClass(o.wijCSS.stateDisabled);
                        }
                    }

                    if (buttonTop !== undefined) {
                        vLargeChange = self._getVScrollBarLargeChange();
                        vMax = o.vScroller.scrollMax - vLargeChange + 1;
                        vValue = o.vScroller.scrollValue;
                        vScrollMin = o.vScroller.scrollMin;
                        if (vValue === undefined) {
                            vValue = vScrollMin;
                        }
                        if (Math.abs(vValue - vScrollMin) < 0.001 || !f.vScrolling) {
                            buttonTop.addClass(o.wijCSS.stateDisabled);
                        } else {
                            buttonTop.removeClass(o.wijCSS.stateDisabled);
                        }

                        if (Math.abs(vValue - vMax) < 0.001 || !f.vScrolling) {
                            buttonBottom.addClass(o.wijCSS.stateDisabled);
                        } else {
                            buttonBottom.removeClass(o.wijCSS.stateDisabled);
                        }
                    }
                },
                _clearInterval: function () {
                    var f = this._fields(), intervalID = f.internalFuncID;
                    if (intervalID > 0) {
                        window.clearInterval(intervalID);
                        f.internalFuncID = -1;
                    }
                },
                _elementMouseOut: function (event) {
                    var ele = $(event.currentTarget), self = event.data;

                    ele.unbind("mouseout", self._elementMouseOut);
                    ele.unbind("mousedown", self._elementMouseDown);
                    ele.unbind("mouseup", self._elementMouseUp);

                    ele.removeClass(self.options.wijCSS.stateHover);
                },
                _getScrollOffset: function (child1) {
                    var child = $(child1), f = this._fields(), cWrapper = f.contentWrapper, tempWrapper = f.templateWrapper, childOffset, templateOffset, cWrapperOffset, tDistance, bDistance, lDistance, rDistance, result = { left: null, top: null };

                    if (child.length === 0) {
                        return result;
                    }
                    childOffset = child.offset();
                    templateOffset = tempWrapper.offset();

                    childOffset.leftWidth = childOffset.left + child.outerWidth();
                    childOffset.topHeight = childOffset.top + child.outerHeight();
                    cWrapperOffset = cWrapper.offset();
                    cWrapperOffset.leftWidth = cWrapperOffset.left + cWrapper.outerWidth();
                    cWrapperOffset.topHeight = cWrapperOffset.top + cWrapper.outerHeight();

                    lDistance = childOffset.left - templateOffset.left;
                    if (childOffset.left < cWrapperOffset.left) {
                        result.left = lDistance;
                    } else if (childOffset.leftWidth > cWrapperOffset.leftWidth) {
                        rDistance = childOffset.leftWidth - templateOffset.left - cWrapper.innerWidth();
                        if (lDistance < rDistance) {
                            result.left = lDistance;
                        } else {
                            result.left = rDistance;
                        }
                    }

                    tDistance = childOffset.top - templateOffset.top;
                    if (childOffset.top < cWrapperOffset.top) {
                        result.top = tDistance;
                    } else if (childOffset.topHeight > cWrapperOffset.topHeight) {
                        bDistance = childOffset.topHeight - templateOffset.top - cWrapper.innerHeight();
                        if (tDistance < bDistance) {
                            result.top = tDistance;
                        } else {
                            result.top = bDistance;
                        }
                    }

                    return result;
                },
                _scrollDrag: function (dir, hbarContainer, hbarDrag, fireScrollEvent) {
                    var self = this, o = self.options, v = dir === "v", scroller = v ? o.vScroller : o.hScroller, hMin = scroller.scrollMin, hMax = scroller.scrollMax, hValue = scroller.scrollValue === undefined ? hMin : (scroller.scrollValue - hMin), hLargeChange = self._getLargeChange(dir), max = hMax - hMin - hLargeChange + 1, dragleft = -1, track, drag, padding;

                    if (hValue > max) {
                        hValue = max;
                    }

                    if (hbarContainer !== undefined) {
                        track = self._getTrackLen(dir);
                        drag = hbarDrag[v ? "outerHeight" : "outerWidth"]();
                        padding = self._getScrollContainerPadding(v ? "top" : "left");
                        dragleft = (hValue / max) * (track - drag) + padding;
                    }

                    if (dragleft >= 0) {
                        hbarDrag.css(v ? "top" : "left", dragleft + "px");
                    }

                    self._scrollEnd(fireScrollEvent, self, dir, hValue);
                },
                /**
                * Determine whether scoll the child DOM element to view
                * need to scroll the scroll bar
                * @param {DOMElement} child The child to scroll to.
                */
                needToScroll: function (child) {
                    var offset = this._getScrollOffset(child);
                    return offset.top !== null || offset.left !== null;
                },
                /**
                * Scroll children DOM element to view.
                * @param {DOMElement} child The child to scroll to.
                */
                scrollChildIntoView: function (child) {
                    var offset = this._getScrollOffset(child), left = offset.left, top = offset.top;

                    if (left !== null) {
                        this.hScrollTo(left);
                    }
                    if (top !== null) {
                        this.vScrollTo(top);
                    }
                },
                /**
                * Scroll to horizontal position.
                * @param {number} x The position to scroll to.
                * @param {bool} isScrollValue A value that indicates whether x is value or pixel.
                */
                hScrollTo: function (x, isScrollValue) {
                    var o = this.options;
                    this._updateScrollValue(!!isScrollValue ? x : this.scrollPxToValue(x, "h"), o.hScroller);
                    this._setDragAndContentPosition(true, true, "h", "nonestop");
                },
                /**
                * Scroll to vertical position.
                * @param {number} y The position to scroll to.
                * @param {bool} isScrollValue A value that indicates whether y is value or pixel.
                */
                vScrollTo: function (y, isScrollValue) {
                    var o = this.options;
                    this._updateScrollValue(!!isScrollValue ? y : this.scrollPxToValue(y, "v"), o.vScroller);
                    this._setDragAndContentPosition(true, true, "v", "nonestop");
                },
                /**
                * Convert pixel to scroll value.
                * For example, wijsuperpanel scrolled 50px
                * which is value 1 after conversion.
                * @param {number} px Length of scrolling.
                * @param {string} dir Scrolling direction. Options are: "h" and "v".
                */
                scrollPxToValue: function (px, dir) {
                    var o = this.options, m = (dir === "h" ? "outerWidth" : "outerHeight"), m1 = (dir === "h" ? "contentWidth" : "contentHeight"), scroller = (dir === "h" ? "hScroller" : "vScroller"), f = this._fields(), cWrapper = f.contentWrapper, size = f[m1], contentHeight = cWrapper[m](), vMin = o[scroller].scrollMin, vMax = o[scroller].scrollMax, vRange = vMax - vMin, vLargeChange = (dir === "h" ? this._getHScrollBarLargeChange() : this._getVScrollBarLargeChange()), maxv = vRange - vLargeChange + 1, ret = maxv * (px / (size - contentHeight));
                    if (ret < vMin) {
                        ret = vMin;
                    }
                    if (ret > maxv) {
                        ret = maxv;
                    }
                    return ret;
                },
                /**
                * Convert scroll value to pixel.
                * For example, scroll value is 1
                * which makes wijsuperpanel scrolled 50px after conversion.
                * @param {number} scroll value.
                * @param {string} dir Scrolling direction. Options are: "h" and "v".
                */
                scrollValueToPx: function (value, dir) {
                    var self = this, o = self.options, f = self._fields(), h = dir === "h", outerDir, contentDir, scroller, cWrapper, size, contentSize, min, max, largeChange, maxv, px;

                    outerDir = h ? "outerWidth" : "outerHeight";
                    contentDir = h ? "contentWidth" : "contentHeight";
                    scroller = h ? "hScroller" : "vScroller";
                    largeChange = h ? self._getHScrollBarLargeChange() : self._getVScrollBarLargeChange();

                    cWrapper = f.contentWrapper;
                    size = f[contentDir];
                    contentSize = cWrapper[outerDir]();
                    min = o[scroller].scrollMin;
                    max = o[scroller].scrollMax;
                    maxv = (max - min) - largeChange + 1;
                    if (value === undefined || value < min) {
                        value = min;
                    }
                    if (value > maxv) {
                        value = maxv;
                    }
                    px = (size - contentSize) * (value / maxv);
                    return Math.round(px);
                },
                /**
                * Scroll to the specified position.
                * which is value 1 after conversion.
                * @param {number} x Horizontal position to scroll to.
                * @param {number} y Vertical position to scroll to.
                * @param {bool} isScrollValue A value that indicates whether the x, y are value or pixel.
                */
                scrollTo: function (x, y, isScrollValue) {
                    this.hScrollTo(x, isScrollValue);
                    this.vScrollTo(y, isScrollValue);
                },
                /**
                * Refreshes wijsuperpanel.
                * Needs to be called after content being changed.
                * @returns {boolean} Returns true if it is successful, else returns false.
                */
                refresh: function () {
                    this.paintPanel();
                },
                /** @ignore
                * Refreshes wijsuperpanel.
                * Needs to be called after content being changed.
                * @returns {boolean} Returns true if it is successful, else returns false.
                */
                paintPanel: function (unfocus) {
                    var self = this, ele = self.element, focused, o, f, templateWrapper, compatibilityIE = $.browser.msie && parseInt($.browser.version.split(".")[0]) < 8;
                    if (ele.is(":visible")) {
                        focused = typeof document.activeElement != 'unknown' ? document.activeElement : undefined;
                        o = self.options;
                        f = self._fields();
                        if (!f.initialized) {
                            self._initialize(f, ele, self);
                        }
                        self._resetLargeChange(self, f, o);
                        self._bindElementEvents(self, f, ele, o);
                        templateWrapper = f.templateWrapper;
                        templateWrapper.css({
                            "float": "left", left: "0px", top: "0px",
                            width: "auto", height: "auto"
                        });
                        if (compatibilityIE) {
                            templateWrapper.css("position", "absolute");
                        }

                        // hide and show wrapper div to force the width to change
                        // for some browser.
                        templateWrapper.hide();
                        templateWrapper.show();
                        f.contentWidth = templateWrapper.width();
                        f.contentHeight = templateWrapper.height();
                        templateWrapper.css("float", "");

                        self._setRounder(self, ele);
                        self._setInnerElementsSize(f, ele);
                        if (self._testScroll(self, f, o) === false) {
                            return false;
                        }
                        if (compatibilityIE) {
                            templateWrapper.css("position", "");
                        }

                        self._initScrollBars(self, f, o);
                        self._initScrollButtons(self, f, o);
                        self._trigger("painted");

                        self._paintedMark = {
                            date: new Date(), mainWidth: ele[0].offsetWidth,
                            mainHeight: ele[0].offsetHeight, width: f.contentWidth,
                            height: f.contentHeight
                        };
                        if (focused !== undefined && !unfocus) {
                            $(focused).focus();
                        }
                        return true;
                    }
                    return false;
                },
                _adjustScrollValue: function (dir) {
                    var isHori = dir === "h", self = this, o = this.options, needScroll = isHori ? self.hNeedScrollBar : self.vNeedScrollBar, scroller = isHori ? o.hScroller : o.vScroller, max = scroller.scrollMax, min = scroller.scrollMin, largeChange, topValue;

                    if (needScroll) {
                        largeChange = isHori ? self._getHScrollBarLargeChange() : self._getVScrollBarLargeChange();
                        topValue = max - largeChange + 1;
                        if (scroller.scrollValue > topValue) {
                            scroller.scrollValue = topValue;
                        }
                        if (scroller.scrollValue < min) {
                            scroller.scrollValue = min;
                        }
                    }
                },
                _resetLargeChange: function (self, f, o) {
                    var handle;
                    if (self._autoVLarge) {
                        o.vScroller.scrollLargeChange = null;
                    }
                    if (self._autoHLarge) {
                        o.hScroller.scrollLargeChange = null;
                    }
                    f.vTrackLen = undefined;
                    f.hTrackLen = undefined;
                    if (f.vbarContainer) {
                        // fixed bug when the original draggable element removed when it's being dragged.
                        // use detach to keep the events to be fired(IE).
                        handle = f.vbarContainer.children("." + scrollerHandle + ":eq(0)");

                        if (handle.data("ui-draggable")) {
                            handle.draggable("destroy");
                        }

                        handle.detach();

                        f.vbarContainer.remove();
                        f.vbarContainer = undefined;
                    }
                    if (f.hbarContainer) {
                        handle = f.hbarContainer.children("." + scrollerHandle + ":eq(0)");

                        if (handle.data("ui-draggable")) {
                            handle.draggable("destroy");
                        }

                        handle.detach();

                        f.hbarContainer.remove();
                        f.hbarContainer = undefined;
                    }
                },
                _initialize: function (f, ele, self) {
                    var wijCSS = self.options.wijCSS;

                    f.initialized = true;

                    // ensure width and height
                    ele.addClass(["wijmo-wijsuperpanel", wijCSS.widget, wijCSS.content].join(' '));
                    f.oldHeight = ele.css("height");
                    var old = ele.css("overflow");
                    ele.css("overflow", "");

                    // set height to element
                    ele.height(ele.height());
                    ele.css("overflow", old);

                    self._createAdditionalDom(self, f, ele);
                },
                /**
                * Gets the content element of wijsuperpanel.
                * @example $("selector").wijsuperpanel("getContentElement");
                * @returns {jQuery}
                */
                getContentElement: function () {
                    return this._fields().templateWrapper;
                },
                _setButtonPosition: function (self, o, scroller, dir, target, f, state) {
                    var h = dir === "h", mouseoverkey = "mouseover." + self.widgetName, decKey = h ? "buttonLeft" : "buttonTop", incKey = h ? "buttonRight" : "buttonBottom", decButton = f[decKey], incButton = f[incKey], html, buttons, defaultPosition;
                    if (self._hasMode(scroller, "buttons") || self._hasMode(scroller, "buttonshover")) {
                        html = h ? hButtons : vButtons;
                        if (decButton === undefined) {
                            buttons = $(html).appendTo(state);
                            buttons.bind(mouseoverkey, self, self._scrollButtonMouseOver);
                            f[decKey] = decButton = state.children(h ? ".wijmo-wijsuperpanel-buttonleft" : ".wijmo-wijsuperpanel-buttontop");
                            f[incKey] = incButton = state.children(h ? ".wijmo-wijsuperpanel-buttonright" : ".wijmo-wijsuperpanel-buttonbottom");
                        }
                        defaultPosition = {
                            my: h ? "left" : "top",
                            of: target,
                            at: h ? "left" : "top",
                            collision: "none"
                        };
                        $.extend(defaultPosition, scroller.decreaseButtonPosition);
                        decButton.position(defaultPosition);
                        defaultPosition = {
                            my: h ? "right" : "bottom",
                            of: target,
                            at: h ? "right" : "bottom",
                            collision: "none"
                        };
                        $.extend(defaultPosition, scroller.increaseButtonPosition);
                        incButton.position(defaultPosition);
                    } else if (decButton !== undefined) {
                        decButton.remove();
                        incButton.remove();
                        f[decKey] = f[incKey] = undefined;
                    }
                },
                _initScrollButtons: function (self, f, o) {
                    var a = f.contentWrapper, state = f.stateContainer;
                    self._setButtonPosition(self, o, o.hScroller, "h", a, f, state);
                    self._setButtonPosition(self, o, o.vScroller, "v", a, f, state);
                },
                _getVScrollBarSmallChange: function () {
                    var o = this.options, va;
                    if (!o.vScroller.scrollSmallChange) {
                        va = this._getVScrollBarLargeChange();
                        o.vScroller.scrollSmallChange = va / 2;
                    }
                    return o.vScroller.scrollSmallChange;
                },
                _getVScrollBarLargeChange: function () {
                    return this._getLargeChange("v");
                },
                _getLargeChange: function (dir) {
                    var self = this, o = self.options, f = self._fields(), v = dir === "v", scroller = v ? o.vScroller : o.hScroller, clientKey = v ? "innerHeight" : "innerWidth", offsetKey = v ? "contentHeight" : "contentWidth", autoKey = v ? "_autoVLarge" : "_autoHLarge", hMax, hMin, hRange, content, contentWidth, wrapperWidth, percent, large;

                    if (scroller.scrollLargeChange) {
                        return scroller.scrollLargeChange;
                    }

                    // calculate large change if empty
                    hMax = scroller.scrollMax;
                    hMin = scroller.scrollMin;
                    hRange = hMax - hMin;

                    content = f.contentWrapper;
                    contentWidth = content[clientKey]();
                    wrapperWidth = f[offsetKey];

                    percent = contentWidth / (wrapperWidth - contentWidth);
                    large = ((hRange + 1) * percent) / (1 + percent);
                    if (isNaN(large)) {
                        large = 0;
                    }
                    scroller.scrollLargeChange = large;

                    self[autoKey] = true;
                    return scroller.scrollLargeChange;
                },
                _getHScrollBarSmallChange: function () {
                    var o = this.options, va;
                    if (!o.hScroller.scrollSmallChange) {
                        va = this._getHScrollBarLargeChange();
                        o.hScroller.scrollSmallChange = va / 2;
                    }
                    return o.hScroller.scrollSmallChange;
                },
                _getHScrollBarLargeChange: function () {
                    return this._getLargeChange("h");
                },
                _initScrollBars: function (self, f, o) {
                    // Set scroll bar initial position.
                    var hScroller = o.hScroller, hMax = hScroller.scrollMax, hMin = hScroller.scrollMin, hRange = hMax - hMin, vScroller = o.vScroller, vMax = vScroller.scrollMax, vMin = vScroller.scrollMin, vRange = vMax - vMin, hbarDrag = f.hbarDrag, vbarDrag = f.vbarDrag, hLargeChange, track, dragLen, difference, icon, vLargeChange, track1, dragLen1, difference1, icon1;

                    if (self.hNeedScrollBar && hbarDrag.is(":visible")) {
                        hLargeChange = self._getHScrollBarLargeChange();
                        track = self._getTrackLen("h");
                        dragLen = self._getDragLength(hRange, hLargeChange, track, o.hScroller.scrollMinDragLength);
                        hbarDrag.width(dragLen);
                        difference = hbarDrag.outerWidth(true) - hbarDrag.width();
                        hbarDrag.width(dragLen - difference);
                        icon = hbarDrag.children("span");
                        icon.css("margin-left", (hbarDrag.width() - icon[0].offsetWidth) / 2);
                        if (track <= hbarDrag.outerWidth(true)) {
                            hbarDrag.hide();
                        } else {
                            hbarDrag.show();
                        }

                        //fixed bug the dragger will be reset after refresh
                        if (self._isDragging == true) {
                            $(document).trigger("mouseup");
                            self._isDragging = false;
                        }
                    }
                    if (self.vNeedScrollBar && vbarDrag.is(":visible")) {
                        vLargeChange = self._getVScrollBarLargeChange();
                        track1 = self._getTrackLen("v");
                        dragLen1 = self._getDragLength(vRange, vLargeChange, track1, o.vScroller.scrollMinDragLength);
                        vbarDrag.height(dragLen1);
                        difference1 = vbarDrag.outerHeight(true) - vbarDrag.height();
                        vbarDrag.height(dragLen1 - difference1);
                        icon1 = vbarDrag.children("span");
                        icon1.css("margin-top", (vbarDrag.height() - icon1[0].offsetHeight) / 2);
                        if (track1 <= vbarDrag.outerHeight(true)) {
                            vbarDrag.hide();
                        } else {
                            vbarDrag.show();
                        }

                        //fixed bug the dragger will be reset after refresh
                        if (self._isDragging == true) {
                            $(document).trigger("mouseup");
                            self._isDragging = false;
                        }
                    }
                    self._setDragAndContentPosition(false, false, "both");
                },
                _getTrackLen: function (dir) {
                    // Get the length of the track.
                    // <param name="dir" type="String">
                    // Options are: "v" and "h".
                    // "v" - Vertical scroll track.
                    // "h" - Horizontal scroll track.
                    // </param>
                    var self = this, f = self._fields(), key = dir + "TrackLen", hbarContainer = f.hbarContainer, vbarContainer = f.vbarContainer, track = 0, padding = 0, border = 0;
                    if (f[key] !== undefined) {
                        return f[key];
                    }

                    if (dir === "h") {
                        padding = self._getScrollContainerPadding("h");
                        border = self._getScrollContainerBorders("h");
                        track = hbarContainer.innerWidth();
                    }
                    if (dir === "v") {
                        padding = self._getScrollContainerPadding("v");
                        border = self._getScrollContainerBorders("v");
                        track = vbarContainer.innerHeight();
                    }
                    f[key] = (track - padding - border);
                    return f[key];
                },
                _getScrollContainerPadding: function (paddingType) {
                    // Get the padding of the scroll bar container.
                    var self = this, f = self._fields(), padding = 0, container, key;
                    if (paddingType === "h") {
                        padding = self._getScrollContainerPadding("left") + self._getScrollContainerPadding("right");
                    } else if (paddingType === "v") {
                        padding = self._getScrollContainerPadding("top") + self._getScrollContainerPadding("bottom");
                    } else {
                        if (paddingType === "left" || paddingType === "right") {
                            container = f.hbarContainer;
                        } else {
                            container = f.vbarContainer;
                        }
                        key = paddingType + "Padding";
                        if (f[key] !== undefined) {
                            padding = f[key];
                            return padding;
                        }
                        if (container && container.css) {
                            padding = parseFloat(container.css("padding-" + paddingType));
                        }
                        f[key] = padding;
                    }
                    return padding;
                },
                _getScrollContainerBorders: function (dir) {
                    // Get the border width of the scroll bar container.
                    var self = this, f = self._fields(), borders = 0, key;
                    key = dir + "Borders";
                    if (f[key] !== undefined) {
                        borders = f[key];
                        return borders;
                    }
                    if (dir === "h") {
                        borders = self._getScrollContainerBorder("left") + self._getScrollContainerBorder("right");
                    } else if (dir === "v") {
                        borders = self._getScrollContainerBorder("top") + self._getScrollContainerBorder("bottom");
                    }
                    f[key] = borders;
                    return borders;
                },
                _getScrollContainerBorder: function (borderType) {
                    var self = this, f = self._fields(), border = 0, container, key, borderStyle, borderWidth;
                    if (borderType === "left" || borderType === "right") {
                        container = f.hbarContainer;
                    } else {
                        container = f.vbarContainer;
                    }
                    key = borderType + "Border";
                    if (f[key] !== undefined) {
                        border = f[key];
                        return border;
                    }
                    if (container && container.css) {
                        borderWidth = container.css("border-" + borderType + "-width").toLowerCase();
                        border = parseFloat(borderWidth);
                        if (isNaN(border)) {
                            borderStyle = container.css("border-" + borderType + "-style").toLowerCase();
                            switch (borderStyle) {
                                case "none":
                                case "hidden":
                                    border = 0;
                                    break;
                                default:
                                    switch (borderWidth) {
                                        case "thin":
                                            border = 1;
                                            break;
                                        case "medium":
                                            border = 3;
                                            break;
                                        case "thick":
                                            border = 5;
                                            break;
                                        default:
                                            border = 0;
                                            break;
                                    }
                                    break;
                            }
                        }
                    }
                    f[key] = border;

                    return border;
                },
                _triggerScroll: function (contentLeft, dir, contentAnimationOptions) {
                    var data = {
                        position: contentLeft,
                        dir: dir,
                        animationOptions: contentAnimationOptions
                    };
                    this._trigger("scroll", null, data);
                },
                _contentDragAnimate: function (dir, animated, hbarContainer, hbarDrag, stop, fireScrollEvent, dragging) {
                    var self = this, o = self.options, v = dir === "v", scroller = v ? o.vScroller : o.hScroller, tempKey = v ? "outerHeight" : "outerWidth", paddingKey = v ? "top" : "left", hMin = scroller.scrollMin, hMax = scroller.scrollMax, hRange = hMax - hMin, hValue = scroller.scrollValue === undefined ? hMin : scroller.scrollValue, hLargeChange = self._getLargeChange(dir), max = hRange - hLargeChange + 1, f = self._fields(), tempWrapper = f.templateWrapper, contentLeft, dragleft, track, drag, r, padding, dragAnimationOptions, properties, contentAnimationOptions, userComplete, properties1, key;

                    hValue = Math.max(hValue, hMin);
                    hValue = Math.min(hValue, max);

                    contentLeft = self.scrollValueToPx(hValue, dir);
                    dragleft = -1;
                    if (hbarContainer !== undefined) {
                        if (animated && hbarDrag.is(":animated") && stop !== "nonestop") {
                            hbarDrag.stop(true, false);
                        }
                        track = self._getTrackLen(dir);
                        drag = hbarDrag[tempKey](true);
                        r = track - drag;
                        padding = self._getScrollContainerPadding(paddingKey);
                        dragleft = (hValue / max) * r + padding;
                    }
                    if (animated && o.animationOptions && !o.animationOptions.disabled) {
                        if (dragleft >= 0 && dragging !== "dragging") {
                            dragAnimationOptions = $.extend({}, o.animationOptions);

                            // not trigger scrolled when stop
                            dragAnimationOptions.complete = undefined;
                            if (v) {
                                properties = { top: dragleft };
                            } else {
                                properties = { left: dragleft };
                            }
                            hbarDrag.animate(properties, dragAnimationOptions);
                        }
                        contentAnimationOptions = $.extend({}, o.animationOptions);
                        userComplete = o.animationOptions.complete;
                        contentAnimationOptions.complete = function () {
                            self._scrollEnd(fireScrollEvent, self, dir, hValue);
                            if ($.isFunction(userComplete)) {
                                userComplete(arguments);
                            }
                        };
                        if (animated && tempWrapper.is(":animated") && stop !== "nonestop") {
                            tempWrapper.stop(true, false);
                        }
                        if (v) {
                            properties1 = { top: -contentLeft };
                        } else {
                            properties1 = { left: -contentLeft };
                        }

                        if (!o.customScrolling) {
                            tempWrapper.animate(properties1, contentAnimationOptions);
                        } else {
                            self._scrollEnd(fireScrollEvent, self, dir, hValue);
                        }
                        self._triggerScroll(contentLeft, dir, contentAnimationOptions);
                    } else {
                        key = v ? "top" : "left";
                        if (hbarContainer && hbarDrag) {
                            if (dragleft >= 0 && dragging !== "dragging") {
                                hbarDrag[0].style[key] = dragleft + "px";
                            }
                        }
                        if (!o.customScrolling) {
                            tempWrapper[0].style[key] = -contentLeft + "px";
                        }
                        self._triggerScroll(contentLeft, dir);
                        self._scrollEnd(fireScrollEvent, self, dir, hValue);
                    }
                },
                _setDragAndContentPosition: function (fireScrollEvent, animated, dir, stop, dragging) {
                    var self = this, f = self._fields(), hbarContainer = f.hbarContainer, hbarDrag = f.hbarDrag, vbarContainer = f.vbarContainer, vbarDrag = f.vbarDrag;
                    if ((dir === "both" || dir === "h") && f.hScrolling) {
                        self._contentDragAnimate("h", animated, hbarContainer, hbarDrag, stop, fireScrollEvent, dragging);
                    }
                    if ((dir === "both" || dir === "v") && f.vScrolling) {
                        self._contentDragAnimate("v", animated, vbarContainer, vbarDrag, stop, fireScrollEvent, dragging);
                    }
                    if (f.intervalID > 0) {
                        window.clearInterval(f.intervalID);
                    }
                    f.intervalID = window.setInterval(function () {
                        self._disableButtonIfNeeded(self);
                    }, 500);
                },
                _scrolling: function (fireEvent, self, d) {
                    var r = true;
                    if (fireEvent) {
                        d.beforePosition = self.getContentElement().position();
                        self._beforePosition = d.beforePosition;
                        r = self._trigger("scrolling", null, d);
                        self.customScroll = d.customScroll;
                    }
                    return r;
                },
                _scrollEnd: function (fireEvent, self, dir, newValue) {
                    if (fireEvent) {
                        // use settimeout to return to caller immediately.
                        window.setTimeout(function () {
                            var content = self.getContentElement(), after, d;
                            if (!content.is(":visible")) {
                                return;
                            }
                            after = self.getContentElement().position();
                            d = {
                                dir: dir,
                                beforePosition: self._beforePosition,
                                afterPosition: after
                            };
                            if (!isNaN(newValue)) {
                                d.newValue = newValue;
                            }
                            self._trigger("scrolled", null, d);
                        }, 0);
                    }
                },
                _getDragLength: function (range, largeChange, track, min) {
                    var divide = range / largeChange, dragLength = track / divide, minidrag = min;
                    if (dragLength < minidrag) {
                        dragLength = minidrag;
                    } else if ((dragLength + 1) >= track) {
                        dragLength = track - 1;
                    }
                    return Math.round(dragLength);
                },
                _needScrollbar: function (scroller, needscroll) {
                    var scrollbarMode = this._hasMode(scroller, "scrollbar"), barVisibility = scroller.scrollBarVisibility, needScrollBar = scrollbarMode && (barVisibility === "visible" || (barVisibility === "auto" && needscroll));
                    return needScrollBar;
                },
                _bindBarEvent: function (barContainer, barDrag, dir) {
                    var self = this;
                    barContainer.bind("mouseover." + self.widgetName, self, self._scrollerMouseOver);
                    if (!$.fn.draggable) {
                        self._createCustomDraggable(barDrag);
                        return;
                    }
                    barDrag.draggable({
                        axis: dir === "h" ? "x" : "y",
                        start: function (e, data) {
                            //fixed an issue that when disabled, the bar can be dragged.
                            if (self._isDisabled()) {
                                return false;
                            }
                            self._isDragging = true;
                        },
                        drag: function (e, data) {
                            self._dragging(e, data, self);
                        },
                        containment: "parent",
                        stop: function (e) {
                            self._dragStop(e, self, dir);
                            $(e.target).removeClass(activeCss);
                            self._isDragging = false;
                        }
                    });
                },
                _createCustomDraggable: function (dragElement) {
                    var self = this, mouseHasDown = false, mouseMoving = false, dir, originalPosition, newPosition;

                    dir = dragElement.parent().hasAllClasses(hbarContainerCSS) ? "h" : "v";

                    var dragEleMouseMoving = function (e) {
                        var dValue, newValue, data;
                        if (!mouseHasDown) {
                            return;
                        }
                        mouseMoving = true;
                        newPosition = { x: e.pageX, y: e.pageY };
                        if (dir === "h") {
                            dValue = newPosition.x - originalPosition.x;
                            newValue = parseFloat(dragElement.css("left")) + dValue;
                            data = { position: { "left": newValue } };
                        } else {
                            dValue = newPosition.y - originalPosition.y;
                            newValue = parseFloat(dragElement.css("top")) + dValue;
                            data = { position: { "top": newValue } };
                        }
                        originalPosition = { x: e.pageX, y: e.pageY };
                        e.stopPropagation();

                        self._isDragging = true;
                        self._dragging(e, data, self);
                    };

                    var dragEleMouseDown = function (e) {
                        mouseHasDown = true;
                        originalPosition = { x: e.pageX, y: e.pageY };
                        dragElement.unbind("wijmousemove." + this.widgetName + "CustomDrag");
                        if (!self._isDisabled()) {
                            dragElement.bind("wijmousemove." + this.widgetName + "CustomDrag", dragEleMouseMoving);
                            e.preventDefault();
                        }
                    };

                    var dragEleMouseUp = function (e) {
                        if (!mouseHasDown) {
                            return;
                        }
                        if (mouseMoving) {
                            self._dragStop(e, self, dir);
                            dragElement.removeClass(activeCss);
                            mouseMoving = false;
                            self._isDragging = false;
                        }
                        mouseHasDown = false;
                        dragElement.unbind("wijmousemove." + this.widgetName + "CustomDrag", dragEleMouseMoving);
                    };

                    // Make sure these events can be binded only one time.
                    dragElement.unbind("." + this.widgetName + "CustomDrag");
                    $(document).unbind("." + this.widgetName + "CustomDrag");

                    dragElement.bind("wijmousedown." + this.widgetName + "CustomDrag", dragEleMouseDown);
                    dragElement.bind("wijmouseup." + this.widgetName + "CustomDrag", dragEleMouseUp);
                    $(document).bind("wijmouseup." + this.widgetName + "CustomDrag", dragEleMouseUp);
                },
                _createBarIfNeeded: function (hNeedScrollBar, scrollerWrapper, dir, html, content) {
                    if (hNeedScrollBar) {
                        var self = this, data, f = self._fields(), strBarContainer = dir + "barContainer", strBarDrag = dir + "barDrag", hbar = dir === "h", contentLength = content[hbar ? "innerHeight" : "innerWidth"](), c = f[strBarContainer] = $(html), targetBarLen, d;

                        scrollerWrapper.append(c);
                        targetBarLen = c[0][hbar ? "offsetHeight" : "offsetWidth"];
                        contentLength = contentLength - targetBarLen;

                        data = {
                            direction: hbar ? "horizontal" : "vertical",
                            targetBarLen: targetBarLen,
                            contentLength: contentLength
                        };

                        if (self._trigger(hbar ? "hScrollerActivating" : "vScrollerActivating", null, data) === false) {
                            return false;
                        }

                        d = f[strBarDrag] = c.find("." + scrollerHandle);
                        self._bindBarEvent(c, d, dir);

                        content[hbar ? "height" : "width"](contentLength);
                    }
                },
                _setScrollbarPosition: function (wrapper, self, content, targetBarContainer, referBarContainer, targetNeedScrollBar, referNeedScrollBar, targetScrollBarPosition, referScrollBarPosition, dir, scrollingNeed) {
                    var hbar = dir === "h", targetBarLen, targetPadding, targetBorder, targetBarPosition, barPosition1, contentPosition1, barPosition2, contentPosition2, contentLength2, referBarWidth, css = self.options.wijCSS;
                    if (targetNeedScrollBar) {
                        targetBarLen = targetBarContainer[0][hbar ? "offsetHeight" : "offsetWidth"];
                        targetPadding = self._getScrollContainerPadding(dir);
                        targetBorder = self._getScrollContainerBorders(dir);
                        targetBarPosition = hbar ? "top" : "left";
                        barPosition1 = hbar ? {
                            top: "0px", bottom: "auto", left: "auto",
                            right: "auto"
                        } : {
                            left: "0px", right: "auto", top: "auto",
                            bottom: "auto"
                        };
                        contentPosition1 = hbar ? { top: targetBarLen + "px", left: null } : { left: targetBarLen + "px" };

                        barPosition2 = hbar ? {
                            top: "auto", right: "auto", left: "auto",
                            bottom: "0px"
                        } : {
                            left: "auto", right: "0px", top: "auto",
                            bottom: "auto"
                        };
                        contentPosition2 = hbar ? { top: "", left: null } : { left: "" };
                        contentLength2 = content[hbar ? "innerWidth" : "innerHeight"]();
                        if (targetScrollBarPosition === targetBarPosition) {
                            targetBarContainer.css(barPosition1);
                            content.css(contentPosition1);
                            if (hbar) {
                                targetBarContainer.children(".wijmo-wijsuperpanel-hbar-buttonleft").removeClass(css.cornerBL).addClass(css.cornerTL);
                                targetBarContainer.children(".wijmo-wijsuperpanel-hbar-buttonright").removeClass(css.cornerBR).addClass(css.cornerTR);
                                targetBarContainer.removeClass(css.cornerBottom).addClass(css.cornerTop);
                            } else {
                                targetBarContainer.children(".wijmo-wijsuperpanel-vbar-buttontop").removeClass(css.cornerTR).addClass(css.cornerTL);
                                targetBarContainer.children(".wijmo-wijsuperpanel-vbar-buttonbottom").removeClass(css.cornerBR).addClass(css.cornerBL);
                                targetBarContainer.removeClass(css.cornerRight).addClass(css.cornerLeft);
                            }
                        } else {
                            targetBarContainer.css(barPosition2);
                            content.css(contentPosition2);
                            if (hbar) {
                                targetBarContainer.children(".wijmo-wijsuperpanel-hbar-buttonleft").removeClass(css.cornerTL).addClass(css.cornerBL);
                                targetBarContainer.children(".wijmo-wijsuperpanel-hbar-buttonright").removeClass(css.cornerBL).addClass(css.cornerBR);
                                targetBarContainer.removeClass(css.cornerTop).addClass(css.cornerBottom);
                            } else {
                                targetBarContainer.children(".wijmo-wijsuperpanel-vbar-buttontop").removeClass(css.cornerTL).addClass(css.cornerTR);
                                targetBarContainer.children(".wijmo-wijsuperpanel-vbar-buttonbottom").removeClass(css.cornerBL).addClass(css.cornerBR);
                                targetBarContainer.removeClass(css.cornerLeft).addClass(css.cornerRight);
                            }
                        }
                        referBarWidth = 0;
                        if (referNeedScrollBar) {
                            referBarWidth = referBarContainer[0][hbar ? "offsetWidth" : "offsetHeight"];
                            if (referScrollBarPosition === "left") {
                                targetBarContainer.css("right", "0px");
                            } else if (referScrollBarPosition === "right") {
                                targetBarContainer.css("left", "0px");
                            } else if (referScrollBarPosition === "top") {
                                targetBarContainer.css("bottom", "0px");
                            } else if (referScrollBarPosition === "bottom") {
                                targetBarContainer.css("top", "0px");
                            }
                        }
                        if (!hbar && referNeedScrollBar) {
                            referBarWidth = 0;
                        }

                        // When calculate the height or width of the scroll barcontainer, the border widht of the scroll bar container shall be removed too.
                        targetBarContainer[hbar ? "width" : "height"](contentLength2 - targetPadding - targetBorder);
                        self._enableDisableScrollBar(dir, targetBarContainer, !scrollingNeed);
                    } else {
                        wrapper.css(hbar ? "left" : "top", "");
                    }
                },
                _testScroll: function (self, f, o) {
                    var wrapper = f.templateWrapper, content = f.contentWrapper, scrollerWrapper = f.stateContainer, contentWidth = content.innerWidth(), contentHeight = content.innerHeight(), wrapperWidth = f.contentWidth, wrapperHeight = f.contentHeight, hNeedScrollBar, vNeedScrollBar, hbarContainer, vbarContainer, hbarPosition, vbarPosition;
                    f.hScrolling = wrapperWidth > contentWidth;
                    f.vScrolling = wrapperHeight > contentHeight;

                    hNeedScrollBar = self.hNeedScrollBar = self._needScrollbar(o.hScroller, f.hScrolling);
                    if (self._createBarIfNeeded(hNeedScrollBar, scrollerWrapper, "h", hbarHtml, content) === false) {
                        return false;
                    }

                    // having h scroll bar, but no vscroll bar, we need to test vscrolling again.
                    if (hNeedScrollBar && !f.vScrolling) {
                        wrapper.css("float", "left");
                        f.contentHeight = wrapper.height();
                        f.vScrolling = f.contentHeight > (contentHeight - f.hbarContainer[0].offsetHeight);
                        wrapper.css("float", "");
                    }

                    vNeedScrollBar = self.vNeedScrollBar = self._needScrollbar(o.vScroller, f.vScrolling);
                    if (self._createBarIfNeeded(vNeedScrollBar, scrollerWrapper, "v", vbarHtml, content) === false) {
                        return false;
                    }

                    if (vNeedScrollBar && !f.hScrolling) {
                        wrapper.css("float", "left");
                        f.contentWidth = wrapper.width();

                        f.hScrolling = f.contentWidth > (contentWidth - f.vbarContainer[0].offsetWidth);
                        wrapper.css("float", "");
                        if (f.hScrolling && !hNeedScrollBar) {
                            hNeedScrollBar = self.hNeedScrollBar = self._needScrollbar(o.hScroller, f.hScrolling);
                            if (self._createBarIfNeeded(hNeedScrollBar, scrollerWrapper, "h", hbarHtml, content) === false) {
                                return false;
                            }
                        }
                    }

                    hbarContainer = f.hbarContainer;
                    vbarContainer = f.vbarContainer;
                    hbarPosition = o.hScroller.scrollBarPosition;
                    vbarPosition = o.vScroller.scrollBarPosition;

                    self._setScrollbarPosition(wrapper, self, content, hbarContainer, vbarContainer, hNeedScrollBar, vNeedScrollBar, hbarPosition, vbarPosition, "h", f.hScrolling);
                    self._setScrollbarPosition(wrapper, self, content, vbarContainer, hbarContainer, vNeedScrollBar, hNeedScrollBar, vbarPosition, hbarPosition, "v", f.vScrolling);

                    // Update content size data since adding the scroll element may change the content size.
                    // For example: single-line text element may change to multi-line, then height of content changed.
                    wrapper.css("float", "left");
                    f.contentWidth = wrapper.width();
                    f.contentHeight = wrapper.height();
                    wrapper.css("float", "");
                },
                _enableDisableScrollBar: function (bar, barContainer, disable) {
                    // Disables scroll bar.
                    // <param name="bar" type="String">
                    // Scrollbar to disable.
                    // Options are: "h" and "v"
                    // </param>
                    // <param name="barContainer" type="jQuery">
                    // The scroll bar container jQuery object.
                    // </param>
                    // <param name="disable" type="Boolean">
                    // Whether to disable scroll bar.
                    // </param>
                    var o = this.options;
                    if (bar === "v") {
                        barContainer[disable ? "addClass" : "removeClass"]("wijmo-wijsuperpanel-vbarcontainer-disabled");
                        barContainer.find("." + o.wijCSS.stateDefault)[disable ? "addClass" : "removeClass"](o.wijCSS.stateDisabled);
                    } else if (bar === "h") {
                        barContainer[disable ? "addClass" : "removeClass"]("wijmo-wijsuperpanel-hbarcontainer-disabled");
                        barContainer.find("." + o.wijCSS.stateDefault)[disable ? "addClass" : "removeClass"](o.wijCSS.stateDisabled);
                    }
                    barContainer.children("." + scrollerHandle)[disable ? "hide" : "show"]();
                },
                _initResizer: function () {
                    // Initialize reseizer of wijsuperpanel.
                    var self = this, o = self.options, f = self._fields(), resizer = f.resizer, resizableOptions, oldstop;
                    if (!$.fn.resizable) {
                        return;
                    }
                    if (!resizer && o.allowResize) {
                        resizableOptions = o.resizableOptions;
                        oldstop = resizableOptions.stop;
                        resizableOptions.stop = function (e) {
                            self._resizeStop(e, self);
                            if ($.isFunction(oldstop)) {
                                oldstop(e);
                            }
                        };
                        f.resizer = resizer = self.element.resizable(resizableOptions);
                    }
                    if (!o.allowResize && f.resizer) {
                        resizer.resizable("destroy");
                        f.resizer = null;
                        if (self._isDisabled()) {
                            self.element.addClass(o.wijCSS.stateDisabled);
                        }
                    }
                },
                _resizeStop: function (e, self) {
                    // give the chance to autoRefresh polling to repaint.
                    if (!this.options.autoRefresh) {
                        self.paintPanel(true);
                    }
                    self._trigger("resized");
                },
                _createAdditionalDom: function (self, f, ele) {
                    // make sure the key pressing event work in FireFox.
                    if (!ele.attr("tabindex")) {
                        ele.attr("tabindex", "-1");
                        f.tabindex = true;
                    }
                    var stateContainer = f.stateContainer = $(innerElementHtml), templateW, wijCSS = self.options.wijCSS;

                    // move child element to content wrapper div of wijsuperpanel.
                    f.contentWrapper = stateContainer.children();
                    templateW = f.templateWrapper = f.contentWrapper.children();
                    ele.contents().each(function (index, el) {
                        var jel = $(el);
                        if (jel.hasAllClasses(wijCSS.superpanelHeader)) {
                            f.header = jel;
                            return;
                        }
                        if (jel.hasAllClasses(wijCSS.superpanelFooter)) {
                            f.footer = jel;
                            return;
                        }
                        templateW[0].appendChild(el);
                    });

                    // apeend header to first element.
                    if (f.header !== undefined) {
                        ele.prepend(f.header);
                    }
                    ele[0].appendChild(stateContainer[0]);

                    // apeend footer to first element.
                    if (f.footer !== undefined) {
                        f.footer.insertAfter(stateContainer);
                    }
                },
                _setRounder: function (self, ele) {
                    if (this.options.showRounder) {
                        ele.addClass(this.options.wijCSS.cornerAll);
                        if (self._rounderAdded) {
                            return;
                        }
                        if ($.browser.msie) {
                            return;
                        }
                        var key1 = "", key = "", value, border;

                        if ($.browser.webkit) {
                            key = "WebkitBorderTopLeftRadius";
                            key1 = "WebkitBorderRadius";
                        } else if ($.browser.mozilla) {
                            key = "MozBorderRadiusBottomleft";
                            key1 = "MozBorderRadius";
                        } else {
                            key = "border-top-left-radius";
                            key1 = "border-radius";
                        }
                        value = ele.css(key);
                        border = parseInt(value, 10);

                        // adding 1 extra to out-most radius.
                        ele.css(key1, border + 1);
                        self._rounderAdded = true;
                        self._radiusKey = key1;
                    } else {
                        ele.removeClass(this.options.wijCSS.cornerAll);
                    }
                },
                _setInnerElementsSize: function (f, ele) {
                    var state = f.stateContainer, content = f.contentWrapper, height = 0, style, clientHeight, clientWidth, style2;
                    if (f.header !== undefined) {
                        height += f.header.outerHeight();
                    }
                    if (f.footer !== undefined) {
                        height += f.footer.outerHeight();
                    }

                    style = state[0].style;
                    clientHeight = ele.innerHeight() - height;
                    clientWidth = ele.innerWidth();

                    // hide element before setting width and height to improve javascript performance in FF3.
                    style.display = "none";
                    style.height = clientHeight + "px";
                    style.width = clientWidth + "px";
                    style2 = content[0].style;
                    style2.height = clientHeight + "px";
                    style2.width = clientWidth + "px";
                    style.display = "";
                }
            });

            wijsuperpanel.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijsuperpanel_options());

            $.wijmo.registerWidget("wijsuperpanel", wijsuperpanel.prototype);
        } else {
            //use native scrollbar
            var scrollerHandle = "wijmo-wijsuperpanel-handle", innerElementHtml = "<div class='wijmo-wijsuperpanel-statecontainer' " + "style='float: left; height: 100%;'>" + "<div class='wijmo-wijsuperpanel-contentwrapper-touch'>" + "</div></div>", panelContainerClass = "wijmo-wijsuperpanel-panelContainer", assistContainerClass = "wijmo-wijsuperpanel-assistContainer", simulateScrollClass = "wijmo-wijsuperpanel-simulateScrollBar", scrollBarEleClass = "wijmo-wijsuperpanel-scrollBarEle", isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i), isWIN = window.navigator.userAgent.match(/Windows/i), scrollBarEleHtml = isIOS ? "<div class='" + scrollBarEleClass + "' style='position: absolute; width: 3px; background:#7E7E7E; -webkit-border-radius: 1px; display: none'></div>" : "", assistElementHtml = "<div class='" + assistContainerClass + "' style='position: absolute;'><div class='" + simulateScrollClass + "' " + "style='position: absolute; overflow-x: hidden; -webkit-overflow-scrolling: touch; -ms-overflow-style: -ms-autohiding-scrollbar'>" + "<div></div></div>" + scrollBarEleHtml + "</div>", scrollWidth = isWIN ? 18 : 4, widthForHideScroll = isWIN ? 18 : 6;

            wijsuperpanel.prototype = $.extend(true, {}, $.Widget.prototype, {
                widgetEventPrefix: "wijsuperpanel",
                _setOption: function (key, value) {
                    var self = this, oldDisabled = self._isDisabled(), newDisabled, ele = self.element, o = self.options, f = self._fields();

                    if (key === "animationOptions" || key === "resizableOptions") {
                        value = $.extend(o[key], value);
                    } else if (key === "hScroller" || key === "vScroller") {
                        var dir = key === "hScroller" ? "h" : "v";
                        value = $.extend(o[key], value);
                        self._adjustScrollValue(dir);
                        self.refresh();
                    }

                    if (key === "customScrolling") {
                        if (o[key] !== value) {
                            o[key] = value;
                            self._initialize(f, ele, self);
                            self._bindElementEvents();
                        }
                    }

                    $.Widget.prototype._setOption.apply(self, arguments);

                    switch (key) {
                        case "allowResize":
                            self._initResizer();
                            break;
                        case "disabled":
                            newDisabled = this._isDisabled();
                            if (oldDisabled === newDisabled)
                                return;

                            if (newDisabled) {
                                this._innerDisable();
                            } else {
                                this._innerEnable();
                            }
                            break;
                        case "mouseWheelSupport":
                        case "keyboardSupport":
                            self._bindElementEvents(self, f, self.element, o);
                            break;
                    }
                },
                _innerDisable: function () {
                    this._handleDisabledOption(true, this.element);
                },
                _innerEnable: function () {
                    this._handleDisabledOption(false, this.element);
                },
                _create: function () {
                    var self = this, o = self.options;
                    o.vScroller.dir = "v";
                    o.hScroller.dir = "h";

                    self._createDom();

                    //update for visibility change
                    if (self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                        self.element.wijAddVisibilityObserver(function () {
                            self.refresh();
                            if (self.element.wijRemoveVisibilityObserver) {
                                self.element.wijRemoveVisibilityObserver();
                            }
                        }, "wijsuperpanel");
                    }
                    if (self._isDisabled()) {
                        self._handleDisabledOption(true, self.element);
                    }
                },
                _handleDisabledOption: function (disabled, ele) {
                    var self = this;
                    ele.toggleClass("ui-state-disabled", !!disabled).attr("aria-disabled", disabled);
                    if (disabled) {
                        if (!self.disabledDiv) {
                            self.disabledDiv = self._createDisabledDiv(ele);
                        }
                        self.disabledDiv.appendTo("body");
                    } else {
                        if (self.disabledDiv) {
                            self.disabledDiv.remove();
                            self.disabledDiv = null;
                        }
                    }
                },
                _createDisabledDiv: function (outerEle) {
                    var self = this, ele = outerEle ? outerEle : self.element, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();

                    return $("<div></div>").addClass("ui-disabled").css({
                        "z-index": "99999",
                        position: "absolute",
                        width: disabledWidth,
                        height: disabledHeight,
                        left: eleOffset.left,
                        top: eleOffset.top
                    });
                },
                _createDom: function () {
                    var self = this, el = self.element;

                    self.paintPanel();
                    self._initResizer();
                    self._bindElementEvents();
                },
                _applyOverflow: function (stateContainer) {
                    var css = {}, o = this.options;
                    css["overflow-x"] = "auto";
                    css["overflow-y"] = "auto";

                    if (this._isDisabled()) {
                        css["overflow-x"] = "hidden";
                        css["overflow-y"] = "hidden";
                    } else {
                        css["touch-action"] = "";
                        css["ms-touch-action"] = "";

                        if (o.customScrolling) {
                            // ** Enable native horizontal scroll bar **
                            //css["overflow-x"] = "hidden";
                            css["overflow-y"] = "hidden";
                            css["touch-action"] = "pan-x";
                            css["ms-touch-action"] = "pan-x";
                        }
                    }
                    stateContainer.css(css);
                },
                _createAdditionalDom: function (self, f, ele) {
                    if (!ele.attr("tabindex")) {
                        ele.attr("tabindex", "-1");
                        f.tabindex = true;
                    }
                    var container = $("<div class='" + panelContainerClass + "' style='overflow:hidden'></div>"), customScrolling = self.options.customScrolling, stateContainer = f.stateContainer = $(innerElementHtml), assistContainer = f.assistContainer = $(assistElementHtml), simulateScroll = f.simulateScroll = assistContainer.find("." + simulateScrollClass), customScrollBarEle = f.customScrollBarEle = assistContainer.find("." + scrollBarEleClass), wijCSS = self.options.wijCSS, containerCreated = false;

                    // move child element to content wrapper div of wijsuperpanel.
                    f.contentWrapper = stateContainer.children();
                    ele.contents().each(function (index, el) {
                        var jel = $(el);
                        if (jel.hasAllClasses(wijCSS.superpanelHeader)) {
                            f.header = jel;
                            return;
                        }
                        if (jel.hasAllClasses(wijCSS.superpanelFooter)) {
                            f.footer = jel;
                            return;
                        }
                        if (jel.hasClass(panelContainerClass)) {
                            containerCreated = true;
                            return false;
                        }
                        f.contentWrapper[0].appendChild(el);
                    });

                    // append header to first element.
                    if (f.header !== undefined) {
                        ele.prepend(f.header);
                    }
                    if (containerCreated) {
                        container = ele.children("." + panelContainerClass);
                        stateContainer = f.stateContainer = container.find(".wijmo-wijsuperpanel-statecontainer");
                        f.contentWrapper = stateContainer.children();
                    }
                    container[0].appendChild(stateContainer[0]);
                    ele[0].appendChild(container[0]);

                    // Ensure assist div stay behind the state contianer.
                    if (container.children("." + assistContainerClass).length > 0) {
                        f.assistContainer = container.children("." + assistContainerClass);
                        f.simulateScroll = f.assistContainer.find("." + simulateScrollClass);
                        f.customScrollBar = f.assistContainer.find("." + scrollBarEleClass);
                    }
                    if (customScrolling) {
                        container[0].appendChild(f.assistContainer[0]);
                    } else {
                        f.assistContainer.remove();
                    }

                    self._resetDom();

                    container.height(stateContainer.height()).width(stateContainer.width());

                    // append footer to first element.
                    if (f.footer !== undefined) {
                        f.footer.insertAfter(container);
                    }

                    // Ensure to get correct size of inner content.
                    f.contentWrapper.css("overflow", "").css("height", "").css("float", "left");

                    f.contentWidth = f.contentWrapper.width();
                    f.contentHeight = f.contentWrapper.height();
                    f.contentWrapper.css("float", "");

                    if (customScrolling) {
                        // Hide default scrollbar.
                        f.contentWrapper.css("overflow", "hidden").height(stateContainer.height()).width(f.contentWidth);

                        self._setAssistElementStyle(f);
                    }
                    self._applyOverflow(f.stateContainer);
                    if (self.options.vScroller.scrollBarVisibility === "hidden") {
                        // If there is no vertical scrollbar. It is no need to hide.
                        if (f.contentWrapper.height() > stateContainer.height()) {
                            self._coverScrollBarWithContainer(f, "v");
                        }
                    }
                    if (self.options.hScroller.scrollBarVisibility === "hidden") {
                        // If there is no horizontal scrollbar. It is no need to hide.
                        if (f.contentWrapper.width() > stateContainer.width()) {
                            self._coverScrollBarWithContainer(f, "h");
                        }
                    }
                },
                _coverScrollBarWithContainer: function (f, dir) {
                    var stateContainer = f.stateContainer;
                    if (dir === "v") {
                        var width = stateContainer.width();
                        stateContainer.width(width + widthForHideScroll);
                    } else if (dir === "h") {
                        var height = stateContainer.height();
                        stateContainer.height(height + widthForHideScroll);
                    }
                },
                _setAssistElementStyle: function (f) {
                    var self = this, vs = self.options.vScroller.scrollBarVisibility, stateContainer = f.stateContainer, assistContainer = f.assistContainer, sumitScroll = f.simulateScroll, stateContainer, containterHeight, contentHeight, scrollDiv, left;

                    containterHeight = stateContainer.height();
                    contentHeight = f.contentHeight;
                    left = stateContainer.position().left + stateContainer.width() - scrollWidth;

                    scrollDiv = sumitScroll.children();

                    sumitScroll.css("width", scrollWidth).css("height", containterHeight).css("overflow-y", "auto");

                    assistContainer.css("left", (left) + "px").css("width", vs === "hidden" ? 0 : scrollWidth).css("height", containterHeight).css("overflow-y", "hidden");

                    scrollDiv.css("width", scrollWidth + 2).css("height", contentHeight).css("background", "transparent");

                    self._setCustomScrollDragLengthForIOS(self.options, f);
                },
                _setCustomScrollDragLengthForIOS: function (o, f) {
                    if (!isIOS) {
                        return;
                    }
                    var self = this, scrollBarEle = f.customScrollBarEle, range = o.vScroller.scrollMax - o.vScroller.scrollMin, largeChange = self._getVScrollBarLargeChange(), track = f.stateContainer.height(), divide = range / largeChange, dragLength = track / divide, minidrag = o.vScroller.scrollMinDragLength || 6;
                    if (dragLength < minidrag) {
                        dragLength = minidrag;
                    } else if ((dragLength + 1) >= track) {
                        dragLength = track - 1;
                    }
                    dragLength = Math.round(dragLength);
                    scrollBarEle.height(dragLength);
                },
                _elementScrolled: function (curScrollLeft, curScrollTop, originalScrollLeft, originalScrollTop, customScrolling) {
                    var self = this, o = self.options, ele = self.element, direction, dir, oldValue, newValue, scrollPx;

                    if (curScrollTop === originalScrollTop && curScrollLeft === originalScrollLeft) {
                        return;
                    }
                    if (curScrollTop === originalScrollTop) {
                        if (customScrolling) {
                            return;
                        }
                        dir = "h";
                        if (curScrollLeft > originalScrollLeft) {
                            direction = "right";
                        } else {
                            direction = "left";
                        }
                        oldValue = o.hScroller.scrollValue;
                        scrollPx = curScrollLeft;
                    } else {
                        dir = "v";
                        if (curScrollTop > originalScrollTop) {
                            direction = "bottom";
                        } else {
                            direction = "top";
                        }
                        oldValue = o.vScroller.scrollValue;
                        scrollPx = curScrollTop;
                    }

                    newValue = self.scrollPxToValue(scrollPx, dir);
                    newValue = Math.round(newValue);

                    self._trigger("scrolling", null, {
                        dir: dir,
                        direction: direction,
                        oldValue: oldValue,
                        newValue: newValue,
                        beforePosition: {
                            left: -originalScrollLeft,
                            top: -originalScrollTop
                        }
                    });

                    //scroll event
                    self._triggerScroll(scrollPx, dir);

                    //update scroll value
                    self._updateScrollValue(scrollPx, dir);

                    //scrolled event
                    self._trigger("scrolled", null, {
                        dir: dir,
                        beforePosition: {
                            left: -originalScrollLeft,
                            top: -originalScrollTop
                        },
                        afterPosition: {
                            left: -curScrollLeft,
                            top: -curScrollTop
                        },
                        newValue: newValue
                    });
                },
                _bindElementEvents: function () {
                    var self = this, ele = self.element, o = self.options, f = self._fields(), wn = self.widgetName, scrollEle = f.stateContainer, originalScrollLeft = scrollEle.scrollLeft(), originalScrollTop = scrollEle.scrollTop(), simulateScroll = f.simulateScroll, currentTop, currentLeft, scrollBarEle = f.customScrollBarEle, scrollBarEleTop, scrollBarEleHeight, innerHeight, scrollHeight, startPointY, endPointY, y_Offset, startPointX, endPointX, x_Offset, horizontalMove = false, hasMouseDown = false, fadeTime, hasScrollBarEle = isIOS && (scrollBarEle.length > 0);

                    simulateScroll.unbind();
                    scrollEle.unbind("." + wn);
                    $(document).unbind("mouseup." + wn);

                    if (self._isDisabled()) {
                        return;
                    }

                    if (o.customScrolling) {
                        if (simulateScroll.length > 0) {
                            innerHeight = simulateScroll.children().height();
                            scrollHeight = simulateScroll.height();
                            originalScrollTop = simulateScroll.scrollTop();

                            if (hasScrollBarEle) {
                                scrollBarEle.css("display", "block");
                                scrollBarEleHeight = scrollBarEle.height();
                                scrollBarEle.css("display", "none");
                                scrollBarEleTop = scrollBarEle.position().top;
                            }

                            simulateScroll.bind("scroll", function (event, data) {
                                currentTop = simulateScroll.scrollTop();
                                currentLeft = scrollEle.scrollLeft();

                                if (hasScrollBarEle) {
                                    scrollBarEleTop = self._getCustomScrollOffset(currentTop, innerHeight, scrollHeight, scrollBarEleHeight);
                                    if (scrollBarEleTop < 0) {
                                        scrollBarEleTop = 0;
                                    }
                                    scrollBarEle.css("top", scrollBarEleTop + "px");
                                }

                                self._elementScrolled(currentLeft, currentTop, originalScrollLeft, originalScrollTop, true);

                                originalScrollLeft = currentLeft;
                                originalScrollTop = currentTop;
                            });

                            scrollEle.bind("wijmousedown." + wn, function (event) {
                                startPointY = event.pageY;
                                startPointX = event.pageX;
                                hasMouseDown = true;

                                if (fadeTime) {
                                    clearTimeout(fadeTime);
                                }
                                if (hasScrollBarEle) {
                                    scrollBarEle.stop().fadeIn(100);
                                }
                            });

                            scrollEle.bind("wijmousemove." + wn, function (event) {
                                if (hasMouseDown) {
                                    endPointY = event.pageY;
                                    y_Offset = endPointY - startPointY;
                                    endPointX = event.pageX;
                                    x_Offset = endPointX - startPointX;
                                    horizontalMove = (Math.abs(y_Offset) < Math.abs(x_Offset));
                                    if (y_Offset) {
                                        if (!horizontalMove) {
                                            currentTop = simulateScroll.scrollTop();
                                            simulateScroll.scrollTop(currentTop - y_Offset);
                                        }
                                        startPointY = endPointY;
                                    }
                                }
                                if (!$.browser.msie && !horizontalMove) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                }
                            });

                            scrollEle.bind("wijmouseup." + wn, function (event) {
                                startPointY = event.pageY;
                                startPointX = event.pageX;
                                hasMouseDown = false;
                                horizontalMove = false;
                                if (hasScrollBarEle) {
                                    fadeTime = setTimeout(function () {
                                        scrollBarEle.fadeOut("slow");
                                    }, 1000);
                                }
                            });

                            $(document).bind("mouseup." + wn, function (event) {
                                hasMouseDown = false;
                                horizontalMove = false;
                                startPointY = event.pageY;
                                startPointX = event.pageX;
                            });
                        }
                        scrollEle.bind("mousewheel." + wn, self, self._panelMouseWheel);
                    }

                    scrollEle.bind("scroll", function (event, data) {
                        if (o.customScrolling && simulateScroll.length > 0) {
                            currentTop = simulateScroll.scrollTop();
                        } else {
                            currentTop = scrollEle.scrollTop();
                        }
                        currentLeft = scrollEle.scrollLeft();
                        self._elementScrolled(currentLeft, currentTop, originalScrollLeft, originalScrollTop, false);

                        originalScrollLeft = currentLeft;
                        originalScrollTop = currentTop;
                    });

                    if (o.keyboardSupport) {
                        if (self._keyboardBind === undefined) {
                            self._keyboardBind = true;
                            ele.bind("keydown." + wn, self, self._panelKeyDown);
                        }
                    } else {
                        ele.unbind("keydown." + wn, self._panelKeyDown);
                        self._keyboardBind = undefined;
                    }

                    if (!o.mouseWheelSupport) {
                        ele.bind("mousewheel", function (event) {
                            event.stopPropagation();
                            return false;
                        });
                    }
                },
                _getCustomScrollOffset: function (scrollOffset, innerScrollHeight, scrollHeight, customScrollHeight) {
                    var customOffset, divide;
                    divide = (scrollHeight - customScrollHeight) / (innerScrollHeight - scrollHeight);
                    return scrollOffset * divide;
                },
                // ** Add private methods for customize mouse wheel event. ** //
                // ** Copy code from Default Superpanel ** //
                _panelMouseWheel: function (e, delta) {
                    var self = e.data, o = self.options, originalElement, dir = "", onHbar, hScroller = o.hScroller, vScroller = o.vScroller, scrollEnd, vSmall, vLarge, vSCrollValue, vScrollPx, assistDiv;
                    if (!o.mouseWheelSupport || self._isDisabled()) {
                        return;
                    }
                    originalElement = $(e.srcElement || e.originalEvent.target);
                    onHbar = originalElement.closest("." + hbarContainerCSS, self.element).size() > 0;
                    if (onHbar) {
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                    }
                    if (delta > 0) {
                        dir = "top";
                    } else {
                        dir = "bottom";
                    }

                    if (dir.length > 0) {
                        vSmall = self._getVScrollBarSmallChange();
                        vLarge = self._getVScrollBarLargeChange();
                        if (!self._setScrollerValue(dir, vScroller, vSmall, vLarge, dir === "bottom", false, self)) {
                            return;
                        }
                        vSCrollValue = vScroller.scrollValue;
                        vScrollPx = vSCrollValue ? self._scrollValueToPx(vSCrollValue, "v") : 0;

                        if (vSCrollValue !== undefined) {
                            self._fields().assistContainer.find("." + simulateScrollClass).prop("scrollTop", vScrollPx);
                        }
                    }
                    scrollEnd = false;
                    if (dir === "top") {
                        scrollEnd = !self.vNeedScrollBar || Math.abs(vScroller.scrollValue - vScroller.scrollMin) < 0.001;
                    }
                    if (dir === "bottom") {
                        scrollEnd = !self.vNeedScrollBar || Math.abs(vScroller.scrollValue - (vScroller.scrollMax - self._getVScrollBarLargeChange() + 1)) < 0.001;
                    }
                    if (!scrollEnd || !o.bubbleScrollingEvent) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                },
                _getVScrollBarSmallChange: function () {
                    var o = this.options, va;
                    if (!o.vScroller.scrollSmallChange) {
                        va = this._getVScrollBarLargeChange();
                        o.vScroller.scrollSmallChange = va / 2;
                    }
                    return o.vScroller.scrollSmallChange;
                },
                _getVScrollBarLargeChange: function () {
                    var self = this, o = self.options, f = self._fields(), scroller = o.vScroller, autoKey = "_autoVLarge", vMax, vMin, vRange, content, contentHeight, wrapperHeight, percent, large;

                    if (scroller.scrollLargeChange) {
                        return scroller.scrollLargeChange;
                    }

                    // calculate large change if empty
                    vMax = scroller.scrollMax;
                    vMin = scroller.scrollMin;
                    vRange = vMax - vMin;

                    content = f.simulateScroll;
                    contentHeight = content["innerHeight"]();
                    wrapperHeight = f["contentHeight"];

                    percent = contentHeight / (wrapperHeight - contentHeight);
                    large = ((vRange + 1) * percent) / (1 + percent);
                    if (isNaN(large)) {
                        large = 0;
                    }
                    scroller.scrollLargeChange = large;

                    self[autoKey] = true;
                    return scroller.scrollLargeChange;
                },
                _setScrollerValue: function (dir, scroller, smallChange, largeChange, isAdd, isLarge, self) {
                    var o = this.options, vMin = scroller.scrollMin, change = isLarge ? largeChange : smallChange, value = scroller.scrollValue, t = 0, vTopValue, firstStepChangeFix, data, scrollValue, val, ev;
                    if (!value) {
                        value = vMin;
                    }
                    vTopValue = scroller.scrollMax - largeChange + 1;
                    if (value > vTopValue) {
                        value = vTopValue;
                    }
                    if (isAdd) {
                        if (Math.abs(value - vTopValue) < 0.0001) {
                            self._clearInterval();
                            return false;
                        }
                        firstStepChangeFix = scroller.firstStepChangeFix;
                        t = value + change;
                        if (!isLarge && Math.abs(value - vMin) < 0.0001 && !isNaN(firstStepChangeFix)) {
                            t += firstStepChangeFix;
                        }
                        if (t > vTopValue) {
                            t = vTopValue;
                        }
                    } else {
                        if (Math.abs(value - vMin) < 0.0001) {
                            self._clearInterval();
                            return false;
                        }
                        t = value - change;
                        if (t < 0) {
                            t = vMin;
                        }
                    }
                    data = {
                        oldValue: scroller.scrollValue,
                        newValue: t,
                        direction: dir,
                        dir: scroller.dir
                    };
                    if (!self._scrolling(true, self, data)) {
                        return false;
                    }

                    if (self.customScroll) {
                        val = Math.abs(self.customScroll);
                        scrollValue = self.scrollPxToValue(val, scroller.dir);
                    }

                    scroller.scrollValue = scrollValue || t;
                    ev = $.Event("scrollValueChanged");
                    this._trigger("scrollValueChanged", ev, scroller);

                    self.customScroll = undefined;
                    return true;
                },
                _clearInterval: function () {
                    var f = this._fields(), intervalID = f.internalFuncID;
                    if (intervalID > 0) {
                        window.clearInterval(intervalID);
                        f.internalFuncID = -1;
                    }
                },
                _scrolling: function (fireEvent, self, d) {
                    var r = true;
                    if (fireEvent) {
                        d.beforePosition = self.getContentElement().position();
                        self._beforePosition = d.beforePosition;
                        r = self._trigger("scrolling", null, d);
                        self.customScroll = d.customScroll;
                    }
                    return r;
                },
                // ** End ** //
                _setScrollingInterval: function (f, dir, self, large) {
                    var o = self.options;
                    if (dir.length > 0) {
                        f.internalFuncID = window.setInterval(function () {
                            self._doScrolling(dir, self, large);
                        }, o.keyDownInterval);
                    }
                },
                _triggerScroll: function (contentLeft, dir) {
                    var data = {
                        position: contentLeft,
                        dir: dir
                    };
                    this._trigger("scroll", null, data);
                },
                _panelKeyDown: function (e) {
                    // Key down handler.
                    var self = e.data, o = self.options, shift, keycode, kCode = wijmo.getKeyCodeEnum();
                    if (!o.keyboardSupport || self._isDisabled()) {
                        return;
                    }
                    shift = e.shiftKey;
                    keycode = e.keyCode;
                    if (keycode === kCode.LEFT) {
                        self._doScrolling("left", self, shift);
                    } else if (keycode === kCode.RIGHT) {
                        self._doScrolling("right", self, shift);
                    } else if (keycode === kCode.UP) {
                        self._doScrolling("top", self, shift);
                    } else if (keycode === kCode.DOWN) {
                        self._doScrolling("bottom", self, shift);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                },
                _doScrolling: function (dir, self, large) {
                    var value, orient, func, f = self._fields(), ele = self.options.customScrolling ? f.simulateScroll[0] : f.stateContainer[0], animateOpt = {}, scrollVal;

                    if (dir === "top" || dir === "bottom") {
                        orient = "v";
                        func = "scrollTop";
                    } else if (dir === "left" || dir === "right") {
                        orient = "h";
                        func = "scrollLeft";
                    }

                    if (large) {
                        value = self._getLargeChange(orient);
                    } else {
                        value = self._getSmallChange(orient);
                    }

                    scrollVal = ele[func];

                    if (dir === "top" || dir === "left") {
                        animateOpt[func] = scrollVal - value;
                    } else {
                        animateOpt[func] = scrollVal + value;
                    }

                    self._animateTo(animateOpt);
                },
                _getLargeChange: function (div) {
                    var self = this, f = self._fields(), largeChange, length = div == "h" ? f.clientWidth : f.clientHeight;

                    if (length) {
                        largeChange = length;
                    } else {
                        largeChange = f.stateContainer[div == "h" ? "width" : "height"]();
                    }
                    return largeChange;
                },
                _getSmallChange: function () {
                    return this._getLargeChange() / 2;
                },
                _setRounder: function (self, ele) {
                    var cornerCSS = this.options.wijCSS.cornerAll;
                    if (this.options.showRounder) {
                        ele.addClass(cornerCSS);
                        if (self._rounderAdded) {
                            return;
                        }
                        if ($.browser.msie) {
                            return;
                        }
                        var key1 = "", key = "", value, border;

                        if ($.browser.webkit) {
                            key = "WebkitBorderTopLeftRadius";
                            key1 = "WebkitBorderRadius";
                        } else if ($.browser.mozilla) {
                            key = "MozBorderRadiusBottomleft";
                            key1 = "MozBorderRadius";
                        } else {
                            key = "border-top-left-radius";
                            key1 = "border-radius";
                        }
                        value = ele.css(key);
                        border = parseInt(value, 10);

                        ele.css(key1, border + 1);
                        self._rounderAdded = true;
                        self._radiusKey = key1;
                    } else {
                        ele.removeClass(cornerCSS);
                    }
                },
                _initResizer: function () {
                    // Initialize reseizer of wijsuperpanel.
                    var self = this, o = self.options, f = self._fields(), resizer = f.resizer, resizableOptions, oldstop;

                    if (!$.fn.resizable) {
                        return;
                    }

                    if (!resizer && o.allowResize) {
                        resizableOptions = o.resizableOptions;
                        oldstop = resizableOptions.stop;
                        resizableOptions.stop = function (e) {
                            self._resetDom();
                            self._trigger("resized");
                            if ($.isFunction(oldstop)) {
                                oldstop(e);
                            }
                        };
                        f.resizer = resizer = self.element.resizable(resizableOptions);
                    }
                    if (!o.allowResize && f.resizer) {
                        resizer.resizable("destroy");
                        f.resizer = null;
                        if (self._isDisabled()) {
                            self.element.addClass(o.wijCSS.stateDisabled);
                        }
                    }
                },
                _adjustScrollValue: function (dir) {
                    var isHori = dir === "h", self = this, o = this.options, needScroll = isHori ? self.hNeedScrollBar : self.vNeedScrollBar, scroller = isHori ? o.hScroller : o.vScroller, max = scroller.scrollMax, min = scroller.scrollMin, largeChange, topValue;

                    if (needScroll) {
                        largeChange = isHori ? self._getHScrollBarLargeChange() : self._getVScrollBarLargeChange();
                        topValue = max - largeChange + 1;
                        if (scroller.scrollValue > topValue) {
                            scroller.scrollValue = topValue;
                        }
                        if (scroller.scrollValue < min) {
                            scroller.scrollValue = min;
                        }
                    }
                },
                _resetDom: function () {
                    var self = this, o = self.options, ele = self.element, f = self._fields(), width = ele.width(), height = ele.height();

                    //minus header and footer's height if they exist.
                    //fix #37099
                    if (f.header !== undefined) {
                        height -= f.header.outerHeight();
                    }
                    if (f.footer !== undefined) {
                        height -= f.footer.outerHeight();
                    }
                    if (f.stateContainer.length) {
                        f.stateContainer.css({
                            width: width,
                            height: height
                        });
                        f.clientWidth = f.stateContainer[0].clientWidth;
                        f.clientHeight = f.stateContainer[0].clientHeight;
                    }

                    self._initScrollPosition();
                },
                _fields: function () {
                    var self = this, ele = self.element, key = self.widgetName + "-fields", d = self._fieldsStore;
                    if (d === undefined) {
                        d = {};
                        ele.data(key, d);
                        self._fieldsStore = d;
                    }
                    return d;
                },
                _getScrollOffset: function (child1) {
                    var child = $(child1), f, cWrapper, childOffset, templateOffset, cWrapperOffset, tDistance, bDistance, lDistance, rDistance, result = { left: null, top: null };

                    if (child.length === 0) {
                        return result;
                    }
                    f = this._fields();
                    cWrapper = f.contentWrapper;
                    childOffset = child.offset();

                    childOffset.leftWidth = childOffset.left + child.outerWidth();
                    childOffset.topHeight = childOffset.top + child.outerHeight();
                    cWrapperOffset = cWrapper.offset();
                    cWrapperOffset.leftWidth = cWrapperOffset.left + f.clientWidth;
                    cWrapperOffset.topHeight = cWrapperOffset.top + f.clientHeight;

                    lDistance = childOffset.left - cWrapperOffset.left;
                    if (childOffset.left < cWrapperOffset.left) {
                        result.left = lDistance;
                    } else if (childOffset.leftWidth > cWrapperOffset.leftWidth) {
                        rDistance = childOffset.leftWidth - cWrapperOffset.left - f.clientWidth;
                        if (lDistance < rDistance) {
                            result.left = lDistance;
                        } else {
                            result.left = rDistance;
                        }
                    }

                    tDistance = childOffset.top - cWrapperOffset.top;
                    if (childOffset.top < cWrapperOffset.top) {
                        result.top = tDistance;
                    } else if (childOffset.topHeight > cWrapperOffset.topHeight) {
                        bDistance = childOffset.topHeight - cWrapperOffset.top - f.clientHeight;
                        if (tDistance < bDistance) {
                            result.top = tDistance;
                        } else {
                            result.top = bDistance;
                        }
                    }

                    return result;
                },
                _initialize: function (f, ele, self) {
                    var wijCSS = self.options.wijCSS;
                    f.initialized = true;

                    ele.addClass(["wijmo-wijsuperpanel", wijCSS.widget, wijCSS.content].join(' '));
                    self._setRounder(self, ele);

                    self._createAdditionalDom(self, f, ele);
                    self._trigger("painted");
                    self._initScrollPosition();
                },
                _initScrollPosition: function () {
                    var o = this.options, hScroller = o.hScroller, vScroller = o.vScroller, hScrollValue = hScroller.scrollValue, vSCrollValue = vScroller.scrollValue, f = this._fields(), vScrollElement = o.customScrolling ? f.simulateScroll : f.stateContainer, hScrollPx = hScrollValue ? this._scrollValueToPx(hScrollValue, "h") : 0, vScrollPx = vSCrollValue ? this._scrollValueToPx(vSCrollValue, "v") : 0;

                    if (hScrollValue) {
                        f.stateContainer.prop("scrollLeft", hScrollPx);
                    }
                    if (vSCrollValue) {
                        vScrollElement.prop("scrollTop", vScrollPx);
                    }
                },
                _updateScrollValue: function (px, dir) {
                    var value = this.scrollPxToValue(px, dir), o = this.options, scroller = (dir === "h" ? "hScroller" : "vScroller"), ev = $.Event("scrollValueChanged");
                    o[scroller].scrollValue = value;

                    this._trigger("scrollValueChanged", ev, o[scroller]);
                },
                /**
                * Convert pixel to scroll value.
                * For example, wijsuperpanel scrolled 50px
                * which is value 1 after conversion.
                * @param {number} px Length of scrolling.
                * @param {string} dir Scrolling direction. Options are: "h" and "v".
                */
                scrollPxToValue: function (px, dir) {
                    var self = this, o = self.options, f = self._fields(), clientLengthKey, scrollLengthKey, scroller, vScrollElement, hScrollElement, cWrapper, clientLengthValue, scrollLengthValue, vMin, vMax, vRange, ret;

                    clientLengthKey = (dir === "h" ? "clientWidth" : "clientHeight");
                    scrollLengthKey = (dir === "h" ? "scrollWidth" : "scrollHeight");
                    scroller = (dir === "h" ? "hScroller" : "vScroller");

                    hScrollElement = f.stateContainer[0];
                    vScrollElement = o.customScrolling ? f.simulateScroll[0] : hScrollElement, cWrapper = dir === "h" ? hScrollElement : vScrollElement;

                    clientLengthValue = cWrapper[clientLengthKey];
                    scrollLengthValue = cWrapper[scrollLengthKey];

                    vMin = o[scroller].scrollMin;
                    vMax = o[scroller].scrollMax - self._getVScrollBarLargeChange() + 1;
                    vRange = vMax - vMin;
                    ret = vRange * px / (scrollLengthValue - clientLengthValue) + vMin;
                    return ret;
                },
                /**
                * Convert scroll value to pixel.
                * For example, scroll value is 1
                * which makes wijsuperpanel scroll 50px after conversion.
                * @param {number} value of scrolling.
                * @param {string} dir Scrolling direction. Options are: "h" and "v".
                */
                scrollValueToPx: function (value, dir) {
                    return this._scrollValueToPx(value, dir);
                },
                _scrollValueToPx: function (value, dir) {
                    var self = this, o = self.options, f = self._fields(), clientLengthKey, scrollLengthKey, scroller, cWrapper, clientLengthValue, scrollLengthValue, vMin, vMax, vRange, ret, vScrollElement, hScrollElement;

                    clientLengthKey = (dir === "h" ? "clientWidth" : "clientHeight");
                    scrollLengthKey = (dir === "h" ? "scrollWidth" : "scrollHeight");
                    scroller = (dir === "h" ? "hScroller" : "vScroller");

                    hScrollElement = f.stateContainer[0];
                    vScrollElement = o.customScrolling ? f.simulateScroll[0] : hScrollElement, cWrapper = (dir === "h" ? hScrollElement : vScrollElement);
                    clientLengthValue = cWrapper[clientLengthKey];
                    scrollLengthValue = cWrapper[scrollLengthKey];

                    vMin = o[scroller].scrollMin;
                    vMax = o[scroller].scrollMax - self._getVScrollBarLargeChange() + 1;
                    vRange = vMax - vMin;
                    if (value === undefined || value < vMin) {
                        value = vMin;
                    }
                    if (value > vMax) {
                        value = vMax;
                    }
                    ret = (value - vMin) * (scrollLengthValue - clientLengthValue) / vRange;
                    return ret;
                },
                _animateTo: function (to) {
                    var self = this, ele = self.element, o = self.options, ao = o.animationOptions, vTo, hTo, f = self._fields();
                    if (o.customScrolling) {
                        vTo = { "scrollTop": to["scrollTop"] };
                        f.simulateScroll.animate(vTo, ao);
                        hTo = { "scrollLeft": to["scrollLeft"] };
                        f.stateContainer.animate(hTo, ao);
                    } else {
                        f.stateContainer.animate(to, ao);
                    }
                },
                destroy: function () {
                    var self = this, ele = self.element, o = self.options, f = self._fields(), cWrapper, container, wijCSS = o.wijCSS;

                    if (self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                    }

                    if (f.resizer !== undefined) {
                        f.resizer.resizable("destroy");
                    }
                    ele.unbind("." + self.widgetName);
                    ele.removeClass(["wijmo-wijsuperpanel", wijCSS.widget, wijCSS.content, wijCSS.cornerAll].join(' '));

                    container = ele.find("." + panelContainerClass);
                    cWrapper = f.contentWrapper;
                    cWrapper.contents().each(function (index, e) {
                        ele.append(e);
                    });
                    f.stateContainer.remove();
                    f.assistContainer.remove();
                    container.remove();

                    $.Widget.prototype.destroy.apply(self, arguments);
                },
                doScrolling: function (dir, large) {
                    /// <summary>
                    /// Do scrolling.
                    /// </summary>
                    /// <param name="dir" type="string">
                    ///   Scrolling direction. Options are: "left", "right", "top" and "bottom".
                    /// </param>
                    /// <param name="large" type="Boolean">
                    /// Whether to scroll a large change.
                    /// </param>
                    this._doScrolling(dir, this, large);
                },
                paintPanel: function (unfocus) {
                    var self = this, ele = self.element, f = self._fields();

                    if (!f.initialized) {
                        this._initialize(f, ele, self);
                    }
                },
                needToScroll: function (child1) {
                    /// <summary>
                    /// Determine whether scoll the child DOM element to view
                    /// need to scroll the scroll bar
                    /// </summary>
                    /// <param name="child" type="DOMElement/JQueryObj">
                    /// The child to scroll to.
                    /// </param>
                    var offset = this._getScrollOffset(child1);
                    return offset.top !== null || offset.left !== null;
                },
                scrollChildIntoView: function (child1) {
                    /// <summary>
                    /// Scroll child DOM element into view.
                    /// Code Example:
                    /// $("selector").wijsuperpanel("scrollChildIntoView", $("li#reditem"));
                    /// </summary>
                    /// <param name="child" type="DOMElement/JQueryObj">
                    /// The child to scroll to.
                    /// </param>
                    var offset = this._getScrollOffset(child1), left = offset.left, top = offset.top;

                    this.scrollTo(left, top);
                },
                getContentElement: function () {
                    /// <summary>
                    /// Gets the content element of wijsuperpanel.
                    /// Code Example:
                    /// $("selector").wijsuperpanel("getContentElement");
                    /// </summary>
                    /// <returns type="JQueryObj" />
                    return this._fields().contentWrapper;
                },
                hScrollTo: function (x, isScrollValue) {
                    /// <summary>
                    /// Scrolls to the indicated horizontal position.
                    /// Code Example:
                    /// $("selector").wijsuperpanel("hScrollTo", 100);
                    /// </summary>
                    /// <param name="x" type="Number">
                    /// The position to scroll to.
                    /// </param>
                    /// <param name="isScrollValue" type="Boolean">
                    /// A value that indicates whether x is value or pixel.
                    /// </param>
                    var val = !!isScrollValue ? this._scrollValueToPx(x) : x;

                    //this._updateScrollValue(val, "h");
                    this._animateTo({ "scrollLeft": val });
                },
                vScrollTo: function (y, isScrollValue) {
                    /// <summary>
                    /// Scrolls to the indicated vertical position.
                    /// Code Example:
                    /// $("selector").wijsuperpanel("vScrollTo", 100);
                    /// </summary>
                    /// <param name="y" type="Number">
                    /// The position to scroll to.
                    /// </param>
                    /// <param name="isScrollValue" type="Boolean">
                    /// A value that indicates whether x is value or pixel.
                    /// </param>
                    var val = !!isScrollValue ? this._scrollValueToPx(y) : y;

                    //this._updateScrollValue(val, "v");
                    this._animateTo({ "scrollTop": val });
                },
                refresh: function () {
                    /// <summary>
                    /// Refreshes the wijsuperpanel.
                    /// Needs to be called after content being changed.
                    /// Code Example:
                    /// $("selector").wijsuperpanel("refresh");
                    /// </summary>
                    /// <returns type="Boolean">
                    /// Returns true if it is successful, else returns false.
                    /// </returns>
                    var self = this, f = self._fields();
                    self._applyOverflow(f.stateContainer);
                    self._createAdditionalDom(self, f, self.element);
                },
                scrollTo: function (x, y, isScrollValue) {
                    /// <summary>
                    /// Scroll to specified position.
                    /// Code Example:
                    /// $("selector").wijsuperpanel("scrollTo", 100, 100);
                    /// </summary>
                    /// <param name="x" type="Number">
                    /// Horizontal position to scroll to.
                    /// </param>
                    /// <param name="y" type="Number">
                    /// Vertical position to scroll to.
                    /// </param>
                    /// <param name="isScrollValue" type="Boolean">
                    /// A value that indicates whether x,y are value or pixel.
                    /// </param>
                    var valX = !!isScrollValue ? this._scrollValueToPx(x) : x, valY = !!isScrollValue ? this._scrollValueToPx(y) : y;

                    //this._updateScrollValue(valX, "h");
                    //this._updateScrollValue(valY, "v");
                    //this._animateTo({ "scrollTop": valY, "scrollLeft": valX });
                    this._animateTo({ "scrollTop": valY });
                    this._animateTo({ "scrollLeft": valX });
                }
            });

            wijsuperpanel.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, {
                wijCSS: {
                    superpanelHeader: "wijmo-wijsuperpanel-header",
                    superpanelFooter: "wijmo-wijsuperpanel-footer",
                    superpanelHandle: "",
                    superpanelVBarbuttonTop: "",
                    superpanelVBarbuttonBottom: "",
                    superpanelHBarbuttonLeft: "",
                    superpanelHBarbuttonRight: "",
                    superpanelHBarContainer: "",
                    superpanelVBarContainer: "",
                    superpanelButton: "",
                    superpanelButtonLeft: "",
                    superpanelButtonRight: "",
                    superpanelButtonTop: "",
                    superpanelButtonBottom: ""
                },
                wijMobileCSS: {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-c"
                },
                /// <summary>
                /// Selector option for auto self initialization.
                /// This option is internal.
                /// </summary>
                initSelector: ":jqmData(role='wijsuperpanel')",
                allowResize: false,
                animationOptions: {
                    queue: false,
                    disabled: false,
                    duration: 250,
                    easing: undefined
                },
                hScroller: {
                    scrollBarVisibility: "auto",
                    scrollValue: null,
                    scrollMax: 100,
                    firstStepChangeFix: 0,
                    scrollMin: 0,
                    hoverEdgeSpan: 20
                },
                keyboardSupport: false,
                keyDownInterval: 100,
                mouseWheelSupport: true,
                resizableOptions: {
                    handles: "all",
                    helper: "ui-widget-content wijmo-wijsuperpanel-helper"
                },
                resized: null,
                painted: null,
                scroll: null,
                showRounder: true,
                vScroller: {
                    scrollBarVisibility: "auto",
                    scrollValue: null,
                    scrollMax: 100,
                    scrollMin: 0,
                    firstStepChangeFix: 0,
                    hoverEdgeSpan: 20
                }
            });

            $.wijmo.registerWidget("wijsuperpanel", wijsuperpanel.prototype);
        }
    })(wijmo.superpanel || (wijmo.superpanel = {}));
    var superpanel = wijmo.superpanel;
})(wijmo || (wijmo = {}));

