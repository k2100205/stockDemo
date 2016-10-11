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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijlinechart/jquery.wijmo.wijlinechart.ts"/>
/// <reference path="../wijslider/jquery.wijmo.wijslider.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (_chart) {
        var chartMargin = 2;

        var _getArrayMinMax = function (array, field) {
            var min, max, isTime;

            if (array && array.length) {
                min = _chart.ChartUtil.getFirstValidListValue(array);
                max = min = field ? min[field] : min;
                if (typeof min === "string") {
                    return { min: 0, max: array.length - 1 };
                }

                isTime = _chart.ChartUtil.isDate(min);

                $.each(array, function (idx, item) {
                    item = field ? item[field] : item;
                    if (min > item) {
                        min = item;
                    }
                    if (max < item) {
                        max = item;
                    }
                });

                min = isTime ? $.toOADate(min) : min;
                max = isTime ? $.toOADate(max) : max;

                return { min: min, max: max, isTime: isTime };
            }
            return undefined;
        };

        var getIndicatorTimeDefaultFormat = function (max, min) {
            var dateUtil = _chart.ChartDataUtil, range = max - min, format = "d";

            if (range > 2 * dateUtil.tmInc.year) {
                format = "yy";
            } else if (range > dateUtil.tmInc.year) {
                format = "MMM yy";
            } else if (range > dateUtil.tmInc.month) {
                format = "MMM d";
            } else if (range > dateUtil.tmInc.week) {
                format = "ddd d";
            } else if (range > dateUtil.tmInc.day) {
                format = "ddd H";
            } else if (range > dateUtil.tmInc.hour) {
                format = "H:mm";
            }

            return format;
        };

        /** @widget */
        var wijchartnavigator = (function (_super) {
            __extends(wijchartnavigator, _super);
            function wijchartnavigator() {
                _super.apply(this, arguments);
            }
            wijchartnavigator.prototype._create = function () {
                _super.prototype._create.call(this);
                this.element.addClass(this.options.wijCSS.chartNavigator);

                this.isInitialized = true;
                this._render();
            };

            wijchartnavigator.prototype._render = function () {
                var self = this;

                self._initialXDataRange();
                if (self.isInitialized) {
                    self._initialTargetCharts();
                } else {
                    self._updateTargetCharts();
                }
                self._initialNavigator();
                self.isInitialized = false;
            };

            wijchartnavigator.prototype._setOption = function (key, value) {
                var self = this, opts = self.options, xAxis = opts.xAxis, range;

                if (key === "targetSelector") {
                    if (opts.targetSelector !== value) {
                        opts.targetSelector = value;
                        self._initialTargetCharts();
                    }
                } else if (key === "data" || key === "dataSource" || key === "seriesList") {
                    opts[key] = value;
                    self._render();
                } else if (key === "seriesStyles") {
                    opts.seriesStyles = value;
                    self.element.wijlinechart("option", "seriesStyles", value);
                } else if (key === "xAxis") {
                    opts.xAxis = value;
                    if ((value.min != null && value.min !== xAxis.min) || (value.max != null && value.max !== xAxis.max)) {
                        self._render();
                    } else {
                        self.element.wijlinechart("option", "axis", { x: value });
                    }
                } else if (key === "culture") {
                    self.element.wijlinechart("option", "culture", value);
                    self.indicatorCulture = $.wijGetCulture(value, "");
                } else if (key === "indicator") {
                    opts.indicator = value;
                    self._initialNvIndicator();
                } else if (key === "rangeMin" || key === "rangeMax") {
                    range = self._getCurrentRange();
                    if (key === "rangeMin") {
                        self._triggerRangeUpdated(value, range.max);
                    } else {
                        self._triggerRangeUpdated(range.min, value);
                    }
                    self._updateNvSlider("values");
                } else if (key === "disabled" || key === "step") {
                    _super.prototype._setOption.call(this, key, value);
                    self._updateNvSlider(key);
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijchartnavigator.prototype._initialXDataRange = function () {
                var self = this, xAxis = self.options.xAxis, nvRange;

                if (xAxis) {
                    if (xAxis.min) {
                        self.xFieldIsTime = _chart.ChartUtil.isDate(xAxis.min);
                        self.nvMin = xAxis.min;
                    }
                    if (xAxis.max) {
                        self.xFieldIsTime = _chart.ChartUtil.isDate(xAxis.max);
                        self.nvMax = xAxis.max;
                    }
                }

                if (self.nvMin == null || self.nvMax == null) {
                    nvRange = self._getNavigatorXRange();
                    if (nvRange) {
                        self.nvMin = self.nvMin === undefined ? nvRange.min : self.nvMin;
                        self.nvMax = self.nvMax === undefined ? nvRange.max : self.nvMax;
                        self.xFieldIsTime = nvRange.isTime;
                    }
                }
            };

            wijchartnavigator.prototype._getNavigatorXRange = function () {
                var self = this, opt = self.options, dataSource = opt.dataSource, data = opt.data, seriesList = opt.seriesList, xField, isTime = false, range, sRange;

                if (!(seriesList && seriesList.length > 0)) {
                    return undefined;
                }

                if (dataSource && dataSource.length) {
                    if (data && data.x && data.x.bind) {
                        xField = data.x.bind.toString();
                    } else {
                        if (seriesList[0].data && seriesList[0].data.x) {
                            xField = seriesList[0].data.x.bind;
                        }
                    }

                    if (xField) {
                        range = _getArrayMinMax(dataSource, xField);
                    }
                } else {
                    if (data && data.x && $.isArray(data.x)) {
                        range = _getArrayMinMax(data.x);
                    }
                    $.each(seriesList, function (idx, series) {
                        if (series.data && series.data.x) {
                            sRange = _getArrayMinMax(series.data.x);
                            if (sRange) {
                                range = range ? {
                                    min: Math.min(range.min, sRange.min),
                                    max: Math.max(range.max, sRange.max),
                                    isTime: range.isTime && sRange.isTime
                                } : sRange;
                            }
                        }
                    });
                }

                return range;
            };

            wijchartnavigator.prototype._initialTargetCharts = function () {
                var self = this, opt = self.options, selector = opt.targetSelector, targetChartInfos, targetCharts, newTargets, i = 0, chartInfo, chart;
                if (selector === undefined || selector === null) {
                    return;
                }

                targetChartInfos = self.targetChartInfos || [];
                targetCharts = self.targetCharts || [];

                newTargets = $(selector);

                while (i < targetChartInfos.length) {
                    chartInfo = targetChartInfos[i];

                    if ($.inArray(chartInfo.chartObj.element[0], newTargets) < 0) {
                        self._recoverTarget(chartInfo);
                        targetChartInfos.splice(i, 1);
                    } else {
                        i++;
                    }
                }

                for (i = 0; i < newTargets.length; i++) {
                    if ($.inArray(newTargets[i], targetCharts) < 0) {
                        chart = self._getChartObj($(newTargets[i]));
                        if (chart) {
                            targetChartInfos.push(chart);
                        }
                    }
                }

                self.targetChartInfos = targetChartInfos;
                self.targetCharts = newTargets;

                self._updateTargetCharts();
            };

            wijchartnavigator.prototype._getChartObj = function (target) {
                var self = this, chartTarget = undefined, chartOpts, type, isDataBind = false, dataSource, data, seriesList, axisXMin, axisXMax, isTime;

                $.each(self.targetChartTypes, function (idx, chartType) {
                    chartTarget = target.data("wijmo-" + chartType);
                    if (chartTarget) {
                        type = chartType;
                        chartOpts = chartTarget.options;
                        isTime = chartTarget.axisInfo && chartTarget.axisInfo.x.isTime;
                        dataSource = chartOpts.dataSource;
                        data = chartOpts.data;
                        seriesList = chartOpts.seriesList;
                        isDataBind = dataSource !== undefined && dataSource !== null && $.isArray(dataSource);
                        axisXMax = axisXMin = undefined;
                        if (!chartOpts.axis.x.autoMin) {
                            axisXMin = chartOpts.axis.x.min;
                            axisXMin = self._getActualValue(axisXMin);
                        }
                        if (!chartOpts.axis.x.autoMax) {
                            axisXMax = chartOpts.axis.x.max;
                            axisXMax = self._getActualValue(axisXMax);
                        }

                        return false;
                    }
                });

                if (chartTarget) {
                    return {
                        type: type,
                        chartObj: chartTarget,
                        isDataBind: isDataBind,
                        dataSource: dataSource,
                        data: data,
                        seriesList: seriesList,
                        axisXMax: axisXMax,
                        axisXMin: axisXMin
                    };
                }

                return undefined;
            };

            wijchartnavigator.prototype._initialNavigator = function () {
                var self = this;
                self._initialNvChart();
                self._initialNvSlider();
            };

            wijchartnavigator.prototype._initialNvChart = function () {
                var self = this, opt = self.options, chartOpt;

                chartOpt = {
                    dataSource: opt.dataSource,
                    data: opt.data,
                    marginTop: chartMargin,
                    marginBottom: chartMargin,
                    marginLeft: chartMargin,
                    marginRight: chartMargin,
                    axis: {
                        y: {
                            visible: false,
                            textVisible: false,
                            gridMajor: {
                                visible: false
                            },
                            gridMinor: {
                                visible: false
                            }
                        }
                    },
                    showChartLabels: false,
                    legend: { visible: false },
                    hint: { enable: false },
                    animation: { enabled: false },
                    seriesTransition: { enabled: false },
                    culture: opt["culture"]
                };

                if (opt.seriesList && opt.seriesList.length > 0) {
                    chartOpt.seriesList = $.arrayClone(opt.seriesList);
                }
                if (opt.seriesStyles && opt.seriesStyles.length > 0) {
                    chartOpt.seriesStyles = $.arrayClone(opt.seriesStyles);
                }

                chartOpt.axis.x = $.extend(true, {}, {
                    min: self._getActualValue(self.nvMin),
                    max: self._getActualValue(self.nvMax)
                }, self.options.xAxis);

                self.element.wijlinechart(chartOpt);
            };

            wijchartnavigator.prototype._initialNvSlider = function () {
                var self = this, opt = self.options, sliderContainer, nvBounds, nvSlider, updatingResult, sliderOpts, eleOffset = self.element.offset(), top, sOffset, sSize, indicatorOpt = opt.indicator, indicatorVisible = !(indicatorOpt && indicatorOpt.visible === false), range = self._getCurrentRange(), max = range.max, min = range.min;

                self.isSliding = false;

                nvBounds = self.element.data("wijmo-wijlinechart").canvasBounds;

                if (!self.nvSliderEle) {
                    sliderContainer = $("<div class='" + opt.wijCSS.navigatorSliderContainer + "'></div>").appendTo(self.element);
                    top = eleOffset.top - sliderContainer.offset().top;
                    sliderContainer.css("top", top + "px");

                    nvSlider = $("<div class='" + opt.wijCSS.navigatorSlider + "'></div>").appendTo(sliderContainer);
                } else {
                    nvSlider = self.nvSliderEle;
                }

                nvSlider.css({
                    "height": (nvBounds.endY - nvBounds.startY + chartMargin) + "px"
                });

                self.nvSliderLayout = {
                    width: nvSlider.width(),
                    height: nvSlider.height(),
                    offset: nvSlider.offset()
                };

                sliderOpts = {
                    disabled: this._isDisabled(),
                    min: self.nvMin || 0,
                    max: self.nvMax || 100,
                    values: [min, max],
                    step: opt.step,
                    range: true
                };

                sliderOpts.start = function () {
                    if (indicatorVisible) {
                        self.nvSliderLayout.offset = self.nvSliderEle.offset();
                        self.nvIndicateTooltips[0].show();
                        self.nvIndicateTooltips[1].show();
                    }
                    self.isSliding = true;
                };

                // For drag the handlers
                sliderOpts.slide = function (event, ui) {
                    updatingResult = self._triggerRangeUpdating(ui.values[0], ui.values[1], false, event);
                };

                // For drag the "fill" element
                sliderOpts.change = function (event, ui) {
                    if (self.isSliding) {
                        updatingResult = self._triggerRangeUpdating(ui.values[0], ui.values[1], true, event);
                    }
                };

                sliderOpts.stop = function (event, ui) {
                    if (updatingResult !== false) {
                        self._triggerRangeUpdated(ui.values[0], ui.values[1], event);
                    }

                    self.nvIndicateTooltips[0].hide();
                    self.nvIndicateTooltips[1].hide();
                    self.isSliding = false;
                };

                self.nvSliderEle = nvSlider.wijslider(sliderOpts);
                self._initialNvIndicator();
            };

            wijchartnavigator.prototype._triggerRangeUpdating = function (min, max, dragFill, event) {
                var self = this, opt = self.options, updating = opt.updating, indicatorOpt = opt.indicator, indicatorVisible = !(indicatorOpt && indicatorOpt.visible === false), content = indicatorOpt ? indicatorOpt.content : "", range = self._getCurrentRange(), needUpdating, updatingResult = true;

                self._updateNvIndicateTooltips(min, max, content);

                needUpdating = max !== range.max || min !== range.min;
                needUpdating = dragFill ? needUpdating && (max - min === range.max - range.min) : needUpdating;

                if (!needUpdating) {
                    return false;
                }
                if (updating && typeof updating === "function") {
                    updatingResult = updating.call(self, event, {
                        rangeMin: self._getActualValue(min),
                        rangeMax: self._getActualValue(max)
                    });
                }

                return updatingResult;
            };

            wijchartnavigator.prototype._triggerRangeUpdated = function (min, max, event) {
                var self = this, updated = self.options.updated, range = self._getCurrentRange(), needUpdated = max !== range.max || min !== range.min;

                if (!needUpdated) {
                    return;
                }

                self.options.rangeMax = max;
                self.options.rangeMin = min;
                self._updateTargetCharts();
                if (updated && typeof updated === "function") {
                    updated.call(self, event, {
                        rangeMin: self._getActualValue(min),
                        rangeMax: self._getActualValue(max)
                    });
                }
            };

            wijchartnavigator.prototype._initialNvIndicator = function () {
                var self = this, leftIndicator, rightIndicator, opt = self.options, indicatorOpt = opt.indicator;

                if (!self.nvIndicateTooltips || self.nvIndicateTooltips.length === 0) {
                    leftIndicator = $("<div></div>").addClass(opt.wijCSS.navigatorIndicator).appendTo("body");
                    rightIndicator = $("<div></div>").addClass(opt.wijCSS.navigatorIndicator).appendTo("body");
                    self.nvIndicateTooltips = [leftIndicator, rightIndicator];
                }

                self._bindSliderHandlerEvents();
            };

            wijchartnavigator.prototype._bindSliderHandlerEvents = function () {
                var self = this, opt = self.options, sliderEle = self.nvSliderEle, indicatorOpt = opt.indicator, indicatorVisible = !(indicatorOpt && indicatorOpt.visible === false), content = indicatorOpt ? indicatorOpt.content : "", index, stringFormat = indicatorOpt ? indicatorOpt.format : "", sliderHandlers = sliderEle.find(".ui-slider-handle"), range;

                if (self.xFieldIsTime && (!stringFormat || stringFormat.length === 0)) {
                    stringFormat = getIndicatorTimeDefaultFormat(self.nvMax, self.nvMin);
                }
                self.indicatorContentFormat = stringFormat;
                self.indicatorCulture = $.wijGetCulture(opt["culture"], "");

                self._unbindSliderHandlerEvents();
                sliderEle.on("wijmouseover." + self.widgetName, ".ui-slider-handle", function (event) {
                    if (indicatorVisible && !self.isSliding && !self._isDisabled()) {
                        self.nvSliderLayout.offset = self.nvSliderEle.offset();
                        range = self._getCurrentRange();
                        self._updateNvIndicateTooltips(range.min, range.max, content);
                        index = event.target === sliderHandlers[0] ? 0 : 1;
                        self.nvIndicateTooltips[index].show();
                    }
                }).on("wijmouseout." + self.widgetName, ".ui-slider-handle", function (event) {
                    if (!self.isSliding) {
                        index = event.target === sliderHandlers[0] ? 0 : 1;
                        self.nvIndicateTooltips[index].hide();
                    }
                });
            };

            wijchartnavigator.prototype._unbindSliderHandlerEvents = function () {
                var self = this;

                self.nvSliderEle.off("." + self.widgetName, ".ui-slider-handle");
            };

            wijchartnavigator.prototype._updateNvSlider = function (key) {
                var self = this, opts = self.options, range = self._getCurrentRange(), max = range.max, min = range.min, step = opts.step, sliderEle = self.nvSliderEle;

                if (sliderEle) {
                    if (key === "values") {
                        sliderEle.wijslider({
                            "values": [min, max]
                        });
                    } else if (key === "step") {
                        sliderEle.wijslider({
                            step: step
                        });
                    } else if (key === "disabled") {
                        sliderEle.wijslider({
                            disabled: self._isDisabled()
                        });
                    }
                }
            };

            wijchartnavigator.prototype._updateNvIndicateTooltips = function (rangeMin, rangeMax, content) {
                var self = this, leftPos, rightPos, contentResult, leftContent = "", rightContent = "", nvLayout = self.nvSliderLayout, dx = self.nvMax - self.nvMin, width = nvLayout.width, height = nvLayout.height, offset = nvLayout.offset, ui, format = self.indicatorContentFormat;
                rangeMin = rangeMin === undefined ? self.nvMin : rangeMin;
                rangeMax = rangeMax === undefined ? self.nvMax : rangeMax;

                leftPos = { left: offset.left, top: offset.top };
                rightPos = { left: offset.left, top: offset.top };
                leftPos.top += height / 2;
                rightPos.top += height / 2;
                leftPos.left += (rangeMin - self.nvMin) / dx * width;
                rightPos.left += (rangeMax - self.nvMin) / dx * width;

                self._updateIndicatorsContent(rangeMin, rangeMax, content);
                self._updateIndicatorsPosition(leftPos, rightPos);
            };

            wijchartnavigator.prototype._updateIndicatorsContent = function (rangeMin, rangeMax, content) {
                var self = this, contentResult = content, ui, leftContent, rightContent, format = self.indicatorContentFormat;

                if (typeof content === "function") {
                    ui = {
                        rangeMin: self._getActualValue(rangeMin),
                        rangeMax: self._getActualValue(rangeMax)
                    };
                    contentResult = content.call(self, ui);
                }
                if (typeof contentResult === "string" && contentResult.length > 0) {
                    contentResult = contentResult.split(",");
                }
                if ($.isArray(contentResult) && contentResult.length > 0) {
                    leftContent = contentResult[0].toString();
                    rightContent = (contentResult[1] || contentResult[0]).toString();
                } else {
                    leftContent = self._getActualValue(rangeMin);
                    rightContent = self._getActualValue(rangeMax);
                    if (format) {
                        leftContent = Globalize.format(leftContent, format, self.indicatorCulture);
                        rightContent = Globalize.format(rightContent, format, self.indicatorCulture);
                    }
                }

                self.nvIndicateTooltips[0].html(leftContent);
                self.nvIndicateTooltips[1].html(rightContent);
            };

            wijchartnavigator.prototype._updateIndicatorsPosition = function (lPosition, rPosition) {
                var self = this, lTooltipEle = self.nvIndicateTooltips[0], rTooltipEle = self.nvIndicateTooltips[1], left, width, height;

                lTooltipEle.css("float", "left");
                width = lTooltipEle.width();
                height = lTooltipEle.height();
                left = parseInt(lPosition.left) - (width + 15);
                lTooltipEle.css("left", left);
                lTooltipEle.css("top", lPosition.top - height / 2);

                rTooltipEle.css("float", "left");
                width = rTooltipEle.width();
                height = rTooltipEle.height();
                left = parseInt(rPosition.left) + 15;
                rTooltipEle.css("left", left);
                rTooltipEle.css("top", rPosition.top - height / 2);
            };

            wijchartnavigator.prototype._updateTargetCharts = function () {
                var self = this, opts = self.options, range = self._getCurrentRange(), max = range.max, min = range.min;

                if (!self.targetChartInfos) {
                    return;
                }
                $.each(self.targetChartInfos, function (idx, targetChart) {
                    if (self.isInitialized) {
                        self._clearTargetInitialAnimation(targetChart.chartObj);
                    }

                    self._updateTarget(targetChart, min, max);
                });
            };

            wijchartnavigator.prototype._updateTarget = function (targetChartInfo, rangeMin, rangeMax) {
                var self = this, type = targetChartInfo.type, isCandlestick = (type.indexOf("candlestickchart") > -1), chartObj = targetChartInfo.chartObj, currentChartObj = chartObj.element.data("wijmo-" + type), isDataBind = targetChartInfo.isDataBind, seriesList = targetChartInfo.seriesList, dataSource, data, sLength = 0, xField = "", xFieldIsString = false, idx = 0, hasSharedDataX = false, updatedDataSource, updatedData, updatedSeriesList, originRangeMin = targetChartInfo.rangeMin, originRangeMax = targetChartInfo.rangeMax, newXAxis, xDataArray = [], filterFunc = function (element, index) {
                    var value;
                    if (isDataBind && xField) {
                        value = element[xField];
                    } else {
                        value = xDataArray[index];
                    }

                    if (value !== null && value !== undefined) {
                        if (typeof value === "string") {
                            value = index;
                        }

                        return value >= rangeMin && value <= rangeMax;
                    }
                    return true;
                };

                if (!(seriesList && seriesList.length > 0)) {
                    return;
                }

                if (rangeMin === originRangeMin && rangeMax === originRangeMax) {
                    return;
                }

                targetChartInfo.rangeMin = rangeMin;
                targetChartInfo.rangeMax = rangeMax;

                rangeMin = self._getActualValue(rangeMin);
                rangeMax = self._getActualValue(rangeMax);

                newXAxis = isCandlestick ? undefined : {
                    x: {
                        min: rangeMin,
                        max: rangeMax
                    }
                };

                if (!currentChartObj || chartObj !== currentChartObj) {
                    self._removeInvalidTarget(targetChartInfo);
                    return;
                }

                if (isDataBind) {
                    dataSource = targetChartInfo.dataSource;
                    data = targetChartInfo.data;
                    if (data && data.x) {
                        xField = data.x.bind;
                    } else {
                        while (xField == "") {
                            if (seriesList[idx].data && seriesList[idx].data.xField) {
                                xField = seriesList[idx].data.xField;
                            }
                            idx++;
                        }
                    }
                    if (xField) {
                        updatedDataSource = $.grep(dataSource, filterFunc);
                        chartObj.beginUpdate();
                        chartObj.element[type]({
                            "dataSource": updatedDataSource,
                            axis: newXAxis
                        });
                        chartObj.endUpdate();
                    }
                } else {
                    data = targetChartInfo.data;
                    updatedSeriesList = $.arrayClone(seriesList);
                    hasSharedDataX = data && data.x && $.isArray(data.x);
                    if (hasSharedDataX) {
                        xDataArray = data.x;
                        updatedData = { x: $.grep(data.x, filterFunc) };
                    }
                    $.each(updatedSeriesList, function (idx, series) {
                        if (!series.data) {
                            return true;
                        }
                        xDataArray = series.data.x || xDataArray;
                        $.each(series.data, function (key, dataArray) {
                            if (dataArray && dataArray.length > 0) {
                                series.data[key] = $.grep(dataArray, filterFunc);
                            }
                        });
                    });

                    xFieldIsString = typeof _chart.ChartUtil.getFirstValidListValue(xDataArray) === "string";
                    newXAxis = xFieldIsString ? undefined : newXAxis;

                    chartObj.beginUpdate();
                    chartObj.element[type]({
                        "data": updatedData,
                        "seriesList": updatedSeriesList,
                        axis: newXAxis
                    });
                    chartObj.endUpdate();
                }
            };

            // Clear the storage of last state for the redraw animation to start from the original state.
            wijchartnavigator.prototype._clearTargetInitialAnimation = function (chartObj) {
                var chartField = chartObj.element.data("fields");

                // wijlinechart
                chartObj["aniPathsAttr"] = null;

                // wijbarchart
                if (chartField) {
                    chartField.aniBarsAttr = null;
                }
            };

            wijchartnavigator.prototype._recoverTargetCharts = function () {
                var self = this;

                if (self.targetChartInfos && self.targetChartInfos.length > 0) {
                    $.each(self.targetChartInfos, function (idx, targetChartInfo) {
                        self._recoverTarget(targetChartInfo);

                        self.targetChartInfos[idx] = null;
                    });
                }

                self.targetChartInfos = null;
            };

            wijchartnavigator.prototype._recoverTarget = function (targetChartInfo) {
                var type = targetChartInfo.type, chartObj = targetChartInfo.chartObj, currentChartObj = chartObj.element.data("wijmo-" + type), isDataBind = targetChartInfo.isDataBind, seriesList = targetChartInfo.seriesList, dataSource = targetChartInfo.dataSource, data = targetChartInfo.data, axisXInfo = {
                    min: targetChartInfo.axisXMin,
                    max: targetChartInfo.axisXMax
                };

                if (!currentChartObj || chartObj !== currentChartObj) {
                    this._removeInvalidTarget(targetChartInfo);
                    return;
                }

                chartObj.beginUpdate();
                if (isDataBind) {
                    chartObj.element[type]({
                        "dataSource": dataSource,
                        data: data,
                        axis: {
                            x: axisXInfo
                        }
                    });
                } else {
                    chartObj.element[type]({
                        "data": data,
                        "seriesList": seriesList,
                        axis: {
                            x: axisXInfo
                        }
                    });
                }
                chartObj.endUpdate();
            };

            wijchartnavigator.prototype._removeInvalidTarget = function (chartInfo) {
                var self = this, index = -1;
                if (!self.targetChartInfos) {
                    return;
                }
                index = self.targetChartInfos.indexOf(chartInfo);
                self.targetChartInfos.splice(index, 1);
            };

            wijchartnavigator.prototype.destroy = function () {
                var self = this;
                self.element.removeClass(self.options.wijCSS.chartNavigator);
                self._recoverTargetCharts();

                self._removeNvIndicator();

                self.nvSliderEle.remove();
                self.element.wijlinechart("destroy");

                _super.prototype.destroy.call(this);
            };

            wijchartnavigator.prototype._removeNvIndicator = function () {
                var self = this;
                self._unbindSliderHandlerEvents();

                self.nvIndicateTooltips[0].remove();
                self.nvIndicateTooltips[0] = null;
                self.nvIndicateTooltips[1].remove();
                self.nvIndicateTooltips[1] = null;
                self.nvIndicateTooltips = null;
            };

            wijchartnavigator.prototype._getActualValue = function (value) {
                return this.xFieldIsTime ? $.fromOADate(value) : value;
            };

            wijchartnavigator.prototype._getCurrentRange = function () {
                var self = this, opts = self.options, max = opts.rangeMax, min = opts.rangeMin;

                min = min === undefined ? self.nvMin : Math.max(min, self.nvMin);
                max = max === undefined ? self.nvMax : Math.min(max, self.nvMax);

                max = Math.max(max, min);
                return {
                    min: min,
                    max: max
                };
            };
            return wijchartnavigator;
        })(wijmo.wijmoWidget);
        _chart.wijchartnavigator = wijchartnavigator;

        // c1chartnavigator will overwrite this value.
        wijchartnavigator.prototype.targetChartTypes = ["wijbarchart", "wijcandlestickchart", "wijlinechart"];

        wijchartnavigator.prototype.widgetEventPrefix = "wijchartnavigator";

        var wijchartnavigator_css = (function (_super) {
            __extends(wijchartnavigator_css, _super);
            function wijchartnavigator_css() {
                _super.apply(this, arguments);
                this.chartNavigator = "wijmo-wijchartnavigator";
                this.navigatorSliderContainer = "wijmo-wijchartnavigator-sliderContainer";
                this.navigatorSlider = "wijmo-wijchartnavigator-slider";
                this.navigatorIndicator = "wijmo-wijchartnavigator-indicator";
            }
            return wijchartnavigator_css;
        })(wijmo.wijmo_css);
        _chart.wijchartnavigator_css = wijchartnavigator_css;

        var wijchartnavigator_options = (function () {
            function wijchartnavigator_options() {
                /** @ignore*/
                this.initSelector = ":jqmData(role='wijchartnavigator')";
                /**
                * All CSS classes used in widgets.
                * @ignore
                */
                this.wijCSS = new wijchartnavigator_css();
                /** Set this option as a jquery selector to bind the target chart(s).
                */
                this.targetSelector = "";
                /**
                * Creates an array of series objects that contain data values and labels to display in the chart navigator.
                */
                this.seriesList = [];
                /**
                * The updating event is raised when range of navigator is changing.
                * @event
                * @param {JQueryEventObject} e The jQuery.Event object.
                * @param {any} args The data with this event.
                */
                this.updating = null;
                /**
                * The updated event is raised when range of navigator has been changed.
                * @event
                * @param {JQueryEventObject} e The jQuery.Event object.
                * @param {any} args The data with this event.
                */
                this.updated = null;
            }
            return wijchartnavigator_options;
        })();
        _chart.wijchartnavigator_options = wijchartnavigator_options;

        wijchartnavigator.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijchartnavigator_options());

        $.wijmo.registerWidget("wijchartnavigator", wijchartnavigator.prototype);

        

        

        
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
