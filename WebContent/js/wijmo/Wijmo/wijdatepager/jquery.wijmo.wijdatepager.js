/*
 *
 * Wijmo Library 3.20162.103
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 */
/// <reference path="../external/declarations/globalize.d.ts" />
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijpopup/jquery.wijmo.wijpopup.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery,$,window,alert,document,confirm,location,setTimeout, Globalize,
    clearTimeout,amplify*/
    /*jslint white: false */
    /*jslint nomen: false*/
    /*
    * Depends:
    *  jquery.ui.core.js
    *  jquery.ui.widget.js
    *  globalize.js
    *  jquery.wijmo.wijpopup.js
    *  jquery.ui.wijutil.js
    *
    */
    (function (datepager) {
        var $ = jQuery, widgetName = "wijdatepager", datePagerClass = "wijmo-wijdatepager", incButtonClass = "wijmo-wijdatepager-increment", decButtonClass = "wijmo-wijdatepager-decrement", containerClass = "wijmo-wijdatepager-container", pagesClass = "wijmo-wijdatepager-pages", pageLabelClass = "wijmo-wijdatepager-pagelabel", pageLabelFirstClass = "wijmo-wijdatepager-pagelabel-first", pageLabelLastClass = "wijmo-wijdatepager-pagelabel-last", pageHeaderClass = "wijmo-wijdatepager-pageheader", pageRangeClass = "wijmo-wijdatepager-pagerange", tooltipClass = "wijmo-wijdatepager-tooltip", tooltipInnerClass = "wijmo-wijdatepager-tooltip-inner", triangleClass = "wijmo-wijdatepager-triangle", widthSmallestClass = "wijmo-wijdatepager-width-smallest", widthSmallClass = "wijmo-wijdatepager-width-small", widthMediumClass = "wijmo-wijdatepager-width-medium", widthNormalClass = "wijmo-wijdatepager-width-normal";

        /** @widget */
        var wijdatepager = (function (_super) {
            __extends(wijdatepager, _super);
            function wijdatepager() {
                _super.apply(this, arguments);
            }
            wijdatepager.prototype._setOption = function (key, value) {
                var prevSelectedDate = this.options.selectedDate, dateEqual = function (a, b) {
                    if (a && b && a.getTime && b.getTime) {
                        return a.getTime() === b.getTime();
                    } else {
                        return a === b;
                    }
                };
                _super.prototype._setOption.call(this, key, value);
                switch (key) {
                    case "culture":
                    case "cultureCalendar":
                        this.options[key] = value;
                        this._innerCulture = null;
                        this._resetCulture();
                        this._initBackground();
                        break;
                    case "selectedDate":
                        this.options.selectedDate = value;
                        this._initBackground();
                        if (!dateEqual(value, prevSelectedDate)) {
                            this._onSelectedDateChanged();
                        }
                        break;
                    case "viewType":
                        this.options.viewType = value;
                        this._resetPageDates();
                        this._initBackground();
                        break;
                    case "customViewOptions":
                        this.options.customViewOptions = value;
                        this._resetPageDates();
                        this._initBackground();
                        break;
                    case "nextTooltip":
                        this.element.find("." + incButtonClass).attr("title", value);
                        break;
                    case "prevTooltip":
                        this.element.find("." + decButtonClass).attr("title", value);
                        break;
                    case "firstDayOfWeek":
                        this.options.firstDayOfWeek = value;
                        if (this.options.viewType === "week") {
                            this._initBackground();
                        }
                        break;
                }
                return this;
            };

            wijdatepager.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableDatePager(true);
            };

            wijdatepager.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableDatePager(false);
            };

            wijdatepager.prototype._toggleDisableDatePager = function (disabled) {
                this.element.toggleClass(this.options.wijCSS.stateDisabled, disabled);
                if ($.mobile == null) {
                    this.element.find("." + decButtonClass).button("option", "disabled", disabled);
                    this.element.find("." + incButtonClass).button("option", "disabled", disabled);
                } else {
                    this.element.find("." + decButtonClass).toggleClass(this.options.wijCSS.stateDisabled, disabled);
                    this.element.find("." + incButtonClass).toggleClass(this.options.wijCSS.stateDisabled, disabled);
                }
            };

            ///	<summary>
            ///	Creates date pager DOM elements and binds interactive events.
            ///	</summary>
            wijdatepager.prototype._create = function () {
                var o = this.options, resizeHandler, decBtn, incBtn;

                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }

                if (!o.selectedDate) {
                    o.selectedDate = new Date();
                }
                this._nativeClass = this.element.attr("class");
                this._dtpagernamespacekey = "dtpager" + new Date().getTime();
                this.element.addClass(datePagerClass).addClass(o.wijCSS.wijdatepager).addClass(o.wijCSS.widget).addClass(o.wijCSS.helperClearFix);
                resizeHandler = $.proxy(this.invalidate, this);
                $(window).bind("resize." + this._dtpagernamespacekey, resizeHandler);
                if (this.element.disableSelection) {
                    this.element.disableSelection();
                }
                this.element.append($("<a></a>").addClass(decButtonClass).addClass(o.wijCSS.wijdatepagerDecButton).append($("<span>" + o.prevTooltip + "</span>"))).append($("<div></div>").addClass(containerClass).addClass(o.wijCSS.wijdatepagerContainer).addClass(o.wijCSS.content).append($("<div></div>").addClass(pagesClass).addClass(o.wijCSS.wijdatepagerPages))).append($("<a></a>").addClass(incButtonClass).addClass(o.wijCSS.wijdatepagerIncButton).append($("<span>" + o.nextTooltip + "</span>")));

                decBtn = this.element.find("." + decButtonClass);
                incBtn = this.element.find("." + incButtonClass);
                if ($.mobile == null) {
                    decBtn.button({
                        icons: {
                            primary: o.wijCSS.iconArrowLeft
                        }, text: false
                    });
                    incBtn.button({
                        icons: {
                            primary: o.wijCSS.iconArrowRight
                        }, text: false
                    });
                } else {
                    decBtn.html("");
                    decBtn.addClass(o.wijCSS.iconArrowLeft + " " + o.wijCSS.icon + " ui-btn");
                    incBtn.html("");
                    incBtn.addClass(o.wijCSS.iconArrowRight + " " + o.wijCSS.icon + " ui-btn");
                }

                decBtn.click($.proxy(this.goLeft, this));
                incBtn.click($.proxy(this.goRight, this));

                this._initBackground();

                _super.prototype._create.call(this);
            };

            /** Destroys the widget and resets the DOM element.*/
            wijdatepager.prototype.destroy = function () {
                var wijCSS = this.options.wijCSS;
                this.element.empty().removeAttr("aria-disabled");
                this.element.attr("class", this._nativeClass ? this._nativeClass : "");
                $(window).unbind("." + this._dtpagernamespacekey);
                $(document).unbind("." + this._dtpagernamespacekey);
                _super.prototype.destroy.call(this);
            };

            /** Refreshes the widget layout.*/
            wijdatepager.prototype.refresh = function () {
                this.invalidate();
            };

            wijdatepager.prototype._getCustomViewUnit = function () {
                var o = this.options, timeUnit;
                if (!o.customViewOptions.unit) {
                    return "day";
                }
                timeUnit = o.customViewOptions.unit.toLowerCase();
                if ($.inArray(timeUnit, ["day", "week", "month", "year"])) {
                    return timeUnit;
                } else {
                    return "day";
                }
            };

            /** Redraws the widget layout.*/
            wijdatepager.prototype.invalidate = function () {
                var self = this, selectedPage, o = self.options, selectedDate = o.selectedDate, newIndex, container = self.element.find("." + containerClass), decBtn = self.element.find("." + decButtonClass), incBtn = self.element.find("." + incButtonClass), innerWidth = self.element.innerWidth(), pageDate = selectedDate, decBtnW = decBtn.is(":visible") ? decBtn.outerWidth(true) : 0, incBtnW = incBtn.is(":visible") ? incBtn.outerWidth(true) : 0, pagesBg, pageLabels, pageWidth, activeStates, activeLabelSelector, unitCount, i, unit = this._getCustomViewUnit(), dateClass;
                if (o.viewType.toLowerCase() === "custom") {
                    unitCount = o.customViewOptions.count || 1;

                    for (i = 0; i < unitCount; i++) {
                        switch (unit) {
                            case "day":
                                dateClass = self._getDateClass(self._addDays(selectedDate, -i));
                                break;
                            case "month":
                                dateClass = self._getDateClass(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1));
                                break;
                            case "year":
                                dateClass = self._getDateClass(new Date(selectedDate.getFullYear() - i, 0, 1));
                                break;
                            default:
                                dateClass = self._getDateClass(pageDate);
                                break;
                        }
                        selectedPage = self.element.find("." + pageLabelClass + "." + dateClass);
                        if (selectedPage.length === 1) {
                            break;
                        }
                    }
                } else {
                    selectedPage = self.element.find("." + pageLabelClass + "." + self._getDateClass(pageDate));
                }

                if (selectedPage.length !== 1) {
                    selectedPage = $(self.element.find("." + pageLabelClass)[self._index]);
                } else {
                    newIndex = this.element.find("." + pageLabelClass).index(selectedPage);
                    this._index = newIndex;
                }

                activeLabelSelector = "." + pageLabelClass;
                activeStates = o.wijCSS.stateActive.split(" ");
                $.each(activeStates, function (i) {
                    activeLabelSelector += "." + activeStates[i];
                });
                self.element.find(activeLabelSelector).removeClass(o.wijCSS.stateActive);
                selectedPage.addClass(self.options.wijCSS.stateActive);
                container.css("left", decBtnW);
                self.element.removeClass(widthSmallestClass).removeClass(o.wijCSS.wijdatepagerWidthSmallest).removeClass(widthSmallClass).removeClass(o.wijCSS.wijdatepagerWidthSmall).removeClass(widthMediumClass).removeClass(o.wijCSS.wijdatepagerWidthMedium).removeClass(widthNormalClass).removeClass(o.wijCSS.wijdatepagerWidthNormal);
                if (innerWidth < 300) {
                    self.element.addClass(widthSmallestClass).addClass(o.wijCSS.wijdatepagerWidthSmallest);
                } else if (innerWidth < 475) {
                    self.element.addClass(widthSmallClass).addClass(o.wijCSS.wijdatepagerWidthSmall);
                } else if (innerWidth < 600) {
                    self.element.addClass(widthMediumClass).addClass(o.wijCSS.wijdatepagerWidthMedium);
                } else {
                    self.element.addClass(widthNormalClass).addClass(o.wijCSS.wijdatepagerWidthNormal);
                }
                container.outerWidth(innerWidth - decBtnW - incBtnW);

                //ie6/7 don't support display: table and display: table-cell,
                //so set width to each page label.
                if ($.browser.msie && parseInt($.browser.version, 10) <= 7) {
                    pagesBg = self.element.find("." + pagesClass);
                    pageLabels = pagesBg.find("." + pageLabelClass);
                    pageWidth = Math.round(pagesBg.width() / self._datesDef.length) - (pageLabels.outerWidth(true) - pageLabels.width());
                    pageLabels.width(pageWidth);
                }
            };

            /** Selects the previous date.
            * @param {Object} ev The event of firing the select previous date.
            */
            wijdatepager.prototype.goLeft = function (ev) {
                if (this._isDisabled()) {
                    return;
                }
                this._setSelectedIndex(this._index - 1, true);
                if (ev) {
                    ev.preventDefault();
                    return false;
                }
            };

            /** Selects the next date.*/
            wijdatepager.prototype.goRight = function () {
                if (this._isDisabled()) {
                    return;
                }
                this._setSelectedIndex(this._index + 1);
            };

            wijdatepager.prototype._getCulture = function (name) {
                if (!this._innerCulture) {
                    this._resetCulture(name);
                }
                return this._innerCulture;
            };
            wijdatepager.prototype._resetCulture = function (culture) {
                var cal = $.wijGetCulture(culture || this.options.culture, this.options.cultureCalendar);
                this._innerCulture = cal;
            };

            wijdatepager.prototype._isRTL = function () {
                return !!this._getCulture().isRTL;
            };

            wijdatepager.prototype._initBackground = function (animate, isRightToLeft) {
                var _this = this;
                if (typeof animate === "undefined") { animate = false; }
                if (typeof isRightToLeft === "undefined") { isRightToLeft = false; }
                var s, oldBg, newBg, pageLabels, newPageIndPos, self = this, o = self.options, pageWidth, pages = $("<div></div>");
                if (this._isInAnimate) {
                    return;
                }
                this._index = 0;
                this._datesDef = this._getDatesDefinition();
                this._min = 0;
                this._max = this._datesDef.length - 1;

                $.each(this._datesDef, function (i, dateDef) {
                    var page = $("<div>" + _this._datesDef[i].l + "</div>").addClass(pageLabelClass).addClass(o.wijCSS.wijdatepagerPageLabel).addClass(_this._getDateClass(dateDef.d));
                    if (i === 0) {
                        page.addClass(pageLabelFirstClass).addClass(o.wijCSS.wijdatepagerPageLabelFirst);
                    }
                    if (dateDef.range) {
                        page.addClass(pageRangeClass).addClass(o.wijCSS.wijdatepagerPageRange);
                    }
                    if (dateDef.header) {
                        page.addClass(pageHeaderClass).addClass(o.wijCSS.wijdatepagerPageHeader).addClass(o.wijCSS.stateHighlight);
                    }
                    if (i === _this._max) {
                        page.addClass(pageLabelLastClass).addClass(o.wijCSS.wijdatepagerPageLabelLast);
                    }
                    pages.append(page);
                });

                s = pages.html();
                newBg = this.element.find("." + pagesClass);
                if (animate) {
                    this._isInAnimate = true;

                    oldBg = newBg.clone(true);
                    newBg.html(s);

                    pageLabels = newBg.find("." + pageLabelClass);
                    if (!isRightToLeft) {
                        oldBg.insertBefore(newBg);
                        newPageIndPos = $(pageLabels[this._index]).offset().left;

                        newBg.css("opacity", 0).css("left", oldBg.outerWidth(true)).stop().animate({ left: "0px", opacity: 100 });
                        oldBg.stop().animate({
                            left: "-" + oldBg.outerWidth(true) + "px",
                            opacity: 0
                        }, function () {
                            oldBg.remove();
                            self._isInAnimate = false;
                            self.invalidate();
                        });
                    } else {
                        oldBg.insertAfter(newBg);
                        newPageIndPos = $(pageLabels[this._index]).offset().left;

                        newBg.css("opacity", 0).css("left", -oldBg.outerWidth(true)).stop().animate({ left: "0px", opacity: 100 });
                        oldBg.css("left", 0).stop().animate({ left: oldBg.outerWidth(true) + "px", opacity: 0 }, function () {
                            oldBg.remove();
                            self._isInAnimate = false;
                            self.invalidate();
                        });
                    }
                } else {
                    newBg.html(s);
                    this.invalidate();
                }
                pageLabels = newBg.find("." + pageLabelClass);
                pageLabels.hover($.proxy(this._pagelabelHover, this), $.proxy(this._pagelabelHout, this));

                pageLabels.bind("mousedown", $.proxy(this._pagelabelMouseDown, this));
                pageLabels.click($.proxy(function (e) {
                    var target = $(e.target), ind;
                    ind = this.element.find("." + pageLabelClass).index(target);
                    this._setSelectedIndex(ind);
                }, this));
            };
            wijdatepager.prototype._getDateClass = function (dt) {
                return "c1dt" + dt.getFullYear() + "_" + dt.getMonth() + "_" + dt.getDate();
            };
            wijdatepager.prototype._addDays = function (dt, num) {
                return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + num);
            };

            wijdatepager.prototype._nextYears = function (dt, num) {
                return new Date(dt.getFullYear() + num, 0, 1);
            };

            wijdatepager.prototype._nextMonths = function (dt, num) {
                return new Date(dt.getFullYear(), dt.getMonth() + num, 1);
            };

            wijdatepager.prototype._getDatesDefinition = function () {
                var self = this, o = self.options, viewType = o.viewType.toLowerCase(), i, dt, curDt, nextDt, endDt, datesDef = [], customViewDayOffset, selectedDate = o.selectedDate, maxDateGroup = o.maxDateGroup || 6, datesPerGroup, endDateOfGroup, format, timeUnit, customCount = o.customViewOptions.count || 1;

                switch (viewType) {
                    case "week":
                        curDt = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), -6);
                        i = o.firstDayOfWeek - curDt.getDay();
                        if (Math.abs(i) > 6) {
                            i = curDt.getDay() - o.firstDayOfWeek;
                        }
                        curDt = self._addDays(curDt, i);
                        endDt = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 7);
                        i = 0;
                        while (curDt <= endDt || curDt.getMonth() === selectedDate.getMonth()) {
                            nextDt = self._addDays(curDt, 7);
                            datesDef.push({
                                l: self._formatString(self.localizeString("weekViewLabelFormat", "{0:MMM dd}-{1:dd}"), curDt, self._addDays(curDt, 6)),
                                d: curDt,
                                d2: self._addDays(curDt, 6)
                            });
                            if (selectedDate >= curDt && selectedDate <= nextDt) {
                                self._index = i;
                            }
                            curDt = nextDt;
                            i += 1;
                        }
                        break;
                    case "month":
                        dt = new Date(selectedDate.getFullYear() - 1, 0, 1);
                        datesDef.push({
                            l: self._formatString(self.localizeString("monthViewYearLabelFormat", "{0:yyyy}"), dt),
                            d: dt,
                            range: true
                        });
                        dt = new Date(selectedDate.getFullYear(), 0, 1);
                        datesDef.push({
                            l: self._formatString(self.localizeString("monthViewYearLabelFormat", "{0:yyyy}"), dt),
                            d: dt,
                            header: true
                        });

                        for (i = 0; i < 12; i += 1) {
                            dt = new Date(selectedDate.getFullYear(), i, 1);
                            datesDef.push({
                                l: self._formatString(self.localizeString("monthViewLabelFormat", "{0:MMM}"), dt),
                                d: dt
                            });
                            nextDt = new Date(selectedDate.getFullYear(), i + 1, 1);
                            if (selectedDate >= dt && selectedDate <= nextDt) {
                                self._index = i + 2;
                            }
                        }
                        dt = new Date(selectedDate.getFullYear() + 1, 0, 1);
                        datesDef.push({
                            l: self._formatString(self.localizeString("monthViewYearLabelFormat", "{0:yyyy}"), dt),
                            d: dt,
                            range: true
                        });
                        break;
                    case "custom":
                        timeUnit = self._getCustomViewUnit();
                        datesPerGroup = (timeUnit === "week" ? 7 : 1) * customCount;

                        //make sure current date is in the middle of the slide.
                        curDt = self._getDateAfterAdjusting(-maxDateGroup * datesPerGroup / 2);
                        endDt = self._getDateAfterAdjusting(maxDateGroup * datesPerGroup / 2);
                        if (!self._shouldResetDates(curDt, endDt)) {
                            return self._datesDef;
                        }
                        i = 0;
                        while (curDt <= endDt) {
                            switch (timeUnit) {
                                case "week":
                                    customViewDayOffset = o.firstDayOfWeek - curDt.getDay();
                                    curDt = self._addDays(curDt, customViewDayOffset);
                                    endDt = self._addDays(endDt, customViewDayOffset);
                                case "day":
                                    nextDt = self._addDays(curDt, datesPerGroup);
                                    endDateOfGroup = self._addDays(curDt, datesPerGroup - 1);
                                    if (customCount === 1 && timeUnit === "day") {
                                        format = self.localizeString("customViewUnitSingleDayLabelFormat", "{0:MMM dd}");
                                    } else {
                                        if (curDt.getMonth() === endDateOfGroup.getMonth()) {
                                            format = self.localizeString("customViewUnitDayLabelFormat", "{0:MMM dd}-{1:dd}");
                                        } else {
                                            format = self.localizeString("customViewUnitDayLabelFormat2Months", "{0:MMM dd}-{1:MMM dd}");
                                        }
                                    }
                                    break;
                                case "month":
                                    nextDt = self._nextMonths(curDt, customCount);
                                    endDateOfGroup = self._nextMonths(curDt, customCount - 1);
                                    if (customCount === 1) {
                                        format = self.localizeString("customViewUnitSingleMonthLabelFormat", "{0:MMM}");
                                    } else {
                                        if (curDt.getFullYear() === endDateOfGroup.getFullYear()) {
                                            format = self.localizeString("customViewUnitMonthLabelFormat", "{0:MMM}-{1:MMM, yyyy}");
                                        } else {
                                            format = self.localizeString("customViewUnitMonthLabelFormat2Years", "{0:MMM yyyy}-{1:MMM yyyy}");
                                        }
                                    }
                                    break;
                                case "year":
                                    nextDt = self._nextYears(curDt, customCount);
                                    endDateOfGroup = self._nextYears(curDt, customCount - 1);
                                    if (customCount === 1) {
                                        format = self.localizeString("customViewUnitSingleYearLabelFormat", "{0:yyyy}");
                                    } else {
                                        format = self.localizeString("customViewUnitYearLabelFormat", "{0:yyyy}-{1:yyyy}");
                                    }
                                    break;
                            }

                            datesDef.push({
                                l: self._formatString(format, curDt, endDateOfGroup),
                                d: curDt,
                                d2: endDateOfGroup
                            });
                            if (selectedDate >= curDt && selectedDate <= nextDt) {
                                self._index = i;
                            }
                            curDt = nextDt;
                            i += 1;
                        }
                        self._resetPageDates(datesDef[0].d, datesDef[datesDef.length - 1].d);
                        break;
                    default:
                        //case "day":
                        dt = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
                        datesDef.push({
                            l: self._formatString(self.localizeString("dayViewMonthLabelFormat", "{0:MMM}"), dt),
                            d: dt,
                            range: true
                        });
                        dt = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                        datesDef.push({
                            l: self._formatString(self.localizeString("dayViewMonthLabelFormat", "{0:MMM}"), dt),
                            d: dt, header: true
                        });

                        curDt = dt;
                        i = 2;
                        while (curDt.getMonth() === selectedDate.getMonth()) {
                            nextDt = new Date(curDt.getFullYear(), curDt.getMonth(), curDt.getDate() + 1);
                            datesDef.push({
                                l: self._formatString(self.localizeString("dayViewLabelFormat", "{0:d }"), curDt),
                                d: curDt
                            });
                            if (selectedDate >= curDt && selectedDate <= nextDt) {
                                self._index = i;
                            }
                            curDt = nextDt;
                            i += 1;
                        }

                        dt = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
                        datesDef.push({
                            l: self._formatString(self.localizeString("dayViewMonthLabelFormat", "{0:MMM}"), dt),
                            d: dt,
                            range: true
                        });
                        break;
                }
                return datesDef;
            };

            wijdatepager.prototype._getDateAfterAdjusting = function (dateOffset) {
                var self = this, o = self.options, selectedDate = o.selectedDate, year = selectedDate.getFullYear(), month = selectedDate.getMonth();

                switch (self._getCustomViewUnit()) {
                    case "day":
                    case "week":
                        return new Date(year, month, selectedDate.getDate() + dateOffset);
                    case "month":
                        return new Date(year, month + dateOffset, 1);
                    case "year":
                        return new Date(year + dateOffset, 0, 1);
                }
            };

            wijdatepager.prototype._resetPageDates = function (startDate, endDate) {
                this._startDate = startDate || null;
                this._endDate = endDate || null;
            };

            wijdatepager.prototype._shouldResetDates = function (startDate, endDate) {
                var self = this, o = self.options, selectedDate = o.selectedDate;
                if (!self._startDate || !self._endDate) {
                    self._resetPageDates(startDate, endDate);
                    return true;
                } else {
                    if (self._startDate < new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) && self._endDate > new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())) {
                        return false;
                    }
                }
                self._resetPageDates(startDate, endDate);
                return true;
            };

            wijdatepager.prototype._setSelectedIndex = function (ind, skipHeader) {
                if (typeof skipHeader === "undefined") { skipHeader = false; }
                var o = this.options, pendingSelectedDate;
                if (this._isDisabled()) {
                    return;
                }
                if (ind >= this._min && ind <= this._max) {
                    if (this._dragActivated) {
                        this._showTooltip(ind);
                    }

                    if (this._index !== ind) {
                        if (this._datesDef[ind].header) {
                            if (skipHeader) {
                                ind = ind - 1;
                            } else {
                                return;
                            }
                        }
                        this._index = ind;
                        pendingSelectedDate = this._datesDef[ind].d;
                        o.selectedDate = pendingSelectedDate;

                        if (this._max > 2 && this._index === 0) {
                            this._initBackground(true, true);
                        } else if (this._index === this._max) {
                            if (o.viewType === "week") {
                                o.selectedDate = new Date(o.selectedDate.getFullYear(), o.selectedDate.getMonth(), o.selectedDate.getDate() + 7);
                            }
                            this._initBackground(true, false);
                            o.selectedDate = pendingSelectedDate;
                        } else {
                            this.invalidate();
                        }
                        this._onSelectedDateChanged();
                    }
                }
            };
            wijdatepager.prototype._onSelectedDateChanged = function () {
                var o = this.options;
                this._trigger("selectedDateChanged", null, { selectedDate: o.selectedDate });
            };
            wijdatepager.prototype._pagelabelHover = function (e) {
                var target = $(e.target), o = this.options;
                if (target.hasClass(pageHeaderClass)) {
                    return;
                }
                target.addClass(o.wijCSS.stateHover);
            };
            wijdatepager.prototype._showTooltip = function (ind) {
                var self = this, o = self.options, dateDef = self._datesDef[ind], viewType = o.viewType, s, target = this.element.find("." + pageLabelClass)[ind], timeUnit = self._getCustomViewUnit(), customCount = o.customViewOptions.count || 1;
                if (!self._tooltip) {
                    self._tooltip = $("<div></div>").addClass(tooltipClass).addClass(o.wijCSS.wijdatepagerTooltip).append($("<div></div>").addClass(tooltipInnerClass).addClass(o.wijCSS.wijdatepagerTooltipInner)).append($("<div></div>").addClass(triangleClass).addClass(o.wijCSS.wijdatepagerTriangle));
                    self.element.append(self._tooltip);
                    self._tooltip.wijpopup();
                }

                switch (viewType) {
                    case "week":
                        if (dateDef.d.getMonth() !== dateDef.d2.getMonth()) {
                            s = self._formatString(self.localizeString("weekViewTooltip2MonthesFormat", "{0:MMMM d} - {1:MMMM d, yyyy}"), dateDef.d, dateDef.d2);
                        } else {
                            s = self._formatString(self.localizeString("weekViewTooltipFormat", "{0:MMMM d} - {1:d, yyyy}"), dateDef.d, dateDef.d2);
                        }
                        break;
                    case "month":
                        s = self._formatString(self.localizeString("monthViewTooltipFormat", "{0:MMMM yyyy}"), dateDef.d);
                        break;
                    case "custom":
                        if (timeUnit === "day" || timeUnit === "week") {
                            if (customCount === 1) {
                                s = self._formatString(self.localizeString("customViewSingleDayTooltipFormat", "{0:MMMM d yyyy}"), dateDef.d);
                            } else {
                                if (dateDef.d.getMonth() !== dateDef.d2.getMonth()) {
                                    s = self._formatString(self.localizeString("customViewDayUnitTooltip2MonthesFormat", "{0:MMMM d} - {1:MMMM d, yyyy}"), dateDef.d, dateDef.d2);
                                } else {
                                    s = self._formatString(self.localizeString("customViewDayTooltipFormat", "{0:MMMM d} - {1:d, yyyy}"), dateDef.d, dateDef.d2);
                                }
                            }
                        } else if (timeUnit === "month") {
                            if (customCount === 1) {
                                s = self._formatString(self.localizeString("customViewSingleMonthTooltipFormat", "{0:MMMM yyyy}"), dateDef.d);
                            } else {
                                if (dateDef.d.getFullYear() !== dateDef.d2.getFullYear()) {
                                    s = self._formatString(self.localizeString("customViewMonthTooltip2YearsFormat", "{0:MMMM yyyy} - {1:MMMM yyyy}"), dateDef.d, dateDef.d2);
                                } else {
                                    s = self._formatString(self.localizeString("customViewMonthTooltipFormat", "{0:MMMM} - {1:MMMM, yyyy}"), dateDef.d, dateDef.d2);
                                }
                            }
                        } else if (timeUnit === "year") {
                            if (customCount === 1) {
                                s = self._formatString(self.localizeString("customViewSingleYearTooltipFormat", "{0:yyyy}"), dateDef.d);
                            } else {
                                s = self._formatString(self.localizeString("customViewYearTooltipFormat", "{0:yyyy} - {1:yyyy}"), dateDef.d, dateDef.d2);
                            }
                        }
                        break;
                    default:
                        //case "day":
                        s = this._formatString(self.localizeString("dayViewTooltipFormat", "{0:dddd, MMMM d, yyyy}"), dateDef.d);
                        break;
                }
                if ($.ui) {
                    //disable popup for mobile mode
                    self._tooltip.wijpopup("show", {
                        of: target,
                        my: "center bottom",
                        at: "center top",
                        offset: "-10 -10"
                    });

                    self._tooltip.find("." + tooltipInnerClass).html(s);
                }
            };
            wijdatepager.prototype._hideTooltip = function () {
                this._tooltip.wijpopup("hide");
            };
            wijdatepager.prototype._pagelabelHout = function (e) {
                $(e.target).removeClass(this.options.wijCSS.stateHover);
            };
            wijdatepager.prototype._pagelabelMouseDown = function (e) {
                this._dragActivated = false;
                if (this._isDisabled()) {
                    return;
                }
                e.preventDefault();
                var target = $(e.target), ind;
                if (target.hasClass(pageHeaderClass)) {
                    return;
                }
                ind = this.element.find("." + pageLabelClass).index(target);

                this._dragActivated = true;
                this._setSelectedIndex(ind);
                this._mouseDownTimeFix20555 = new Date().getTime();
                this._startClientX = e.pageX;
                this._startInd = ind;

                $(document).bind("mousemove." + this._dtpagernamespacekey, $.proxy(this._pageindicatorMouseMove, this));
                $(document).bind("mouseup." + this._dtpagernamespacekey, $.proxy(this._pageindicatorMouseUp, this));
            };

            wijdatepager.prototype._detectLeftButton = function (event) {
                if (event.originalEvent) {
                    event = event.originalEvent;
                }
                if ("buttons" in event) {
                    return event.buttons === 1;
                } else if ("which" in event) {
                    return event.which === 1;
                } else {
                    return event.button === 1;
                }
            };

            wijdatepager.prototype._pageindicatorMouseMove = function (e) {
                if (!this._detectLeftButton(e)) {
                    this._pageindicatorMouseUp();
                    return;
                }
                e.preventDefault();
                if (this._isInAnimate) {
                    return;
                }

                var startPage = this.element.find("." + pageLabelClass)[this._startInd], newPos, ind;
                if (!startPage) {
                    return;
                }
                newPos = startPage.offsetLeft + Math.round(startPage.offsetWidth / 2) + (e.pageX - this._startClientX);
                ind = this._findClosesPageIndexByPos(newPos);

                if (this._prevMoveInd === ind) {
                    // fix for [20534] case 1:
                    return;
                }
                this._prevMoveInd = ind;
                if ((this._mouseDownTimeFix20555 + 150) > new Date().getTime()) {
                    // fix for [20555]
                    return;
                }
                if (ind !== -1 && ind !== this._index) {
                    this._setSelectedIndex(ind);
                }
            };
            wijdatepager.prototype._pageindicatorMouseUp = function () {
                this._dragActivated = false;
                $(document).unbind("." + this._dtpagernamespacekey);
                this._hideTooltip();
            };
            wijdatepager.prototype._findClosesPageIndexByPos = function (pos) {
                var pagelabels = this.element.find("." + pagesClass).find("." + pageLabelClass), i;

                for (i = 0; i < pagelabels.length; i += 1) {
                    if ((pagelabels[i].offsetLeft) < pos && (pagelabels[i].offsetLeft + pagelabels[i].offsetWidth) > pos) {
                        return i;
                    }
                }
                return -1;
            };

            /** @ignore */
            wijdatepager.prototype.localizeString = function (key, defaultValue) {
                var o = this.options;
                if (o.localization && o.localization[key]) {
                    return o.localization[key];
                }
                return defaultValue;
            };

            wijdatepager.prototype._formatString = function (fmt, arg0, arg1, arg2) {
                var r, args = arguments, i, funcArgs, self = this;
                if (args.length <= 1) {
                    return Globalize.format(args);
                }
                if (typeof fmt === "string") {
                    if (typeof window[fmt] === "function") {
                        fmt = window[fmt];
                    }
                }
                if (typeof fmt === "function") {
                    funcArgs = [];
                    for (i = 1; i < args.length; i += 1) {
                        funcArgs[i - 1] = args[i];
                    }
                    return fmt.apply(this, funcArgs);
                }
                r = new RegExp("\\{(\\d+)(?:,([-+]?\\d+))?(?:\\:" + "([^(^}]+)(?:\\(((?:\\\\\\)|[^)])+)\\)){0,1}){0,1}\\}", "g");
                return fmt.replace(r, function (m, num, len, f, params) {
                    m = args[Number(num) + 1];
                    if (f) {
                        return Globalize.format(m, f, self._getCulture());
                    } else {
                        return m;
                    }
                });
            };
            return wijdatepager;
        })(wijmo.wijmoWidget);
        datepager.wijdatepager = wijdatepager;

        var wijdatepager_options = (function () {
            function wijdatepager_options() {
                this.wijCSS = {
                    wijdatepager: "",
                    wijdatepagerIncButton: "",
                    wijdatepagerDecButton: "",
                    wijdatepagerContainer: "",
                    wijdatepagerPages: "",
                    wijdatepagerPageLabel: "",
                    wijdatepagerPageLabelFirst: "",
                    wijdatepagerPageLabelLast: "",
                    wijdatepagerPageHeader: "",
                    wijdatepagerPageRange: "",
                    wijdatepagerTooltip: "",
                    wijdatepagerTooltipInner: "",
                    wijdatepagerTriangle: "",
                    wijdatepagerWidthSmallest: "",
                    wijdatepagerWidthSmall: "",
                    wijdatepagerWidthMedium: "",
                    wijdatepagerWidthNormal: ""
                };
                /** @ignore */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body ui-body-b",
                    stateDefault: "ui-btn ui-btn-b"
                };
                /** @ignore */
                this.initSelector = ":jqmData(role='wijdatepager')";
                /** Culture name, e.g. "de-DE".
                * @example
                * // This markup sets the culture to German:
                * $("#element").wijdatepager( { culture: "de-DE" } );
                */
                this.culture = "";
                /** A value that indicators the culture calendar to format the text.
                *  This option must work with culture option.*/
                this.cultureCalendar = "";
                /** Use the localization option in order to provide custom localization.
                * @remarks Default:
                *  {
                *  dayViewTooltipFormat: "{0:dddd, MMMM d, yyyy}",
                *  weekViewTooltipFormat: "{0:MMMM d} - {1:d, yyyy}",
                *  weekViewTooltip2MonthesFormat: "{0:MMMM d} - {1:MMMM d, yyyy}",
                *  monthViewTooltipFormat: "{0:MMMM yyyy}",
                *  customViewDayUnitTooltip2MonthesFormat: "{0:MMMM d} - {1:MMMM d, yyyy}",
                *  customViewSingleDayTooltipFormat: "{0:MMMM d yyyy}",
                *  customViewDayTooltipFormat: "{0:MMMM d} - {1:d, yyyy}",
                *  customViewMonthTooltip2YearsFormat: "{0:MMMM yyyy} - {1:MMMM yyyy}",
                *  customViewSingleMonthTooltipFormat: "{0:MMMM yyyy}",
                *  customViewMonthTooltipFormat: "{0:MMMM} - {1:MMMM, yyyy}",
                *  customViewSingleYearTooltipFormat: "{0:yyyy}",
                *  customViewYearTooltipFormat: "{0:yyyy} - {1:yyyy}",
                *  customViewUnitDayLabelFormat: "{0:MMM dd}-{1:dd}",
                *  customViewUnitSingleDayLabelFormat: "{0:MMM dd}",
                *  customViewUnitDayLabelFormat2Months: "{0:MMM dd}-{1:MMM dd}",
                *  customViewUnitMonthLabelFormat: "{0:MMM}-{1:MMM, yyyy}",
                *  customViewUnitSingleMonthLabelFormat: "{0:MMM}",
                *  customViewUnitMonthLabelFormat2Years: "{0:MMM yyyy}-{1:MMM yyyy}",
                *  customViewUnitSingleYearLabelFormat: "{0:yyyy}",
                *  customViewUnitYearLabelFormat: "{0:yyyy}-{1:yyyy}",
                *  dayViewLabelFormat": "{0:d }",
                *  dayViewMonthLabelFormat: "{0:MM}",
                *  weekViewLabelFormat: "{0:MMM dd}-{1:dd}",
                *  monthViewLabelFormat: "{0:MMM}",
                *  monthViewYearLabelFormat: "{0:yyyy}"
                *	}
                * @example
                * $("#datepager").wijdatepager(
                *					{
                *						localization: {
                *							weekViewTooltip2MonthesFormat: "{0:MMMM d} - {1:MMMM d}",
                *							dayViewTooltipFormat: "{0:dddd, MMMM d}"
                *						}
                *					});
                */
                this.localization = null;
                /** The first day of the week (from 0 to 6).  Sunday is 0, Monday is 1, and so on.*/
                this.firstDayOfWeek = 0;
                /** The count of date group displayed in the pager.
                * @type {Number}
                */
                this.maxDateGroup = 6;
                /** The selected date.
                * @type {Date}
                */
                this.selectedDate = null;
                /** The active view type.
                * @remarks Possible values are: day, week, month, custom.
                */
                this.viewType = "day";
                /** The options of custom view.
                * @type {Object}
                * @example $("#datepager").wijdatepager({
                *         customViewOptions: {
                *             unit: "day",
                *             count: 2
                *         }
                *     });
                * @remarks
                * The options of the custom view. options object fields:
                * unit - String, the time unit of custom view possible values are "day", "week", "month", "year";
                * count - number, the count of time span, depends on the unit;
                * Default:
                * {
                *     unit: "day",
                *     count: 1
                * }
                */
                this.customViewOptions = { unit: "day", count: 1 };
                /** Gets or sets the text for the 'next' button's ToolTip.
                */
                this.nextTooltip = "right";
                /** Gets or sets the text for the 'previous' button's ToolTip.
                */
                this.prevTooltip = "left";
                /** Occurs when the selectedDate option has been changed.
                * @event
                * @dataKey selectedDate The new selectedDate option value.
                */
                this.selectedDateChanged = null;
            }
            return wijdatepager_options;
        })();
        ;
        wijdatepager.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijdatepager_options());
        $.wijmo.registerWidget(widgetName, wijdatepager.prototype);
    })(wijmo.datepager || (wijmo.datepager = {}));
    var datepager = wijmo.datepager;
})(wijmo || (wijmo = {}));

