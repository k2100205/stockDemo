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
/// <reference path="../wijchart/jquery.wijmo.wijchartcore.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery, Globalize*/
    /*
    * Depends:
    *  raphael.js
    *  globalize.js
    *  jquery.ui.widget.js
    *  jquery.wijmo.wijchartcore.js
    *
    */
    (function (chart) {
        /**
        * @widget
        */
        var wijbarchart = (function (_super) {
            __extends(wijbarchart, _super);
            function wijbarchart() {
                _super.apply(this, arguments);
            }
            wijbarchart.prototype._create = function () {
                var self = this, o = self.options, defFill = self._getDefFill(), compass;

                //			if (o.horizontal) {
                //				$.extend(true, o.axis, {
                //					x: {
                //						compass: "west"
                //					},
                //					y: {
                //						compass: "south"
                //					}
                //				});
                //			}
                if (o.horizontal) {
                    compass = o.axis.y.compass || "south";
                    o.axis.y.compass = o.axis.x.compass || "west";
                    o.axis.x.compass = compass;
                }

                $.extend(true, {
                    compass: "east"
                }, o.hint);

                self._handleChartStyles();

                defFill = null;

                _super.prototype._create.call(this);

                self.chartElement.addClass(o.wijCSS.barChart);
            };

            wijbarchart.prototype._setOption = function (key, value) {
                if (key === "horizontal") {
                    var axis = this.options.axis;
                    axis.x.compass = value ? "west" : "south";
                    axis.y.compass = value ? "south" : "west";
                    //$.extend(true, this.options.axis, {
                    //	x: {
                    //		compass: value ? "west" : "south"
                    //	},
                    //	y: {
                    //		compass: value ? "south" : "west"
                    //	}
                    //});
                }
                _super.prototype._setOption.call(this, key, value);
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijbarchart.prototype.destroy = function () {
                var self = this, o = self.options, element = self.chartElement, fields = element.data("fields"), aniBarsAttr = fields && fields.bars;

                element.removeClass(o.wijCSS.barChart);
                _super.prototype.destroy.call(this);

                if (aniBarsAttr && aniBarsAttr.length) {
                    $.each(aniBarsAttr, function (idx, barAttr) {
                        barAttr = null;
                    });
                }

                element.data("fields", null);
            };

            wijbarchart.prototype._clearChartElement = function () {
                var self = this, o = self.options, fields = self.chartElement.data("fields");

                _super.prototype._clearChartElement.call(this);
                self.element.removeData("plotInfos");

                if (!o.seriesTransition.enabled) {
                    if (fields && fields.aniBarsAttr) {
                        fields.aniBarsAttr = null;
                    }
                }
            };

            wijbarchart.prototype._isBarChart = function () {
                return true;
            };

            /**
            * This method returns the bar, which has a set of Raphaël objects (rects) that represent bars for the
            * series data, from the specified index.
            * @param {number} index The zero-based index of the bar to return.
            * @returns {Raphael element} Bar object.
            */
            wijbarchart.prototype.getBar = function (index) {
                var element = this.chartElement, fields = element.data("fields");

                return fields.chartElements.bars[index];
            };

            /** end of public methods */
            wijbarchart.prototype._paintTooltip = function () {
                var self = this, element = self.chartElement, fields = element.data("fields");

                _super.prototype._paintTooltip.call(this);

                if (self.tooltip) {
                    if (fields && fields.trackers && fields.trackers.length) {
                        self.tooltip.setTargets(fields.trackers);
                        self.tooltip.setOptions({ relatedElement: fields.trackers[0] });
                    }
                }
            };

            wijbarchart.prototype._getTooltipText = function (fmt, target) {
                var tar = $(target.node), dataObj, obj;
                if (tar.data("owner")) {
                    tar = tar.data("owner");
                }
                dataObj = tar.data("wijchartDataObj");
                obj = {
                    data: dataObj,
                    value: dataObj.value,
                    label: dataObj.label,
                    total: dataObj.total,
                    target: target,
                    fmt: fmt,
                    x: dataObj.x,
                    y: dataObj.y
                };
                return $.proxy(fmt, obj)();
            };

            wijbarchart.prototype._preHandleSeriesData = function () {
                _super.prototype._preHandleSeriesData.call(this);
                var self = this, o = self.options, seriesList = o.seriesList;

                $.each(seriesList, function (i, n) {
                    var data = n.data;
                    if (data.y) {
                        $.each(data.y, function (j, y) {
                            try  {
                                if (!self._isDate(y)) {
                                    data.y[j] = parseFloat(y);
                                }
                            } catch (e) {
                                data.y[j] = 1;
                            }
                        });
                    }
                });
            };

            wijbarchart.prototype._paintPlotArea = function () {
                var self = this, o = self.options;
                this.barchartRender = new BarChartRender(this.chartElement, {
                    annotations: o.annotations,
                    canvas: self.canvas,
                    bounds: self.canvasBounds,
                    hint: o.hint,
                    tooltip: self.tooltip,
                    widgetName: self.widgetName,
                    horizontal: o.horizontal,
                    stacked: o.stacked,
                    axis: o.axis,
                    seriesList: o.seriesList,
                    seriesStyles: o.seriesStyles,
                    seriesHoverStyles: o.seriesHoverStyles,
                    seriesTransition: o.seriesTransition,
                    showChartLabels: o.showChartLabels,
                    textStyle: o.textStyle,
                    chartLabelStyle: o.chartLabelStyle,
                    chartLabelFormatString: o.chartLabelFormatString,
                    chartLabelFormatter: o.chartLabelFormatter,
                    shadow: o.shadow,
                    disabled: self._isDisabled(),
                    clusterOverlap: o.clusterOverlap,
                    clusterWidth: o.clusterWidth,
                    clusterSpacing: o.clusterSpacing,
                    is100Percent: o.is100Percent,
                    clusterRadius: o.clusterRadius,
                    animation: o.animation,
                    culture: self._getCulture(),
                    isYTime: self.axisInfo.y[0].isTime,
                    isXTime: self.axisInfo.x.isTime,
                    mouseDown: $.proxy(self._mouseDown, self),
                    mouseUp: $.proxy(self._mouseUp, self),
                    mouseOver: $.proxy(self._mouseOver, self),
                    mouseOut: $.proxy(self._mouseOut, self),
                    mouseMove: $.proxy(self._mouseMove, self),
                    click: $.proxy(self._click, self),
                    wijCSS: o.wijCSS,
                    widget: this
                });

                this.barchartRender.render();
            };
            wijbarchart.prototype._showSerieEles = function (seriesEle) {
                var stacked = this.options.stacked;
                if (seriesEle.isTrendline) {
                    chart.TrendlineRender.showSerieEles(seriesEle);
                    return;
                }
                $.each(seriesEle, function (i, bar) {
                    if (bar && bar.bar) {
                        bar.bar.show();
                        if (bar.bar.shadow) {
                            bar.bar.shadow.show();
                        }
                        if (bar.bar.tracker) {
                            bar.bar.tracker.show();
                        }
                        if ($(bar.bar.node).data("wijchartDataObj")) {
                            $(bar.bar.node).data("wijchartDataObj").visible = true;
                        }
                    }
                    if (bar && bar.dcl) {
                        bar.dcl.show();
                    }

                    if (bar && bar.animatedBar && !bar.animatedBar.removed) {
                        bar.animatedBar.show();
                    }
                });

                //handle stacked
                if (stacked && this.stackedSeriesObjs) {
                    this._handleStackedVisible(seriesEle.length);
                }
            };

            wijbarchart.prototype._hideSerieEles = function (seriesEle) {
                var stacked = this.options.stacked, totalLength = seriesEle.length;
                if (seriesEle.isTrendline) {
                    chart.TrendlineRender.hideSerieEles(seriesEle);
                    return;
                }
                $.each(seriesEle, function (i, bar) {
                    if (bar && bar.bar) {
                        bar.bar.hide();
                        if (bar.bar.shadow) {
                            bar.bar.shadow.hide();
                        }
                        if (bar.bar.tracker) {
                            bar.bar.tracker.hide();
                        }
                        if ($(bar.bar.node).data("wijchartDataObj")) {
                            $(bar.bar.node).data("wijchartDataObj").visible = false;
                        }
                    }
                    if (bar && bar.dcl) {
                        bar.dcl.hide();
                    }

                    if (bar && bar.animatedBar && !bar.animatedBar.removed) {
                        bar.animatedBar.hide();
                    }
                });

                //handle stacked
                if (stacked && this.stackedSeriesObjs) {
                    this._handleStackedVisible(seriesEle.length);
                }
            };

            wijbarchart.prototype._handleStackedVisible = function (sCount) {
                var _this = this;
                function getVisible(ele) {
                    return $(ele.bar.node).data("wijchartDataObj").visible !== false;
                }

                function adjustBarH(ele, x, width) {
                    if (ele) {
                        if (ele.bar) {
                            ele.bar.attr("x", x);
                            ele.bar.attr("width", width);
                        }
                        if (ele.bar.shadow) {
                            ele.bar.shadow.attr("x", x);
                            ele.bar.shadow.attr("width", width);
                        }
                        if (ele.bar.tracker) {
                            ele.bar.tracker.attr("x", x);
                            ele.bar.tracker.attr("width", width);
                        }
                    }
                }

                function adjustBarV(ele, y, height) {
                    if (ele) {
                        if (ele.bar) {
                            ele.bar.attr("y", y);
                            ele.bar.attr("height", height);
                        }
                        if (ele.bar.shadow) {
                            ele.bar.shadow.attr("y", y);
                            ele.bar.shadow.attr("height", height);
                        }
                        if (ele.bar.tracker) {
                            ele.bar.tracker.attr("y", y);
                            ele.bar.tracker.attr("height", height);
                        }
                    }
                }

                function resetBarH(ele) {
                    if (ele) {
                        var x = ele.rect.x, width = ele.rect.width;
                        if (ele.bar) {
                            ele.bar.attr("x", x);
                            ele.bar.attr("width", width);
                        }
                        if (ele.bar.shadow) {
                            ele.bar.shadow.attr("x", x);
                            ele.bar.shadow.attr("width", width);
                        }
                        if (ele.bar.tracker) {
                            ele.bar.tracker.attr("x", x);
                            ele.bar.tracker.attr("width", width);
                        }
                    }
                }

                function resetBarV(ele) {
                    if (ele) {
                        var y = ele.rect.y, height = ele.rect.height;
                        if (ele.bar) {
                            ele.bar.attr("y", y);
                            ele.bar.attr("height", height);
                        }
                        if (ele.bar.shadow) {
                            ele.bar.shadow.attr("y", y);
                            ele.bar.shadow.attr("height", height);
                        }
                        if (ele.bar.tracker) {
                            ele.bar.tracker.attr("y", y);
                            ele.bar.tracker.attr("height", height);
                        }
                    }
                }

                if (this.stackedSeriesObjs) {
                    $.each(this.stackedSeriesObjs, function (i, ele) {
                        if (_this.options.horizontal) {
                            resetBarH(ele);
                        } else {
                            resetBarV(ele);
                        }
                    });

                    var eleVisibles = [], stackCount = this.stackedSeriesCount;
                    for (var i = 0; i < stackCount; i++) {
                        eleVisibles.push(getVisible(this.stackedSeriesObjs[i + "0"]));
                    }

                    var adjusts = [], start = -1, end = -1, lastVisibleIndex = -1;
                    for (var i = eleVisibles.length - 1; i >= 0; i--) {
                        if (eleVisibles[i]) {
                            if (lastVisibleIndex - i > 1) {
                                adjusts.push({
                                    start: lastVisibleIndex,
                                    end: i + 1
                                });
                            }
                            lastVisibleIndex = i;
                        }
                    }
                    if (lastVisibleIndex > 0) {
                        adjusts.push({
                            start: lastVisibleIndex,
                            end: 0
                        });
                    }

                    $.each(adjusts, function (i, adjust) {
                        var sIndex = adjust.start, eIndex = adjust.end, sEl, eEl, nx, ny, nw, wh;

                        for (var index = 0; index < sCount; index++) {
                            sEl = _this.stackedSeriesObjs[sIndex + "" + index];
                            eEl = _this.stackedSeriesObjs[eIndex + "" + index];
                            if (_this.options.horizontal) {
                                nx = eEl.rect.x;
                                nw = sEl.rect.width + sEl.rect.x - eEl.rect.x;
                                adjustBarH(sEl, nx, nw);
                            } else {
                                nx = sEl.rect.y;
                                nw = eEl.rect.height + eEl.rect.y - sEl.rect.y;
                                adjustBarV(sEl, nx, nw);
                            }
                        }
                    });
                }
            };

            wijbarchart.prototype._indicatorLineShowing = function (objs) {
                _super.prototype._indicatorLineShowing.call(this, objs);
                $.each(objs, function (i, obj) {
                    if (obj.bar) {
                        obj.bar.attr(obj.hoverStyle);
                    }
                });
            };

            wijbarchart.prototype._removeIndicatorStyles = function (objs) {
                $.each(objs, function (i, obj) {
                    if (obj.bar) {
                        obj.bar.attr(obj.style);
                    }
                });
            };

            wijbarchart.prototype._supportStacked = function () {
                return true;
            };

            wijbarchart.prototype._calculateParameters = function (axisInfo, options) {
                _super.prototype._calculateParameters.call(this, axisInfo, options);

                // check for bar chart and x axis expansion
                if (axisInfo.id === "x") {
                    var minor = options.unitMinor, adj = this._getBarAdjustment(axisInfo);

                    if (adj === 0) {
                        adj = minor;
                    } else {
                        if (minor < adj && minor !== 0) {
                            adj = Math.floor(adj / minor) * minor;
                        }
                    }

                    /*if (autoMin) {
                    axisInfo.min -= adj;
                    }
                    
                    if (autoMax) {
                    axisInfo.max += adj;
                    }*/
                    axisInfo.min -= adj;
                    axisInfo.max += adj;

                    this._calculateMajorMinor(options, axisInfo);
                }
            };

            wijbarchart.prototype._getBarAdjustment = function (axisInfo) {
                var len = 0, o = this.options, max = axisInfo.max, min = axisInfo.min, seriesList = o.seriesList, i = 0, xLen = 0;

                for (i = 0; i < seriesList.length && seriesList[i].data.x; i++) {
                    xLen = seriesList[i].data.x.length;

                    if (len < xLen) {
                        len = xLen;
                    }
                }

                if (len > 1) {
                    var clusterRelativeWidth = (max - min) / (len - 1) * (o.clusterWidth / 100);

                    // Make a "0.25" offset to avoid the column being too close to axis.
                    return (clusterRelativeWidth * 1.25) / 2;
                } else if (len === 1) {
                    if (min === 0.0 && max === 1.0) {
                        min = -1.0;
                        axisInfo.min = min;
                    }

                    return (max - min) * 0.0125;
                } else {
                    return 0;
                }
            };
            return wijbarchart;
        })(chart.wijchartcore);
        chart.wijbarchart = wijbarchart;

        var wijbarchart_css = (function (_super) {
            __extends(wijbarchart_css, _super);
            function wijbarchart_css() {
                _super.apply(this, arguments);
                this.barChart = "wijmo-wijbarchart";
                this.barLabel = "wijbarchart-label";
                this.barElement = "wijbarchart";
                this.barTracker = "bartracker";
            }
            return wijbarchart_css;
        })(chart.wijchartcore_css);
        chart.wijbarchart_css = wijbarchart_css;

        var wijbarchart_options = (function (_super) {
            __extends(wijbarchart_options, _super);
            function wijbarchart_options() {
                _super.apply(this, arguments);
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijbarchart')";
                /**
                * @ignore
                */
                this.wijCSS = new wijmo.chart.wijbarchart_css();
                /**
                * A value that determines whether the bar chart renders horizontally or vertically.
                * @remarks
                * If set to false, the numeric Y axis renders to the left, and the X axis labels render below the bars.
                * @example
                * // set the bar as column chart.
                $("#wijbarchart").wijbarchart({
                *		horizontal: false,
                *		seriesList: [{
                *			legendEntry: false,
                *			data: {
                *				x: ['Ford', 'GM', 'Chrysler', 'Toyota', 'Nissan', 'Honda'],
                *				y: [.05, .04, .21, .27, .1, .24]
                *			}
                *		}]
                *	});
                */
                this.horizontal = true;
                /**
                * Sets a value that determines whether to stack bars in the chart to show how each value in a series
                * contributes to the total.
                * @remarks
                * If you want each bar to fill up 100 percet of the chart area, you can also set the is100Percent option to true.
                * See Clustering Data for more information on the concept of using the same X values with multiple Y series.
                * @example
                * // set the chart to stacked bar chart.
                *  $("#wijbarchart").wijbarchart({
                *		stacked: true,
                *		seriesList: [{
                *			label: "US",
                *			data: { x: ['PS3', 'XBOX360', 'Wii'], y: [12.35, 21.50, 30.56] }
                *		}, {
                *			label: "Japan",
                *			data: { x: ['PS3', 'XBOX360', 'Wii'], y: [4.58, 1.23, 9.67] }
                *		}, {
                *			label: "Other",
                *			data: { x: ['PS3', 'XBOX360', 'Wii'], y: [31.59, 37.14, 65.32] }
                *		}]
                *	});
                */
                this.stacked = false;
                /**
                * Sets a value that determines whether to present stacked bars as a total value of 100 percent, illustrating
                * how each value contributes to the total.
                * @remarks
                * See Clustering Data for more information on the concept of using the same X values with multiple Y series.
                * Note: This value has no effect if you do not set the stacked option to true.
                * @example
                * // This code results in bars with data for three countries stacked to fill 100% of the chart area, with each
                * // series in a different color representing its percentage of the total.
                * $("#wijbarchart").wijbarchart({
                *		stacked: true,
                *		is100Percent: true,
                *		seriesList: [{
                *			label: "US",
                *			legendEntry: true,
                *			data: { x: ['PS3', 'XBOX360', 'Wii'], y: [12.35, 21.50, 30.56] }
                *		}, {
                *			label: "Japan",
                *			legendEntry: true,
                *			data: { x: ['PS3', 'XBOX360', 'Wii'], y: [4.58, 1.23, 9.67] }
                *		}, {
                *			label: "Other",
                *			legendEntry: true,
                *			data: { x: ['PS3', 'XBOX360', 'Wii'], y: [31.59, 37.14, 65.32] }
                *		}],
                *	});
                */
                this.is100Percent = false;
                /**
                * Sets the amount of each bar to render over the edge of the next bar in the same cluster,as a percentage of
                * the bar width.
                * @remarks
                * Note: A cluster occurs when you have two or more series in your seriesList that have the same x data,
                * but have different y data and different labels
                */
                this.clusterOverlap = 0;
                /**
                * Sets the percentage of each cluster's allocated plot area that the bars in each cluster occupy.
                * @remarks
                * By default, the bars occupy 85% of the cluster's plot area, leaving a small gap between clusters. A setting
                * of 100% removes the gap, or you can make the gap more dramatic with a setting of 50%.
                * This setting may affect your clusterSpacing option setting.
                */
                this.clusterWidth = 85;
                /**
                * Sets the number of pixels by which to round the corner-radius for the bars in the chart.
                * @remarks
                * The amount of rounding this produces depends on the size of the bar.For example, with a clusterRadius
                * of 3, a small bar might look like a ball on the end, while a very large bar might only show a slight
                * rounding of the corners.
                */
                this.clusterRadius = 0;
                /**
                * Sets the amount of space in pixels between the bars in each cluster.
                * @remarks
                * This space may also be affected by the clusterOverlap and clusterWidth option settings.
                */
                this.clusterSpacing = 0;
                /**
                * The animation option determines whether and how the animation is shown.
                * @remarks
                * It defines the animation effect and controls other aspects of the widget's animation, such as
                * duration and easing. Set this option to false in order to disable the animation effect.
                */
                this.animation = {
                    /**
                    * A value that determines whether to show animation. Set this option to false in order to disable easing.
                    */
                    enabled: true,
                    /**
                    * The duration option defines the length of the animation effect in milliseconds.
                    */
                    duration: 400,
                    /**
                    * Sets the type of animation easing effect that users experience when the wijbarchart series loads on the page
                    * @remarks
                    * For example, the wijbarchart series can bounce several times as it loads.
                    * The easing is defined in Raphael, the documentation is: http://raphaeljs.com/reference.html#Raphael.easing_formulas
                    */
                    easing: ">"
                };
                /**
                * Creates the animation object to use when the seriesList data changes.
                * @remarks
                * This allows you to visually show changes in data for the same series.
                * Note: This animation does not appear when you first load or reload the page--it only occurs when data changes.
                * @example
                * // This code creates a chart with random data that regenerates when you click the button created in the
                * second code snippet below
                *  $(document).ready(function () {
                * $("#wijbarchart").wijbarchart({
                *	seriesList: [createRandomSeriesList("2013")],
                *	seriesTransition: {
                *		duration: 800,
                *		easing: "easeOutBounce"
                *	}
                * });
                *	} );
                *	function reload() {
                *		$("#wijbarchart").wijbarchart("option", "seriesList", [createRandomSeriesList("2013")]);
                *	}
                
                *	function createRandomSeriesList(label) {
                *		var data = [],
                *			randomDataValuesCount = 12,
                *			labels = ["January", "February", "March", "April", "May", "June",
                *				"July", "August", "September", "October", "November", "December"],
                *			idx;
                *		for (idx = 0; idx < randomDataValuesCount; idx++) {
                *			data.push(Math.round(Math.random() * 100));
                *		}
                *		return {
                *			label: label,
                *			legendEntry: false,
                *			data: { x: labels, y: data }
                *		};
                *	}
                */
                this.seriesTransition = {
                    /**
                    * A value that determines whether to show animation in redrawing bars when the seriesList data changes.
                    * Set this option to false to disable this animation.
                    */
                    enabled: true,
                    /**
                    * A value that indicates how long to display the series transition animation in milliseconds.
                    */
                    duration: 400,
                    /**
                    * Sets the type of animation easing effect to use in redrawing bars when the seriesList data changes.
                    * @remarks
                    * The easing is defined in Raphael, the documentation is:http://raphaeljs.com/reference.html#Raphael.easing_formulas
                    */
                    easing: ">"
                };
                /**
                * This event fires when the user clicks a mouse button.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBarChartEventArgs} data Information about an event
                */
                this.mouseDown = null;
                /**
                * Fires when the user releases a mouse button while the pointer is over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBarChartEventArgs} data Information about an event
                */
                this.mouseUp = null;
                /**
                * Fires when the user first places the pointer over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBarChartEventArgs} data Information about an event
                */
                this.mouseOver = null;
                /**
                * Fires when the user moves the pointer off of the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBarChartEventArgs} data Information about an event
                */
                this.mouseOut = null;
                /**
                * Fires when the user moves the mouse pointer while it is over a chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBarChartEventArgs} data Information about an event
                */
                this.mouseMove = null;
                /**
                * Fires when the user clicks the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBarChartEventArgs} data Information about an event
                */
                this.click = null;
            }
            return wijbarchart_options;
        })(chart.wijchartcore_options);

        wijbarchart.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijbarchart_options());

        wijbarchart.prototype.widgetEventPrefix = "wijbarchart";

        //$.widget("wijmo.wijbarchart", WijBarChart.prototype);
        $.wijmo.registerWidget("wijbarchart", wijbarchart.prototype);

        var XSpec = (function () {
            function XSpec(nx) {
                this.x = nx;
                this.paSpec = [];
            }
            XSpec.prototype.stackValues = function () {
                var self = this, len = self.paSpec.length, ps0;

                if (len > 1) {
                    ps0 = self.paSpec[0];
                    $.each(self.paSpec, function (idx, ps) {
                        if (idx === 0) {
                            return true;
                        }

                        ps.y += ps0.y;
                        ps0 = ps;
                    });
                }
            };
            return XSpec;
        })();

        // render the bar chart.
        /** @ignore */
        var BarChartRender = (function (_super) {
            __extends(BarChartRender, _super);
            function BarChartRender(element, options) {
                _super.call(this, element, options);
            }
            BarChartRender.prototype._init = function () {
                _super.prototype._init.call(this);
                var o = this.options, inverted = o.horizontal, xaxis = o.axis.x, bounds = o.bounds;

                this.startLocation = { x: bounds.startX, y: bounds.startY };
                this.nSeries = o.seriesList.length, this.seriesList = $.arrayClone(o.seriesList);
                this.seriesStyles = [].concat(o.seriesStyles.slice(0, this.nSeries));
                this.seriesHoverStyles = [].concat(o.seriesHoverStyles.slice(0, this.nSeries));

                this.xscale = chart.ChartUtil.getScaling(inverted, xaxis.max, xaxis.min, inverted ? this.height : this.width);
                this.xlate = chart.ChartUtil.getTranslation(inverted, this.startLocation, xaxis.max, xaxis.min, this.xscale);

                this.aniBarsAttr = this.fields.aniBarsAttr;
                this.canvas = o.canvas;
                this.animationSet = this.canvas.set();
                this.fieldsAniPathAttr = [];
                this.paths = [];
                this.aniPathsAttr = [];
            };

            BarChartRender.prototype._paintShadow = function (element, offset, stroke) {
                if (this.options.shadow) {
                    chart.ChartUtil.paintShadow(element, offset, stroke);
                }
            };

            BarChartRender.prototype.getMinDX = function (x) {
                var minDx = Number.MAX_VALUE, len = x.length, idx, dx;

                if (len == 1) {
                    minDx = Math.min(x[0].x - this.options.axis.x.min, this.options.axis.x.max - x[0].x);
                }

                for (idx = 1; idx < len; idx++) {
                    dx = x[idx].x - x[idx - 1].x;

                    if (dx < minDx && dx > 0) {
                        minDx = dx;
                    }
                }

                if (minDx === Number.MAX_VALUE) {
                    return 2;
                }

                return minDx;
            };

            BarChartRender.prototype.getChartElementPosition = function (seriesIndex, pointIndex) {
                var self = this, o = self.options, widget = o.widget, seriesList = widget.options.seriesList, series = seriesList[seriesIndex];

                if (!series.isTrendline && o.horizontal && !o.stacked) {
                    seriesIndex = seriesList.length - 1 - seriesIndex;
                }

                return _super.prototype.getChartElementPosition.call(this, seriesIndex, pointIndex);
            };

            BarChartRender.prototype.getDataPosition = function (x, y) {
                return chart.BaseChartRender.calculateDataPosition(x, y, this, this.options.horizontal);
            };

            BarChartRender.prototype.stackValues = function (x) {
                $.each(x, function (idx, xSpec) {
                    xSpec.stackValues();
                });
                return x;
            };

            BarChartRender.prototype.barPointList = function (seriesList, seriesEles, paths, inverted) {
                var x = [], shadowPaths = [], self = this, animationSet = self.options.canvas.set(), getXSortedPoints = chart.ChartUtil.getXSortedPoints;

                function addSeriesData(idx, series) {
                    var points = getXSortedPoints(series), nSeries = series.length, xs = null, lim = 0, j = 0, jlim = 0, first_point = true, xprev = 0, dupl = false;

                    if (points) {
                        lim = points.length;
                    }

                    if (x) {
                        jlim = x.length;
                    }

                    if (points === undefined) {
                        return;
                    }

                    $.each(points, function (p, point) {
                        if (first_point) {
                            first_point = false;
                            xprev = point.x;
                        } else {
                            if (xprev === point.x) {
                                dupl = true;
                            } else {
                                dupl = false;
                            }
                            xprev = point.x;
                        }

                        while (j < jlim && x[j].x < point.x) {
                            j++;
                        }

                        if (j < jlim) {
                            // use or insert before the existing item
                            if (x[j].x !== point.x) {
                                xs = new XSpec(point.x);
                                x.splice(j, 0, xs);
                                jlim = x.length;
                            } else {
                                xs = x[j];
                            }
                        } else {
                            // add a new item
                            xs = new XSpec(point.x);
                            x.push(xs);
                            jlim = x.length;
                        }

                        xs.paSpec.push({ y: point.y, sIdx: idx, pIdx: p, dupl: dupl });
                    });
                }

                $.each(seriesList, function (idx, series) {
                    var trendLineEles;
                    if (series.isTrendline) {
                        trendLineEles = [];
                        chart.TrendlineRender.renderSingleTrendLine(series, self.seriesStyles[idx], self.seriesHoverStyles[idx], self.options.axis, null, self.fieldsAniPathAttr, self.options.animation, self.options.seriesTransition, idx, self.options.bounds, self.canvas, self.paths, shadowPaths, self.animationSet, self.aniPathsAttr, self.options.wijCSS, trendLineEles, inverted, self.options.shadow);
                        if (trendLineEles.length) {
                            seriesEles[idx] = trendLineEles[0];
                            paths.push(trendLineEles[0].path);
                        }
                    } else {
                        addSeriesData(idx, series);
                    }
                });

                return x;
            };

            BarChartRender.prototype.adjustToLimits = function (val, min, max) {
                if (val < min) {
                    return min;
                }

                if (val > max) {
                    return max;
                }

                return val;
            };

            BarChartRender.prototype.transformPoints = function (inverted, xscale, yscale, xlate, ylate, points) {
                $.each(points, function (idx, point) {
                    var x = point.x, y = point.y, temp = 0;
                    point.x = xscale * x + xlate;
                    point.y = yscale * y + ylate;

                    if (inverted) {
                        temp = point.x;
                        point.x = point.y;
                        point.y = temp;
                    }
                });

                return points;
            };

            BarChartRender.prototype.paintDefaultChartLabel = function (rf, points, isTime, seriesTextStyle) {
                var options = this.options, inverted = options.horizontal, canvas = options.canvas, wijCSS = options.wijCSS, culture = options.culture, textStyle = $.extend(true, {}, options.textStyle, options.chartLabelStyle), pos = inverted ? { x: rf.x + rf.width, y: rf.y + rf.height / 2 } : { x: rf.x + rf.width / 2, y: rf.y }, chartLabelFormatString = options.chartLabelFormatString, chartLabelFormatter = options.chartLabelFormatter, dclBox, defaultChartLabel, widget = this.options.widget, text = points.y, processedChartLabel;

                if (seriesTextStyle) {
                    textStyle = $.extend(true, textStyle, seriesTextStyle);
                }

                /*if (isTime) {
                text = $.wijchart.fromOADate(y);
                } else {
                text = $.wijchart.round(y, 2);
                }*/
                if (isTime) {
                    text = $.fromOADate(text);
                }
                processedChartLabel = chart.ChartUtil.getChartLabel(chartLabelFormatString, text, culture, {
                    index: points.sIdx,
                    data: { x: points.x, y: points.y },
                    value: points.y,
                    chartLabelFormatter: chartLabelFormatter
                });
                if (processedChartLabel.processed) {
                    text = processedChartLabel.text;
                } else if (!isTime) {
                    text = $.round(text, 2);
                }

                defaultChartLabel = widget._text.call(widget, pos.x, pos.y, text);
                defaultChartLabel.wijAttr(textStyle);
                $.wijraphael.addClass($(defaultChartLabel.node), wijCSS.barLabel);
                dclBox = defaultChartLabel.getBBox();
                if (inverted) {
                    defaultChartLabel.attr({ x: pos.x + dclBox.width / 2 });
                } else {
                    defaultChartLabel.attr({ y: pos.y - dclBox.height / 2 });
                }

                return defaultChartLabel;
            };

            BarChartRender.prototype.getSeriesItemPosition = function (rf) {
                var options = this.options, inverted = options.horizontal, pos = inverted ? { x: rf.x + rf.width, y: rf.y + rf.height / 2 } : { x: rf.x + rf.width / 2, y: rf.y };

                return { x: pos.x, y: pos.y };
            };

            BarChartRender.prototype.paintBar = function (rp, points, height, xAxisInfo, yAxisInfo, seriesStyle, animated, shadowOffset, startLocation, clusterOverlap, preY, lastY, isYTime, seriesTextStyle, yaxis) {
                var o = this.options, stacked = o.stacked, inverted = o.horizontal, is100Percent = o.is100Percent, xmin = xAxisInfo.min, xmax = xAxisInfo.max, ymin = yAxisInfo.min, ymax = yAxisInfo.max, xscale = xAxisInfo.scale, xlate = xAxisInfo.late, yscale = yAxisInfo.scale, ylate = yAxisInfo.late, hold, x, inPlotArea, rf, defaultChartLabel = null, r, style = seriesStyle, strokeWidth = seriesStyle["stroke-width"], stroke = seriesStyle.stroke, bar, barWidth, barHeight, animatedBar, start = -1, y = points.y, annotation;

                if (yaxis.origin !== null) {
                    start = yscale * yaxis.origin + ylate;
                }

                if (stacked) {
                    if (is100Percent) {
                        if (lastY > 0) {
                            rp.height = y / lastY;
                        }

                        if (preY || preY === 0) {
                            rp.y = preY / lastY;
                            rp.height -= rp.y;
                        }
                    } else {
                        rp.height = y;

                        if (preY || preY === 0) {
                            rp.height -= preY;
                            rp.y = preY;
                        }
                    }
                } else {
                    if (preY || preY === 0) {
                        // 1 bar over less overlap and 1 pixel
                        rp.x += rp.width * (1 - clusterOverlap);
                        rp.height = y - yaxis.origin || 0;
                    }
                }

                x = [{ x: rp.x, y: rp.y }, { x: rp.x + rp.width, y: rp.y + rp.height }];
                inPlotArea = ((xmin <= x[0].x && x[0].x <= xmax) || (xmin <= x[1].x && x[1].x <= xmax)) && ((ymin <= x[0].y && x[0].y <= ymax) || (ymin <= x[1].y && x[1].y <= ymax));

                x[0].x = this.adjustToLimits(x[0].x, xmin, xmax);
                x[0].y = this.adjustToLimits(x[0].y, ymin, ymax);
                x[1].x = this.adjustToLimits(x[1].x, xmin, xmax);
                x[1].y = this.adjustToLimits(x[1].y, ymin, ymax);

                x = this.transformPoints(inverted, xscale, yscale, xlate, ylate, x);

                if (x[0].x > x[1].x) {
                    hold = x[0].x;
                    x[0].x = x[1].x;
                    x[1].x = hold;
                }

                if (x[0].y > x[1].y) {
                    hold = x[0].y;
                    x[0].y = x[1].y;
                    x[1].y = hold;
                }

                rf = {
                    x: x[0].x,
                    y: x[0].y,
                    width: x[1].x - x[0].x,
                    height: x[1].y - x[0].y
                };

                if (inPlotArea && !stacked) {
                    if (rf.width === 0) {
                        rf.width = 1;
                    }

                    if (rf.height === 0) {
                        rf.height = 1;
                        rf.y -= 1;
                    }
                }

                if (o.showChartLabels) {
                    defaultChartLabel = this.paintDefaultChartLabel(rf, points, isYTime, seriesTextStyle);
                }

                annotation = this.getSeriesItemPosition(rf);

                r = seriesStyle.r ? seriesStyle.r : o.clusterRadius;

                if (r) {
                    style = $.extend(true, {}, seriesStyle, {
                        r: 0
                    });
                }

                if (stroke !== "none" && strokeWidth) {
                    strokeWidth = parseInt(strokeWidth, 10);
                }

                if (!strokeWidth || isNaN(strokeWidth)) {
                    strokeWidth = 0;
                }

                barWidth = rf.width;
                barHeight = rf.height;
                if (strokeWidth > 1) {
                    strokeWidth--;
                    barWidth = rf.width - strokeWidth;
                    barHeight = rf.height - strokeWidth / 2;
                    rf.x += strokeWidth / 2;
                }

                if (barWidth < 0) {
                    barWidth = 0;
                }
                if (barHeight < 0) {
                    barHeight = 0;
                }

                if (animated) {
                    if (start === -1) {
                        if (inverted) {
                            start = startLocation.x + strokeWidth / 2;
                        } else {
                            start = startLocation.y + height - strokeWidth / 2;
                        }
                    }

                    if (r) {
                        if (inverted) {
                            if (y > yaxis.origin) {
                                bar = this.canvas.roundRect(rf.x, rf.y, barWidth, barHeight, 0, 0, r, r).hide();
                            } else {
                                bar = this.canvas.roundRect(rf.x, rf.y, barWidth, barHeight, r, r, 0, 0).hide();
                            }
                            animatedBar = this.canvas.rect(start, rf.y, rf.width, rf.height);
                        } else {
                            if (y > yaxis.origin) {
                                bar = this.canvas.roundRect(rf.x, rf.y, barWidth, barHeight, r, 0, 0, r).hide();
                            } else {
                                bar = this.canvas.roundRect(rf.x, rf.y, barWidth, barHeight, 0, r, r, 0).hide();
                            }

                            animatedBar = this.canvas.rect(rf.x, start, rf.width, rf.height);
                        }

                        this._paintShadow(animatedBar, shadowOffset);
                        animatedBar.wijAttr(style);
                        animatedBar.bar = bar;
                    } else {
                        if (inverted) {
                            bar = this.canvas.rect(start, rf.y, rf.width, barHeight);
                        } else {
                            bar = this.canvas.rect(rf.x, start, barWidth, rf.height);
                        }
                        animatedBar = bar;
                    }

                    if (defaultChartLabel) {
                        defaultChartLabel.attr({ opacity: 0 });
                        animatedBar.chartLabel = defaultChartLabel;
                    }

                    animatedBar.left = rf.x;
                    animatedBar.top = rf.y;
                    animatedBar.width = barWidth;
                    animatedBar.height = barHeight;
                    animatedBar.r = r;
                } else {
                    if (r) {
                        if (inverted) {
                            if (y > yaxis.origin) {
                                bar = this.canvas.roundRect(rf.x, rf.y, barWidth, barHeight, 0, 0, r, r);
                            } else {
                                bar = this.canvas.roundRect(rf.x, rf.y, barWidth, barHeight, r, r, 0, 0);
                            }
                        } else {
                            if (y > yaxis.origin) {
                                bar = this.canvas.roundRect(rf.x, rf.y, barWidth, barHeight, r, 0, 0, r);
                            } else {
                                bar = this.canvas.roundRect(rf.x, rf.y, barWidth, barHeight, 0, r, r, 0);
                            }
                        }
                    } else {
                        bar = this.canvas.rect(rf.x, rf.y, barWidth, barHeight);
                    }
                }

                this._paintShadow(bar, shadowOffset);
                if (animated && r) {
                    if (bar.shadow) {
                        bar.shadow.hide();
                    }
                }
                bar.wijAttr(seriesStyle);

                return {
                    rect: rf,
                    dcl: defaultChartLabel,
                    animatedBar: animatedBar,
                    bar: bar,
                    annotation: annotation
                };
            };

            BarChartRender.prototype.paintClusters = function (seriesList, seriesStyles, seriesHoverStyles, xAxisInfo, yAxisInfo, width, height, startLocation, isYTime, isXTime) {
                var self = this, o = self.options, clusterOverlap = o.clusterOverlap / 100, clusterWidth = o.clusterWidth / 100, shadowOffset = 1, clusterSpacing = o.clusterSpacing + shadowOffset, nSeries = seriesList.length, canvas = o.canvas, stacked = o.stacked, inverted = o.horizontal, yaxis = o.axis.y, widget = o.widget, wijCSS = o.wijCSS, animated = o.animation && o.animation.enabled, bpl, bw, pointX, chartLabels = [], bars = [], animatedBars = [], rects = [], sList = [], seriesEles = [], trackers = canvas.set(), trendLines = [], tooltipObj, strokeWidth = 0;

                if (isYTime || isXTime) {
                    $.each(seriesList, function (i, s) {
                        var se = $.extend(true, {}, s);
                        if (se.data && se.data.y && se.data.y.length && isYTime) {
                            $.each(se.data.y, function (idx, data) {
                                se.data.y[idx] = $.toOADate(data);
                            });
                        }
                        if (se.data && se.data.x && se.data.x.length && isXTime) {
                            $.each(se.data.x, function (idx, data) {
                                se.data.x[idx] = $.toOADate(data);
                            });
                        }
                        sList.push(se);
                    });
                    bpl = self.barPointList(sList, seriesEles, trendLines, inverted);
                } else {
                    bpl = self.barPointList(seriesList, seriesEles, trendLines, inverted);
                }

                if (stacked) {
                    bpl = self.stackValues(bpl);
                }

                bw = self.getMinDX(bpl) * clusterWidth;

                // fixed an issue that if the stroke-width is not 0, if set the clusterSpacing to small,
                // some bars are shows too close.
                $.each(seriesStyles, function (i, st) {
                    if (st["stroke-width"] && !isNaN(st["stroke-width"])) {
                        if (strokeWidth !== 0) {
                            strokeWidth = Math.min(parseFloat(st["stroke-width"]), strokeWidth);
                        } else {
                            strokeWidth = parseFloat(st["stroke-width"]);
                        }
                    }
                });
                nSeries = nSeries - trendLines.length;

                // adjust the bar width (bw) to account for overlap
                if (nSeries > 1 && !stacked) {
                    clusterOverlap -= (bpl.length * (nSeries - 1) * (clusterSpacing + strokeWidth * 2)) / (inverted ? height : width);
                    bw /= (nSeries * (1 - clusterOverlap) + clusterOverlap);
                }

                self.annoPoints = {};
                $.each(bpl, function (bplIdx, xs) {
                    var ps = xs.paSpec, ns = ps.length, sx, rp, bar, barInfo;

                    if (stacked) {
                        sx = bw;
                    } else {
                        sx = (bw * (ns * (1 - clusterOverlap) + clusterOverlap));
                    }

                    // calculate the first series rectangle
                    rp = { x: xs.x - sx / 2, y: 0, width: bw, height: ps[0].y };

                    $.each(ps, function (psIndex, points) {
                        // if the array data.x's length is more than the data.y's,
                        // the rp.height is undefined. it will cause wrong.
                        if (rp.height === undefined) {
                            return true;
                        }

                        var sIdx = points.sIdx, pIdx = points.pIdx, seriesStyle = seriesStyles[sIdx], series = seriesList[sIdx], tracker, yAxisIndex = series.yAxis || 0, axisY = yaxis[yAxisIndex] || yaxis, axisInfoY = yAxisInfo[yAxisIndex] || yAxisInfo;

                        if (!stacked) {
                            rp.y = axisY.origin || 0;
                            rp.height -= rp.y;
                        }
                        if (!rects[sIdx]) {
                            rects[sIdx] = [];
                        }

                        if (!seriesEles[sIdx]) {
                            seriesEles[sIdx] = [];
                        }

                        self.yscale = chart.ChartUtil.getScaling(!inverted, axisY.max, axisY.min, inverted ? width : height);
                        self.ylate = chart.ChartUtil.getTranslation(!inverted, startLocation, axisY.max, axisY.min, self.yscale);

                        axisInfoY.late = self.ylate;
                        axisInfoY.scale = self.yscale;

                        barInfo = self.paintBar(rp, points, height, xAxisInfo, axisInfoY, seriesStyle, animated, shadowOffset, startLocation, clusterOverlap, psIndex > 0 ? ps[psIndex - 1].y : null, ps[ps.length - 1].y, isYTime, series.textStyle, axisY);

                        bar = barInfo.bar;
                        tracker = bar.clone().attr({
                            opacity: 0.01, fill: "white", "stroke-width": 0,
                            "fill-opacity": 0.01
                        });
                        if (series.visible === false) {
                            bar.hide();
                            if (barInfo.dcl) {
                                barInfo.dcl.hide();
                            }
                            tracker.hide();
                            if (bar.shadow) {
                                bar.shadow.hide();
                            }
                        }
                        $.wijraphael.addClass($(bar.node), wijCSS.canvasObject + " " + wijCSS.barElement);

                        tooltipObj = $.extend(false, {
                            index: pIdx,
                            bar: bar,
                            type: "bar",
                            style: seriesStyle,
                            hoverStyle: seriesHoverStyles[sIdx],
                            x: series.data.x[pIdx],
                            y: series.data.y[pIdx],
                            visible: true
                        }, series);

                        if (isXTime) {
                            tooltipObj.x = $.fromOADate(xs.x);
                        } else if (typeof series.data.x[pIdx] === "number") {
                            tooltipObj.x = xs.x;
                        }

                        if (isYTime) {
                            tooltipObj.y = $.fromOADate(points.y);
                        } else if (typeof series.data.y[pIdx] === "number") {
                            tooltipObj.y = points.y;
                        }

                        $(bar.node).data("wijchartDataObj", tooltipObj);

                        // cache the bar position to show indicator line.
                        //if()
                        widget.dataPoints = widget.dataPoints || {};
                        widget.pointXs = widget.pointXs || [];

                        if (o.horizontal) {
                            pointX = $.round(barInfo.rect.y + barInfo.rect.height / 2, 2);
                        } else {
                            pointX = $.round(barInfo.rect.x + barInfo.rect.width / 2, 2);
                        }
                        if (!widget.dataPoints[pointX.toString()]) {
                            widget.dataPoints[pointX.toString()] = [];
                            widget.pointXs.push(pointX);
                        }

                        widget.dataPoints[pointX.toString()].push(tooltipObj);

                        $(tracker.node).data("owner", $(bar.node));
                        $.wijraphael.addClass($(tracker.node), wijCSS.barElement + " " + wijCSS.barTracker);
                        barInfo.bar.tracker = tracker;
                        trackers.push(tracker);
                        bars.push(bar);

                        if (barInfo.animatedBar) {
                            animatedBars.push(barInfo.animatedBar);
                        }

                        if (barInfo.dcl) {
                            chartLabels.push(barInfo.dcl);
                        }
                        rects[sIdx][pIdx] = barInfo.rect;
                        seriesEles[sIdx][pIdx] = barInfo;
                        bar = null;
                        tracker = null;
                        if (self.annoPoints[sIdx] == null)
                            self.annoPoints[sIdx] = {};
                        self.annoPoints[sIdx][pIdx] = barInfo.annotation;
                    });
                });

                //set default chart label to front.
                $.each(chartLabels, function (sIdx, chartLabel) {
                    chartLabel.toFront();
                });

                trackers.toFront();

                return {
                    bars: bars, animatedBars: animatedBars,
                    rects: rects, chartLabels: chartLabels,
                    seriesEles: seriesEles,
                    trackers: trackers,
                    trendLines: trendLines
                };
            };

            BarChartRender.prototype.processStackedElement = function (seriesEles) {
                var eles = {}, newIndex = 0;
                $.each(seriesEles, function (i, seriesEle) {
                    if (!$.isArray(seriesEle)) {
                        return true;
                    }
                    if (seriesEle.isTrendline) {
                        return true;
                    }
                    $.each(seriesEle, function (j, ele) {
                        ele.sIndex = newIndex;
                        ele.stackIndex = j;
                        eles[newIndex + "" + j] = ele;
                    });
                    newIndex = newIndex + 1;
                });
                this.options.widget.stackedSeriesObjs = eles;
                this.options.widget.stackedSeriesCount = newIndex;
            };

            BarChartRender.prototype.playAnimation = function (animatedBars) {
                var self = this, o = self.options, animation = o.animation, animated = animation && animation.enabled, inverted = o.horizontal, seriesTransition = o.seriesTransition, duration, easing, barsAttr = [], diffAttr, chartLabelStyle = o.chartLabelStyle;

                if (animated) {
                    duration = animation.duration || 2000;
                    easing = animation.easing || "linear";
                    if (animatedBars) {
                        $.each(animatedBars, function (idx, animatedBar) {
                            var params;
                            if (inverted) {
                                animatedBar.wijAttr({ width: 0 });
                                params = { width: animatedBar.width, x: animatedBar.left };
                            } else {
                                animatedBar.wijAttr({ height: 0 });
                                params = { height: animatedBar.height, y: animatedBar.top };
                            }

                            if (self.aniBarsAttr && seriesTransition.enabled) {
                                if (self.aniBarsAttr.length > idx) {
                                    diffAttr = chart.ChartUtil.getDiffAttrs(self.aniBarsAttr[idx], animatedBar.attr());

                                    if (inverted) {
                                        diffAttr.x = self.aniBarsAttr[idx].x;
                                        diffAttr.width = self.aniBarsAttr[idx].width;
                                    } else {
                                        diffAttr.y = self.aniBarsAttr[idx].y;
                                        diffAttr.height = self.aniBarsAttr[idx].height;
                                    }

                                    if (diffAttr.path) {
                                        delete diffAttr.path;
                                    }
                                    animatedBar.attr(diffAttr);
                                    duration = seriesTransition.duration;
                                    easing = seriesTransition.easing;
                                }
                            }
                            barsAttr.push($.extend(true, {}, animatedBar.attr(), params));
                            if (animatedBar.tracker) {
                                animatedBar.tracker.hide();
                            }

                            //return;
                            animatedBar.stop().wijAnimate(params, duration, easing, function () {
                                var b = this, r = b.r, bar = b;

                                if (b.chartLabel) {
                                    // fixed an issue that if the chart label's opacity is not 1,
                                    // this code will change the opacity.
                                    if (chartLabelStyle && chartLabelStyle.opacity) {
                                        b.chartLabel.wijAnimate({ opacity: chartLabelStyle.opacity }, 250);
                                    } else {
                                        b.chartLabel.wijAnimate({ opacity: 1 }, 250);
                                    }
                                }

                                if (b.tracker) {
                                    b.tracker.show();
                                    b.tracker.attr({
                                        width: b.width,
                                        height: b.height,
                                        x: b.attr("x"),
                                        y: b.attr("y")
                                    });
                                }

                                if (r) {
                                    bar = b.bar;
                                    bar.show();
                                    if (bar.shadow) {
                                        bar.shadow.show();
                                    }

                                    if (b.shadow) {
                                        b.shadow.wijRemove();
                                        b.shadow = null;
                                    }
                                    b.wijRemove();

                                    //bar.animatedBar = null;
                                    b = null;
                                }
                            });
                        });
                    }

                    self.aniBarsAttr = barsAttr;
                }
            };

            BarChartRender.prototype.playTrendLineAnimation = function () {
                var self = this, o = self.options, animation = o.animation, animated = animation && animation.enabled, seriesTransition = o.seriesTransition, trendLines = self.fields.trendLines, duration, easing;

                if (animated) {
                    duration = animation.duration || 2000;
                    easing = animation.easing || "linear";
                    if (trendLines && trendLines.length) {
                        chart.TrendlineRender.playAnimation(animated, duration, easing, seriesTransition, o.bounds, trendLines, self.fieldsAniPathAttr, o.axis, o.widget.extremeValue);
                    }
                }
            };

            BarChartRender.prototype.bindLiveEvents = function () {
                var o = this.options, wijCSS = o.wijCSS, widgetName = o.widgetName, disabled = o.disabled, mouseDown = o.mouseDown, mouseUp = o.mouseUp, mouseOver = o.mouseOver, mouseOut = o.mouseOut, mouseMove = o.mouseMove, click = o.click, element = this.element, isFunction = $.isFunction, touchEventPrefix = "";

                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    touchEventPrefix = "wij";
                }

                //				if (hintEnable && !tooltip) {
                //					hint = $.extend(true, {}, options.hint);
                //					hint.offsetY = hint.offsetY || -2;
                //					title = hint.title;
                //					content = hint.content;
                //					if ($.isFunction(title)) {
                //						hint.title = function () {
                //							return getTooltipText(title, this.target);
                //						};
                //					}
                //					if ($.isFunction(content)) {
                //						hint.content = function () {
                //							return getTooltipText(content, this.target);
                //						};
                //					}
                //					hint.beforeShowing = function () {
                //						if (this.target) {
                //						this.options.style.stroke =
                //							this.target.attrs.stroke ||
                //								this.target.attrs.fill;
                //						}
                //					};
                //					tooltip = canvas.tooltip(bars, hint);
                //				}
                $("." + wijCSS.barElement, element[0]).on(touchEventPrefix + "mousedown." + widgetName, function (e) {
                    if (disabled) {
                        return;
                    }

                    if (isFunction(mouseDown)) {
                        var target = $(e.target), dataObj;
                        if (target.data("owner")) {
                            target = target.data("owner");
                        }
                        dataObj = target.data("wijchartDataObj");
                        mouseDown.call(element, e, dataObj);
                        dataObj = null;
                    }
                }).on(touchEventPrefix + "mouseup." + widgetName, function (e) {
                    if (disabled) {
                        return;
                    }
                    if (isFunction(mouseUp)) {
                        var target = $(e.target), dataObj;
                        if (target.data("owner")) {
                            target = target.data("owner");
                        }
                        dataObj = target.data("wijchartDataObj");
                        mouseUp.call(element, e, dataObj);
                        dataObj = null;
                    }
                }).on(touchEventPrefix + "mouseover." + widgetName, function (e) {
                    if (disabled) {
                        return;
                    }
                    if (isFunction(mouseOver)) {
                        var target = $(e.target), dataObj, bar;
                        if (target.data("owner")) {
                            target = target.data("owner");
                        }
                        dataObj = target.data("wijchartDataObj");
                        bar = dataObj.bar;
                        if (!dataObj.hoverStyle) {
                            if (bar) {
                                bar.wijAttr({ opacity: "0.8" });
                            }
                        } else {
                            dataObj.initTransform = bar.matrix.toTransformString();

                            //bar.transform("");
                            bar.wijAttr(dataObj.hoverStyle);
                        }

                        mouseOver.call(element, e, dataObj);
                        dataObj = null;
                    }
                }).on(touchEventPrefix + "mouseout." + widgetName, function (e) {
                    if (disabled) {
                        return;
                    }
                    var target = $(e.target), dataObj, bar;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    bar = dataObj.bar;

                    if (!dataObj.hoverStyle) {
                        if (bar) {
                            bar.wijAttr({ opacity: "1" });
                        }
                    } else {
                        // when set the seriesStyle init the transform of the element.
                        bar.transform("");
                        if (bar.shadow) {
                            bar.shadow.transform("");
                        }
                        bar.wijAttr(dataObj.style);
                    }

                    if (isFunction(mouseOut)) {
                        mouseOut.call(element, e, dataObj);
                    }
                    dataObj = null;
                    //if (tooltip) {
                    //	tooltip.hide();
                    //}
                }).on(touchEventPrefix + "mousemove." + widgetName, function (e) {
                    if (disabled) {
                        return;
                    }

                    var target = $(e.target), dataObj, bar;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    bar = dataObj.bar;

                    if (isFunction(mouseMove)) {
                        mouseMove.call(element, e, dataObj);
                    }
                    dataObj = null;
                    //end of code for adding hover state effect.
                }).on(touchEventPrefix + "click." + widgetName, function (e) {
                    if (disabled) {
                        return;
                    }

                    if (isFunction(click)) {
                        var target = $(e.target), dataObj;
                        if (target.data("owner")) {
                            target = target.data("owner");
                        }
                        dataObj = target.data("wijchartDataObj");
                        click.call(element, e, dataObj);
                    }
                    if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                });

                chart.TrendlineRender.bindLiveEvents(element, widgetName, mouseDown, mouseUp, mouseOver, mouseOut, mouseMove, click, disabled, wijCSS, false);
            };

            BarChartRender.prototype.unbindLiveEvents = function () {
                var o = this.options, widgetName = o.widgetName, wijCSS = o.wijCSS, element = this.element;

                // TO DO
                $("." + wijCSS.barElement, element[0]).off(widgetName).off("." + widgetName);
                chart.TrendlineRender.unbindLiveEvents(element, widgetName, wijCSS);
            };

            BarChartRender.prototype.render = function () {
                var o = this.options, inverted = o.horizontal, stacked = o.stacked, seriesList = this.seriesList, seriesStyles = this.seriesStyles, seriesHoverStyles = this.seriesHoverStyles, xaxis = o.axis.x, yaxis = o.axis.y, isYTime = o.isYTime, isXTime = o.isXTime, clusterInfos;
                this.unbindLiveEvents();
                if (inverted && !stacked) {
                    seriesList.reverse();
                    seriesStyles.reverse();
                    seriesHoverStyles.reverse();
                }
                if (this.nSeries === 0) {
                    return;
                }

                clusterInfos = this.paintClusters(seriesList, seriesStyles, seriesHoverStyles, {
                    min: xaxis.min,
                    max: xaxis.max,
                    late: this.xlate,
                    scale: this.xscale
                }, yaxis, this.width, this.height, this.startLocation, isYTime, isXTime);

                this.element.data("plotInfos", {
                    xscale: this.xscale,
                    xlate: this.xlate,
                    yscale: this.yscale,
                    ylate: this.ylate,
                    rects: clusterInfos.rects
                });

                this.fields.trendLines = clusterInfos.trendLines;
                this.playAnimation(clusterInfos.animatedBars);
                this.playTrendLineAnimation();

                //bars = clusterInfos.bars;
                this.chartElements.bars = clusterInfos.bars;
                this.chartElements.animatedBars = clusterInfos.animatedBars;
                this.chartElements.chartLabels = clusterInfos.chartLabels;
                this.fields.seriesEles = clusterInfos.seriesEles;
                this.fields.trackers = clusterInfos.trackers;

                //fields.chartElements = chartElements;
                if (!this.fields.chartElements) {
                    this.fields.chartElements = {};
                }

                if (inverted && !stacked) {
                    this.fields.seriesEles.reverse();
                }

                if (stacked) {
                    this.processStackedElement(this.fields.seriesEles);
                }

                $.extend(true, this.fields.chartElements, this.chartElements);
                this.fields.aniBarsAttr = this.aniBarsAttr;
                this.element.data("fields", this.fields);
                this.bindLiveEvents();
                _super.prototype.render.call(this);
            };
            return BarChartRender;
        })(chart.BaseChartRender);
        chart.BarChartRender = BarChartRender;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));

