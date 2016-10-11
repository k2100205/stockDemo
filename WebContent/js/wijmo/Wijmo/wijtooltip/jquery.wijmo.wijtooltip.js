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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../external/declarations/globalize.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals window document clearTimeout setTimeout jQuery */
    /*
    * Depends:
    *  jQuery.js
    *  jquery.ui.core.js
    *  jquery.ui.widget.js
    *  jQuery.ui.position.js
    *  jquery.bgiframe-2.1.3-pre.js
    */
    (function (_tooltip) {
        "use strict";
        var $ = jQuery, widgetName = "wijtooltip", defaultTooltipKey = "@wijtp@", tipCss = "wijmo-wijtooltip", calloutCssPrefix = tipCss + "-arrow-", parseF = parseFloat, win = window, doc = document, math = Math, max = math.max, oldTipPos;

        /** @widget*/
        var wijtooltip = (function (_super) {
            __extends(wijtooltip, _super);
            function wijtooltip() {
                _super.apply(this, arguments);
            }
            wijtooltip.prototype._setOption = function (key, value) {
                var self = this, funName = "_set_" + key, oldValue = self.options[key];

                if (key === "controlwidth") {
                    self._setSize("width", value);
                    return;
                }

                if (key === "controlheight") {
                    self._setSize("height", value);
                    return;
                }

                // use jQueryUI or jQueryMobile's _setOption instead of wijmoWidget's to avoid adding disabledState to the host element.
                _super.prototype._baseWidget.call(this).prototype._setOption.apply(self, arguments);

                if ($.isPlainObject(value)) {
                    self.options[key] = $.extend({}, oldValue, value);
                }

                if (self[funName]) {
                    self[funName](oldValue);
                }

                if (self._isDisabled()) {
                    self._hideTooltip();
                }
            };

            //fix the issue 21416: cssClass does not show.
            wijtooltip.prototype._set_cssClass = function () {
                var self = this, o = self.options, tooltip = self._tooltipCache._$tooltip;

                if (!tooltip) {
                    return;
                }
                if (!tooltip.hasClass(o.cssClass)) {
                    tooltip.addClass(o.cssClass);
                }
            };

            wijtooltip.prototype._set_content = function (value) {
                var self = this;
                if (self._isAjaxCallback) {
                    self._callbacked = true;
                    self.show();
                    self._callbacked = false;
                } else {
                    self._setText();
                }
            };

            wijtooltip.prototype._create = function () {
                var self = this, o = self.options, element = self.element, id = element && element.attr("id"), describedBy = "", cssClass = "", key = o.group || defaultTooltipKey, tooltip = wijtooltip._getTooltip(key);

                if (tooltip) {
                    tooltip.count++;
                } else {
                    tooltip = self._createTooltip();
                    tooltip.count = 1;
                    wijtooltip._tooltips[key] = tooltip;
                }

                //fix the issue 21416: cssClass does not show.
                cssClass = o.cssClass ? o.cssClass : "";
                if (!tooltip._$tooltip.hasClass(cssClass)) {
                    tooltip._$tooltip.addClass(cssClass);
                }

                o.position.of = self.element;
                self._bindLiveEvents();
                self._tooltipCache = tooltip;

                if (id) {
                    describedBy = tooltip._$tooltip.attr("aria-describedby");
                    describedBy = describedBy === undefined ? "" : describedBy + " ";

                    tooltip._$tooltip.attr("aria-describedby", describedBy + id);
                }

                if (o.controlwidth && o.controlwidth !== "") {
                    self._setSize("width", o.controlwidth);
                }

                if (o.controlheight && o.controlheight !== "") {
                    self._setSize("height", o.controlheight);
                }
                _super.prototype._baseWidget.call(this).prototype._create.apply(self, arguments);
            };

            /** Removes the wijtooltip functionality completely.
            * This returns the element back to its pre-init state.
            */
            wijtooltip.prototype.destroy = function () {
                var self = this, element = self.element, key = self.options.group || defaultTooltipKey, timer = self._tooltipCache._showAtAnimationTimer;

                element.unbind(".tooltip");
                element.attr("title", self._content);
                _super.prototype.destroy.call(this);

                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                wijtooltip._removeTooltip(key);
                self._tooltipCache = null;
            };

            /** Returns the wijtooltip element. */
            wijtooltip.prototype.widget = function () {
                return this._tooltipCache._$tooltip;
            };

            /** Shows the tooltip */
            wijtooltip.prototype.show = function () {
                this.showAt(null);
            };

            /** Shows the tooltip at the specified position
            * @param {object} point A point value that indicates the position that tooltip will be shown.
            * @example
            * //Shows the tooltip at point {x: 100, y: 120}.
            * $("#tooltip").wijtooltip("showAt", {x:100, y:120});
            */
            wijtooltip.prototype.showAt = function (point) {
                var self = this, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null, o = self.options;
                if (!tooltipCache || self._isDisabled()) {
                    return;
                }

                _$tooltip.stop(true, true);

                if (tooltipCache._showAnimationTimer) {
                    clearTimeout(tooltipCache._showAnimationTimer);
                    tooltipCache._showAnimationTimer = null;
                }
                if (tooltipCache._showAtAnimationTimer) {
                    clearTimeout(tooltipCache._showAtAnimationTimer);
                    tooltipCache._showAtAnimationTimer = null;
                }
                if (tooltipCache._hideAnimationTimer) {
                    clearTimeout(tooltipCache._hideAnimationTimer);
                    tooltipCache._hideAnimationTimer = null;
                }

                if (!point) {
                    if (o.ajaxCallback && $.isFunction(o.ajaxCallback) && !self._callbacked) {
                        self._isAjaxCallback = true;
                        o.ajaxCallback.call(self.element);
                        return;
                    }
                    self._setText();
                }

                if (!!o.showDelay) {
                    tooltipCache._showAtAnimationTimer = setTimeout(function () {
                        self._showToolTipHelper(point, _$tooltip);
                    }, o.showDelay);
                } else {
                    self._showToolTipHelper(point, _$tooltip);
                }
            };

            /** Hides the tooltip.*/
            wijtooltip.prototype.hide = function () {
                var self = this, tooltipCache = self._tooltipCache;

                if (!tooltipCache) {
                    return;
                }

                if (tooltipCache._showAnimationTimer) {
                    clearTimeout(tooltipCache._showAnimationTimer);
                    tooltipCache._showAnimationTimer = null;
                }
                if (tooltipCache._showAtAnimationTimer) {
                    clearTimeout(tooltipCache._showAtAnimationTimer);
                    tooltipCache._showAtAnimationTimer = null;
                }
                if (tooltipCache._hideAnimationTimer) {
                    clearTimeout(tooltipCache._hideAnimationTimer);
                    tooltipCache._hideAnimationTimer = null;
                }

                //clearTimeout(tooltip._showAnimationTimer);
                if (!!self.options.hideDelay) {
                    tooltipCache._hideAnimationTimer = setTimeout($.proxy(self._hideTooltip, self), self.options.hideDelay);
                } else {
                    self._hideTooltip();
                }
            };

            //begin private methods
            wijtooltip.prototype._createTooltip = function () {
                var self = this, o = self.options, tooltipCache = new TooltipCache(), _$tooltip = $("<div></div>").addClass(o.wijCSS.tooltip).addClass(o.wijCSS.widget).addClass(o.wijCSS.content).addClass(o.wijCSS.cornerAll), container = $("<div></div>").addClass(o.wijCSS.tooltipContainer), callout = $("<div></div>").addClass(o.wijCSS.content).addClass(o.wijCSS.tooltipPointer).append($("<div></div>").addClass(o.wijCSS.tooltipPointerInner)), title = $("<div></div>").addClass(o.wijCSS.tooltipTitle).addClass(o.wijCSS.header).addClass(o.wijCSS.cornerAll), closeBtn = $("<a href='#'></a>").addClass(o.wijCSS.tooltipClose).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll);

                closeBtn.append($("<span></span>").addClass(o.wijCSS.icon).addClass(o.wijCSS.iconClose)).unbind("click").bind("click", $.proxy(self._onClickCloseBtn, self));

                if (o.closeBehavior !== "sticky") {
                    closeBtn.hide();
                }
                if (!o.showCallout) {
                    callout.hide();
                }

                _$tooltip.append(title).append(closeBtn).append(container).append(callout).css("position", "absolute").attr("role", "tooltip").appendTo("body").hide();

                tooltipCache._$tooltip = _$tooltip;
                tooltipCache._container = container;
                tooltipCache._callout = callout;
                tooltipCache._closeBtn = closeBtn;
                tooltipCache._title = title;

                return tooltipCache;
            };

            wijtooltip.prototype._showToolTipHelper = function (point, _$tooltip) {
                if (point) {
                    var self = this, tooltipCache = self._tooltipCache, offset = {}, calloutShape, newCalloutShape, visible = _$tooltip.is(":visible"), callout = tooltipCache ? tooltipCache._callout : null;
                    if (!callout) {
                        return;
                    }
                    self._setText();
                    oldTipPos = _$tooltip.offset();

                    _$tooltip.offset({ left: 0, top: 0 }).show();

                    calloutShape = self._getCalloutShape();

                    offset = this._getOffsetPosition(point, _$tooltip, callout, calloutShape);

                    newCalloutShape = self._flipTooltip(offset, calloutShape);
                    self._setUnfilledCallout(newCalloutShape);
                    if (_$tooltip && newCalloutShape != calloutShape) {
                        offset = this._getOffsetPosition(point, _$tooltip, callout, newCalloutShape);
                    }
                    _$tooltip.offset(offset); //.hide();
                    if (!visible) {
                        _$tooltip.hide();
                    }
                    self._calloutShape = newCalloutShape;
                } else {
                    oldTipPos = _$tooltip.offset();
                    if (this.options.mouseTrailing) {
                        this._setCalloutCss();
                        if (_$tooltip.is(":visible")) {
                            return;
                        }
                    }
                    this._setPosition();
                }
                this._showTooltip();
            };

            wijtooltip.prototype._getOffsetPosition = function (point, _$tooltip, calloutEle, calloutShape) {
                var offset = { left: 0, top: 0 }, width = _$tooltip.width(), height = _$tooltip.height(), border, hBorder, vBorder, offX, offY;

                // Update callout style to get correct position.
                this._removeCalloutCss();
                _$tooltip.addClass(calloutCssPrefix + calloutShape);
                offX = calloutEle.position().left, offY = calloutEle.position().top;

                // In fact, "border" is the size of callout element
                border = this._getBorder(calloutEle);
                hBorder = border["left"] || border["right"];
                vBorder = border["top"] || border["bottom"];

                switch (calloutShape) {
                    case "rt":
                        offset = {
                            left: point.x - width - hBorder,
                            top: point.y - offY
                        };
                        break;
                    case "rc":
                        offset = {
                            left: point.x - width - hBorder,
                            top: point.y - height / 2
                        };
                        break;
                    case "rb":
                        offset = {
                            left: point.x - width - hBorder,
                            top: point.y - offY - vBorder
                        };
                        break;
                    case "lt":
                        offset = {
                            left: point.x + hBorder,
                            top: point.y - offY
                        };
                        break;
                    case "lc":
                        offset = {
                            left: point.x + hBorder,
                            top: point.y - height / 2
                        };
                        break;
                    case "lb":
                        offset = {
                            left: point.x + hBorder,
                            top: point.y - offY - vBorder
                        };
                        break;
                    case "tl":
                        offset = {
                            left: point.x - offX,
                            top: point.y + vBorder
                        };
                        break;
                    case "tc":
                        offset = {
                            left: point.x - width / 2,
                            top: point.y + vBorder
                        };
                        break;
                    case "tr":
                        offset = {
                            left: point.x - offX - hBorder,
                            top: point.y + vBorder
                        };
                        break;
                    case "bl":
                        offset = {
                            left: point.x - offX,
                            top: point.y - height - vBorder
                        };
                        break;
                    case "bc":
                        offset = {
                            left: point.x - width / 2,
                            top: point.y - height - vBorder
                        };
                        break;
                    case "br":
                        offset = {
                            left: point.x - offX - hBorder,
                            top: point.y - height - vBorder
                        };
                        break;
                    case "cc":
                        offset = {
                            left: point.x - width / 2,
                            top: point.y - height / 2
                        };
                        break;
                }

                return offset;
            };

            wijtooltip.prototype._bindLiveEvents = function () {
                var self = this, o = self.options, element = self.element;

                if (self._content === undefined) {
                    self._content = element.attr("title");
                    element.attr("title", "");
                }

                element.unbind('.tooltip');

                if (o.mouseTrailing) {
                    element.bind("mousemove.tooltip", function (e) {
                        if (self._isDisabled()) {
                            return;
                        }
                        var offset = o.position.offset || "", offsets = offset.split(" ");
                        if (offsets.length === 2) {
                            self.showAt({
                                x: e.pageX + parseInt(offsets[0], 10),
                                y: e.pageY + parseInt(offsets[1], 10)
                            });
                        } else {
                            self.showAt({ x: e.pageX, y: e.pageY });
                        }
                    });
                }

                element.bind("mouseout.tooltip", $.proxy(self._hideIfNeeded, self));
                switch (o.triggers) {
                    case "hover":
                        element.bind("mouseover.tooltip", $.proxy(self.show, self));
                        break;
                    case "click":
                        element.bind("click.tooltip", $.proxy(self.show, self));
                        break;
                    case "focus":
                        element.bind("focus.tooltip", $.proxy(self.show, self)).bind("blur.tooltip", $.proxy(self._hideIfNeeded, self));
                        break;
                    case "rightClick":
                        element.bind("contextmenu.tooltip", function (e) {
                            self.show();
                            e.preventDefault();
                        });
                        break;
                }
            };

            wijtooltip.prototype._hideIfNeeded = function () {
                var self = this, o = self.options, closeBehavior = o.closeBehavior, visible = self._tooltipCache && self._tooltipCache._$tooltip && self._tooltipCache._$tooltip.is(":visible");

                if (closeBehavior === "sticky" || o.modal || !visible || closeBehavior === "none" || self._isDisabled()) {
                    return;
                }

                self.hide();
            };

            wijtooltip.prototype._flipTooltip = function (pos, calloutShape) {
                var self = this, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null, bound = { width: _$tooltip.width(), height: _$tooltip.height() }, flipCallout, flip, width, height;

                flipCallout = self._flipCallout(pos, bound, calloutShape);

                return flipCallout.calloutShape;
            };

            wijtooltip.prototype._flipCallout = function (pos, bound, calloutShape) {
                var self = this, o = self.options, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache._$tooltip, flip = { h: false, v: false }, jqWin = $(win), collision = (o.position.collision || "flip").split(" ");

                if (collision.length === 1) {
                    collision[1] = collision[0];
                }

                if (!tooltipCache || (collision[0] !== "flip" && collision[1] !== "flip")) {
                    return { flip: flip, calloutShape: null };
                }

                if (collision[0] === "flip") {
                    if (pos.left < 0) {
                        flip.h = true;
                        if (calloutShape.indexOf('r') > -1) {
                            calloutShape = calloutShape.replace(/r/, 'l');
                            flip.h = "r";
                        }
                    }
                    if (pos.left + bound.width > jqWin.width() + jqWin.scrollLeft()) {
                        flip.h = true;
                        if (calloutShape.indexOf('l') > -1) {
                            calloutShape = calloutShape.replace(/l/, 'r');
                            flip.h = "l";
                        }
                    }
                }

                if (collision[0] === "flip") {
                    if (pos.top < 0) {
                        flip.v = true;
                        if (calloutShape.indexOf('b') > -1) {
                            calloutShape = calloutShape.replace(/b/, 't');
                            flip.v = "b";
                        }
                    }
                    if (pos.top + bound.height > jqWin.height() + jqWin.scrollTop()) {
                        flip.v = true;
                        if (calloutShape.indexOf('t') > -1) {
                            calloutShape = calloutShape.replace(/t/, 'b');
                            flip.v = "t";
                        }
                    }
                }

                //fix the issue 21386, calloutShape undefind
                if (flip.h || flip.v) {
                    self._removeCalloutCss();
                    _$tooltip.addClass(calloutCssPrefix + calloutShape);
                }

                return { flip: flip, calloutShape: calloutShape };
            };

            //methods for options setters
            wijtooltip.prototype._set_position = function (oldValue) {
                var self = this, o = self.options, val = o.position;

                if (o.showCallout) {
                    if (oldValue.my !== val.my || oldValue.at !== val.at) {
                        self._setPosition();
                    }

                    self._setCalloutOffset(true);
                }

                //fix the issue 21467.
                self._setText();
            };

            wijtooltip.prototype._set_showCallout = function () {
                var self = this, tooltipCache = self._tooltipCache, callout = tooltipCache ? tooltipCache._callout : null;

                if (!tooltipCache || !callout) {
                    return;
                }

                if (self.options.showCallout) {
                    self._setCalloutCss();
                    callout.show();
                } else {
                    callout.hide();
                }
                self._setPosition();
            };

            wijtooltip.prototype._set_closeBehavior = function () {
                var self = this, tooltipCache = self._tooltipCache, closeBtn = tooltipCache ? tooltipCache._closeBtn : null;

                if (closeBtn) {
                    closeBtn[self.options.closeBehavior === "sticky" ? "show" : "hide"]();
                }
            };

            wijtooltip.prototype._set_triggers = function () {
                this._bindLiveEvents();
            };

            wijtooltip.prototype._set_mouseTrailing = function () {
                this._bindLiveEvents();
            };

            //end of methods for options setters.
            wijtooltip.prototype._getCalloutShape = function () {
                var self = this, position = self.options.position, makeArr = function (items) {
                    return $.makeArray($.map(items, function (item) {
                        return item.substr(0, 1);
                    }));
                }, myItems = makeArr(position.my.split(" ")), atItems = makeArr(position.at.split(" ")), shape = [];

                if (myItems.length === 2) {
                    shape = myItems;
                }

                if (myItems[0] === atItems[0]) {
                    if ((myItems[1] === 't' && atItems[1] === 'b') || (myItems[1] === 'b' && atItems[1] === 't')) {
                        shape.reverse();
                    }
                } else if (atItems[0] === 'c') {
                    shape.reverse();
                }

                if (shape[0] === 'c') {
                    shape.reverse();
                }

                return shape.join("");
            };

            wijtooltip.prototype._setCalloutCss = function () {
                var self = this, o = self.options, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null, cssName = "", calloutShape = "", isTouchEnabled = $.support.isTouchEnabled;

                if (!o.showCallout && !isTouchEnabled) {
                    return;
                }

                self._removeCalloutCss();
                calloutShape = self._getCalloutShape();
                cssName = calloutCssPrefix + calloutShape;

                if (_$tooltip) {
                    _$tooltip.addClass(cssName);
                }
            };

            wijtooltip.prototype._removeCalloutCss = function () {
                var tooltipCache = this._tooltipCache, _$tooltip;

                if (tooltipCache) {
                    _$tooltip = tooltipCache._$tooltip;
                    $.each([
                        "tl", "tc", "tr",
                        "bl", "bc", "br",
                        "rt", "rc", "rb",
                        "lt", "lc", "lb", "cc"], function (idx, compass) {
                        var cssName = calloutCssPrefix + compass;

                        if (_$tooltip.hasClass(cssName)) {
                            _$tooltip.removeClass(cssName);
                            return false;
                        }
                    });
                }
            };

            wijtooltip.prototype._getBorder = function (element) {
                var obj = {};

                $.each(["top", "right", "left", "bottom"], function (idx, compass) {
                    obj[compass] = parseF(element.css("border-" + compass + "-width"));
                });

                return obj;
            };

            wijtooltip.prototype._setPosition = function () {
                var self = this, o = self.options, position = o.position, my = position.my, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null, isHidden = _$tooltip.is(":hidden"), calloutShape = self._getCalloutShape(), arrCalloutShape = calloutShape ? calloutShape.split('') : null, offset = [0, 0], callout = tooltipCache._callout, border, top, left, right, bottom, bound = { width: _$tooltip.width(), height: _$tooltip.height() }, flipCallout, flip, isTouchEnabled = $.support.isTouchEnabled;

                self._setCalloutCss();

                if (isHidden) {
                    _$tooltip.show();
                }

                _$tooltip.css({ left: 0, top: 0 });

                if (o.showCallout) {
                    border = self._getBorder(callout);
                    left = parseF(callout.css("left"));
                    top = parseF(callout.css("top"));
                    right = parseF(callout.css("right"));
                    bottom = parseF(callout.css("bottom"));

                    switch (arrCalloutShape[0]) {
                        case "l":
                            offset[0] = border.right;
                            break;
                        case "r":
                            offset[0] = -border.left;
                            break;
                        case "b":
                            offset[1] = bottom;
                            break;
                        case "t":
                            offset[1] = -top;
                            break;
                    }

                    switch (arrCalloutShape[1]) {
                        case "t":
                            offset[1] = -top;
                            break;
                        case "b":
                            offset[1] = bottom;
                            break;
                        case "r":
                            offset[0] = right;
                            break;
                        case "l":
                            offset[0] = -left;
                            break;
                    }
                    //sOffset = offset.join(" ");
                }

                if (isTouchEnabled && isTouchEnabled()) {
                    switch (arrCalloutShape[0]) {
                        case "l":
                            offset[0] = offset[0] + 30;
                            break;
                        case "r":
                            offset[0] = offset[0] - 30;
                            break;
                        case "b":
                            offset[1] = offset[1] - 30;
                            break;
                        case "t":
                            offset[1] = offset[1] + 30;
                            break;
                    }

                    switch (arrCalloutShape[1]) {
                        case "t":
                            offset[1] = offset[1] + 30;
                            break;
                        case "b":
                            offset[1] = offset[1] - 30;
                            break;
                        case "r":
                            offset[0] = offset[0] - 30;
                            break;
                        case "l":
                            offset[0] = offset[0] + 30;
                            break;
                    }
                    //sOffset = offset.join(" ");
                }

                //"left+10 top+-10"
                if (position.my.indexOf(" ") > -1) {
                    my = position.my.split(" ")[0] + "+" + offset[0] + " " + position.my.split(" ")[1] + "+" + offset[1];
                } else {
                    my = position.my + "+" + offset[0] + " " + position.my + "+" + offset[1];
                }

                _$tooltip.position({
                    my: my, at: position.at, of: position.of,
                    //offset: sOffset, collision: "none none"
                    collision: "none none"
                });

                flipCallout = self._flipCallout(_$tooltip.offset(), bound, calloutShape);
                flip = flipCallout.flip;

                if (flip.h || flip.v) {
                    _$tooltip.css({ left: 0, top: 0 });
                    _$tooltip.position({
                        my: my, at: position.at, of: position.of,
                        //offset: sOffset, collision: position.collision
                        collision: position.collision
                    });
                }

                if (o.showCallout) {
                    self._setUnfilledCallout(calloutShape);
                }

                self._calloutShape = calloutShape;

                if (isHidden) {
                    _$tooltip.hide();
                }
            };

            wijtooltip.prototype._setCalloutOffset = function (showCalloutAnimation) {
                var self = this, o = self.options, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null, callout = tooltipCache && tooltipCache._callout, calloutShape = self._calloutShape, horizontal = false, offset = o.position.offset, value = "", offsetItems = [], calloutAnimation = o.calloutAnimation;

                if (!callout) {
                    return;
                }

                if (!offset || offset.length === 0) {
                    return;
                }

                callout.stop(true, true);

                $.each(["tr", "tc", "tl", "bl", "bc", "br"], function (idx, compass) {
                    if (calloutShape === compass) {
                        horizontal = true;
                        return false;
                    }
                });

                if (offset) {
                    offsetItems = offset.split(" ");

                    if (offsetItems.length === 2) {
                        value = horizontal ? offsetItems[0] : offsetItems[1];
                    } else if (offsetItems.length === 1) {
                        value = offsetItems[0];
                    }
                }

                //when 'position.offset' is set "none none",
                //the properties left and top of the 'callout' element in the tooltip
                //need to be removed.
                if (offsetItems && offsetItems.length === 2 && offsetItems[0] === "none" && offsetItems[1] === "none") {
                    callout.css("left", "").css("top", "");
                } else if (value === "none") {
                    callout.css(horizontal ? "left" : "top", "");
                } else if (value !== "") {
                    if (showCalloutAnimation && !showCalloutAnimation.disabled) {
                        if (horizontal) {
                            callout.animate({ left: value }, calloutAnimation.duration, calloutAnimation.easing);
                        } else {
                            callout.animate({ top: value }, calloutAnimation.duration, calloutAnimation.easing);
                        }
                    } else {
                        callout.css(horizontal ? "left" : "top", value);
                    }
                }
            };

            wijtooltip.prototype._setUnfilledCallout = function (calloutShape) {
                var self = this, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null, callout = tooltipCache && tooltipCache._callout, innerCallout = callout && callout.children(), arrCalloutSharp = calloutShape.split(''), borderColor = _$tooltip ? _$tooltip.css("background-color") : "";

                if (!innerCallout) {
                    return;
                }

                innerCallout.css({
                    "border-left-color": "",
                    "border-top-color": "",
                    "border-bottom-color": "",
                    "border-right-color": ""
                });

                if (!self.options.calloutFilled) {
                    switch (arrCalloutSharp[0]) {
                        case "l":
                            innerCallout.css("border-right-color", borderColor);
                            break;
                        case "t":
                            innerCallout.css("border-bottom-color", borderColor);
                            break;
                        case "r":
                            innerCallout.css("border-left-color", borderColor);
                            break;
                        case "b":
                            innerCallout.css("border-top-color", borderColor);
                            break;
                    }
                }
            };

            wijtooltip.prototype._showTooltip = function () {
                var self = this, o = self.options, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null, showAnimation, animations, curPos;

                if (!tooltipCache) {
                    return;
                }

                if (self._trigger("showing", null, self) === false) {
                    //fixed the issue 41097, when the tooltip is visible, hide the tooltip.
                    if (_$tooltip.is(":visible")) {
                        _$tooltip.hide();
                    }
                    return;
                }

                self._showModalLayer();
                _$tooltip.css("z-index", 99999);

                if ($.fn.wijshow) {
                    animations = {
                        show: true,
                        context: _$tooltip
                    };

                    showAnimation = $.extend({}, o.animation, o.showAnimation);

                    if (_$tooltip.is(":visible")) {
                        curPos = _$tooltip.offset();
                        _$tooltip.offset(oldTipPos);
                        $.extend(animations, { pos: curPos });
                        showAnimation.animated = "tooltipSlide";
                    }
                    _$tooltip.wijshow(showAnimation, wijtooltip.animations, animations, null, function () {
                        self._trigger("shown");
                    });
                } else {
                    _$tooltip.show();
                    self._trigger("shown");
                }
                self._setCalloutOffset(false);
            };

            wijtooltip.prototype._hideTooltip = function () {
                var self = this, o = self.options, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null, hideAnimation = $.extend({}, o.animation, o.hideAnimation), animations;

                if (!tooltipCache) {
                    return;
                }

                if (self._trigger("hiding", null, self) === false) {
                    return;
                }

                self._hideModalLayer();

                if ($.fn.wijhide) {
                    animations = {
                        show: false,
                        context: _$tooltip
                    };
                    _$tooltip.wijhide(hideAnimation, wijtooltip.animations, animations, null, function () {
                        self._trigger("hidden");
                        _$tooltip.css("z-index", "");
                    });
                } else {
                    _$tooltip.hide();
                    self._trigger("hidden");
                    _$tooltip.css("z-index", "");
                }
            };

            wijtooltip.prototype._getContent = function (content) {
                var obj = { data: "" }, retValue;
                if ($.isFunction(content)) {
                    retValue = content.call(this.element, obj);
                    if (obj.data !== "") {
                        return obj.data;
                    } else {
                        return retValue;
                    }
                } else if (window[content] && $.isFunction(window[content])) {
                    // if window[content/title] is a function, then get the
                    // function value.
                    retValue = window[content].call(this.element, obj);
                    if (obj.data !== "") {
                        return obj.data;
                    } else {
                        return retValue;
                    }
                }
                return content;
            };

            wijtooltip.prototype._setText = function () {
                var self = this, o = self.options, tooltipCache = self._tooltipCache, content = "", title = "", jqTitle = tooltipCache ? tooltipCache._title : null;

                if (!tooltipCache) {
                    return;
                }

                content = self._getContent(o.content);
                content = content === "" ? self._content : content;
                tooltipCache._container.html(content);

                title = self._getContent(o.title);

                if (title !== "") {
                    jqTitle.html(title).show();
                } else {
                    jqTitle.hide();
                }
            };

            wijtooltip.prototype._showModalLayer = function () {
                var self = this, o = self.options, modalLayer = null;

                if (self.options.modal) {
                    modalLayer = $("<div>").addClass(o.wijCSS.overlay).css("z-index", 99000).width(self._getDocSize("Width")).height(self._getDocSize("Height")).appendTo("body");

                    $(window).bind("resize.wijtooltip", function () {
                        modalLayer.width(self._getDocSize("Width")).height(self._getDocSize("Height"));
                    });

                    self._tooltipCache._modalLayer = modalLayer;
                }
            };

            wijtooltip.prototype._hideModalLayer = function () {
                var self = this, modalLayer = self._tooltipCache._modalLayer;

                if (modalLayer) {
                    modalLayer.css("z-index", "").remove();
                    modalLayer = null;

                    $(window).unbind("resize.wijtooltip");
                }
            };

            wijtooltip.prototype._getDocSize = function (name) {
                var scrollValue, offsetValue, de = "documentElement", body = "body";

                // handle IE 6
                if ($.browser.msie && parseFloat($.browser.version) < 9) {
                    scrollValue = max(doc[de]["scroll" + name], doc[body]["scroll" + name]);

                    offsetValue = max(doc[de]["offset" + name], doc[body]["offset" + name]);

                    return (scrollValue < offsetValue ? ($(win)[name.toLowerCase()]() + 'px') : scrollValue + 'px');
                } else {
                    return $(doc)[name.toLowerCase()]() + 'px';
                }
            };

            wijtooltip.prototype._setSize = function (key, val) {
                var self = this, tooltipCache = self._tooltipCache, _$tooltip = tooltipCache ? tooltipCache._$tooltip : null;

                if (_$tooltip) {
                    _$tooltip.css(key, val);
                }
            };

            //begin event handler methods
            wijtooltip.prototype._onClickCloseBtn = function (e) {
                this.hide();
                e.preventDefault();
            };

            wijtooltip._getTooltip = function (key) {
                return wijtooltip._tooltips[key];
            };

            wijtooltip._removeTooltip = function (key) {
                var tooltipCache = wijtooltip._tooltips[key];

                if (tooltipCache) {
                    tooltipCache.count--;

                    if (tooltipCache.count <= 0) {
                        tooltipCache._title.remove();
                        delete tooltipCache._title;
                        tooltipCache._closeBtn.unbind();
                        tooltipCache._closeBtn.remove();
                        delete tooltipCache._closeBtn;
                        tooltipCache._callout.remove();
                        delete tooltipCache._callout;
                        tooltipCache._container.remove();
                        delete tooltipCache._container;
                        tooltipCache._$tooltip.remove();
                        delete tooltipCache._$tooltip;
                        if (tooltipCache._modalLayer) {
                            tooltipCache._modalLayer.remove();
                            delete tooltipCache._modalLayer;
                        }
                        wijtooltip._tooltips[key] = null;
                        delete wijtooltip._tooltips[key];
                    }
                }
            };
            wijtooltip._tooltips = new Array();

            wijtooltip.animations = {
                fade: function (options, additions) {
                    options = $.extend({
                        duration: 300,
                        easing: "swing"
                    }, options, additions);
                    options.context.stop(true, true).animate(options.show ? { opacity: 'show' } : { opacity: 'hide' }, options);
                },
                tooltipSlide: function (options, additions) {
                    options = $.extend({
                        duration: 300,
                        easing: "swing"
                    }, options, additions);
                    options.context.stop(true, true).animate({
                        left: options.pos.left,
                        top: options.pos.top
                    }, options);
                }
            };
            return wijtooltip;
        })(wijmo.wijmoWidget);
        _tooltip.wijtooltip = wijtooltip;

        var wijtooltip_options = (function () {
            function wijtooltip_options() {
                /** Selector option for auto self initialization.
                * This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijtooltip')";
                /** tooltip css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                    tooltip: "wijmo-wijtooltip",
                    tooltipContainer: "wijmo-wijtooltip-container",
                    tooltipPointer: "wijmo-wijtooltip-pointer",
                    tooltipPointerInner: "wijmo-wijtooltip-pointer-inner",
                    tooltipTitle: "wijmo-wijtooltip-title",
                    tooltipClose: "wijmo-wijtooltip-close"
                };
                /** @ignore */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-a",
                    stateDefault: "ui-btn ui-btn-a",
                    stateHover: "ui-btn-down-a",
                    stateActive: "ui-btn-down-a"
                };
                /** Sets the tooltip's content.
                * @type {string|function}
                * @remarks  The value can be a string, html code, or a function.
                * If it is a function, then the content will be
                * the function's return value.
                * @example
                * //Set tooltip's content to "my content".
                * $(".selector").wijtooltip("option", "content", "my content").
                */
                this.content = '';
                /** Specifies a value that sets the tooltip's title.
                * @type {string|function}
                * @remarks The value can be a string, html code, or a function.
                * If it is a function, then the title will be the function's return value.
                * @example
                * //Set tooltip's title to "my title".
                * $(".selector").wijtooltip("option", "title", "my title");
                */
                this.title = '';
                /** Determines how to close the tooltip. Behaviors include auto or sticky.
                * @remarks Options: "auto", "none" and "sticky".
                */
                this.closeBehavior = 'auto';
                /** If true, then the tooltip moves with the mouse. */
                this.mouseTrailing = false;
                /** Sets the event that will cause the tooltip to appear.
                * @remarks Options: "hover", "click", "focus", "rightClick", "custom".
                */
                this.triggers = 'hover';
                /** Sets the tooltip's position mode in relation to the 'relativeTo',
                * 'offsetX', and 'offsetY' properties.
                * @remarks See jQuery ui position for more details
                * http://api.jqueryui.com/position/ .
                */
                this.position = {
                    my: 'left bottom',
                    at: 'right top',
                    offset: null
                };
                /** Determines whether to show the callout element. */
                this.showCallout = true;
                /** Sets the showAnimation and hideAnimation options if they are  not specified individually.
                * @remarks This should be an object value. Possible values include:
                * 'animated', 'duration', and 'easing'. You can create custom easing
                * animations using jQuery UI Easings.
                * This property works with jQuery animation.
                */
                this.animation = { animated: 'fade', duration: 500, easing: null };
                /** Determines the animation effect that will be shown.
                * @remarks This should be an object value. Possible values include:
                * 'animated', 'duration', and 'easing'. You can create custom easing
                * animations using jQuery UI Easings.
                * This property works with jQuery animation.
                */
                this.showAnimation = {};
                /** Determines whether the animation effect can be seen.
                * @remarks This should be an object value. Possible values include:
                * 'animated', 'duration', and 'easing'. You can create custom easing
                * animations using jQuery UI Easings.
                * This property works with jQuery animation.
                */
                this.hideAnimation = {};
                /** Determines the length of the delay before the tooltip appears. */
                this.showDelay = 150;
                /** Determines the length of the delay before the tooltip disappears. */
                this.hideDelay = 150;
                /** Sets the callout's offset changing animation.
                * @remarks This should be an object value. Possible values include:
                * 'disabled', 'duration', and 'easing'.
                */
                this.calloutAnimation = { duration: 1000, disabled: false, easing: null };
                /** Determines the callout's class style.
                * If true, then the callout triangle is filled.
                */
                this.calloutFilled = false;
                /** A value that indicates whether to show the modal tooltip. */
                this.modal = false;
                /** Determines which group the tooltip belongs to.
                * @type {string}
                */
                this.group = null;
                /** A function that defines a callback when AJAX is uesd to set the
                * content property.
                * @type {function}
                * @remarks In AJAX's complete callback method, the user set the callback
                * data to the content option.
                */
                this.ajaxCallback = null;
                /** Trigegred before showing the tooltip.
                * Use return false; to cancel the event and stop showing the tooltip.
                * @event
                * @param event jQuery.Event object
                * @param ui The wijtooltip widget.
                */
                this.showing = null;
                /** Triggered once the tooltip has shown.
                * @event
                * @param event jQuery.Event object
                * @param ui The wijtooltip widget.
                */
                this.shown = null;
                /** Triggered before hiding the tooltip.If data.cancel is
                * set to true, then the tooltip is no longer hidden
                * @event
                * @param event jQuery.Event object
                * @param ui The wijtooltip widget.
                */
                this.hiding = null;
                /** Triggered once the tooltip is hidden.
                * @event
                * @param event jQuery.Event object
                * @param ui The wijtooltip widget.
                */
                this.hidden = null;
                /** A value that indicates whether to set user-defined class. */
                this.cssClass = '';
                /** Determines the width of the tooltip. */
                this.controlwidth = null;
                /** Determines the height of the tooltip. */
                this.controlheight = null;
            }
            return wijtooltip_options;
        })();
        ;

        //#region options
        wijtooltip.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijtooltip_options());

        //#endregion
        $.wijmo.registerWidget(widgetName, wijtooltip.prototype);
    })(wijmo.tooltip || (wijmo.tooltip = {}));
    var tooltip = wijmo.tooltip;
})(wijmo || (wijmo = {}));

/** @ignore */
var TooltipCache = (function () {
    function TooltipCache() {
    }
    return TooltipCache;
})();


