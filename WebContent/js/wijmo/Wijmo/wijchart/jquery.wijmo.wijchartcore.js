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
/// <reference path="../wijutil/jquery.wijmo.raphael.ts"/>
/// <reference path="../wijtooltip/jquery.wijmo.wijtooltip.ts"/>
/// <reference path="../external/declarations/globalize.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals $, Raphael, jQuery, document, window, Globalize, wijmoASPNetParseOptions*/
    /*
    * Depends:
    *  raphael.js
    *  globalize.js
    *  jquery.svgdom.js
    *  jquery.ui.widget.js
    *
    */
    (function (chart) {
        var $ = jQuery, disabledCss = ".35";

        /** @ignore */
        var TrendlineFitType = (function () {
            function TrendlineFitType() {
            }
            TrendlineFitType.strPolynom = "polynom";

            TrendlineFitType.strExponent = "exponent";

            TrendlineFitType.strLogarithmic = "logarithmic";

            TrendlineFitType.strPower = "power";

            TrendlineFitType.strFourier = "fourier";

            TrendlineFitType.strMinX = "minX";

            TrendlineFitType.strMinY = "minY";

            TrendlineFitType.strMaxX = "maxX";

            TrendlineFitType.strMaxY = "maxY";

            TrendlineFitType.strAverageX = "averageX";

            TrendlineFitType.strAverageY = "averageY";
            return TrendlineFitType;
        })();
        chart.TrendlineFitType = TrendlineFitType;

        /** @ignore */
        var ChartConsts = (function () {
            function ChartConsts() {
            }
            ChartConsts.strTrendline = "trendLine";
            return ChartConsts;
        })();
        chart.ChartConsts = ChartConsts;

        /** @ignore */
        var ChartUtil = (function () {
            function ChartUtil() {
            }
            ChartUtil.getDiffAttrs = function (attrs, newAttrs) {
                var result = {};

                $.each(newAttrs, function (key, attr) {
                    if (typeof (attrs) === "undefined") {
                        return true;
                    } else if (typeof (attrs[key]) === "undefined") {
                        result[key] = newAttrs[key];
                    } else if (attrs[key] !== newAttrs[key]) {
                        result[key] = newAttrs[key];
                    }
                });

                return result;
            };

            //To do: make sure what is the type of the element.
            ChartUtil.paintShadow = function (element, offset, stroke) {
                if (element.removed || $(element.node).parent().length === 0) {
                    return;
                }
                var shadow = element.clone(), newOffset = offset || 1, newStroke = stroke || "#cccccc";

                shadow.insertBefore(element);
                shadow.attr({
                    // translation: newOffset + " " + newOffset,
                    transform: Raphael.format("...T{0},{1}", newOffset, newOffset),
                    stroke: newStroke,
                    // the shadow should not fill an color.
                    fill: "none",
                    "stroke-width": newOffset
                });
                shadow.toBack();
                shadow.offset = newOffset;
                element.shadow = shadow;
            };
            ChartUtil.getScaling = function (isVertical, max, min, length) {
                var dx = max - min;

                if (dx === 0) {
                    dx = 1;
                }

                if (isVertical) {
                    dx = -dx;
                }

                return length / dx;
            };
            ChartUtil.getTranslation = function (isVertical, location, max, min, scaling) {
                var translation = 0;

                if (isVertical) {
                    translation = location.y;
                    translation -= scaling * max;
                } else {
                    translation = location.x;
                    translation -= scaling * min;
                }

                return translation;
            };
            ChartUtil.getXSortedPoints = function (series) {
                var seriesX = series.data.x, tempX = [].concat(seriesX), tempY = [].concat(series.data.y), points = [], sortedX = seriesX;

                if (seriesX === undefined || seriesX.length === 0) {
                    return;
                }

                function sortNumber(a, b) {
                    return a - b;
                }

                if (typeof (seriesX[0]) === "number") {
                    sortedX = [].concat(seriesX).sort(sortNumber);
                }

                $.each(sortedX, function (i, nSortedX) {
                    $.each(tempX, function (j, nx) {
                        if (nSortedX === nx) {
                            if (typeof (nx) !== "number") {
                                nx = i;
                            }
                            points.push({ x: nx, y: tempY[j] });
                            tempX.splice(j, 1);
                            tempY.splice(j, 1);
                            return false;
                        }
                    });
                });

                return points;
            };
            ChartUtil.sector = function (cx, cy, r, startAngle, endAngle) {
                var start = $.wijraphael.getPositionByAngle(cx, cy, r, startAngle), end = $.wijraphael.getPositionByAngle(cx, cy, r, endAngle);

                var largeArcFlag, sweepFlag, angleDiff, isConvex;

                if (endAngle > startAngle) {
                    angleDiff = endAngle - startAngle;
                    isConvex = angleDiff > 180;
                    if (isConvex) {
                        largeArcFlag = 1;
                        sweepFlag = 0;
                    } else {
                        largeArcFlag = +isConvex;
                        sweepFlag = +isConvex;
                    }
                } else {
                    angleDiff = startAngle - endAngle;
                    isConvex = angleDiff > 180;

                    if (isConvex) {
                        largeArcFlag = 1;
                        sweepFlag = 1;
                    } else {
                        largeArcFlag = +isConvex;
                        sweepFlag = +!isConvex;
                    }
                }

                return [
                    "M", cx, cy, "L", start.x, start.y, "A", r, r, 0,
                    largeArcFlag, sweepFlag, end.x, end.y, "z"];
            };
            ChartUtil.donut = function (cx, cy, outerR, innerR, startAngle, endAngle) {
                var outerS = $.wijraphael.getPositionByAngle(cx, cy, outerR, startAngle), outerE = $.wijraphael.getPositionByAngle(cx, cy, outerR, endAngle), innerS = $.wijraphael.getPositionByAngle(cx, cy, innerR, startAngle), innerE = $.wijraphael.getPositionByAngle(cx, cy, innerR, endAngle), largeAngle = endAngle - startAngle > 180;

                var largeArcFlagStart, sweepFlagStart, largeArcFlagEnd, sweepFlagEnd, angleDiff, isConvex;

                // if direction is counter clockwise
                if (endAngle > startAngle) {
                    angleDiff = endAngle - startAngle;
                    isConvex = angleDiff > 180;
                    if (isConvex) {
                        largeArcFlagStart = 1;
                        sweepFlagStart = 0;
                        largeArcFlagEnd = 1;
                        sweepFlagEnd = 1;
                    } else {
                        largeArcFlagStart = 0;
                        sweepFlagStart = 0;
                        largeArcFlagEnd = 0;
                        sweepFlagEnd = 1;
                    }
                } else {
                    angleDiff = startAngle - endAngle;
                    isConvex = angleDiff > 180;

                    if (isConvex) {
                        largeArcFlagStart = 1;
                        sweepFlagStart = 1;
                        largeArcFlagEnd = 1;
                        sweepFlagEnd = 0;
                    } else {
                        largeArcFlagStart = 0;
                        sweepFlagStart = 1;
                        largeArcFlagEnd = 0;
                        sweepFlagEnd = 0;
                    }
                }

                return [
                    "M", outerS.x, outerS.y,
                    "A", outerR, outerR, 0, largeArcFlagStart, sweepFlagStart, outerE.x, outerE.y,
                    "L", innerE.x, innerE.y,
                    "A", innerR, innerR, 0, largeArcFlagEnd, sweepFlagEnd, innerS.x, innerS.y,
                    "L", outerS.x, outerS.y, "z"];
            };
            ChartUtil.isDate = function (obj) {
                if (!obj) {
                    return false;
                }
                return (typeof obj === 'object') && obj.constructor === Date;
            };

            ChartUtil.getNumberValues = function (values) {
                var numberValues = [], isDate, validValue = ChartUtil.getFirstValidListValue(values);

                if (typeof validValue === "number") {
                    return values;
                }
                isDate = ChartUtil.isDate(validValue);
                for (var i = 0; i < values.length; i++) {
                    if (isDate) {
                        numberValues.push($.toOADate(values[i]));
                    } else {
                        numberValues.push(i);
                    }
                }
                return numberValues;
            };
            ChartUtil.getFirstValidListValue = function (values) {
                var val;
                $.each(values, function (idx, value) {
                    if (value === null) {
                        return true;
                    } else if (typeof value === "undefined") {
                        return true;
                    } else if (typeof value === "number" && isNaN(value)) {
                        return true;
                    }
                    val = value;
                    return false;
                });
                return val;
            };

            ChartUtil.getLastValidListValue = function (values) {
                var vals = [].concat(values).reverse();
                return ChartUtil.getFirstValidListValue(vals);
            };

            ChartUtil.isHolefunction = function (val, hole) {
                if (val === null) {
                    return true;
                } else if (typeof val === "undefined") {
                    return true;
                } else if (typeof val === "number" && isNaN(val)) {
                    return true;
                }
                if (hole === null) {
                    return false;
                }
                if (typeof val !== "undefined") {
                    // for datetime, if use val === hole it returns false.
                    if (val - hole === 0) {
                        return true;
                    }
                    return false;
                }
                return false;
            };

            ChartUtil.toHexColor = function (color) {
                if ({ hs: 1, rg: 1 }.hasOwnProperty(color.toLowerCase().substring(0, 2)) || color.substring(0, 1) === "#") {
                    return color;
                } else {
                    try  {
                        var document = new ActiveXObject("htmlfile"), body, range, value;
                        document.write("<body>");
                        document.close();
                        body = document.body;
                        range = body.createTextRange();
                        body.style.color = color;
                        value = range.queryCommandValue("ForeColor");
                        value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
                        value = value.toString(16);
                        return "#000000".slice(0, 7 - value.length) + value;
                    } catch (e) {
                        return color;
                    }
                }
            };

            ChartUtil.getChartLabel = function (chartLabelFormatString, text, culture, opts) {
                var chartLabel = text, processed = false, args;
                if (chartLabelFormatString && chartLabelFormatString.length) {
                    processed = true;
                    chartLabel = Globalize.format(text, chartLabelFormatString, culture);
                }
                if (opts.chartLabelFormatter && $.isFunction(opts.chartLabelFormatter)) {
                    processed = true;
                    args = $.extend(true, {}, opts, { chartLabel: chartLabel });
                    chartLabel = $.proxy(opts.chartLabelFormatter, args)();
                }

                return { text: chartLabel, processed: processed };
            };
            return ChartUtil;
        })();
        chart.ChartUtil = ChartUtil;

        /** @ignore */
        var ChartDataUtil = (function () {
            function ChartDataUtil() {
            }
            ChartDataUtil.roundTime = function (timevalue, unit, roundup) {
                var self = this, tunit = unit, tv = $.fromOADate(timevalue), th, td, tx, tz;

                if (tunit > 0) {
                    th = {
                        year: tv.getFullYear(),
                        month: tv.getMonth(),
                        day: tv.getDate(),
                        hour: tv.getHours(),
                        minute: tv.getMinutes(),
                        second: tv.getSeconds()
                    };
                    if (tunit < self.tmInc.minute) {
                        th.second = self.tround(th.second, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }

                    th.second = 0;
                    if (tunit < self.tmInc.hour) {
                        tunit /= self.tmInc.minute;
                        th.minute = self.tround(th.minute, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }

                    th.minute = 0;
                    if (tunit < self.tmInc.day) {
                        tunit /= self.tmInc.hour;
                        th.hour = self.tround(th.hour, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }

                    th.hour = 0;
                    if (tunit < self.tmInc.month) {
                        tunit /= self.tmInc.day;
                        th.day = self.tround(th.day, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }

                    th.day = 1;
                    if (tunit < self.tmInc.year) {
                        tunit /= self.tmInc.month;
                        th.month = self.tround(th.month, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }

                    // th.month = 1;
                    th.month = 0; // the month start from 0 in javascript.
                    tunit /= self.tmInc.year;
                    th.year = self.tround(th.year, tunit, roundup);
                    return self.getTimeAsDouble(th);
                } else {
                    td = tv;
                    tx = td - tunit;
                    tz = parseInt((tx / unit).toString(), 10) * unit;
                    if (roundup && tz !== tx) {
                        tz += unit;
                    }
                    td = tunit + tz;
                    return td;
                }
            };

            ChartDataUtil.tround = function (tval, tunit, roundup) {
                var test = parseInt(((tval / tunit) * tunit).toString(), 10);
                if (roundup && test !== tval) {
                    test += parseInt(tunit, 10);
                }
                return test;
            };

            ChartDataUtil.getTimeAsDouble = function (th) {
                var smon = 0, sday = 0, newDate = null;
                if (th.day < 1) {
                    sday = -1 - th.day;
                    th.day = 1;
                } else if (th.day > 28) {
                    sday = th.day - 28;
                    th.day = 28;
                }

                /*
                * if (th.month < 1) { smon = -1 - th.day; th.month = 1; } else if
                * (th.month > 12) { smon = th.month - 12; th.month = 12; }
                */
                // the month start from 0 & end with 11 in javascript.
                if (th.month < 0) {
                    smon = -1 - th.day;
                    th.month = 0;
                } else if (th.month > 11) {
                    smon = th.month - 11;
                    th.month = 11;
                }
                newDate = new Date(th.year, th.month, th.day, th.hour, th.minute, th.second);
                newDate.setDate(newDate.getDate() + sday);
                newDate.setMonth(newDate.getMonth() + smon);
                return $.toOADate(newDate);
            };

            ChartDataUtil.getTimeDefaultFormat = function (max, min) {
                var self = this, range = max - min, format = "d";

                // format = "s";
                if (range > 2 * self.tmInc.year) {
                    format = "yyyy";
                } else if (range > self.tmInc.year) {
                    format = "MMM yy";
                } else if (range > 3 * self.tmInc.month) {
                    format = "MMM";
                } else if (range > 2 * self.tmInc.week) {
                    format = "MMM d";
                } else if (range > 2 * self.tmInc.day) {
                    format = "ddd d";
                } else if (range > self.tmInc.day) {
                    format = "ddd H:mm";
                } else if (range > self.tmInc.hour) {
                    format = "H:mm";
                } else if (range >= 1000) {
                    format = "H:mm:ss";
                }

                /*
                * else if (range > 0) { //TODO: return millisecond }
                */
                return format;
            };

            ChartDataUtil.niceTimeUnit = function (timeinc, manualFormat) {
                var self = this, tsRange = timeinc;

                tsRange = self.niceTimeSpan(tsRange, manualFormat);

                // return tsRange / self._tmInc.day;
                return tsRange;
            };

            ChartDataUtil.niceTimeSpan = function (range, manualFormat) {
                var self = this, minSpan = self.manualTimeInc(manualFormat), tsinc = 0, tinc = 0;

                /*
                * if (minSpan < this._tmInc.second) { //TODO: calculate when
                * millisecond }
                */
                tsinc = Math.ceil(range);
                if (tsinc === 0) {
                    return self.timeSpanFromTmInc(minSpan);
                }
                tinc = 1;
                if (minSpan < self.tmInc.minute) {
                    if (tsinc < self.tmInc.minute) {
                        tinc = self.getNiceInc([1, 2, 5, 10, 15, 30], tsinc, minSpan);
                        if (tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.minute;
                }
                if (minSpan < self.tmInc.hour) {
                    if (tsinc < self.tmInc.hour) {
                        tinc = self.getNiceInc([1, 2, 5, 10, 15, 30], tsinc, minSpan);
                        if (tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.hour;
                }
                if (minSpan < self.tmInc.day) {
                    if (tsinc < self.tmInc.day) {
                        tinc = self.getNiceInc([1, 3, 6, 12], tsinc, minSpan);
                        if (tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.day;
                }
                if (minSpan < self.tmInc.month) {
                    if (tsinc < self.tmInc.month) {
                        tinc = self.getNiceInc([1, 2, 7, 14], tsinc, minSpan);
                        if (tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.month;
                }
                if (minSpan < self.tmInc.year) {
                    if (tsinc < self.tmInc.year) {
                        tinc = self.getNiceInc([1, 2, 3, 4, 6], tsinc, minSpan);
                        if (tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.year;
                }
                tinc = 100 * self.tmInc.year;
                if (tsinc < tinc) {
                    tinc = self.getNiceInc([1, 2, 5, 10, 20, 50], tsinc, minSpan);
                    if (tinc === 0) {
                        tinc = 100 * self.tmInc.year;
                    }
                }
                return tinc;
            };

            ChartDataUtil.getNiceInc = function (tik, ts, mult) {
                var i = 0, tikm = 0, ii = tik.length;

                for (i = 0; i < ii; i++) {
                    tikm = tik[i] * mult;
                    if (ts <= tikm) {
                        return tikm;
                    }
                }

                return 0;
            };

            ChartDataUtil.timeSpanFromTmInc = function (ti) {
                var rv = 1000, rti = ti, ticks = 1;

                if (ti !== this.tmInc.maxtime) {
                    if (ti > this.tmInc.tickf1) {
                        rv = ti;
                    } else {
                        ti += 7;
                        while (rti > 0) {
                            ticks *= 10;
                            rti--;
                        }
                        rv = ticks;
                    }
                }
                return rv;
            };

            ChartDataUtil.manualTimeInc = function (manualFormat) {
                var self = this, minSpan = self.tmInc.second;
                if (!manualFormat || manualFormat.length === 0) {
                    return minSpan;
                }

                // var f = manualFormat.indexOf("f");
                // if (f > 0) {
                // //TODO: when _getTimeDefaultFormat return millisecond
                // }
                // else if (manualFormat.indexOf("s") >= 0) {
                if (manualFormat.indexOf("s") >= 0) {
                    minSpan = self.tmInc.second;
                } else if (manualFormat.indexOf("m") >= 0) {
                    minSpan = self.tmInc.minute;
                } else if (manualFormat.indexOf("h") >= 0 || manualFormat.indexOf("H") >= 0) {
                    minSpan = self.tmInc.hour;
                } else if (manualFormat.indexOf("d") >= 0) {
                    minSpan = self.tmInc.day;
                } else if (manualFormat.indexOf("M") >= 0) {
                    minSpan = self.tmInc.month;
                } else if (manualFormat.indexOf("y") >= 0) {
                    minSpan = self.tmInc.year;
                }
                return minSpan;
            };

            ChartDataUtil.niceTickNumber = function (x) {
                if (parseFloat(x) === 0.0) {
                    return x;
                } else if (x < 0) {
                    x = -x;
                }
                var log10 = Math.log(x) / Math.log(10), exp = parseInt(this.signedFloor(log10).toString(), 10), f = x / Math.pow(10.0, exp), nf = 10.0;
                if (f <= 1.0) {
                    nf = 1.0;
                } else if (f <= 2.0) {
                    nf = 2.0;
                } else if (f <= 5.0) {
                    nf = 5.0;
                }
                return (nf * Math.pow(10.0, exp));
            };

            ChartDataUtil.niceNumber = function (x, exp, round) {
                if (parseFloat(x) === 0.0) {
                    return x;
                } else if (x < 0) {
                    x = -x;
                }

                var f = x / Math.pow(10.0, exp), nf = 10.0;

                if (round) {
                    if (f < 1.5) {
                        nf = 1.0;
                    } else if (f < 3.0) {
                        nf = 2.0;
                    } else if (f < 7.0) {
                        nf = 5.0;
                    }
                } else {
                    if (f <= 1.0) {
                        nf = 1.0;
                    } else if (f <= 2.0) {
                        nf = 2.0;
                    } else if (f <= 5.0) {
                        nf = 5.0;
                    }
                }

                return (nf * Math.pow(10.0, exp));
            };

            ChartDataUtil.nicePrecision = function (range) {
                if (range <= 0 || typeof (range) !== "number") {
                    return 0;
                }

                var log10 = Math.log(range) / Math.log(10), exp = parseInt(this.signedFloor(log10).toString(), 10), f = range / Math.pow(10.0, exp);

                if (f < 3.0) {
                    exp = -exp + 1;
                }

                return exp;
            };

            ChartDataUtil.precCeil = function (prec, value) {
                var f = Math.pow(10.0, prec), x = value / f;

                x = Math.ceil(x);

                return x * f;
            };

            ChartDataUtil.precFloor = function (prec, value) {
                var f = Math.pow(10.0, prec), x = value / f;

                x = Math.floor(x);

                return x * f;
            };

            ChartDataUtil.signedCeiling = function (val) {
                if (val < 0.0) {
                    return Math.floor(val);
                }

                return Math.ceil(val);
            };

            ChartDataUtil.signedFloor = function (val) {
                if (val < 0.0) {
                    return Math.ceil(val);
                }

                return Math.floor(val);
            };

            // f(x) = A * x**B => ln(f(x) = ln( A) + B * ln(x)
            ChartDataUtil.powerTransform = function (np, x, y, xt, yt) {
                var fy, factor = y[0] < 0 ? -1 : 1;

                for (var i = 0; i < np; i++) {
                    if (x[i] <= 0) {
                        throw "Incompatible data: x values should be positive.";
                    } else {
                        fy = factor * y[i];
                        if (fy <= 0) {
                            throw "Incompatible data: y values must all have the same sign.";
                        } else {
                            xt[i] = Math.log(x[i]);
                            yt[i] = Math.log(fy);
                        }
                    }
                }

                return factor;
            };

            // f(X) = A * exp(B*x) => ln(f(x)) = B*x + ln(A)
            ChartDataUtil.expoTransform = function (np, x, y, xt, yt) {
                var fy, factor = y[0] < 0 ? -1 : 1;

                for (var i = 0; i < np; i++)
                    xt[i] = x[i];

                for (var i = 0; i < np; i++) {
                    fy = factor * y[i];

                    if (fy <= 0) {
                        throw "Incompatible data: for expo fit all Y values must have the same sign";
                    } else {
                        yt[i] = Math.log(fy);
                    }
                }

                return factor;
            };

            // f(X) = A * Ln(B*x) => f(X) = A * Ln(X) + A * Ln(B)
            ChartDataUtil.logTransform = function (np, x, y, xt, yt) {
                var fx, factor = x[0] < 0 ? -1 : 1;

                for (var i = 0; i < np; i++)
                    yt[i] = y[i];

                for (var i = 0; i < np; i++) {
                    fx = factor * x[i];
                    if (fx <= 0) {
                        throw "Incompatible data: for log fit all Y values must have the same sign";
                    } else {
                        xt[i] = Math.log(fx);
                    }
                }

                return factor;
            };

            // f0 = 1, f1 = x, f2 = x**2 ...
            ChartDataUtil.polyCreateBasisFunctions = function (np, nt, x, basis, zero) {
                for (var row = 0; row < np; row++) {
                    if (zero) {
                        basis[row][0] = x[row]; // start from x, x*x ...
                        if (nt > 1)
                            basis[row][1] = x[row] * x[row];
                    } else {
                        basis[row][0] = 1;
                        basis[row][1] = x[row];
                    }
                    for (var col = 2; col < nt; col++)
                        basis[row][col] = x[row] * basis[row][col - 1];
                }
            };

            // f0 = 1, f1 = x
            ChartDataUtil.powerCreateBasisFunctions = function (np, x, basis) {
                for (var row = 0; row < np; row++) {
                    basis[row][0] = 1;
                    basis[row][1] = x[row];
                }
            };

            // f0 = 1, f1 = x
            ChartDataUtil.expoCreateBasisFunctions = function (np, x, basis) {
                for (var row = 0; row < np; row++) {
                    basis[row][0] = 1;
                    basis[row][1] = x[row];
                }
                ;
            };

            // f0 = x, f1 = 1
            ChartDataUtil.logCreateBasisFunctions = function (np, x, basis) {
                for (var row = 0; row < np; row++) {
                    basis[row][0] = x[row];
                    basis[row][1] = 1;
                }
            };

            // f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x) ...
            ChartDataUtil.fourierCreateBasisFunctions = function (np, nt, x, basis) {
                for (var row = 0; row < np; row++) {
                    if (basis[row] === null || basis[row] === undefined) {
                        basis[row] = new Array();
                    }
                    basis[row][0] = 1;

                    if (nt > 1)
                        basis[row][1] = Math.cos(x[row]);

                    if (nt > 2)
                        basis[row][2] = Math.sin(x[row]);

                    for (var col = 3; col < nt; col++) {
                        var n = Math.ceil((col + 1) / 2);
                        if ((col % 2) == 1)
                            basis[row][col] = Math.cos(n * x[row]);
                        else
                            basis[row][col] = Math.sin(n * x[row]);
                    }
                }
            };

            ChartDataUtil.createBasis = function (np, x, y, nt, solution, basis, fit, zero) {
                if (np < 2)
                    throw "Incompatible data: Less than 2 data points.";
                if (nt < 1)
                    throw "Incompatible data: Less than 1 coefficient in the fit";
                if (nt > np)
                    throw "Incompatible data: Number of data points less than number of terms";

                for (var i = 0; i < nt; i++) {
                    solution[i] = 0;
                }

                switch (fit) {
                    case TrendlineFitType.strPolynom:
                        ChartDataUtil.polyCreateBasisFunctions(np, nt, x, basis, zero);
                        break;
                    case TrendlineFitType.strPower:
                        ChartDataUtil.powerCreateBasisFunctions(np, x, basis);
                        break;
                    case TrendlineFitType.strExponent:
                        ChartDataUtil.expoCreateBasisFunctions(np, x, basis);
                        break;
                    case TrendlineFitType.strLogarithmic:
                        ChartDataUtil.logCreateBasisFunctions(np, x, basis);
                        break;
                    case TrendlineFitType.strFourier:
                        ChartDataUtil.fourierCreateBasisFunctions(np, nt, x, basis);
                        break;
                }
            };

            // A[n][n]*x = A[n+1]
            ChartDataUtil.solveGauss = function (a, x, epsilon) {
                var n = a.length, i, j, k, m, t, result = true;

                if (x.length < n || a[0].length < n + 1)
                    throw "Dimension of matrix is not correct.";

                for (i = 0; i < n; i++) {
                    k = i;
                    m = Math.abs(a[i][i]);

                    for (j = i + 1; j < n; j++) {
                        if (m < Math.abs(a[j][i])) {
                            m = Math.abs(a[j][i]);
                            k = j;
                        }
                    }

                    if (Math.abs(m) > epsilon) {
                        for (j = i; j <= n; j++) {
                            t = a[i][j];
                            a[i][j] = a[k][j];
                            a[k][j] = t;
                        }

                        for (k = i + 1; k < n; k++) {
                            t = a[k][i] / a[i][i];

                            a[k][i] = 0;

                            for (j = i + 1; j <= n; j++)
                                a[k][j] -= t * a[i][j];
                        }
                    } else {
                        result = false;
                        break;
                    }
                }

                if (result) {
                    for (i = n - 1; i >= 0; i--) {
                        x[i] = a[i][n];

                        for (j = i + 1; j < n; j++)
                            x[i] -= a[i][j] * x[j];

                        x[i] = x[i] / a[i][i];
                    }
                }
                return result;
            };

            ChartDataUtil.normalizeAndSolveGauss = function (np, nt, basis, y, solution) {
                var a = new Array(nt);

                for (var i = 0; i < nt; i++) {
                    a[i] = ChartDataUtil.createArray(nt + 1, 0);
                }
                ChartDataUtil.computeNormalEquations(np, nt, basis, y, a);

                if (!ChartDataUtil.solveGauss(a, solution, 0))
                    throw "Incompatible data: No solution";
            };

            // transform the least square task to the normal equation
            //  a * solution = c
            // where
            //   a = basis_transposed * basis
            //   c = basis_transposed * y
            //
            // here right part
            //   a[i][nt] = c[i]
            //
            ChartDataUtil.computeNormalEquations = function (np, nt, basis, y, a) {
                var sum;

                for (var col = 0; col < nt; col++) {
                    sum = 0;
                    for (var i = 0; i < np; i++)
                        sum += y[i] * basis[i][col];

                    a[col][nt] = sum;

                    for (var row = col; row < nt; row++) {
                        sum = 0;

                        for (var i = 0; i < np; i++)
                            sum = sum + basis[i][row] * basis[i][col];

                        a[row][col] = sum;
                        a[col][row] = sum;
                    }
                }
            };

            ChartDataUtil.solveLeastSquares = function (np, x, y, nt, solution, fit, zero) {
                var factor = 0, xt, yt, basis = new Array(np);
                if (fit == TrendlineFitType.strExponent || fit == TrendlineFitType.strLogarithmic || fit == TrendlineFitType.strPower) {
                    nt = 2;
                    xt = ChartDataUtil.createArray(np, 0);
                    yt = ChartDataUtil.createArray(np, 0);
                    switch (fit) {
                        case TrendlineFitType.strPower:
                            factor = ChartDataUtil.powerTransform(np, x, y, xt, yt);
                            break;
                        case TrendlineFitType.strExponent:
                            factor = ChartDataUtil.expoTransform(np, x, y, xt, yt);
                            break;
                        case TrendlineFitType.strLogarithmic:
                            factor = ChartDataUtil.logTransform(np, x, y, xt, yt);
                            break;
                    }
                } else {
                    xt = x;
                    yt = y;
                }
                if (zero && fit == TrendlineFitType.strPolynom) {
                    factor = solution[0];
                    nt--; // decrease term number
                }
                for (var i = 0; i < np; i++) {
                    basis[i] = ChartDataUtil.createArray(nt, 0);
                }
                ChartDataUtil.createBasis(np, xt, yt, nt, solution, basis, fit, zero);
                ChartDataUtil.normalizeAndSolveGauss(np, nt, basis, yt, solution);
                switch (fit) {
                    case TrendlineFitType.strPower:
                        solution[0] = factor * Math.exp(solution[0]);
                        break;
                    case TrendlineFitType.strExponent:
                        solution[0] = factor * Math.exp(solution[0]);
                        break;
                    case TrendlineFitType.strLogarithmic:
                        solution[1] = factor * Math.exp(solution[1] / solution[0]);
                        break;
                    case TrendlineFitType.strPolynom:
                        if (zero) {
                            for (var i = solution.length - 1; i > 0; i--)
                                solution[i] = solution[i - 1];
                            solution[0] = factor;
                        }
                        break;
                }
            };

            ChartDataUtil.aproximate = function (fit, coeffs, xvalue) {
                var yvalue = 0;

                switch (fit) {
                    case TrendlineFitType.strPolynom:
                        var pow = 1;
                        for (var k = 0; k < coeffs.length; k++) {
                            if (k > 0) {
                                pow *= xvalue;
                            }
                            yvalue += coeffs[k] * pow;
                        }
                        break;

                    case TrendlineFitType.strPower:
                        yvalue = coeffs[0] * Math.pow(xvalue, coeffs[1]);
                        break;

                    case TrendlineFitType.strExponent:
                        yvalue = coeffs[0] * Math.exp(xvalue * coeffs[1]);
                        break;

                    case TrendlineFitType.strLogarithmic:
                        yvalue = coeffs[0] * Math.log(xvalue * coeffs[1]);
                        break;

                    case TrendlineFitType.strFourier:
                        yvalue = coeffs[0];
                        for (var k = 1; k < coeffs.length; k++) {
                            var k1 = Math.ceil((k + 1) / 2);
                            if ((k % 2) == 1) {
                                yvalue += coeffs[k] * Math.cos(k1 * xvalue);
                            } else {
                                yvalue += coeffs[k] * Math.sin(k1 * xvalue);
                            }
                        }
                        break;
                }
                return yvalue;
            };

            ChartDataUtil.processSimpleValues = function (valuesX, valuesY, fitType) {
                var len = valuesX.length, xmin = valuesX[0], xmax = xmin, ymin = valuesY[0], ymax = ymin, xavg = 0, yavg = 0, valsX = [], valsY = [];

                for (var i = 0; i < len; i++) {
                    if (xmin > valuesX[i]) {
                        xmin = valuesX[i];
                    }
                    if (xmax < valuesX[i]) {
                        xmax = valuesX[i];
                    }
                    if (ymin > valuesY[i]) {
                        ymin = valuesY[i];
                    }
                    if (ymax < valuesY[i]) {
                        ymax = valuesY[i];
                    }
                    xavg += valuesX[i];
                    yavg += valuesY[i];
                }
                xavg = xavg * 1.0 / len;
                yavg = yavg * 1.0 / len;
                switch (fitType) {
                    case TrendlineFitType.strMinX:
                        valsX = [].concat([xmin, xmin]);
                        valsY = [].concat([ymin, ymax]);
                        break;
                    case TrendlineFitType.strMaxX:
                        valsX = [].concat([xmax, xmax]);
                        valsY = [].concat([ymin, ymax]);
                        break;
                    case TrendlineFitType.strMinY:
                        valsX = [].concat([xmin, xmax]);
                        valsY = [].concat([ymin, ymin]);
                        break;
                    case TrendlineFitType.strMaxY:
                        valsX = [].concat([xmin, xmax]);
                        valsY = [].concat([ymax, ymax]);
                        break;
                    case TrendlineFitType.strAverageX:
                        valsX = [].concat([xavg, xavg]);
                        valsY = [].concat([ymin, ymax]);
                        break;
                    case TrendlineFitType.strAverageY:
                        valsX = [].concat([xmin, xmax]);
                        valsY = [].concat([yavg, yavg]);
                        break;
                }
                return { x: valsX, y: valsY };
            };

            ChartDataUtil.getNumberSeriesData = function (valuesX, valuesY, display, hole) {
                var valsX = ChartUtil.getNumberValues(valuesX), valsY = ChartUtil.getNumberValues(valuesY), x = [], y = [];

                $.each(valuesY, function (i, value) {
                    if (i === valsX.length) {
                        return false;
                    }
                    if (ChartUtil.isHolefunction(value, hole)) {
                        if (display === "excludeHole") {
                            return true;
                        }
                        if (!ChartUtil.isHolefunction(hole, undefined) && value === hole) {
                            if (valsX[i] === undefined) {
                                return false;
                            }
                            x.push(valsX[i]);
                            y.push(valsY[i]);
                        } else {
                            return true;
                        }
                    } else {
                        x.push(valsX[i]);
                        y.push(valsY[i]);
                    }
                });
                return { x: x, y: y };
            };

            ChartDataUtil.createArray = function (count, defaultValue) {
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push(defaultValue);
                }
                return result;
            };

            ChartDataUtil.processValues = function (valuesX, valuesY, fitType, xAutoMin, xAutoMax, xMin, xMax, order, npts, display, hole) {
                var xmin, xmax, len, delta, valsX = [], valsY = [], coeffs, nValues;

                if (order === null || order === undefined) {
                    order = 2;
                } else if (typeof order === "number") {
                    if (order < 1) {
                        return;
                    }
                } else {
                    return;
                }
                if (npts === null || npts === undefined) {
                    npts = 100;
                } else if (typeof npts === "number") {
                    if (npts < 1) {
                        return;
                    }
                } else {
                    return;
                }
                if (fitType === null || fitType === undefined) {
                    fitType = TrendlineFitType.strPolynom;
                }
                if (!TrendlineRender.validateType(fitType)) {
                    return;
                }
                nValues = ChartDataUtil.getNumberSeriesData(valuesX, valuesY, display, hole);

                if (!nValues.x.length || !nValues.y.length) {
                    return;
                }

                if (fitType == TrendlineFitType.strMinX || fitType == TrendlineFitType.strMaxX || fitType == TrendlineFitType.strMinY || fitType == TrendlineFitType.strMaxY || fitType == TrendlineFitType.strAverageX || fitType == TrendlineFitType.strAverageY) {
                    return ChartDataUtil.processSimpleValues(nValues.x, nValues.y, fitType);
                }

                len = nValues.x.length;
                for (var i = 0; i < len; i++) {
                    if (i == 0) {
                        xmin = nValues.x[i];
                        xmax = xmin;
                    } else {
                        if (xmin > nValues.x[i]) {
                            xmin = nValues.x[i];
                        }
                        if (xmax < nValues.x[i]) {
                            xmax = nValues.x[i];
                        }
                    }
                }
                order = Math.min(order, len);
                coeffs = ChartDataUtil.createArray(order, 0);
                ChartDataUtil.solveLeastSquares(len, nValues.x, nValues.y, order, coeffs, fitType, false);
                if (!xAutoMin && (xmin < xMin)) {
                    xmin = xMin;
                }
                if (!xAutoMax && (xmax > xMax)) {
                    xmax = xMax;
                }
                delta = (xmax - xmin) / (npts - 1);
                for (var i = 0; i < npts; i++) {
                    var xv = xmin + delta * i;
                    valsX.push(xv);
                    valsY.push(ChartDataUtil.aproximate(fitType, coeffs, xv));
                }
                return { x: valsX, y: valsY };
            };
            ChartDataUtil.tmInc = {
                tickf7: -7000,
                tickf6: -6000,
                tickf5: -5000,
                tickf4: -4000,
                tickf3: -3000,
                tickf2: -2000,
                tickf1: -1,
                second: 1000,
                minute: 60 * 1000,
                hour: 60 * 60 * 1000,
                day: 24 * 60 * 60 * 1000,
                week: 7 * 24 * 60 * 60 * 1000,
                month28: 28 * 24 * 60 * 60 * 1000,
                month29: 29 * 24 * 60 * 60 * 1000,
                month30: 30 * 24 * 60 * 60 * 1000,
                month: 31 * 24 * 60 * 60 * 1000,
                year: 365 * 24 * 60 * 60 * 1000,
                maxtime: 2147483647
            };
            return ChartDataUtil;
        })();
        chart.ChartDataUtil = ChartDataUtil;

        var TrendlineRender = (function () {
            function TrendlineRender(element, options) {
                var bounds, self = this;
                self.options = options;
                self.element = element;
                if (options && options.bounds) {
                    bounds = options.bounds;
                    self.width = bounds.endX - bounds.startX;
                    self.height = bounds.endY - bounds.startY;
                }
            }
            TrendlineRender.prototype.render = function () {
                var element = this.element, options = this.options, wijCSS = options.wijCSS, cBounds = options.bounds, widgetName = options.widgetName, canvas = options.canvas, ani = options.animation, seTrans = options.seriesTransition, mouseDown = options.mouseDown, mouseUp = options.mouseUp, mouseOver = options.mouseOver, mouseOut = options.mouseOut, mouseMove = options.mouseMove, click = options.click, linesStyle = [], paths = [], shadowPaths = [], disabled = options.disabled, animationSet = canvas.set(), fieldsAniPathAttr = options.aniPathsAttr, aniPathsAttr = [], chartEles, fields = element.data("fields") || {}, seriesEles = [], widget = options.widget, exVal = options.extremeValue;

                this.widget = widget;
                this.renderTrendLineChart(options, aniPathsAttr, fieldsAniPathAttr, paths, shadowPaths, animationSet, linesStyle, seriesEles);

                TrendlineRender.playAnimation(ani.enabled, ani.duration, ani.easing, seTrans, cBounds, paths, fieldsAniPathAttr, options.axis, exVal);
                fieldsAniPathAttr.length = 0;
                $.each(aniPathsAttr, function (idx, aniPathAttr) {
                    fieldsAniPathAttr.push(aniPathAttr);
                });

                TrendlineRender.unbindLiveEvents(element, widgetName, wijCSS);
                TrendlineRender.bindLiveEvents(element, widgetName, mouseDown, mouseUp, mouseOver, mouseOut, mouseMove, click, disabled, wijCSS, false);
                chartEles = {
                    trendLines: paths,
                    trendLineShadows: shadowPaths,
                    trendLineAnimationSet: animationSet
                };
                if (!fields.chartElements) {
                    fields.chartElements = {};
                }

                fields.seriesEles = seriesEles;

                $.extend(true, fields.chartElements, chartEles);
                element.data("fields", fields);
            };

            TrendlineRender.setClipRect = function (clipRect, path, cBounds) {
                var width = cBounds.endX - cBounds.startX - clipRect.left + clipRect.right, height = cBounds.endY - cBounds.startY - clipRect.top + clipRect.bottom;
                path.wijAttr("clip-rect", Raphael.format("{0} {1} {2} {3}", (cBounds.startX + clipRect.left), (cBounds.startY + clipRect.top), width, height));
            };

            TrendlineRender.playAnimation = function (animationEnable, duration, easing, seTrans, cBounds, paths, fieldsAniPathAttr, axis, exVal) {
                $.each(paths, function (idx, path) {
                    var axisIndex = path.data("yAxis"), yAxis = $.isArray(axis.y) ? axis.y[axisIndex] : axis.y, ty = exVal.y[axisIndex], currentClipRect = {
                        enable: false,
                        left: -10,
                        top: -10,
                        right: 10,
                        bottom: 10
                    }, width, height;

                    if (!yAxis || !ty) {
                        return true;
                    }

                    if (!axis.x.autoMax && axis.x.max < exVal.txx) {
                        currentClipRect.enable = true;
                        currentClipRect.right = 0;
                    }
                    if (!axis.x.autoMin && axis.x.min > exVal.txn) {
                        currentClipRect.enable = true;
                        currentClipRect.left = 0;
                    }
                    if (!yAxis.autoMax && yAxis.max < ty.tyx) {
                        currentClipRect.enable = true;
                        currentClipRect.top = 0;
                    }
                    if (!yAxis.autoMin && yAxis.min > ty.tyn) {
                        currentClipRect.enable = true;
                        currentClipRect.bottom = 0;
                    }

                    if (fieldsAniPathAttr && fieldsAniPathAttr.length && seTrans.enabled) {
                        duration = seTrans.duration;
                        easing = seTrans.easing;
                    }

                    if (path.tracker) {
                        path.tracker.hide();
                    }

                    width = cBounds.endX - cBounds.startX - currentClipRect.left + currentClipRect.right, height = cBounds.endY - cBounds.startY - currentClipRect.top + currentClipRect.bottom;
                    if (animationEnable || seTrans.enabled) {
                        path.wijAttr("clip-rect", Raphael.format("{0} {1} 0 {2}", (cBounds.startX + currentClipRect.left), (cBounds.startY + currentClipRect.top), height));

                        TrendlineRender.playPathAnimation(duration, easing, cBounds, path, currentClipRect, width, height);
                    } else {
                        TrendlineRender.setClipRect(currentClipRect, path, cBounds);
                    }
                });
            };

            TrendlineRender.playPathAnimation = function (duration, easing, cBounds, path, clipRect, width, height) {
                var clipRectEnable = clipRect.enable;

                path.wijAnimate({
                    "clip-rect": Raphael.format("{0} {1} {2} {3}", (cBounds.startX + clipRect.left), (cBounds.startY + clipRect.top), width, height)
                }, duration, easing, function () {
                    if (this.tracker && this.visible !== false) {
                        this.tracker.show();
                    }

                    if (Raphael.vml && !clipRectEnable) {
                        var attrs = null, clipRect = null, node = this.node;
                        if (node && node.clipRect) {
                            attrs = this.attrs;
                            delete attrs["clip-rect"];
                            node.clipRect = null;
                            clipRect = $(node).parent();
                            clipRect.before(node);
                            clipRect.remove();
                            this.attr(attrs);
                            if (attrs.src && attrs.src.length) {
                                this.attr({ "src": attrs.src });
                            }
                            if (attrs.gradient && attrs.gradient.length && attrs.fill === "none") {
                                this.attr({ "fill": attrs.gradient });
                            }
                        }
                    }
                });
            };

            TrendlineRender.validateType = function (fitType) {
                var valid = false;
                if (!fitType) {
                    return true;
                }
                $.each(TrendlineFitType, function (key, value) {
                    if (value === fitType) {
                        valid = true;
                        return false;
                    }
                });
                return valid;
            };

            TrendlineRender.renderSingleTrendLine = function (series, seriesStyle, seriesHoverStyle, axis, hole, fieldsAniPathAttr, animation, seriesTransition, index, cBounds, canvas, paths, shadowPaths, animationSet, aniPathsAttr, wijCSS, seriesEles, inverted, shadow) {
                var xAxis = axis.x, firstYPoint, lastYPoint, needAnimated = false, lineSeries, lineStyle, path, valuesX, valuesY, seriesData, pathArr = [], initAniPath = [];

                if (!series.isValid || !series.innerData) {
                    return;
                }
                lineSeries = $.extend(true, {
                    display: "show",
                    fitType: TrendlineFitType.strPolynom,
                    order: 2,
                    sampleCount: 100,
                    visible: true
                }, series);
                lineStyle = $.extend(true, {
                    stroke: "black",
                    opacity: 1,
                    fill: "none",
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round"
                }, seriesStyle);

                if (hole !== undefined) {
                    valuesX = [].concat(lineSeries.data.x);
                    valuesY = [].concat(lineSeries.data.y);
                    try  {
                        seriesData = ChartDataUtil.processValues(valuesX, valuesY, lineSeries.fitType, xAxis.autoMin, xAxis.autoMax, xAxis.min, xAxis.max, lineSeries.order, lineSeries.sampleCount, lineSeries.display, hole);
                    } catch (e) {
                        //todo:  Incompatible data
                        return;
                    }
                    valuesX = seriesData.x;
                    valuesY = seriesData.y;
                } else {
                    valuesX = [].concat(series.innerData.x);
                    valuesY = [].concat(series.innerData.y);
                }

                if (fieldsAniPathAttr.length <= index || (animation.enabled && !seriesTransition.enabled)) {
                    needAnimated = true;
                }
                if (needAnimated) {
                    if (valuesY.length > 0) {
                        firstYPoint = ChartUtil.getFirstValidListValue(inverted ? valuesX : valuesY);
                        lastYPoint = ChartUtil.getLastValidListValue(inverted ? valuesX : valuesY);
                    }
                }

                $.each(valuesY, function (m, valY) {
                    pathArr = TrendlineRender.renderPoint(cBounds, initAniPath, pathArr, needAnimated, firstYPoint, lastYPoint, valuesX[m], valY, axis, m, inverted);
                });

                TrendlineRender.renderPath(canvas, cBounds, lineSeries, paths, shadowPaths, seriesHoverStyle, animationSet, pathArr, aniPathsAttr, initAniPath, lineStyle, index, wijCSS, axis, null, shadow);
                path = paths[paths.length - 1];
                seriesEles.push({
                    path: path,
                    shadowPath: shadowPaths[shadowPaths.length - 1],
                    isTrendline: true
                });
                if (path.tracker) {
                    path.tracker.toFront();
                }
                path.data("yAxis", series.yAxis ? series.yAxis : 0);
                return path;
            };

            TrendlineRender.prototype.renderTrendLineChart = function (options, aniPathsAttr, fieldsAniPathAttr, paths, shadowPaths, animationSet, linesStyle, seriesEles) {
                var wijCSS = options.wijCSS, cBounds = options.bounds, canvas = options.canvas, axis = options.axis, ani = options.animation, hole = options.hole, seTrans = options.seriesTransition, needAnimated = false, linesSeries = options.seriesList, linesSeriesStyles = options.seriesStyles, linesHoverStyles = options.seriesHoverStyles, self = this;

                self.annoPoints = {};
                $.each(linesSeries, function (k, trendlineSeries) {
                    var trendLine = TrendlineRender.renderSingleTrendLine(trendlineSeries, linesSeriesStyles[k], linesHoverStyles[k], axis, hole, fieldsAniPathAttr, ani, seTrans, k, cBounds, canvas, paths, shadowPaths, animationSet, aniPathsAttr, wijCSS, seriesEles), valuesX, valuesY;

                    if (!trendLine) {
                        return true;
                    }
                    valuesX = ChartUtil.getNumberValues(trendlineSeries.data.x);
                    valuesY = ChartUtil.getNumberValues(trendlineSeries.data.y);
                    if (self.annoPoints[k] == null) {
                        self.annoPoints[k] = {};
                    }
                    $.each(valuesX, function (pIndex, x) {
                        self.annoPoints[k][pIndex] = BaseChartRender.calculateDataPosition(x, valuesY[pIndex], self);
                    });
                });
            };

            TrendlineRender.renderPath = function (canvas, bounds, lineSeries, paths, shadowPaths, lineHoverStyle, animationSet, pathArr, aniPathsAttr, initAniPath, lineStyle, pathIdx, wijCSS, axis, inverted, shadow) {
                var path, startX, endX, tracker, trackerWidth, idx, noFillStyle, endY, yOrigin = axis.y.origin;

                endY = bounds.endY;
                if (axis && axis.y && (yOrigin !== null && yOrigin !== undefined && !isNaN(yOrigin))) {
                    endY = TrendlineRender.calculatePoint(yOrigin, "y", axis, bounds, inverted);
                }

                path = canvas.path(pathArr.join(" "));
                path.straight = initAniPath.join(" ");
                if (shadow !== false) {
                    ChartUtil.paintShadow(path, 1, "#cccccc");
                }
                if (pathIdx === 0) {
                    if (pathArr.length > 1) {
                        startX = pathArr[1];
                        endX = pathArr[pathArr.length - 2];
                    } else {
                        startX = bounds.startX;
                        endX = bounds.endX;
                    }
                }

                tracker = canvas.path(pathArr.join(" "));
                path.tracker = tracker;
                if (lineStyle["stroke-width"]) {
                    trackerWidth = 10 + parseFloat(lineStyle["stroke-width"]);
                } else {
                    trackerWidth = 10;
                }
                tracker.attr({
                    "stroke-width": trackerWidth,
                    stroke: "#C0C0C0",
                    opacity: 0.01
                });
                $.wijraphael.addClass($(tracker.node), Raphael.format("{0} {1} {2}", wijCSS.canvasObject, wijCSS.trendlineElement, wijCSS.trendlineTracker));
                $(tracker.node).data("owner", $(path.node));

                noFillStyle = $.extend(true, {}, lineStyle);
                if (noFillStyle.fill) {
                    delete noFillStyle.fill;
                }
                path.wijAttr(noFillStyle);

                if (lineHoverStyle.fill) {
                    delete lineHoverStyle.fill;
                }

                aniPathsAttr.push({
                    path: $.extend(true, {}, path.attr())
                });

                if (!paths) {
                    paths = [];
                }
                paths.push(path);
                if (path.shadow) {
                    shadowPaths[pathIdx] = path.shadow;
                }

                animationSet.push(path);

                if (!lineSeries.visible || lineSeries.display === "hide") {
                    path.hide();
                    if (path.tracker) {
                        path.tracker.hide();
                    }
                    if (path.shadow) {
                        path.shadow.hide();
                    }
                    path.visible = false;
                }
                lineSeries.index = pathIdx;
                lineSeries.type = ChartConsts.strTrendline;
                lineSeries.path = path;
                lineSeries.lineStyle = lineStyle;
                lineSeries.lineHoverStyle = lineHoverStyle;
                $.wijraphael.addClass($(path.node), Raphael.format("{0} {1}", wijCSS.canvasObject, wijCSS.trendlineElement));
                $(path.node).data("wijchartDataObj", lineSeries);
            };

            TrendlineRender.calculatePoint = function (val, dir, axis, bounds, inverted) {
                var min = axis[dir].min, max = axis[dir].max, len, rate, boundStart, boundEnd;

                if (inverted) {
                    if (dir === "x") {
                        dir = "y";
                    } else {
                        dir = "x";
                    }
                }
                if (dir === "x") {
                    rate = (bounds.endX - bounds.startX) / (max - min);
                    return bounds.startX + (val - min) * rate;
                } else {
                    rate = (bounds.endY - bounds.startY) / (max - min);
                    return bounds.endY - (val - min) * rate;
                }
            };

            TrendlineRender.renderPoint = function (cBounds, initAniPath, pathArr, needAnimated, firstYPoint, lastYPoint, valX, valY, axis, pointIdx, inverted) {
                var height = (inverted ? cBounds.endX : cBounds.endY) - (inverted ? cBounds.startX : cBounds.startY), minX = inverted ? axis.y.min : axis.x.min, minY = inverted ? axis.x.min : axis.y.min, maxX = inverted ? axis.y.max : axis.x.max, maxY = inverted ? axis.x.max : axis.y.max, ky = height / (maxY - minY), X = 0, Y, temp, initAniY;

                X = TrendlineRender.calculatePoint(valX, "x", axis, cBounds, inverted);
                Y = TrendlineRender.calculatePoint(valY, "y", axis, cBounds, inverted);
                if (inverted) {
                    temp = X;
                    X = Y;
                    Y = temp;
                }

                if (needAnimated) {
                    initAniY = firstYPoint + (lastYPoint - firstYPoint) / (maxX - minX) * ((inverted ? valY : valX) - minX);
                    initAniY = (inverted ? cBounds.endX : cBounds.endY) - (initAniY - minY) * ky;
                    initAniPath.push(pointIdx ? "L" : "M");
                    initAniPath.push(X);
                    initAniPath.push(initAniY);
                }
                pathArr = pathArr.concat([pointIdx ? "L" : "M", X, Y]);
                return pathArr;
            };

            TrendlineRender.bindLiveEvents = function (element, widgetName, mouseDown, mouseUp, mouseOver, mouseOut, mouseMove, click, disabled, wijCSS, hasProcessed) {
                var touchEventPre = "", proxyObj = {
                    element: element,
                    mousedown: function (e) {
                        if (disabled) {
                            return;
                        }

                        var tar = $(e.target), data, lineSeries = null;
                        if (tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");

                        mouseDown.call(element, e, data);
                    },
                    mouseup: function (e) {
                        if (disabled) {
                            return;
                        }

                        var tar = $(e.target), data, lineSeries = null;
                        if (tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");

                        mouseUp.call(element, e, data);
                    },
                    mouseover: function (e) {
                        if (disabled) {
                            return;
                        }

                        var tar = $(e.target), data, lineSeries = null, trendlinePath;
                        if (tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");
                        if (!hasProcessed && data && data.type === ChartConsts.strTrendline) {
                            trendlinePath = data.path;
                            if (trendlinePath && !trendlinePath.removed) {
                                if (data.lineHoverStyle) {
                                    trendlinePath.wijAttr(data.lineHoverStyle);
                                }
                            }
                        }
                        mouseOver.call(element, e, data);
                    },
                    mouseout: function (e) {
                        if (disabled) {
                            return;
                        }

                        var tar = $(e.target), data, lineSeries = null, trendlinePath;
                        if (tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");
                        if (!hasProcessed && data && data.type === ChartConsts.strTrendline) {
                            trendlinePath = data.path;
                            if (trendlinePath && !trendlinePath.removed) {
                                if (data.lineStyle) {
                                    if (data.lineStyle.fill) {
                                        delete data.lineStyle.fill;
                                    }
                                    trendlinePath.wijAttr(data.lineStyle);
                                }
                            }
                        }
                        mouseOut.call(element, e, data);
                    },
                    mousemove: function (e) {
                        if (disabled) {
                            return;
                        }

                        var tar = $(e.target), data, lineSeries = null;
                        if (tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");

                        mouseMove.call(element, e, data);
                    },
                    click: function (e) {
                        if (disabled) {
                            return;
                        }

                        var tar = $(e.target), data, lineSeries = null;
                        if (tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");

                        click.call(element, e, data);
                    }
                };

                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    touchEventPre = "wij";
                }
                element.on(touchEventPre + "mousedown." + widgetName, "." + wijCSS.trendlineElement, $.proxy(proxyObj.mousedown, proxyObj)).on(touchEventPre + "mouseup." + widgetName, "." + wijCSS.trendlineElement, $.proxy(proxyObj.mouseup, proxyObj)).on(touchEventPre + "mouseover." + widgetName, "." + wijCSS.trendlineElement, $.proxy(proxyObj.mouseover, proxyObj)).on(touchEventPre + "mouseout." + widgetName, "." + wijCSS.trendlineElement, $.proxy(proxyObj.mouseout, proxyObj)).on(touchEventPre + "mousemove." + widgetName, "." + wijCSS.trendlineElement, $.proxy(proxyObj.mousemove, proxyObj)).on(touchEventPre + "click." + widgetName, "." + wijCSS.trendlineElement, $.proxy(proxyObj.click, proxyObj));
            };

            TrendlineRender.unbindLiveEvents = function (element, widgetName, wijCSS) {
                element.off("." + widgetName, "." + wijCSS.trendlineElement);
            };

            TrendlineRender.paintLegendIcon = function (x, y, width, height, style, canvas, legendSize, legendIcons, legendIndex, seriesIndex, legendCss) {
                var legendHeight, icon;

                icon = canvas.path(Raphael.format("M{0},{1}L{2},{3}", x, y + height / 2, x + width, y + height / 2));

                $(icon.node).data("legendIndex", legendIndex).data("index", seriesIndex);
                legendIcons.push(icon);
                if (style) {
                    if (legendSize && legendSize.height) {
                        legendHeight = legendSize.height;
                    }
                    icon.attr($.extend(true, {}, style, {
                        "stroke-width": legendHeight
                    }));
                }
                $.wijraphael.addClass($(icon.node), legendCss);
                return icon;
            };

            TrendlineRender.showSerieEles = function (eles) {
                if (eles.path) {
                    eles.path.show();
                    if (eles.path.shadow) {
                        eles.path.shadow.show();
                    }
                    if (eles.path.tracker) {
                        eles.path.tracker.show();
                    }
                }
            };

            TrendlineRender.hideSerieEles = function (eles) {
                if (eles.path) {
                    eles.path.hide();
                    if (eles.path.shadow) {
                        eles.path.shadow.hide();
                    }
                    if (eles.path.tracker) {
                        eles.path.tracker.hide();
                    }
                }
            };

            TrendlineRender.getSeriesChartType = function (series) {
                if (!series) {
                    return;
                }
                if (series.isTrendline) {
                    return ChartConsts.strTrendline;
                }
                return series.type;
            };
            return TrendlineRender;
        })();
        chart.TrendlineRender = TrendlineRender;

        Raphael.fn.closeBtn = function (x, y, length) {
            var offset = Math.cos(45 * Math.PI / 180) * length, set = this.set(), arrPath = [
                "M", x - offset, y - offset, "L", x + offset, y + offset,
                "M", x - offset, y + offset, "L", x + offset, y - offset], path = this.path(arrPath.join(" ")), rect = null;
            path.attr({ cursor: "pointer" });
            set.push(path);

            rect = this.rect(x - length, y - length, length * 2, length * 2);
            rect.attr({
                fill: "white",
                "fill-opacity": 0,
                cursor: "pointer",
                stroke: "none"
            });
            set.push(rect);
            return set;
        };

        //export enum ToolTipCompass {
        //	east,
        //	eastnorth,
        //	eastsouth,
        //	west,
        //	westnorth,
        //	westsouth,
        //	north,
        //	northeast,
        //	northwest,
        //	south,
        //	southeast,
        //	southwest
        //}
        var ChartTooltip = (function () {
            function ChartTooltip(paper, targets, options) {
                this.options = {
                    content: "",
                    contentStyle: {},
                    title: "",
                    titleStyle: {},
                    style: {
                        fill: "white",
                        "fill-opacity": 0.5
                    },
                    closeBehavior: "auto",
                    mouseTrailing: true,
                    triggers: "hover",
                    animated: "fade",
                    showAnimated: null,
                    hideAnimated: null,
                    duration: 500,
                    showDuration: 500,
                    hideDuration: 500,
                    easing: null,
                    showEasing: null,
                    hideEasing: null,
                    showDelay: 150,
                    hideDelay: 150,
                    relativeTo: "mouse",
                    compass: "east",
                    offsetX: 0,
                    offsetY: 0,
                    showCallout: true,
                    calloutFilled: false,
                    calloutFilledStyle: {
                        fill: "black"
                    },
                    calloutLength: 12,
                    calloutOffset: 0,
                    calloutAnimation: {
                        easing: null,
                        duration: 500
                    },
                    windowCollisionDetection: "flip",
                    calloutSide: null,
                    width: null,
                    height: null,
                    beforeShowing: null
                };
                this.paper = paper;
                this.targets = targets;
                $.extend(this.options, options);
                this.init();
            }
            ChartTooltip.prototype.init = function () {
                var o = this.options;

                // If the document mode of IE is less than 9, it doesn't support svg.
                // The chart will be rendered as vml.  But when raphael try to access the toHex funtion from cache to convert color to hex mode.
                // It will throw 'Permission denied' error and then return 'none'.
                // We provide a workaround to avoid this issue.
                // We convert the color to hex before Rapheal convert it, then set the converted color to the container of tooltip.
                if ($.browser.msie && document.documentMode <= 8) {
                    if (o.style.fill) {
                        this.fillColorForIE8 = ChartUtil.toHexColor(o.style.fill);
                    }
                    if (o.style.stroke) {
                        this.strokeColorForIE8 = ChartUtil.toHexColor(o.style.stroke);
                    }
                }
                this.calloutOffset = o.calloutOffset;
                this.offsetLength = 0;
                this.gapLength = o.calloutLength / 2;
                this.width = o.width;
                this.height = o.height;
                this.offset = { x: 0, y: 0 };
                this.toolTipShown = false;

                if (this.targets) {
                    this._bindLiveEvent(this.targets);
                }
                if (this.selector) {
                    this._bindLiveEventBySelector(this.selector);
                }

                this.isContentHtml = false;
                if ($(this.paper.canvas).wijtooltip) {
                    this.isContentHtml = o.isContentHtml;
                }

                this._initializeHTMLToolTips();
            };

            ChartTooltip.prototype._initializeHTMLToolTips = function () {
                var _this = this;
                if (!this.isContentHtml) {
                    return;
                }

                var o = this.options, showAnimated, showDuration, showEasing, hideAnimated, hideDuration, hideEasing, closeBehavior, positionMY, op;

                this.toolTipTarget = $(this.paper.canvas);
                positionMY = this._getHTMLTooltipPositionMY(o.compass), closeBehavior = o.closeBehavior === "sticky" ? "sticky" : "none";
                showAnimated = o.showAnimated || o.animated;
                showDuration = o.showDuration || o.duration;
                showEasing = o.showEasing || o.easing;
                hideAnimated = o.hideAnimated || o.animated;
                hideDuration = o.hideDuration || o.duration;
                hideEasing = o.hideEasing || o.easing;
                op = {
                    "triggers": "custom",
                    "closeBehavior": closeBehavior,
                    "showCallout": o.showCallout,
                    "position": {
                        "my": positionMY,
                        "at": "center center"
                    },
                    "animation": null,
                    "showDelay": o.showDelay,
                    "hideDelay": o.hideDelay,
                    "showAnimation": { animated: showAnimated, duration: showDuration, easing: showEasing },
                    "hideAnimation": { animated: hideAnimated, duration: hideDuration, easing: hideEasing },
                    "shown": function (e, ui) {
                        _this._setHTMLToolTipMovingDuration();
                        _this.toolTipShown = true;
                    },
                    "hidden": function (e, ui) {
                        _this._revoverHTMLToolTipShowingDuration();
                        _this.toolTipShown = false;
                    }
                };
                this.toolTipTarget.wijtooltip(op);
            };

            ChartTooltip.prototype._setHTMLToolTipMovingDuration = function () {
                if (!this.isContentHtml) {
                    return;
                }

                var o = this.options, ttTarget = this.toolTipTarget, showAnimation;

                // Set the duration value for tooltip moving.
                // Only set it one time when tooltip shows first time.
                if (!this.toolTipShown) {
                    showAnimation = ttTarget.wijtooltip("option", "showAnimation");
                    showAnimation = $.extend(showAnimation, { "duration": 250 });
                    ttTarget.wijtooltip("option", "showAnimation", showAnimation);
                }
                // End comments.
            };

            ChartTooltip.prototype._revoverHTMLToolTipShowingDuration = function () {
                if (!this.isContentHtml) {
                    return;
                }

                var o = this.options, ttTarget = this.toolTipTarget, showAnimation;

                // ** Recover the duration value for tooltip showing.
                if (this.toolTipShown) {
                    showAnimation = ttTarget.wijtooltip("option", "showAnimation");
                    showAnimation = $.extend(showAnimation, { "duration": o.showDuration || o.duration });
                    ttTarget.wijtooltip("option", "showAnimation", showAnimation);
                }
                // ** End comment
            };

            ChartTooltip.prototype._getHTMLTooltipPositionMY = function (compass) {
                var my = "center bottom";
                switch (compass) {
                    case "north":
                        my = "center bottom";
                        break;
                    case "south":
                        my = "center top";
                        break;
                    case "east":
                        my = "left center";
                        break;
                    case "west":
                        my = "right center";
                        break;
                    case "eastnorth":
                        my = "bottom left";
                        break;
                    case "northeast":
                        my = "left bottom";
                        break;
                    case "westnorth":
                        my = "bottom right";
                        break;
                    case "northwest":
                        my = "right bottom";
                        break;
                    case "eastsouth":
                        my = "top left";
                        break;
                    case "southeast":
                        my = "left top";
                        break;
                    case "westsouth":
                        my = "top right";
                        break;
                    case "southwest":
                        my = "right top";
                        break;
                }
                return my;
            };

            ChartTooltip.prototype._getShowPoint = function (raphaelObj, compass) {
                var box = raphaelObj.getBBox(), point = {
                    x: 0,
                    y: 0
                };
                switch (compass.toLowerCase()) {
                    case "east":
                        point.x = box.x + box.width;
                        point.y = box.y + box.height / 2;
                        break;
                    case "eastnorth":
                        point.x = box.x + box.width;
                        point.y = box.y;
                        break;
                    case "eastsouth":
                        point.x = box.x + box.width;
                        point.y = box.y + box.height;
                        break;
                    case "west":
                        point.x = box.x;
                        point.y = box.y + box.height / 2;
                        break;
                    case "westnorth":
                        point.x = box.x;
                        point.y = box.y;
                        break;
                    case "westsouth":
                        point.x = box.x;
                        point.y = box.y + box.height;
                        break;
                    case "north":
                        point.x = box.x + box.width / 2;
                        point.y = box.y;
                        break;
                    case "northeast":
                        point.x = box.x + box.width;
                        point.y = box.y;
                        break;
                    case "northwest":
                        point.x = box.x;
                        point.y = box.y;
                        break;
                    case "south":
                        point.x = box.x + box.width / 2;
                        point.y = box.y + box.height;
                        break;
                    case "southeast":
                        point.x = box.x + box.width;
                        point.y = box.y + box.height;
                        break;
                    case "southwest":
                        point.x = box.x;
                        point.y = box.y + box.height;
                        break;
                }
                return point;
            };

            ChartTooltip.prototype._clearIntentTimer = function (timer) {
                if (timer) {
                    window.clearTimeout(timer);
                    timer = null;
                }
            };

            ChartTooltip.prototype._removeSVGTooltip = function (duration) {
                var _this = this;
                var self = this, elements = this.elements, o = self.options, animated, d, op;
                if (elements) {
                    if (o.hideAnimated || o.animated) {
                        animated = o.hideAnimated;
                        if (!animated) {
                            animated = o.animated;
                        }
                        if (animated && ChartTooltip.animations[animated]) {
                            op = {
                                animated: animated,
                                duration: o.hideDuration || o.duration,
                                easing: o.hideEasing || o.easing,
                                context: elements,
                                show: false
                            };
                            ChartTooltip.animations[animated](op);
                        }
                    }
                    d = o.hideDuration || o.duration;
                    if (duration) {
                        d = duration;
                    }
                    window.setTimeout(function () {
                        var i, ii;
                        if (_this.content) {
                            _this.content.wijRemove();
                            _this.content = null;
                        }
                        if (_this.title) {
                            _this.title.wijRemove();
                            _this.title = null;
                        }
                        if (_this.container) {
                            _this.container.wijRemove();
                            _this.container = null;
                        }
                        if (_this.closeBtn) {
                            for (i = 0, ii = _this.closeBtn.length; i < ii; i++) {
                                _this.closeBtn[i].unclick();
                            }
                            _this.closeBtn.wijRemove();
                            _this.closeBtn = null;
                        }
                        if (_this.callout) {
                            _this.callout.wijRemove();
                            _this.callout = null;
                        }
                        self.lastPoint = null;
                        elements = null;
                    }, d);
                }
            };

            ChartTooltip.prototype._removeHTMLTooltip = function () {
                var o = this.options;
                if (o.closeBehavior !== "sticky") {
                    this.toolTipTarget.wijtooltip("hide");
                }
            };

            ChartTooltip.prototype._removeTooltip = function (duration) {
                if (this.isContentHtml) {
                    this._removeHTMLTooltip();
                } else {
                    this._removeSVGTooltip(duration);
                }
            };

            ChartTooltip.prototype._clearTimers = function () {
                if (this.intentShowTimer) {
                    this._clearIntentTimer(this.intentShowTimer);
                }
                if (this.intentHideTimer) {
                    this._clearIntentTimer(this.intentHideTimer);
                }
            };

            ChartTooltip.prototype._hide = function (e) {
                var self = this;
                self._clearTimers();
                if (self.options.hideDelay) {
                    self.intentHideTimer = window.setTimeout(function () {
                        self._removeTooltip();
                    }, self.options.hideDelay);
                } else {
                    self._removeTooltip();
                }
            };

            ChartTooltip.prototype._convertCompassToPosition = function (compass) {
                var position = "", offset = { x: 0, y: 0 };
                switch (compass.toLowerCase()) {
                    case "east":
                        position = "right-middle";
                        offset.x = 2;
                        offset.y = 0;
                        break;
                    case "eastnorth":
                        position = "right-top";
                        offset.x = 2;
                        offset.y = -2;
                        break;
                    case "eastsouth":
                        position = "right-bottom";
                        offset.x = 2;
                        offset.y = 2;
                        break;
                    case "west":
                        position = "left-middle";
                        offset.x = -2;
                        offset.y = 0;
                        break;
                    case "westnorth":
                        position = "left-top";
                        offset.x = -2;
                        offset.y = -2;
                        break;
                    case "westsouth":
                        position = "left-bottom";
                        offset.x = -2;
                        offset.y = 2;
                        break;
                    case "north":
                        position = "top-middle";
                        offset.x = 0;
                        offset.y = -2;
                        break;
                    case "northeast":
                        position = "top-right";
                        offset.x = 2;
                        offset.y = -2;
                        break;
                    case "northwest":
                        position = "top-left";
                        offset.x = -2;
                        offset.y = -2;
                        break;
                    case "south":
                        position = "bottom-middle";
                        offset.x = 0;
                        offset.y = 2;
                        break;
                    case "southeast":
                        position = "bottom-right";
                        offset.x = 2;
                        offset.y = 2;
                        break;
                    case "southwest":
                        position = "bottom-left";
                        offset.x = -2;
                        offset.y = 2;
                        break;
                }
                this.offset = offset;
                return position;
            };

            ChartTooltip.prototype._getCalloutArr = function (p, offset) {
                var arr = [], o = this.options, compass = o.compass;
                if (o.calloutSide) {
                    compass = o.calloutSide;
                }
                switch (compass.toLowerCase()) {
                    case "east":
                    case "eastsouth":
                    case "eastnorth":
                        arr = [
                            "M", p.x + offset, p.y + offset, "l",
                            -offset, -offset, "l", offset, -offset, "Z"];
                        break;
                    case "west":
                    case "westsouth":
                    case "westnorth":
                        arr = [
                            "M", p.x - offset, p.y - offset, "l",
                            offset, offset, "l", -offset, offset, "Z"];
                        break;
                    case "north":
                    case "northeast":
                    case "northwest":
                        arr = [
                            "M", p.x - offset, p.y - offset, "l",
                            offset, offset, "l", offset, -offset, "Z"];
                        break;
                    case "south":
                    case "southeast":
                    case "southwest":
                        arr = [
                            "M", p.x - offset, p.y + offset, "l",
                            offset, -offset, "l", offset, offset, "Z"];
                        break;
                }
                return arr;
            };

            ChartTooltip.prototype._getFuncText = function (text, e) {
                if ($.isFunction(text)) {
                    var fmt = null, objTar, obj = {
                        target: null,
                        fmt: text
                    }, t;
                    if (e && e.target) {
                        // obj.target = $(e.target).data("raphaelObj");
                        // objTar = $(e.target).data("raphaelObj");
                        // if (!objTar) {
                        // objTar = $(e.target.parentNode).data("raphaelObj");
                        // }
                        // obj.target = objTar;
                        t = e.target;
                        if (!t.raphael || !t.raphaelid) {
                            t = t.parentNode;
                        }
                        if (t.raphael && t.raphaelid) {
                            objTar = this.paper.getById(t.raphaelid);
                            obj.target = objTar;
                        } else {
                            obj.target = e.target;
                        }
                    }
                    fmt = $.proxy(obj.fmt, obj);
                    return fmt().toString();
                }
                return text;
            };

            ChartTooltip.prototype._translateCallout = function (duration) {
                var o = this.options, width = this.width, height = this.height, gapLength = this.gapLength, offsetLength = this.offsetLength, calloutOffset = this.calloutOffset, callout = this.tooltipElements.callout;
                if (o.calloutSide) {
                    var offset = gapLength || offsetLength;
                    switch (o.calloutSide) {
                        case "south":
                        case "north":
                            if (duration) {
                                callout.animate({
                                    "translation": (-width / 2 + offset + calloutOffset) + ",0"
                                }, duration);
                            } else {
                                callout.translate(-width / 2 + offset + calloutOffset, 0);
                            }
                            break;
                        case "east":
                        case "west":
                            if (duration) {
                                callout.animate({
                                    "translation": "0," + (-height / 2 + offset + calloutOffset)
                                }, duration);
                            } else {
                                callout.translate(0, -height / 2 + offset + calloutOffset);
                            }
                            break;
                    }
                }
            };

            ChartTooltip.replacer = function (all, key, obj) {
                var res = obj, objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g;
                key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                    name = name || quotedName;
                    if (res) {
                        if (res[name] !== typeof ('undefined')) {
                            res = res[name];
                        }
                        if (typeof res === "function" && isFunc) {
                            res = res();
                        }
                    }
                });
                res = (res === null || res === obj ? all : res).toString();
                return res;
            };

            ChartTooltip.fill = function (str, obj) {
                var tokenRegex = /\{([^\}]+)\}/g;
                return String(str).replace(tokenRegex, function (all, key) {
                    return ChartTooltip.replacer(all, key, obj);
                });
            };

            ChartTooltip.prototype._createPath = function (point, position, set) {
                var pos = position.split("-"), r = 5, bb = set.getBBox(), o = this.options, p = o.padding, gapLength = this.gapLength, offsetLength = this.offsetLength, padding = p && !isNaN(p) ? parseInt(p) : 0, w = Math.round(bb.width + padding * 2), h = Math.round(bb.height + padding * 2), x = Math.round(bb.x - padding) - r, y = Math.round(bb.y - padding) - r, gap = 0, off = 0, dx = 0, dy = 0, shapes = null, mask = null, out = null;
                if (o.width) {
                    w = w > o.width ? w : o.width;
                }
                if (o.height) {
                    h = h > o.height ? h : o.height;
                }
                this.width = w;
                this.height = h;
                gap = Math.min(h / 4, w / 4, gapLength);
                if (offsetLength) {
                    offsetLength = Math.min(h / 4, w / 4, offsetLength);
                }
                if (offsetLength) {
                    off = offsetLength;
                    shapes = {
                        top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right}," + "0-{offset},0,-{left},0a{r},{r},0,0,1-{r}-{r}" + "v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                        bottom: "M{x},{y}l{left},0,{offset},0,{right},0a{r},{r}," + "0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r}," + "{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}" + "v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                        right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}" + "h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}" + "l0-{bottom},0-{offset},0-{top}a{r},{r},0,0,1,{r}-{r}z",
                        left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "l0,{top},0,{offset},0,{bottom}a{r},{r},0,0,1,-{r}," + "{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}" + "v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
                    };
                } else {
                    shapes = {
                        top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}" + "l-{right},0-{gap},{gap}-{gap}-{gap}-{left},0a{r},{r},0,0,1" + "-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                        bottom: "M{x},{y}l{left},0,{gap}-{gap},{gap},{gap},{right},0" + "a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1," + "-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0," + "1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                        right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}" + "-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom}-{gap}-{gap}," + "{gap}-{gap},0-{top}a{r},{r},0,0,1,{r}-{r}z",
                        left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "l0,{top},{gap},{gap}-{gap},{gap},0,{bottom}a{r},{r},0,0,1," + "-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}" + "v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
                    };
                }
                mask = [
                    {
                        x: x + r,
                        y: y,
                        w: w,
                        w4: w / 4,
                        h4: h / 4,
                        left: 0,
                        right: w - gap * 2 - off * 2,
                        top: 0,
                        bottom: h - gap * 2 - off * 2,
                        r: r,
                        h: h,
                        gap: gap,
                        offset: off * 2
                    }, {
                        x: x + r,
                        y: y,
                        w: w,
                        w4: w / 4,
                        h4: h / 4,
                        left: w / 2 - gap - off,
                        right: w / 2 - gap - off,
                        top: h / 2 - gap - off,
                        bottom: h / 2 - gap - off,
                        r: r,
                        h: h,
                        gap: gap,
                        offset: off * 2
                    }, {
                        x: x + r,
                        y: y,
                        w: w,
                        w4: w / 4,
                        h4: h / 4,
                        right: 0,
                        left: w - gap * 2 - off * 2,
                        bottom: 0,
                        top: h - gap * 2 - off * 2,
                        r: r,
                        h: h,
                        gap: gap,
                        offset: off * 2
                    }][pos[1] === "middle" ? 1 : ((pos[1] === "left" || pos[1] === "top") ? 1 : 0) * 2];
                out = this.paper.path(ChartTooltip.fill(shapes[pos[0]], mask));
                switch (pos[0]) {
                    case "top":
                        dx = point.x - (x + r + mask.left + gap + offsetLength);
                        dy = point.y - (y + r + h + r + gap + offsetLength);
                        break;
                    case "bottom":
                        dx = point.x - (x + r + mask.left + gap + offsetLength);
                        dy = point.y - (y - gap - offsetLength);
                        break;
                    case "left":
                        dx = point.x - (x + r + w + r + gap + offsetLength);
                        dy = point.y - (y + r + mask.top + gap + offsetLength);
                        break;
                    case "right":
                        dx = point.x - (x - gap - off);
                        dy = point.y - (y + r + mask.top + gap + off);
                        break;
                }
                out.translate(dx, dy);

                //set.translate(dx, dy);
                set.transform(Raphael.format("...t{0},{1}", dx, dy));
                return out;
            };

            ChartTooltip.prototype._isWindowCollision = function (container, compass, offsetX, offsetY, ox, oy, windowCollisionDetection) {
                var box = container.getBBox(), counter = 0, cps = compass.toLowerCase(), x = box.x + ox, y = box.y + oy, w = this.paper.width, h = this.paper.height, offX = offsetX, offY = offsetY, strokeWidth = container.attr("stroke-width"), flip = windowCollisionDetection === true || windowCollisionDetection === "flip";
                if (Raphael.vml) {
                    w = $(this.paper.canvas).width();
                    h = $(this.paper.canvas).height();
                }
                if (x - strokeWidth < 0) {
                    // counter++;
                    if (flip) {
                        if (cps.toLowerCase().indexOf("west") === -1) {
                            // check if window collision after change compass.
                            if (x + box.width / 2 + box.width - offsetX <= w) {
                                counter++;
                                cps = cps.toLowerCase() + "east";
                                offX = 0 - offsetX;
                            }
                        } else {
                            if (x + box.width + box.width - offsetX <= w) {
                                counter++;
                                cps = cps.toLowerCase().replace("west", "east");
                                offX = 0 - offsetX;
                            }
                        }
                    } else {
                        //fit
                        counter++;
                        offX = 0 - x + strokeWidth + offsetX;
                    }
                }
                if (y - strokeWidth < 0) {
                    if (flip) {
                        // counter++;
                        if (cps.toLowerCase().indexOf("north") === -1) {
                            // check if window collision after change compass.
                            if (y + box.height / 2 + box.height - offsetY <= h) {
                                counter++;
                                cps = cps.toLowerCase() + "south";
                                offY = 0 - offsetY;
                            }
                        } else {
                            if (y + box.height + box.height - offsetY <= h) {
                                counter++;
                                cps = cps.toLowerCase().replace("north", "south");
                                offY = 0 - offsetY;
                            }
                        }
                    } else {
                        //fit
                        counter++;
                        offY = 0 - y + strokeWidth + offsetY;
                    }
                }
                if (x + box.width + strokeWidth > w) {
                    if (flip) {
                        // counter++;
                        if (cps.toLowerCase().indexOf("east") === -1) {
                            // check if window collision after change compass.
                            if (x - box.width / 2 - offsetX >= 0) {
                                counter++;
                                cps = cps.toLowerCase() + "west";
                                offX = 0 - offsetX;
                            }
                        } else {
                            if (x - box.width - offsetX >= 0) {
                                counter++;
                                cps = cps.toLowerCase().replace("east", "west");
                                offX = 0 - offsetX;
                            }
                        }
                    } else {
                        //fit
                        counter++;
                        offX = w - (x + box.width + strokeWidth) + offsetX;
                    }
                }
                if (y + box.height + strokeWidth > h) {
                    if (flip) {
                        // counter++;
                        if (cps.toLowerCase().indexOf("south") === -1) {
                            // check if window collision after change compass.
                            if (y - box.height / 2 - offsetY >= 0) {
                                counter++;
                                cps = cps.toLowerCase() + "north";
                                offY = 0 - offsetY;
                            }
                        } else {
                            if (y - box.height - offsetY >= 0) {
                                counter++;
                                cps = cps.toLowerCase().replace("south", "north");
                                offY = 0 - offsetY;
                            }
                        }
                    } else {
                        //fit
                        counter++;
                        offY = h - (y + box.height + strokeWidth) + offsetY;
                    }
                }
                if (counter) {
                    return {
                        compass: cps,
                        offsetX: offX,
                        offsetY: offY
                    };
                }
                return false;
            };

            ChartTooltip.prototype._createHTMLTooltipEles = function (point, tit, cont, windowCollisionDetection, compass, offsetX, offsetY) {
                var o = this.options, newPoint, pointOffset, ttTarget = this.toolTipTarget, targetOffset, ttContent, title, content, titleStyle = "", contentStyle = "", showAnimation;
                pointOffset = this._getPointOffset(compass);

                targetOffset = { x: 0, y: 0 };
                targetOffset.x = ttTarget.parent().offset().left;
                targetOffset.y = ttTarget.parent().offset().top;

                newPoint = {};
                newPoint.x = point.x + targetOffset.x + pointOffset.x + offsetX;
                newPoint.y = point.y + targetOffset.y + pointOffset.y + offsetY;

                ttContent = "";
                if (tit && tit.length > 0) {
                    title = tit.replace(/(?:\r\n|\n|\r)/g, '<br>');
                    if (o.titleStyle) {
                        titleStyle = "color:" + o.titleStyle["fill"] + ";font-size:" + o.titleStyle["font-size"];
                    }
                    ttContent += "<div style='" + titleStyle + "'>" + title + "</div>";
                }
                if (cont && cont.length > 0) {
                    content = cont.replace(/(?:\r\n|\n|\r)/g, '<br>');
                    if (o.contentStyle) {
                        contentStyle = "color:" + o.contentStyle["fill"] + ";font-size:" + o.contentStyle["font-size"] + ";font-family:" + o.contentStyle["font-family"];
                    }
                    ttContent += "<div style='" + contentStyle + "'>" + content + "</div>";
                }

                ttTarget.wijtooltip("option", "content", ttContent);

                ttTarget.wijtooltip("showAt", newPoint);
            };

            ChartTooltip.prototype._getPointOffset = function (compass) {
                var pointOffsetVal = 2, offset = { x: 0, y: 0 };
                switch (compass) {
                    case "north":
                        offset.x = 0;
                        offset.y = -pointOffsetVal;
                        break;
                    case "south":
                        offset.x = 0;
                        offset.y = pointOffsetVal;
                        break;
                    case "east":
                        offset.x = pointOffsetVal;
                        offset.y = 0;
                        break;
                    case "west":
                        offset.x = -pointOffsetVal;
                        offset.y = 0;
                    case "northeast":
                    case "eastnorth":
                        offset.x = pointOffsetVal;
                        offset.y = -pointOffsetVal;
                        break;
                    case "northwest":
                    case "westnorth":
                        offset.x = -pointOffsetVal;
                        offset.y = -pointOffsetVal;
                        break;
                    case "southeast":
                    case "eastsouth":
                        offset.x = pointOffsetVal;
                        offset.y = pointOffsetVal;
                        break;
                    case "southwest":
                    case "westsouth":
                        offset.x = -pointOffsetVal;
                        offset.y = pointOffsetVal;
                        break;
                }
                return offset;
            };

            ChartTooltip.prototype._createSVGTooltipEles = function (point, tit, cont, windowCollisionDetection, compass, offsetX, offsetY) {
                var _this = this;
                var titleBox, contentBox, position, set = this.paper.set(), arrPath = null, animated = null, o = this.options, closeBtnLength = this.closeBtnLength, calloutOffset = this.calloutOffset, op = null, ox = 0, oy = 0, duration = 250, idx = 0, len = 0, isWindowCollision, newPoint = {
                    x: point.x,
                    y: point.y
                }, offset = this.offset, anim = null, trans = null;

                $.wijraphael.clearRaphaelCache();
                position = this._convertCompassToPosition(compass);
                newPoint.x += offsetX + offset.x;
                newPoint.y += offsetY + offset.y;
                this.elements = this.paper.set();

                if (this.title) {
                    $.each(this.title, function (i, t) {
                        $(t.node).unbind(".Rtooltip");
                    });
                    this.title.wijRemove();
                }
                if (tit && tit.length > 0) {
                    this.title = this.paper.htmlText(-1000, -1000, tit, o.titleStyle);
                    this.elements.push(this.title);
                    titleBox = this.title.getBBox();
                } else {
                    titleBox = {
                        left: -1000,
                        top: -1000,
                        width: 0,
                        height: 0
                    };
                }
                if (this.content) {
                    $.each(this.content, function (i, c) {
                        $(c.node).unbind(".Rtooltip");
                    });
                    this.content.wijRemove();
                }
                if (cont && cont.length > 0) {
                    this.content = this.paper.htmlText(-1000, -1000, cont, o.contentStyle);
                    this.elements.push(this.content);
                    contentBox = this.content.getBBox();
                } else {
                    contentBox = {
                        left: -1000,
                        top: -1000,
                        width: 0,
                        height: 0
                    };
                }
                if (this.closeBtn) {
                    for (idx = 0, len = this.closeBtn.length; idx < len; idx++) {
                        this.closeBtn[idx].unclick();
                    }
                    this.closeBtn.wijRemove();
                }
                if (this.content) {
                    // content.translate(0, titleBox.height / 2 +
                    // contentBox.height / 2);
                    this.content.transform(Raphael.format("T0,{0}", titleBox.height / 2 + contentBox.height / 2));
                }
                if (this.title) {
                    // content.translate(0, titleBox.height / 2 +
                    // contentBox.height / 2);
                    this.title.transform(Raphael.format("T0,{0}", 0));
                }
                if (o.closeBehavior === "sticky") {
                    this.closeBtn = this.paper.closeBtn(-1000, -1000, closeBtnLength);
                    this.elements.push(this.closeBtn);
                    if (o.width && o.width > titleBox.width + closeBtnLength * 2 && o.width > contentBox.width + closeBtnLength * 2) {
                        // closeBtn.translate(o.width - closeBtnLength,
                        // closeBtnLength);
                        this.closeBtn.transform(Raphael.format("T{0},{1}", o.width - closeBtnLength, closeBtnLength));
                    } else if (titleBox.width >= contentBox.width - closeBtnLength * 2) {
                        // closeBtn.translate(titleBox.width +
                        // closeBtnLength, closeBtnLength);
                        this.closeBtn.transform(Raphael.format("T{0},{1}", titleBox.width + closeBtnLength, closeBtnLength));
                    } else {
                        // closeBtn.translate(contentBox.width -
                        // closeBtnLength, closeBtnLength);
                        this.closeBtn.transform(Raphael.format("T{0},{1}", contentBox.width - closeBtnLength, closeBtnLength));
                    }

                    // bind click event.
                    $.each(this.closeBtn, function (i, btn) {
                        var self = _this;
                        btn.click(function (e) {
                            self._hide(e);
                        });
                    });
                }
                if (this.title) {
                    set.push(this.title);
                    if (o.relatedElement) {
                        this.title.insertBefore(o.relatedElement);
                    }
                }
                if (this.content) {
                    set.push(this.content);
                    if (o.relatedElement) {
                        this.content.insertBefore(o.relatedElement);
                    }
                }
                if (this.closeBtn) {
                    set.push(this.closeBtn);
                    if (o.relatedElement) {
                        this.closeBtn.insertBefore(o.relatedElement);
                    }
                }
                if (!o.showCallout) {
                    this.gapLength = 0;
                }
                if (o.calloutSide || o.calloutFilled) {
                    this.gapLength = 0;
                    this.offsetLength = o.calloutLength / 2;
                    if (o.calloutSide) {
                        position = this._convertCompassToPosition(o.calloutSide);
                    }
                }
                if (o.calloutSide && set.length === 0) {
                    this.content = this.paper.htmlText(-1000, -1000, " ");
                    set.push(this.content);
                    if (o.relatedElement) {
                        this.content.insertBefore(o.relatedElement);
                    }
                }
                if (this.callout) {
                    $(this.callout.node).unbind(".Rtooltip");
                    this.callout.wijRemove();
                }
                if (this.container) {
                    $(this.container.node).unbind(".Rtooltip");
                    this.container.wijRemove();
                }

                // container = self.path();
                if (this.lastPoint) {
                    if (o.showCallout && (o.calloutSide || o.calloutFilled)) {
                        arrPath = this._getCalloutArr(this.lastPoint, this.offsetLength);

                        this.callout = this.paper.path(arrPath.concat(" "));
                        if (o.relatedElement) {
                            this.callout.insertBefore(o.relatedElement);
                        }
                        if (o.calloutFilled) {
                            this.callout.attr(o.calloutFilledStyle);
                        }
                        if (o.calloutSide) {
                            this._translateCallout(0);
                        }
                    }
                    this.container = this._createPath(this.lastPoint, position, set);
                    if (o.relatedElement) {
                        this.container.insertBefore(o.relatedElement);
                    }
                    if (windowCollisionDetection) {
                        isWindowCollision = this._isWindowCollision(this.container, compass, offsetX, offsetY, newPoint.x - this.lastPoint.x, newPoint.y - this.lastPoint.y, windowCollisionDetection);

                        // TODO: window collision
                        if (isWindowCollision) {
                            this._createTooltipEles(point, tit, cont, false, isWindowCollision.compass, isWindowCollision.offsetX, isWindowCollision.offsetY);
                            return;
                        }
                    }
                    this.elements.push(this.callout);
                    this.elements.push(this.container);
                    ox = newPoint.x - this.lastPoint.x;
                    oy = newPoint.y - this.lastPoint.y;
                    trans = Raphael.format("...T{0},{1}", ox, oy);
                    anim = Raphael.animation({ transform: trans }, duration);
                    if (this.container) {
                        // container.animate({ "translation": ox + "," + oy },
                        // duration);
                        if (o.showAnimated || o.animated) {
                            this.container.animate(anim);
                        } else {
                            this.container.attr("transform", trans);
                        }
                    }
                    if (this.title) {
                        // title.animate({ "translation": ox + "," + oy },
                        // duration);
                        if (o.showAnimated || o.animated) {
                            this.title.animate(anim);
                        } else {
                            this.title.attr("transform", trans);
                        }
                    }
                    if (this.content) {
                        // content.animate({ "translation": ox + "," + oy },
                        // duration);
                        if (o.showAnimated || o.animated) {
                            this.content.animate(anim);
                        } else {
                            this.content.attr("transform", trans);
                        }
                    }
                    if (this.closeBtn) {
                        // closeBtn.animate({ "translation": ox + "," + oy },
                        // duration);
                        if (o.showAnimated || o.animated) {
                            this.closeBtn.animate(anim);
                        } else {
                            this.closeBtn.attr("transform", trans);
                        }
                    }
                    if (this.callout) {
                        // callout.animate({ "translation": ox + "," + oy },
                        // duration);
                        if (o.showAnimated || o.animated) {
                            this.callout.animate(anim);
                        } else {
                            this.callout.attr("transform", trans);
                        }
                    }
                } else {
                    if (o.showCallout && (o.calloutSide || o.calloutFilled)) {
                        arrPath = this._getCalloutArr(newPoint, this.offsetLength);
                        this.callout = this.paper.path(arrPath.concat(" "));
                        if (o.relatedElement) {
                            this.callout.insertBefore(o.relatedElement);
                        }
                        if (o.calloutFilled) {
                            this.callout.attr(o.calloutFilledStyle);
                        }
                        if (o.calloutSide) {
                            this._translateCallout(0);
                        }
                    }
                    this.container = this._createPath(newPoint, position, set);
                    if (o.relatedElement) {
                        this.container.insertBefore(o.relatedElement);
                    }
                    if (windowCollisionDetection) {
                        isWindowCollision = this._isWindowCollision(this.container, compass, offsetX, offsetY, 0, 0, windowCollisionDetection);

                        // TODO: window collision
                        if (isWindowCollision) {
                            this._createTooltipEles(point, tit, cont, false, isWindowCollision.compass, isWindowCollision.offsetX, isWindowCollision.offsetY);
                            return;
                        }
                    }
                    this.elements.push(this.callout);
                    this.elements.push(this.container);
                    if (o.showAnimated || o.animated) {
                        animated = o.showAnimated;
                        if (!animated) {
                            animated = o.animated;
                        }
                        if (animated && ChartTooltip.animations[animated]) {
                            op = {
                                animated: animated,
                                duration: o.showDuration || o.duration,
                                easing: o.showEasing || o.easing,
                                context: this.elements,
                                show: true
                            };
                            ChartTooltip.animations[animated](op);
                        }
                    }
                }
                this.lastPoint = newPoint;

                // If the document mode of IE is less than 9, it doesn't support svg.
                // The chart will be rendered as vml.  But when raphael try to access the toHex funtion from cache to convert color to hex mode.
                // It will throw 'Permission denied' error and then return 'none'.
                // We provide a workaround to avoid this issue.
                // We convert the color to hex before Rapheal convert it, then set the converted color to the container of tooltip.
                if ($.browser.msie && document.documentMode <= 8) {
                    this.container.attr($.extend({}, o.style, {
                        fill: this.fillColorForIE8,
                        stroke: this.strokeColorForIE8
                    }));
                } else {
                    this.container.attr(o.style);
                }

                // container.toFront();
                if (o.relatedElement) {
                    if (this.title) {
                        this.title.insertBefore(o.relatedElement);
                    }
                    if (this.content) {
                        this.content.insertBefore(o.relatedElement);
                    }
                    if (this.closeBtn) {
                        this.closeBtn.insertBefore(o.relatedElement);
                    }
                } else {
                    set.toFront();
                }
                // set.toFront();
                /*
                * if (o.closeBehavior === "auto") {
                * $(container.node).bind("mouseover.Rtooltip", function (e) {
                * _clearTimers(); }).bind("mouseout.Rtooltip", function (e) {
                * _hide(e); }); if (title) { $.each(title, function (i, t) {
                * $(t.node).bind("mouseover.Rtooltip", function (e) {
                * _clearTimers(); }).bind("mouseout.Rtooltip", function (e) {
                * _hide(e); }); }); } if (content) { $.each(content, function
                * (i, c) { $(c.node).bind("mouseover.Rtooltip", function (e) {
                * _clearTimers(); }).bind("mouseout.Rtooltip", function (e) {
                * _hide(e); }); }); } if (callout) {
                * $(callout.node).bind("mouseover.Rtooltip", function (e) {
                * _clearTimers(); }).bind("mouseout.Rtooltip", function (e) {
                * _hide(e); }); } }
                */
            };

            ChartTooltip.prototype._createTooltipEles = function (point, tit, cont, windowCollisionDetection, compass, offsetX, offsetY) {
                if (this.isContentHtml) {
                    this._createHTMLTooltipEles(point, tit, cont, windowCollisionDetection, compass, offsetX, offsetY);
                } else {
                    this._createSVGTooltipEles(point, tit, cont, windowCollisionDetection, compass, offsetX, offsetY);
                }
            };

            ChartTooltip.prototype._createTooltip = function (point, e) {
                var tit = null, cont = null, fmt = null, obj = null, o = this.options, objTar, t;
                if ($.isFunction(o.beforeShowing)) {
                    fmt = null;
                    obj = {
                        target: null,
                        options: o,
                        fmt: o.beforeShowing
                    };
                    if (e && e.target) {
                        // objTar = $(e.target).data("raphaelObj");
                        // if (!objTar) {
                        // objTar = $(e.target.parentNode).data("raphaelObj");
                        // }
                        // obj.target = objTar;
                        t = e.target;
                        if (!t.raphael || !t.raphaelid) {
                            t = t.parentNode;
                        }
                        if (t.raphael && t.raphaelid) {
                            objTar = this.paper.getById(t.raphaelid);
                            obj.target = objTar;
                        } else {
                            objTar = e.target;
                            obj.target = objTar;
                        }
                    }
                    fmt = $.proxy(obj.fmt, obj);
                    if (fmt() === false) {
                        return;
                    }
                    ;
                }
                tit = o.title;
                cont = o.content;
                tit = this._getFuncText(tit, e);
                cont = this._getFuncText(cont, e);
                if (!tit && !cont) {
                    return;
                }

                this._createTooltipEles(point, tit, cont, o.windowCollisionDetection, o.compass, o.offsetX, o.offsetY);
            };

            ChartTooltip.prototype._showAt = function (point, e) {
                var o = this.options, self = this;

                this._clearTimers();
                if (o.showDelay) {
                    this.intentShowTimer = window.setTimeout(function () {
                        self._createTooltip(point, e);
                    }, o.showDelay);
                } else {
                    this._createTooltip(point, e);
                }
            };

            ChartTooltip.prototype._show = function (e) {
                var position = $(this.paper.canvas.parentNode).offset(), offsetX = position.left, offsetY = position.top, o = this.options, relativeTo = o.relativeTo, point = {
                    x: 0,
                    y: 0
                }, raphaelObj = null, t = e.target;
                switch (relativeTo) {
                    case "mouse":
                        point.x = e.pageX - offsetX;
                        point.y = e.pageY - offsetY;
                        break;
                    case "element":
                        if (!t.raphael || !t.raphaelid) {
                            t = t.parentNode;
                        }
                        if (t.raphael && t.raphaelid) {
                            raphaelObj = this.paper.getById(t.raphaelid);
                            point = this._getShowPoint(raphaelObj, o.compass);
                        }
                        break;
                }
                this._showAt(point, e);
            };

            ChartTooltip.prototype._bindEvent = function (tar) {
                var o = this.options, self = this;
                switch (o.triggers) {
                    case "hover":
                        $(tar.node).bind("mouseover.Rtooltip", function (e) {
                            self._show(e);
                        }).bind("mouseout.Rtooltip", function (e) {
                            if (o.closeBehavior === "auto") {
                                self._hide(e);
                            }
                        });
                        if (o.mouseTrailing && o.relativeTo === "mouse") {
                            $(tar.node).bind("mousemove.Rtooltip", function (e) {
                                self._show(e);
                            });
                        }
                        break;
                    case "click":
                        $(tar.node).bind("click.Rtooltip", function (e) {
                            self._show(e);
                        });
                        break;
                    case "custom":
                        break;
                }
            };

            ChartTooltip.prototype._bindLiveEvent = function (tars) {
                var i, ii;
                if (tars) {
                    if (tars.length) {
                        for (i = 0, ii = tars.length; i < ii; i++) {
                            this._bindEvent(tars[i]);
                        }
                    } else {
                        this._bindEvent(tars);
                    }
                }
            };

            ChartTooltip.prototype._bindLiveEventBySelector = function (selector) {
                var o = this.options, self = this;
                if (selector) {
                    switch (o.triggers) {
                        case "hover":
                            selector.on("mouseover.Rtooltip", function (e) {
                                self._show(e);
                            }).on("mouseout.Rtooltip", function (e) {
                                if (o.closeBehavior === "auto") {
                                    self._hide(e);
                                }
                            });
                            if (o.mouseTrailing && o.relativeTo === "mouse") {
                                selector.on("mousemove.Rtooltip", function (e) {
                                    self._show(e);
                                });
                            }
                            break;
                        case "click":
                            selector.on("click.Rtooltip", function (e) {
                                self._show(e);
                            });
                            break;
                        case "custom":
                            break;
                    }
                }
            };

            ChartTooltip.prototype._unbindLiveEvent = function (targets, selector) {
                var i, ii;
                if (targets) {
                    if (targets.length) {
                        for (i = 0, ii = targets.length; i < ii; i++) {
                            $(targets[i].node).unbind(".Rtooltip");
                        }
                    } else {
                        $(targets.node).unbind(".Rtooltip");
                    }
                }
                if (selector) {
                    selector.off("Rtooltip").off(".Rtooltip");
                }
            };

            ChartTooltip.prototype._destroy = function () {
                this._unbindLiveEvent(this.targets, this.selector);
                this._removeTooltip(0);
                if (this.isContentHtml) {
                    $(this.paper.canvas).wijtooltip("destroy");
                }
            };

            ChartTooltip.prototype.hide = function (hideImmediately) {
                if (typeof hideImmediately === "undefined") { hideImmediately = false; }
                var self = this, o = self.options, hideDelay = o.hideDelay, hideDuration = o.hideDuration;
                if (hideImmediately) {
                    o.hideDelay = 0;
                    o.hideDuration = 0;
                    self._hide();
                    o.hideDelay = hideDelay;
                    o.hideDuration = hideDuration;
                } else {
                    self._hide();
                }
            };

            ChartTooltip.prototype.showAt = function (point, e) {
                this._showAt(point, e);
            };

            ChartTooltip.prototype.resetCalloutOffset = function (offset) {
                var o = this.options, currentOffset = o.calloutOffset, side = o.calloutSide, ani = o.calloutAnimation, tooltipElements = this.tooltipElements;
                if (tooltipElements.callout) {
                    if (side === "south" || side === "north") {
                        tooltipElements.callout.animate({
                            "translation": (offset - currentOffset) + ",0"
                        }, ani.duration, ani.easing);
                    } else if (side === "east" || side === "west") {
                        tooltipElements.callout.animate({
                            "translation": "0," + (offset - currentOffset)
                        }, ani.duration, ani.easing);
                    }
                }
                o.calloutOffset = offset;
            };

            ChartTooltip.prototype.destroy = function () {
                this._destroy();
            };

            ChartTooltip.prototype.getOptions = function () {
                return this.options;
            };

            ChartTooltip.prototype.setTargets = function (targets) {
                this.targets = targets;
                this._bindLiveEvent(targets);
            };

            ChartTooltip.prototype.setSelector = function (selector) {
                this.selector = selector;
                this._bindLiveEventBySelector(selector);
            };

            ChartTooltip.prototype.setOptions = function (opts) {
                $.extend(true, this.options, opts);
            };

            ChartTooltip.animations = {
                fade: function (options) {
                    var eles = options.context;
                    if (options.show) {
                        eles.attr({ "opacity": 0 });
                        eles.wijAnimate({ "opacity": 1 }, options.duration, options.easing);
                    } else {
                        eles.wijAnimate({ "opacity": 0 }, options.duration, options.easing);
                    }
                }
            };
            return ChartTooltip;
        })();
        chart.ChartTooltip = ChartTooltip;

        //for original API
        Raphael.fn.tooltip = { animations: ChartTooltip.animations };

        /** @ignore */
        var AdjustLabel = (function () {
            function AdjustLabel(bBox) {
                this.labels = [];
                this.crossLabels = {};
                this.bBox = bBox;
            }
            AdjustLabel.prototype.push = function (label) {
                var bBox = label.wijGetBBox();
                this.labels.push({
                    ele: label,
                    x: bBox.x,
                    y: bBox.y,
                    width: bBox.width,
                    height: bBox.height,
                    overlaps: [],
                    bakBBox: bBox
                });
            };

            AdjustLabel.prototype.pushCross = function (idx1, idx2) {
                var label1, label2, dx, dy, tmp;
                if (!this.crossLabels[Raphael.format("{0}-{1}", idx1, idx2)] && !this.crossLabels[Raphael.format("{0}-{1}", idx2, idx1)]) {
                    label1 = this.labels[idx1];
                    label2 = this.labels[idx2];
                    this.crossLabels[Raphael.format("{0}-{1}", idx1, idx2)] = {
                        label1: label1,
                        label2: label2,
                        dx: this._getAdjust(label1, label2, "h"),
                        dy: this._getAdjust(label1, label2, "v")
                    };
                }
            };

            AdjustLabel.prototype._detect = function (label1, label2) {
                return ((label1.x + label1.width > label2.x && label1.x < label2.x) || (label2.x + label2.width > label1.x && label2.x < label1.x)) && ((label1.y + label1.height > label2.y && label1.y < label2.y) || (label2.y + label2.height > label1.y && label2.y < label1.y));
            };

            AdjustLabel.prototype._resetOverlaps = function () {
                this.crossLabels = {};
            };

            AdjustLabel.prototype._detects = function () {
                var len = this.labels.length, label1, label2;
                for (var i = 0; i < len; i++) {
                    for (var j = i + 1; j < len; j++) {
                        label1 = this.labels[i];
                        label2 = this.labels[j];
                        if (this._detect(label1, label2)) {
                            this.pushCross(i, j);
                        }
                    }
                }
            };

            AdjustLabel.prototype._getAdjust = function (label1, label2, dir) {
                var obj = { dx: 0, needRevert: false };
                if (dir === "h") {
                    if (label1.x < label2.x) {
                        obj.dx = label1.x + label1.width - label2.x;
                    } else {
                        obj.dx = label2.x + label2.width - label1.x;
                        obj.needRevert = true;
                    }
                } else {
                    if (label1.y < label2.y) {
                        obj.dx = label1.y + label1.height - label2.y;
                    } else {
                        obj.dx = label2.y + label2.height - label1.y;
                        obj.needRevert = true;
                    }
                }
                return obj;
            };

            AdjustLabel.prototype._adjustlabel = function (label1, label2, dx, dir) {
                if (dir === "h") {
                    label1.x -= dx / 2;
                    label2.x += dx / 2;

                    if (this.bBox) {
                        if (label1.x < this.bBox.x) {
                            label1.x = this.bBox.x;
                            label2.x = label2.x + (this.bBox.x - label1.x);
                        } else if (label2.x > this.bBox.x + this.bBox.width) {
                            label2.x = this.bBox.x + this.bBox.width;
                            label1.x -= label2.x - this.bBox.x + this.bBox.width;
                        }
                    }
                } else {
                    label1.y -= dx / 2;
                    label2.y += dx / 2;
                    if (this.bBox) {
                        if (label1.y < this.bBox.y) {
                            label1.y = this.bBox.y;
                            label2.y = label2.y + (this.bBox.y - label1.y);
                        } else if (label2.y > this.bBox.y + this.bBox.height) {
                            label2.y = this.bBox.y + this.bBox.height;
                            label1.y -= label2.y - this.bBox.y + this.bBox.height;
                        }
                    }
                }
            };

            AdjustLabel.prototype._adjustInternal = function () {
                var _this = this;
                $.each(this.crossLabels, function (i, labelObj) {
                    var label1 = labelObj.label1, label2 = labelObj.label2, dx = labelObj.dx, dy = labelObj.dy;

                    if (dx.dx < dy.dx) {
                        if (dy.needRevert) {
                            _this._adjustlabel(label2, label1, dy.dx, "v");
                        } else {
                            _this._adjustlabel(label1, label2, dy.dx, "v");
                        }
                    } else {
                        if (dx.needRevert) {
                            _this._adjustlabel(label2, label1, dx.dx, "h");
                        } else {
                            _this._adjustlabel(label1, label2, dx.dx, "h");
                        }
                    }
                });
            };

            AdjustLabel.prototype._adjustTheEdge = function () {
                var _this = this;
                if (this.bBox) {
                    $.each(this.labels, function (i, label) {
                        if (label.x < _this.bBox.x) {
                            label.x = _this.bBox.x;
                        } else if (label.x + label.width > _this.bBox.x + _this.bBox.width) {
                            label.x = _this.bBox.x + _this.bBox.width - label.width;
                        }

                        if (label.y < _this.bBox.y) {
                            label.y = _this.bBox.y;
                        } else if (label.y + label.height > _this.bBox.y + _this.bBox.height) {
                            label.y = _this.bBox.y + _this.bBox.height - label.height;
                        }
                    });
                }
            };

            AdjustLabel.prototype._translateLabels = function () {
                $.each(this.labels, function (i, label) {
                    if (label.x !== label.bakBBox.x) {
                        label.ele.attr("x", label.x + label.width / 2);
                        label.bakBBox.x = label.x;
                    }

                    if (label.y !== label.bakBBox.y) {
                        label.ele.attr("y", label.y + label.height / 2);
                        label.bakBBox.y = label.y;
                    }
                });
            };

            AdjustLabel.prototype.adjust = function () {
                var maxCalculate = 1000;
                while (maxCalculate > 0) {
                    this._resetOverlaps();
                    this._adjustTheEdge();
                    this._detects();
                    if ($.isEmptyObject(this.crossLabels)) {
                        break;
                    }
                    maxCalculate--;
                    this._adjustInternal();
                }
                this._translateLabels();
            };
            return AdjustLabel;
        })();
        chart.AdjustLabel = AdjustLabel;

        /** @widget */
        var wijchartcore = (function (_super) {
            __extends(wijchartcore, _super);
            function wijchartcore() {
                _super.apply(this, arguments);
                this.innerState = {};
            }
            wijchartcore.prototype._setOption = function (key, value) {
                var self = this, o = self.options, ev = null, len = 0, idx = 0, oldXMajorFactor = o.axis.x.tickMajor.factor, oldXMinorFactor = o.axis.x.tickMinor.factor, oldYMajorFactor, oldYMinorFactor, bakYAxis, newYAxis, hoverStyleLen, baseAxis = wijchartcore.prototype.options.axis, oldYAxis, axisVal;

                /*
                if (key === "dataSource" || key === "data") {
                self.seriesTransition = true;
                o.dataSource = value;
                //restore the binded data
                if (self.seriesList) {
                o.seriesList = $.arrayClone(self.seriesList);
                }
                self._init();
                }
                */
                if (key === "dataSource") {
                    self.seriesTransition = true;
                    o.dataSource = value;

                    //restore the binded data
                    if (self.seriesList) {
                        o.seriesList = $.arrayClone(self.seriesList);
                    }
                    self._init();
                } else if (key === "data") {
                    self.seriesTransition = true;
                    o.data = value;

                    //restore the binded data
                    if (self.seriesList) {
                        o.seriesList = $.arrayClone(self.seriesList);
                    }
                    self._init();
                } else if (key === "seriesList") {
                    if (!value) {
                        value = [];
                    }

                    ev = $.Event("beforeserieschange");
                    if (self._trigger("beforeSeriesChange", ev, {
                        oldSeriesList: o.seriesList,
                        newSeriesList: value
                    }) === false) {
                        return false;
                    }
                    o.seriesList = value;
                    self.seriesList = $.arrayClone(value);
                    self._trigger("seriesChanged", null, value);
                    self.seriesTransition = true;
                    self._seriesListSeted();
                    self._init();
                } else {
                    if ($.isPlainObject(o[key])) {
                        if (key === "axis") {
                            if ($.isArray(o.axis.y)) {
                                bakYAxis = $.arrayClone([].concat(o.axis.y));
                            } else {
                                bakYAxis = $.extend(true, {}, o.axis.y);
                            }
                        }

                        //extend the axis from base chartcore.
                        if (key === "axis") {
                            //extend axis value first to prevent modify original data.
                            axisVal = $.extend(true, {}, value);

                            //if (!$.isArray(axisVal.y))
                            //    axisVal.y = [axisVal.y]; // make 'y' multiaxis automatically
                            //if min/max value is set, set autoMin and autoMax to false.
                            self._verifyAxisAutoMinMax(axisVal);
                            $.extend(true, o.axis.x, axisVal.x || {});
                            if ($.isArray(o.axis.y) || $.isArray(axisVal.y)) {
                                oldYAxis = {};
                            } else {
                                oldYAxis = o.axis.y;
                            }
                            if ($.isArray(axisVal.y)) {
                                $.each(axisVal.y, function (i, _yaxis) {
                                    axisVal.y[i] = $.extend(true, {}, baseAxis.y, oldYAxis, _yaxis);
                                });
                                o.axis.y = axisVal.y;
                            } else {
                                o.axis.y = $.extend(true, {}, baseAxis.y, oldYAxis, axisVal.y);
                            }
                        } else {
                            $.extend(true, o[key], value);
                        }
                        if (key === "indicator") {
                            this._unbindCanvasEvents();
                            this._bindCanvasEvents();
                        }

                        if (key === "axis") {
                            newYAxis = o.axis.y;
                            if (o.axis.x.tickMajor.factor < 0) {
                                o.axis.x.tickMajor.factor = oldXMajorFactor;
                            }
                            if (o.axis.x.tickMinor.factor < 0) {
                                o.axis.x.tickMinor.factor = oldXMinorFactor;
                            }

                            //case origin y is object, now is object
                            if (!$.isArray(newYAxis)) {
                                if ($.isArray(bakYAxis)) {
                                    oldYMajorFactor = bakYAxis[0].tickMajor.factor;
                                    oldYMinorFactor = bakYAxis[0].tickMinor.factor;
                                } else {
                                    oldXMajorFactor = bakYAxis.tickMajor.factor;
                                    oldXMinorFactor = bakYAxis.tickMinor.factor;
                                }
                                if (o.axis.y.tickMajor && o.axis.y.tickMajor.factor !== undefined && o.axis.y.tickMajor.factor < 0) {
                                    o.axis.y.tickMajor.factor = oldYMajorFactor;
                                }
                                if (o.axis.y.tickMinor && o.axis.y.tickMinor.factor !== undefined && o.axis.y.tickMinor.factor < 0) {
                                    o.axis.y.tickMinor.factor = oldYMinorFactor;
                                }
                            } else {
                                if (!$.isArray(bakYAxis)) {
                                    bakYAxis = [bakYAxis];
                                }
                                $.each(newYAxis, function (i, yAxis) {
                                    var baky = bakYAxis[i] || {};
                                    if (baky.tickMajor && baky.tickMajor.factor && yAxis.tickMajor && yAxis.tickMajor.factor) {
                                        if (yAxis.tickMajor.factor < 0) {
                                            yAxis.tickMajor.factor = baky.tickMajor.factor;
                                        }
                                    }
                                    if (baky.tickMinor && baky.tickMinor.factor && yAxis.tickMinor && yAxis.tickMinor.factor) {
                                        if (yAxis.tickMinor.factor < 0) {
                                            yAxis.tickMinor.factor = baky.tickMinor.factor;
                                        }
                                    }
                                });
                            }
                        }
                    } else {
                        _super.prototype._setOption.call(this, key, value);
                        // o[key] = value;
                    }
                }

                if (key === "autoResize") {
                    self._unbindResizeEvent();
                    self._bindResizeEvent();
                }

                // fixed a issue that when set the disabled option,
                // because the chart is paint by
                // wij***chart plugin, and the disabled set to the plugin
                // as a value, not a refrence,
                // so the plugin's disabled value can't change
                // when set the disabled to charts.
                // now, we just repaint the chart.
                if (key === "seriesTransition" || key === "animation") {
                    //||
                    //	key === "disabled") {
                    return;
                }

                if (key === "hint") {
                    self._resetTooltip();
                    return;
                }

                len = o.seriesList.length;

                if (key === "seriesList" || key === "seriesStyles" || key === "seriesHoverStyles") {
                    //backup the styles. when drawed the charts, restore the styles.
                    if (key !== "seriesList") {
                        self._handleChartStyles();
                    }
                    self.styles = {
                        style: [].concat(o.seriesStyles.slice(0, o.seriesStyles.length)),
                        hoverStyles: [].concat(o.seriesHoverStyles.slice(0, o.seriesHoverStyles.length))
                    };
                    self._initStyles();
                }

                if (key === "seriesList" || key === "seriesHoverStyles") {
                    hoverStyleLen = o.seriesHoverStyles.length;
                    for (idx = hoverStyleLen; idx < len; idx++) {
                        o.seriesHoverStyles[idx] = o.seriesHoverStyles[idx % hoverStyleLen];
                    }
                }

                // fixed an issue that if set height and width option,
                // the chart element's height is not reset.
                if (key === "height" || key === "width") {
                    self.chartElement[key](value);
                }

                if (key === "culture" || key === "cultureCalendar") {
                    self._innerCulture = null;
                    self._resetCulture();
                }

                self.redraw();
            };

            wijchartcore.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._handleDisabledOption(true, this.chartElement);
            };

            wijchartcore.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._handleDisabledOption(false, this.chartElement);
            };

            wijchartcore.prototype._toggleDisable = function () {
                var self = this, e = self.element;
                if (self._isDisabled()) {
                    self._opacityHolder = e.css("opacity");
                    e.css("opacity", disabledCss);
                } else {
                    e.css("opacity", self._opacityHolder);
                }
            };

            wijchartcore.prototype._isTrendline = function (series) {
                if (series.isTrendline || series.type === ChartConsts.strTrendline) {
                    return true;
                }
                return false;
            };

            wijchartcore.prototype._preHandleSeriesData = function () {
                //handler the trendline data
                var self = this, opts = self.options, seriesList = opts.seriesList, axis = opts.axis;

                $.each(seriesList, function (i, series) {
                    var data = series.data, valuesX = [], valuesY = [], length, k, innerData;

                    if (!self._isTrendline(series)) {
                        return true;
                    }
                    if (data.xy && $.isArray(data.xy) && data.xy.length) {
                        length = data.xy.length;
                        while (k < length) {
                            valuesX.push(data.xy[k++]);
                            valuesY.push(data.xy[k++]);
                        }
                        data.x = valuesX;
                        data.y = valuesY;
                    } else if (!data.x) {
                        valuesX = [];

                        $.each(valuesY, function (i) {
                            valuesX.push(i);
                        });

                        data.x = valuesX;
                    }
                    try  {
                        innerData = ChartDataUtil.processValues(data.x, data.y, series.fitType, axis.x.autoMin, axis.x.autoMax, axis.x.min, axis.x.max, series.order, series.sampleCount, series.display, undefined);
                    } catch (e) {
                        innerData = undefined;
                    }
                    if (innerData === undefined) {
                        series.isValid = false;
                    } else {
                        series.isValid = true;
                        series.innerData = innerData;
                    }
                });
            };

            wijchartcore.prototype._seriesListSeted = function () {
            };

            wijchartcore.prototype._initStyles = function () {
                var o = this.options, styles = o.seriesStyles, hoverStyles = o.seriesHoverStyles, stylesLen, seriesLen, hoverStylesLen, i;

                if (o.seriesList) {
                    seriesLen = o.seriesList.length || 0;
                }

                if (o.seriesStyles) {
                    stylesLen = o.seriesStyles.length || 0;
                }

                if (o.seriesHoverStyles) {
                    hoverStylesLen = o.seriesHoverStyles.length || 0;
                }

                if (seriesLen > stylesLen && stylesLen) {
                    for (i = stylesLen; i < seriesLen; i++) {
                        styles[i] = styles[i % stylesLen];
                    }
                }

                if (seriesLen > hoverStylesLen && hoverStylesLen) {
                    for (i = hoverStylesLen; i < seriesLen; i++) {
                        hoverStyles[i] = hoverStyles[i % hoverStylesLen];
                    }
                }
            };

            wijchartcore.prototype._verifyAxisAutoMinMax = function (axis) {
                var isNullOrUndefined = function (value) {
                    return value === null || typeof value === "undefined";
                };
                if (axis.x) {
                    if (!isNullOrUndefined(axis.x.min)) {
                        axis.x.autoMin = false;
                    } else {
                        axis.x.autoMin = true;
                    }
                    if (!isNullOrUndefined(axis.x.max)) {
                        axis.x.autoMax = false;
                    } else {
                        axis.x.autoMax = true;
                    }
                }
                if (axis.y) {
                    if ($.isArray(axis.y)) {
                        $.each(axis.y, function (i, yaxis) {
                            if (!isNullOrUndefined(yaxis.min)) {
                                yaxis.autoMin = false;
                            } else {
                                yaxis.autoMin = true;
                            }
                            if (!isNullOrUndefined(yaxis.max)) {
                                yaxis.autoMax = false;
                            } else {
                                yaxis.autoMax = true;
                            }
                        });
                    } else {
                        var yAxis = axis.y;
                        if (!isNullOrUndefined(yAxis.min)) {
                            yAxis.autoMin = false;
                        } else {
                            yAxis.autoMin = true;
                        }
                        if (!isNullOrUndefined(yAxis.max)) {
                            yAxis.autoMax = false;
                        } else {
                            yAxis.autoMax = true;
                        }
                    }
                }
            };

            wijchartcore.prototype._addChartVisibilityObserver = function () {
                var self = this, ele = self.element;

                if (ele.is(":hidden") && ele.wijAddVisibilityObserver) {
                    if (ele.hasClass("wijmo-wijobserver-visibility")) {
                        return;
                    }

                    ele.wijAddVisibilityObserver(function () {
                        self.redraw();
                        if (self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijchart");
                }
            };

            wijchartcore.prototype._create = function () {
                var self = this, o = self.options, width = o.width || self.element.width(), height = o.height || self.element.height(), newEle = null, canvas;

                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }

                //if min/max value is set, set autoMin and autoMax to false.
                self._verifyAxisAutoMinMax(o.axis);

                self.updating = 0;
                self.innerState = {};
                self.axisCompass = {};

                self._addChartVisibilityObserver();

                // Add for parse date options for jUICE. D.H
                // TO DO
                if ($.isFunction(window["wijmoASPNetParseOptions"])) {
                    window["wijmoASPNetParseOptions"](o);
                }

                // backup the styles. when drawed the charts, restore the styles.
                // when postback the styles, if doesn't clone the styles,
                // the serverside will get the extended styles. when the add a series data,
                // the extend style will wrong.
                self.styles = {
                    style: [].concat(o.seriesStyles.slice(0, o.seriesStyles.length)),
                    hoverStyles: [].concat(o.seriesHoverStyles.slice(0, o.seriesHoverStyles.length))
                };

                if (o.hint && typeof o.hint.content === "string" && window[o.hint.content]) {
                    o.hint.content = window[o.hint.content];
                }
                if (o.hint && typeof o.hint.title === "string" && window[o.hint.title]) {
                    o.hint.title = window[o.hint.title];
                }

                self.legendEles = [];
                self.axisEles = [];
                self.legends = [];
                self.legendIcons = [];
                self.legendDots = [];
                self.chartLabelEles = [];
                self.seriesEles = [];

                if (self.element.length > 0) {
                    if (self.element.is("table")) {
                        self._parseTable();
                        newEle = $("<div></div>");

                        if (width) {
                            newEle.css("width", width);
                        }

                        if (height) {
                            newEle.css("height", height);
                        }

                        self.element.after(newEle);
                        self.chartElement = newEle;
                    } else {
                        self.chartElement = self.element;
                    }

                    self.chartElement.addClass("ui-widget");

                    try  {
                        canvas = Raphael(self.chartElement[0], width, height);
                    } catch (e) {
                        var displayCss = self.chartElement.css("display");
                        newEle = $("<div></div>").insertBefore(self.chartElement).append(self.chartElement);
                        self.chartElement.addClass("ui-helper-hidden-accessible").appendTo($('body'));
                        if (displayCss === "none") {
                            self.chartElement.css("display", "block");
                        }
                        canvas = Raphael(self.chartElement[0], width, height);
                        self.chartElement.appendTo(newEle).unwrap().removeClass("ui-helper-hidden-accessible");
                        if (displayCss === "none") {
                            self.chartElement.css("display", "none");
                        }
                    }
                    self.canvas = canvas;

                    //add comments to fix tfs issue 27816, if element's height is not set,
                    //element's height will be 4px larger than canvas's,
                    //so set height to element is height is 0;
                    if (height === 0 && o.height !== 0) {
                        self.element.height(canvas.height);
                    }

                    // end comments.
                    // add custom attribute to canvas
                    // fixed the issue 20422 by dail on 2012-3-12, If user set
                    // rotation and scale. the transform will only effect on scale.
                    canvas.customAttributes.rotation = function (num) {
                        //return {transform: "...R" + num};
                        this.transform("...R" + num);
                    };
                    canvas.customAttributes.scale = function (num) {
                        //return {transform: "...S" + num};
                        this.transform("...S" + num);
                    };
                    canvas.customAttributes.translation = function (x, y) {
                        //return {transform: Raphael.format("...T{0},{1}", x, y)};
                        this.transform(Raphael.format("...T{0},{1}", x, y));
                    };

                    // end
                    self._bindLiveEvents();
                    _super.prototype._create.call(this);
                }
            };

            wijchartcore.prototype._handleChartStyles = function () {
                this._extendArrayFromBase("seriesStyles");
                this._extendArrayFromBase("seriesHoverStyles");

                var o = this.options, defFill = this._getDefFill();
                $.each(o.seriesStyles, function (idx, style) {
                    if (!style.fill) {
                        style.fill = defFill[idx];
                    }
                });
            };

            wijchartcore.prototype._extendArrayFromBase = function (optionName) {
                var result = $.extend(true, [], wijchartcore.prototype.options[optionName], this.options[optionName]);

                this.options[optionName] = result;
            };

            wijchartcore.prototype._getDefFill = function () {
                var defFill = [
                    "#00cc00",
                    "#0099cc",
                    "#0055cc",
                    "#2200cc",
                    "#8800cc",
                    "#d9007e",
                    "#ff0000",
                    "#ff6600",
                    "#ff9900",
                    "#ffcc00",
                    "#ffff00",
                    "#ace600"
                ];
                return defFill;
            };

            wijchartcore.prototype._getCulture = function (name) {
                if (!this._innerCulture) {
                    this._resetCulture(name);
                }
                return this._innerCulture;
            };
            wijchartcore.prototype._resetCulture = function (culture) {
                var cal = $.wijGetCulture(culture || this.options.culture, this.options.cultureCalendar);
                this._innerCulture = cal;
            };

            wijchartcore.prototype._handleDisabledOption = function (disabled, element) {
                var self = this;
                if (disabled) {
                    if (!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv(element);
                    }
                    self.disabledDiv.appendTo("body");
                } else {
                    if (self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                    }
                }
            };

            wijchartcore.prototype._createDisabledDiv = function (outerEle) {
                var self = this, o = self.options, ele = outerEle || self.element, eleOffset = ele.offset(), disabledWidth = o.width || ele.outerWidth(), disabledHeight = o.height || ele.outerHeight(), disabledDiv;

                disabledDiv = $("<div></div>").css({
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                });

                if (Raphael.vml) {
                    disabledDiv.addClass(o.wijCSS.stateDisabled).css("background-color", "#fff");
                }

                return disabledDiv;
            };

            wijchartcore.prototype._bindData = function () {
                var _this = this;
                var self = this, o = self.options, dataSource = o.dataSource, seriesList = o.seriesList, shareData = o.data, cacheObj = {};

                $.each(seriesList, function (i, series) {
                    var ds = series.dataSource || dataSource;

                    if (ds && series.data || series.type === "sharedPie") {
                        _this._bindSeriesData(ds, series, cacheObj);
                    }
                });
            };

            wijchartcore.prototype._bindSeriesData = function (ds, series, cacheObj) {
                var data = series.data, dataX = data.x, dataY = data.y, shareData = this.options.data;

                if (dataX && dataX.bind) {
                    data.xField = dataX.bind;
                    data.x = this._getBindData(ds, data.xField);
                } else if (shareData && shareData.x && shareData.x.bind) {
                    if (cacheObj.sharedXList === undefined) {
                        cacheObj.sharedXList = this._getBindData(ds, shareData.x.bind);
                    }
                    data.x = cacheObj.sharedXList;
                }
                if (dataY && dataY.bind) {
                    data.y = this._getBindData(ds, dataY.bind);
                }
            };

            wijchartcore.prototype._getBindData = function (dataSource, bind) {
                if ($.isArray(dataSource)) {
                    var arr = [];
                    $.each(dataSource, function (i, data) {
                        if (data && data[bind] !== undefined) {
                            arr.push(data[bind]);
                        }
                    });
                    return arr;
                }
                return null;
            };

            wijchartcore.prototype._hanldSharedXData = function () {
                var self = this, o = self.options, seriesList = o.seriesList, data = o.data;

                if (data) {
                    $.each(seriesList, function (i, series) {
                        var d = series.data;
                        if (d.x === undefined || d.x === null && $.isArray(data.x)) {
                            d.x = data.x;
                        }
                    });
                }
            };

            wijchartcore.prototype._init = function () {
                var self = this, o = self.options, seriesList;

                // back up the seriesList
                if (!self.rendered) {
                    self.seriesList = $.arrayClone(o.seriesList);
                }

                // bind dataSource
                self._bindData();
                self._hanldSharedXData();

                seriesList = o.seriesList.concat();
                $.each(seriesList, function (i, series) {
                    var data = series.data, idx;
                    if (typeof data === 'undefined' || data === null) {
                        idx = $.inArray(series, o.seriesList);
                        o.seriesList.splice(idx, 1);
                    }
                });
                seriesList = null;

                /*
                * o.seriesList = $.grep(o.seriesList, function(series, i) { var
                * data = series.data; if (typeof data === 'undefined' || data ===
                * null) { return false; } return true; });
                */
                if (!self.rendered && !self.updating) {
                    self._paint();
                }
                //super._init();
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijchartcore.prototype.destroy = function () {
                var self = this, o = self.options;
                self._unbindLiveEvents();
                self._clearChartElement();
                self.chartElement.removeClass("ui-widget");

                $("." + o.wijCSS.canvasObject, self.chartElement[0]).off(self.widgetName).off("." + self.widgetName);

                if (self.element !== self.chartElement) {
                    self.chartElement.remove();
                }

                self.element.empty();

                if (self.styles) {
                    self.styles = null;
                }

                // Add for fixing bug 16039
                if (self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }

                // end for bug 16039
                if (self.chartHeader) {
                    self.chartHeader.destroy();
                    self.chartHeader = null;
                }
                if (self.chartFooter) {
                    self.chartFooter.destroy();
                    self.chartFooter = null;
                }
                if (self.chartXAxis) {
                    self.chartXAxis.destroy();
                    self.chartXAxis = null;
                }
                if (self.chartYAxis) {
                    $.each(self.chartYAxis, function (idx, yAxis) {
                        yAxis.destroy();
                        yAxis = null;
                    });
                    self.chartYAxis = null;
                }
                if (self.chartLegend) {
                    self.chartLegend.destroy();
                    self.chartLegend = null;
                }

                _super.prototype.destroy.call(this);
            };

            /**
            * Returns a reference to the Raphael canvas object.
            * @returns {Raphael} Reference to raphael canvas object.
            * @example
            * $("#chartcore").wijchartcore("getCanvas")
            */
            wijchartcore.prototype.getCanvas = function () {
                return this.canvas;
            };

            /**
            * Exports the chart in a graphic format.
            * The export method only works when wijmo.exporter.chartExport's reference is on the page.
            * @remarks Default exported file type is png, possible types are: jpg, png, gif, bmp, tiff, pdf.
            * @param {string|Object} exportSettings
            * 1.The name of the exported file.
            * 2.Settings of exporting, should be conformed to wijmo.exporter.ChartExportSetting
            * @param {?string} type The type of the exported file.
            * @param {?string} pdfSettings The setting of pdf.
            * @param {?string} serviceUrl The export service url.
            * @param {?string} exportMethod with different mode,
            * 1. "Content" Sending chart markup to the service for exporting. It requires IE9 or high version installed on the service host. It has better performance than Options mode.
            * 2. "Options" Sending chart widget options to the service for exporting.
            * @example
            * $("#chartcore").wijchartcore("exportChart", "chart", "png");
            */
            wijchartcore.prototype.exportChart = function (exportSettings, type, pdfSettings, serviceUrl, exportMethod) {
            };

            /**
            * Add series point to the series list.
            * @param {number} seriesIndex The index of the series that the point will be inserted to.
            * @param {object} point The point that will be inserted to.
            * @param {Boolean} shift A value that indicates whether to shift the first point.
            */
            wijchartcore.prototype.addSeriesPoint = function (seriesIndex, point, shift) {
                var seriesList = this.options.seriesList, series = null, data = null;

                if (seriesIndex >= seriesList.length) {
                    return;
                }

                series = seriesList[seriesIndex];
                data = series.data || [];
                data.x.push(point.x);
                data.y.push(point.y);

                if (shift) {
                    data.x.shift();
                    data.y.shift();
                }

                this._setOption("seriesList", seriesList);
            };

            /**
            * Suspend automatic updates to the chart while reseting the options.
            */
            wijchartcore.prototype.beginUpdate = function () {
                var self = this;
                self.updating++;
            };

            /**
            * Restore automatic updates to the chart after the options has been reset.
            */
            wijchartcore.prototype.endUpdate = function () {
                var self = this;
                self.updating--;
                self.redraw();
            };

            /**
            * This method redraws the chart.
            * @param {?Boolean} drawIfNeeded A value that indicates whether to redraw the chart regardless of whether
            * the chart already exists. If true, then the chart is redrawn only if it was not already created. If false,
            * then the chart is redrawn, even if it already exists.
            */
            wijchartcore.prototype.redraw = function (drawIfNeeded) {
                var self = this, o = self.options, width = 0, height = 0;

                if (self.updating > 0) {
                    return;
                }

                if (drawIfNeeded && self.rendered) {
                    return;
                }

                width = o.width || self.element.width();
                height = o.height || self.element.height();

                if (width < 1 || height < 1) {
                    return;
                }

                if (!self.element.is(":hidden")) {
                    self.canvas.setSize(width, height);
                    self._paint();
                } else {
                    self._addChartVisibilityObserver();
                }
            };

            wijchartcore.prototype._parseTable = function () {
                if (!this.element.is("table")) {
                    return;
                }
                var self = this, ele = self.element, o = self.options, captions = $("caption", ele), theaders = $("thead th", ele), seriesList = [], sList = $("tbody tr", ele);

                if (captions.length) {
                    o.header = $.extend({
                        visible: true,
                        text: $.trim($(captions[0]).text())
                    }, o.header);
                    if (captions.length > 1) {
                        o.footer = $.extend({
                            visibel: true,
                            text: $.trim($(captions[1]).text())
                        }, o.footer);
                    }
                }

                // legend
                o.legend = $.extend({
                    visible: true
                }, o.legend);

                self._getSeriesFromTR(theaders, sList, seriesList);

                self.options.seriesList = seriesList;
            };

            wijchartcore.prototype._getSeriesFromTR = function (theaders, sList, seriesList) {
                var valuesX = [], val = null, series = null;

                // seriesList
                if (theaders.length) {
                    theaders.each(function () {
                        val = $.trim($(this).text());
                        valuesX.push(val);
                    });
                }
                if (sList.length) {
                    sList.each(function () {
                        var th = $("th", $(this)), label = $.trim(th.text()), valuesY = [], tds = $("td", $(this));

                        if (tds.length) {
                            tds.each(function (idx, ele) {
                                var td = $(this);
                                valuesY.push(parseFloat($.trim(td.text())));
                            });
                        }
                        series = {
                            label: label,
                            legendEntry: true,
                            data: {
                                x: valuesX,
                                y: valuesY
                            }
                        };
                        seriesList.push(series);
                    });
                }
            };

            wijchartcore.prototype._destroyRaphaelArray = function (objs) {
                if (!objs) {
                    return;
                }
                var len = objs.length, i = 0, ele, obj;

                for (; len && i < len; i++) {
                    ele = objs[i];
                    if (ele && ele[0]) {
                        obj = $(ele.node);
                        obj.unbind().removeData();
                        ele.wijRemove();
                        obj.remove();
                        obj = null;
                    }
                    objs[i] = null;
                }
            };

            wijchartcore.prototype._clearChartElement = function () {
                var self = this, fields = self.chartElement.data("fields");

                self._destroyRaphaelArray(self.breakLineEles);

                self._destroyRaphaelArray(self.chartLabelEles);

                if (self.tooltip) {
                    self.tooltip.destroy();
                    self.tooltip = null;
                }

                self.dataPoints = null;
                self.pointXs = null;
                if (fields && fields.trackers) {
                    self._destroyRaphaelArray(fields.trackers);
                    fields.trackers = null;
                }

                self.breakLineEles = [];

                self.chartLabelEles = [];

                if (fields && fields.chartElements) {
                    $.each(fields.chartElements, function (key, eles) {
                        self._destroyRaphaelArray(eles);
                    });
                    fields.chartElements = null;
                }

                if (fields && fields.seriesEles) {
                    fields.seriesEles = null;
                }

                if (self.seriesEles) {
                    self.seriesEles = [];
                }

                self.canvas.clear();
                self.innerState = null;
                self.axisInfo = null;
                self.seriesGroup = null;
                self.lastAxisOffset = null;
                self.innerState = {};
            };

            wijchartcore.prototype._text = function (x, y, text) {
                var textElement = this.canvas.text(x, y, text);

                if (this.options.disableDefaultTextStyle) {
                    textElement.node["style"].cssText = "";
                }

                return textElement;
            };

            wijchartcore.prototype._paint = function () {
                var self = this, o = self.options, element = self.element, hidden = element.css("display") === "none" || element.css("visibility") === "hidden", oldLeft, oldPosition = null;

                // ev = $.Event("beforepaint");
                if (hidden) {
                    oldLeft = element.css("left");
                    oldPosition = element.css("position");
                    element.css("left", "-10000px");
                    element.css("position", "absolute");
                    element.show();
                }

                if (element.is(":hidden")) {
                    if (hidden) {
                        element.css("left", oldLeft);
                        element.css("position", oldPosition);
                        element.hide();
                    }
                    return;
                }

                self._clearChartElement();
                if (self._trigger("beforePaint") === false) {
                    return;
                }

                // self._trigger("beforepaint", ev);
                self._initStyles();
                self._preHandleSeriesData();

                self.canvasBounds = {
                    startX: 0,
                    endX: o.width || element.width(),
                    startY: 0,
                    endY: o.height || element.height()
                };
                self._paintHeader();
                self._paintFooter();
                self._paintChartLegend();
                self._paintChartArea();

                //self._paintChartLabels();
                if (o.indicator && o.indicator.visible) {
                    if (this.pointXs) {
                        this.pointXs = this.pointXs.sort(function (a, b) {
                            return a - b;
                        });
                    }
                }
                self._paintTooltip();

                self._trigger("painted");

                self.rendered = true;

                // restore the backup options.
                if (self.styles) {
                    o.seriesStyles = self.styles.style;
                    o.seriesHoverStyles = self.styles.hoverStyles;
                }

                // restore the axis "min" and "max"
                if (o.axis && o.axis.x && self.axisInfo && self.axisInfo.x) {
                    o.axis.x.max = self.axisInfo.x.originalMax;
                    o.axis.x.min = self.axisInfo.x.originalMin;
                }

                //$.wijraphael.clearRaphaelCache();
                if (hidden) {
                    element.css("left", oldLeft);
                    element.css("position", oldPosition);
                    element.hide();
                }
            };

            // indicator tooltip
            wijchartcore.prototype._paintIndicater = function () {
            };

            wijchartcore.prototype._calculatePosition = function (compass, width, height) {
                var point = { x: 0, y: 0 }, marginX = 5, marginY = 5, canvasBounds = this.canvasBounds;
                switch (compass) {
                    case "north":
                        point.x = (canvasBounds.endX - canvasBounds.startX) / 2;
                        point.y = canvasBounds.startY + height / 2 + marginY;
                        canvasBounds.startY = canvasBounds.startY + marginY * 2 + height;
                        break;
                    case "south":
                        point.x = (canvasBounds.endX - canvasBounds.startX) / 2;
                        point.y = canvasBounds.endY - height / 2 - marginY;
                        canvasBounds.endY = canvasBounds.endY - marginY * 2 - height;
                        break;
                    case "east":
                        point.x = canvasBounds.endX - width / 2 - marginX;
                        point.y = (canvasBounds.endY - canvasBounds.startY) / 2;
                        canvasBounds.endX = canvasBounds.endX - marginX * 2 - width;
                        break;
                    case "west":
                        point.x = canvasBounds.startX + width / 2 + marginX;
                        point.y = (canvasBounds.endY - canvasBounds.startY) / 2;
                        canvasBounds.startX = canvasBounds.startX + marginX * 2 + width;
                        break;
                }
                return point;
            };

            wijchartcore.prototype._paintHeader = function () {
                var self = this, o = self.options, headerOptions = {
                    text: o.header.text,
                    textStyle: $.extend(true, {}, o.textStyle, o.header.textStyle),
                    textCSS: o.wijCSS.headerText,
                    containerStyle: o.header.style,
                    containerCSS: o.wijCSS.headerContainer,
                    compass: o.header.compass,
                    visible: o.header.visible,
                    canvasBounds: self.canvasBounds,
                    disableDefaultTextStyle: o.disableDefaultTextStyle
                }, textBBox;

                if (!self.chartHeader) {
                    self.chartHeader = new Title(this.canvas, headerOptions);
                    self.chartHeader.render();
                } else {
                    self.chartHeader.redraw(headerOptions);
                }

                self.canvasBounds = self.chartHeader.updatedCanvasBounds;
            };

            wijchartcore.prototype._paintFooter = function () {
                var self = this, o = self.options, footerOptions = {
                    text: o.footer.text,
                    textStyle: $.extend(true, {}, o.textStyle, o.footer.textStyle),
                    textCSS: o.wijCSS.footerText,
                    containerStyle: o.footer.style,
                    containerCSS: o.wijCSS.footerContainer,
                    compass: o.footer.compass,
                    visible: o.footer.visible,
                    canvasBounds: self.canvasBounds,
                    disableDefaultTextStyle: o.disableDefaultTextStyle
                }, textBBox;

                if (!self.chartFooter) {
                    self.chartFooter = new Title(this.canvas, footerOptions);
                    self.chartFooter.render();
                } else {
                    self.chartFooter.redraw(footerOptions);
                }

                self.canvasBounds = self.chartFooter.updatedCanvasBounds;
            };

            wijchartcore.prototype._getRotationByCompass = function (compass) {
                var rotation = 0;

                if (compass === "east") {
                    rotation = 90;
                } else if (compass === "west") {
                    rotation = -90;
                }

                return rotation;
            };

            wijchartcore.prototype._getLegendStyle = function (seriesStyle) {
                return seriesStyle;
            };

            // This method will replace the method "_paintLegend" until "Legend" class completed.
            wijchartcore.prototype._paintChartLegend = function () {
                var legendOptions = this._getLegendRendererOptions();

                if (this.options.legend.visible) {
                    if (!this.chartLegend) {
                        this.chartLegend = new Legend(this.canvas, legendOptions);
                        this.chartLegend.render();
                    } else {
                        this.chartLegend.redraw(legendOptions);
                    }
                    this.canvasBounds = this.chartLegend.updatedCanvasBounds;
                }
            };

            // Get options for "Legend"
            wijchartcore.prototype._getLegendRendererOptions = function () {
                var self = this, o = self.options, legend = o.legend, chartsSeries = o.seriesList, chartsSeriesStyles = o.seriesStyles, legendOptions;

                legendOptions = self._getLegendbasicInfo();
                legendOptions.legendInfoList = self._getLegendSeriesInfoList();

                if (legend.reversed) {
                    legendOptions.legendInfoList = legendOptions.legendInfoList.reverse();
                }
                $.each(legendOptions.legendInfoList, function (idx, lInfo) {
                    lInfo.legendIdx = idx;
                });

                return legendOptions;
            };

            // Get basic legend info such as canvasBounds, compass, CSS, Style, iconSize...
            // LineChart, BubbleChart and ScatterChart will overwrite this method
            // since they should set different "iconSize".
            wijchartcore.prototype._getLegendbasicInfo = function () {
                var self = this, o = self.options, legend = o.legend, legendInfo, chartsSeries = o.seriesList, chartsSeriesStyles = o.seriesStyles, legendOptions = {
                    /** base **/
                    disableDefaultTextStyle: o.disableDefaultTextStyle,
                    canvasBounds: self.canvasBounds,
                    disabled: self._isDisabled(),
                    compass: legend.compass,
                    orientation: legend.orientation,
                    legendCSS: o.wijCSS.legendContainer,
                    legendStyle: legend.style,
                    legendMargin: 2,
                    legendInfoList: [],
                    title: legend.text,
                    titleStyle: $.extend(true, {}, o.textStyle, legend.textStyle, legend.titleStyle),
                    titleCSS: o.wijCSS.legendTitle,
                    labelStyle: $.extend(true, {}, o.textStyle, legend.textStyle),
                    labelWidth: legend.textWidth,
                    labelCSS: o.wijCSS.legendText + " " + o.wijCSS.legend,
                    labelMargin: legend.textMargin,
                    labelCoverCSS: o.wijCSS.legendTextCover + " " + o.wijCSS.legend,
                    iconSize: $.extend(true, {
                        width: 22,
                        height: 10,
                        r: 0
                    }, legend.size),
                    iconCSS: o.wijCSS.legendIcon + " " + o.wijCSS.legend,
                    markerCSS: Raphael.format("{0} {1} {2}", o.wijCSS.legend, o.wijCSS.legendDot, o.wijCSS.canvasObject),
                    legendClickFunc: function (eventData) {
                        self._legendClickFunc(eventData);
                    }
                };

                return legendOptions;
            };

            wijchartcore.prototype._legendClickFunc = function (data) {
                var self = this, seriesIdx = data.seriesIdx, fields = self.chartElement.data("fields"), seriesEles = self.seriesEles, seriesEle;

                if (seriesIdx === null || seriesIdx === undefined) {
                    return;
                }

                if (fields && fields.seriesEles) {
                    seriesEles = fields.seriesEles;
                }
                seriesEle = seriesEles[seriesIdx];
                if (!seriesEle) {
                    return;
                }
                if (!data.visible) {
                    self._showSerieEles(seriesEles[seriesIdx]);
                } else {
                    self._hideSerieEles(seriesEles[seriesIdx]);
                }
                self._toggleDataBoundAnnotation(seriesIdx, !data.visible);
            };

            wijchartcore.prototype._toggleDataBoundAnnotation = function (seriesIdx, visible) {
                var fields = this.chartElement.data("fields"), boundAnnotations;
                if (fields && fields.boundAnnotations && fields.boundAnnotations[seriesIdx]) {
                    boundAnnotations = fields.boundAnnotations[seriesIdx];
                    $.each(boundAnnotations, function (key, annoUI) {
                        annoUI.toggleVisibility(visible);
                    });
                }
            };

            // Get legendInfoList from chart seriesList.
            // CompositeChart will overwrite this method since "pie" type series will contains multi legend items.
            wijchartcore.prototype._getLegendSeriesInfoList = function () {
                var self = this, o = self.options, legendInfo, chartsSeries = o.seriesList, chartsSeriesStyles = o.seriesStyles, seriesStyle, legendInfoList = [], availableSeriesIndex = 0;
                ;
                $.each(chartsSeries, function (idx, series) {
                    seriesStyle = self._getLegendStyle(chartsSeriesStyles[idx]);

                    if (series.legendEntry !== false) {
                        if (series.isTrendline) {
                            legendInfo = self._getTrendLineLegendInfoFromSeries(availableSeriesIndex, series, seriesStyle);
                        } else {
                            legendInfo = self._getLegendInfoFromSeries(availableSeriesIndex, series, seriesStyle);
                        }
                        if (legendInfo) {
                            legendInfoList.push(legendInfo);
                        }
                    }

                    if (!series.isTrendline || TrendlineRender.validateType(series.fitType)) {
                        availableSeriesIndex++;
                    }
                });

                return legendInfoList;
            };

            // Get a legendInfo from a trend line series.
            wijchartcore.prototype._getTrendLineLegendInfoFromSeries = function (seriesIdx, series, seriesStyle) {
                var iconStyle, legendSize = this.options.legend.size, legendInfo = this._getBasicLegendInfoFromSeries(seriesIdx, series, seriesStyle);

                if (series.fitType) {
                    if (!TrendlineRender.validateType(series.fitType)) {
                        return undefined;
                    }
                }

                iconStyle = legendInfo.iconStyle;

                legendInfo.icon = "line";

                legendInfo.iconSize = $.extend(true, {}, { width: 22, height: 1 }, this.options.legend.size);

                return legendInfo;
            };

            // Get legend info from a normal series (Not trendline).
            // LineChart, BubbleChart, ScatterChart and CompositieChart will overwrite this method.
            wijchartcore.prototype._getLegendInfoFromSeries = function (seriesIdx, series, seriesStyle) {
                return this._getBasicLegendInfoFromSeries(seriesIdx, series, seriesStyle);
            };

            wijchartcore.prototype._getBasicLegendInfoFromSeries = function (seriesIdx, series, seriesStyle) {
                var iconType = "rect", legendInfo, iconStyle = $.extend(true, {
                    fill: "none",
                    opacity: 1,
                    stroke: "black"
                }, seriesStyle);
                if (!(parseInt(iconStyle["stroke-width"]) === 0)) {
                    iconStyle = $.extend(iconStyle, { "stroke-width": 1 });
                }

                legendInfo = {
                    icon: iconType,
                    iconStyle: iconStyle,
                    label: series.label,
                    markers: undefined,
                    markerVisible: false,
                    markerStyle: undefined,
                    seriesVisible: !(series.visible === false),
                    legendIdx: 0,
                    seriesIdx: seriesIdx,
                    iconSize: undefined
                };

                return legendInfo;
            };

            wijchartcore.prototype._hasAxes = function () {
                if (this.widgetName === "wijpiechart") {
                    return false;
                }
                return true;
            };

            wijchartcore.prototype._applyAxisText = function (axisOptions, axisInfo) {
                var self = this, text = axisOptions.text, textBounds = null, tempText = null, textStyle = null, textMarginVer = 0, textMarginHor = 0, canvasBounds = axisInfo.bounds || self.canvasBounds;

                if (text !== null && text !== undefined && text.length > 0) {
                    tempText = self._text(-100, -100, text);
                    textStyle = $.extend(true, {}, self.options.textStyle, axisOptions.textStyle);
                    tempText.attr(textStyle);
                    textBounds = tempText.wijGetBBox();
                    if (textStyle["margin-left"]) {
                        textMarginHor += parseFloat(textStyle["margin-left"]);
                    }
                    if (textStyle["margin-top"]) {
                        textMarginVer += parseFloat(textStyle["margin-top"]);
                    }
                    if (textStyle["margin-right"]) {
                        textMarginHor += parseFloat(textStyle["margin-right"]);
                    }
                    if (textStyle["margin-bottom"]) {
                        textMarginVer += parseFloat(textStyle["margin-bottom"]);
                    }

                    switch (axisOptions.compass) {
                        case "north":
                            canvasBounds.startY += (textBounds.height + textMarginVer);
                            break;
                        case "south":
                            canvasBounds.endY -= (textBounds.height + textMarginVer);
                            break;
                        case "east":
                            canvasBounds.endX -= (textBounds.height + textMarginHor);
                            break;
                        case "west":
                            canvasBounds.startX += (textBounds.height + textMarginHor);
                            break;
                    }
                    tempText.wijRemove();
                    tempText = null;
                }

                return textBounds;
            };

            wijchartcore.prototype._isSeriesListDataEmpty = function () {
                var _this = this;
                var self = this, sl = self.options.seriesList, isEmpty = true;

                $.each(sl, function (idx, s) {
                    if (!_this._checkSeriesDataEmpty(s)) {
                        isEmpty = false;
                        return false;
                    }
                });

                return isEmpty;
            };

            wijchartcore.prototype._checkEmptyData = function (arr) {
                if (!arr || !$.isArray(arr)) {
                    return true;
                }
                return false;
            };

            wijchartcore.prototype._checkSeriesDataEmpty = function (series) {
                var checkEmptyData = this._checkEmptyData, data = series.data;
                if (!data || ((checkEmptyData(data.x) || checkEmptyData(data.y)) && checkEmptyData(data.xy))) {
                    return true;
                } else if (this._isTrendline(series) && (!series.isValid || !series.innerData)) {
                    return true;
                } else {
                    return false;
                }
            };

            wijchartcore.prototype._setTooltipContent = function (obj) {
                var self = this, tooltipObjs, title, content, tooltip = self.tooltip, hintOptions, newOptions = {}, hint = self.options.hint, isFunction = $.isFunction;
                if (tooltip) {
                    // if the chart is line chart or compositechart, the data.x value is the marker position.
                    // change the value to the x value.
                    tooltipObjs = [];
                    $.each(obj, function (i, tooltipObj) {
                        var valX = tooltipObj.valX, valY = tooltipObj.valY;
                        if (valX && valY) {
                            tooltipObjs.push($.extend({}, tooltipObj, {
                                x: valX,
                                y: valY
                            }));
                        } else {
                            tooltipObjs.push(tooltipObj);
                        }
                    });
                    hintOptions = tooltip.getOptions();
                    title = hint.title;
                    content = hint.content;

                    if (isFunction(title)) {
                        newOptions.title = function () {
                            return title.call(tooltipObjs);
                        };
                    }

                    if (isFunction(content)) {
                        newOptions.content = function () {
                            return content.call(tooltipObjs);
                        };
                    }

                    tooltip.setOptions(newOptions);
                }
            };

            wijchartcore.prototype._setTooltip = function () {
                var self = this, o = self.options, tooltip = self.tooltip, obj;

                if (tooltip) {
                    obj = {
                        closeBehavior: "none",
                        style: {
                            stroke: o.indicator.style.stroke
                        },
                        animated: false,
                        showDelay: 0,
                        hideDelay: 0,
                        windowCollisionDetection: "fit",
                        beforeShowing: function (e, d) {
                            if (this.target && self.indicatorLine) {
                                return false;
                            }
                        }
                    };
                    if (o.horizontal) {
                        obj.compass = "east";
                    }
                    tooltip.setOptions(obj);
                }
            };

            // when mouse up in plot area, reset the tooltip options.
            wijchartcore.prototype._resetTooltip = function () {
                var self = this, o = self.options, hint = o.hint, title = hint.title, content = hint.content, tooltip = self.tooltip, isFunction = $.isFunction, obj = $.extend(true, {}, this.options.hint);

                if (tooltip) {
                    obj.animated = hint.animated;
                    obj.showDelay = hint.showDelay;
                    obj.hideDelay = hint.hideDelay;
                    obj.title = hint.title;
                    obj.content = hint.content;
                    obj.closeBehavior = hint.closeBehavior || "auto";
                    obj.windowCollisionDetection = "fit";

                    if (isFunction(title)) {
                        obj.title = function () {
                            return self._getTooltipText(title, this.target);
                        };
                    }

                    if (isFunction(content)) {
                        obj.content = function () {
                            return self._getTooltipText(content, this.target);
                        };
                    }

                    obj.beforeShowing = function () {
                        self._onBeforeTooltipShowing(this);
                    };
                    tooltip.setOptions(obj);
                }
            };

            wijchartcore.prototype._fotmatTooltip = function (val) {
                var self = this;
                if (self._isDate(val)) {
                    return Globalize.format(val, "f", self._getCulture());
                } else if (!isNaN(val)) {
                    return Globalize.format(parseFloat(val), "n", self._getCulture());
                } else {
                    return val;
                }
            };

            wijchartcore.prototype._setDefaultTooltipText = function (data) {
                var label = data.label;
                if (data.lineSeries && data.lineSeries.label) {
                    label = data.lineSeries.label;
                }
                return label + ":" + this._fotmatTooltip(data.y);
            };

            wijchartcore.prototype._paintTooltip = function () {
                var self = this, o = self.options, hint = o.hint, hintEnable = !self._isDisabled() && hint.enable, hintEx = hint, title, content, isFunction = $.isFunction;

                if (hintEnable && !self.tooltip) {
                    hintEx = $.extend(true, {}, hint, {});
                    title = hint.title;
                    content = hint.content;

                    // set default hint.
                    if (!content) {
                        content = hint.content = function () {
                            var label;
                            if ($.isArray(this)) {
                                var str = "";
                                $.each(this, function (i, data) {
                                    str += self._setDefaultTooltipText(data) + "\n";
                                });
                                return str;
                            } else {
                                return self._setDefaultTooltipText(this);
                            }
                        };
                    }

                    if (isFunction(title)) {
                        hintEx.title = function () {
                            return self._getTooltipText(title, this.target);
                        };
                    }

                    if (isFunction(content)) {
                        hintEx.content = function () {
                            return self._getTooltipText(content, this.target);
                        };
                    }

                    hintEx.beforeShowing = function () {
                        self._onBeforeTooltipShowing(this);
                    };

                    self.tooltip = new ChartTooltip(self.canvas, null, hintEx);
                }
            };

            wijchartcore.prototype._getTooltipText = function (fmt, target) {
                var dataObj = $(target.node).data("wijchartDataObj"), obj = {
                    data: dataObj,
                    label: dataObj.label,
                    x: dataObj.x,
                    y: dataObj.y,
                    target: target,
                    fmt: fmt
                };
                return $.proxy(fmt, obj)();
            };

            wijchartcore.prototype._onBeforeTooltipShowing = function (tooltip) {
                var target = tooltip.target, hintStyle = this.options.hint.style;

                if (target) {
                    tooltip.options.style.stroke = hintStyle.stroke || target.attrs.stroke || target.attrs.fill;
                }
            };

            wijchartcore.prototype._paintChartArea = function () {
                var self = this, o = self.options, axisOption = o.axis, axisTextOffset = 2, xTextBounds = null, yTextBounds = null, extremeValue = {}, maxtries = 5, offsetX = 0, offsetY = 0, isMultiYAxis = $.isArray(axisOption.y), yAxisCount = 0, yIdx, yaxisOpt, key, xOrigin, yOrigin;

                var xAxisInfo, yAxisInfoSingle, yAxisInfo;

                self._applyMargins();

                self.isMultiYAxis = isMultiYAxis;

                if (self._isSeriesListDataEmpty()) {
                    return;
                }

                if (isMultiYAxis) {
                    $.each(axisOption.y, function (i, yaxis) {
                        axisOption.y[i] = $.extend(true, new wijchartcore_options().axis.y, yaxis);
                    });
                }

                if (self._hasAxes()) {
                    // Restore from cache.
                    if (self.innerState.axisInfo) {
                        self.axisInfo = self.innerState.axisInfo;
                        self.canvasBounds = self.innerState.canvasBounds;
                    } else {
                        xTextBounds = self._applyAxisText(axisOption.x, {});

                        xAxisInfo = {
                            id: "x",
                            tprec: 0,
                            isTime: false,
                            height: 0,
                            offset: 0,
                            vOffset: 0,
                            max: 0,
                            min: 0,
                            originalMax: 0,
                            originalMin: 0,
                            majorTickRect: null,
                            minorTickRect: null,
                            annoFormatString: null,
                            textBounds: xTextBounds,
                            axisTextOffset: axisTextOffset,
                            autoMax: true,
                            autoMin: true,
                            autoMajor: true,
                            autoMinor: true,
                            annoMethod: axisOption.x.annoMethod,
                            valueLabels: axisOption.x.valueLabels || [],
                            bounds: null
                        };

                        yAxisInfo = new Array(); // typed array of chart_axisInfo

                        self.axisInfo = {
                            x: xAxisInfo,
                            y: yAxisInfo
                        };

                        self.axisCompass[axisOption.x.compass] = true;

                        if (isMultiYAxis) {
                            $.each(axisOption.y, function (i, axisY) {
                                yTextBounds = self._applyAxisText(axisY, {});

                                yAxisInfoSingle = {
                                    id: "y" + i,
                                    height: 0,
                                    tprec: 0,
                                    isTime: false,
                                    offset: 0,
                                    vOffset: 0,
                                    max: 0,
                                    min: 0,
                                    originalMax: 0,
                                    originalMin: 0,
                                    majorTickRect: null,
                                    minorTickRect: null,
                                    annoFormatString: null,
                                    textBounds: yTextBounds,
                                    axisTextOffset: axisTextOffset,
                                    autoMax: true,
                                    autoMin: true,
                                    autoMajor: true,
                                    autoMinor: true,
                                    annoMethod: axisY.annoMethod,
                                    valueLabels: axisY.valueLabels || [],
                                    bounds: null
                                };

                                self.axisInfo.y[i.toString()] = yAxisInfoSingle;

                                if (!self.axisCompass[axisY.compass]) {
                                    self.axisCompass[axisY.compass] = true;
                                }
                            });
                        } else {
                            yTextBounds = self._applyAxisText(axisOption.y, {});
                            self.axisInfo.y["0"] = {
                                id: "y",
                                tprec: 0,
                                isTime: false,
                                offset: 0,
                                vOffset: 0,
                                max: 0,
                                min: 0,
                                originalMax: 0,
                                originalMin: 0,
                                majorTickRect: null,
                                minorTickRect: null,
                                annoFormatString: null,
                                textBounds: yTextBounds,
                                axisTextOffset: axisTextOffset,
                                autoMax: true,
                                autoMin: true,
                                autoMajor: true,
                                autoMinor: true,
                                annoMethod: axisOption.y.annoMethod,
                                valueLabels: axisOption.y.valueLabels || []
                            };

                            if (!self.axisCompass[axisOption.y.compass]) {
                                self.axisCompass[axisOption.y.compass] = true;
                            }
                        }

                        self._getSeriesGroup(isMultiYAxis);
                        extremeValue = self._getDataExtreme(isMultiYAxis);
                        self.extremeValue = extremeValue;

                        // handle x axis.
                        if (axisOption.x.autoMin && self.axisInfo.x.autoMin) {
                            axisOption.x.min = extremeValue.txn;
                            xOrigin = axisOption.x.origin;

                            // If "min" is not set by user and "origin" is set,
                            // Compare the "origin" and the extreme value,
                            // use the less one to ensure the axis visible
                            if (!(xOrigin === null || typeof xOrigin === "undefined") && (!self.axisInfo.x.isTime) && xOrigin < axisOption.x.min) {
                                axisOption.x.min = xOrigin;
                            }
                        } else if (axisOption.x.min && self._isDate(axisOption.x.min)) {
                            // if is date time, convert to number.
                            axisOption.x.min = $.toOADate(axisOption.x.min);
                        }
                        if (axisOption.x.autoMax && self.axisInfo.x.autoMax) {
                            axisOption.x.max = extremeValue.txx;
                        } else if (axisOption.x.max && self._isDate(axisOption.x.max)) {
                            // if is date time, convert to number.
                            axisOption.x.max = $.toOADate(axisOption.x.max);
                        }

                        $.each(extremeValue.y, function (key, exval) {
                            yAxisCount++;
                        });

                        for (yIdx = 0; yIdx < (axisOption.y.length || 1); yIdx++) {
                            yaxisOpt = axisOption.y[yIdx] || axisOption.y;
                            key = yIdx.toString();
                            if (yaxisOpt.autoMin && self.axisInfo.y[key].autoMin && extremeValue.y[key]) {
                                yaxisOpt.min = extremeValue.y[key].tyn;
                                yOrigin = yaxisOpt.origin;
                                if (!(yOrigin === null || typeof yOrigin === "undefined") && (!self.axisInfo.y[key].isTime) && yOrigin < yaxisOpt.min) {
                                    yaxisOpt.min = yOrigin;
                                }
                            } else if (yaxisOpt.min && self._isDate(yaxisOpt.min)) {
                                // if is date time, convert to number.
                                yaxisOpt.min = $.toOADate(yaxisOpt.min);
                            }

                            if (yaxisOpt.autoMax && self.axisInfo.y[key].autoMax && extremeValue.y[key]) {
                                yaxisOpt.max = extremeValue.y[key].tyx || 0;
                            } else if (yaxisOpt.max && self._isDate(yaxisOpt.max)) {
                                // if is date time, convert to number.
                                yaxisOpt.max = $.toOADate(yaxisOpt.max);
                            }

                            do {
                                offsetY = self._autoPosition(self.axisInfo, axisOption, "y", key);
                                offsetX = self._autoPosition(self.axisInfo, axisOption, "x", key);

                                if (offsetY === self.axisInfo.y[key].offset && offsetX === self.axisInfo.x.offset) {
                                    maxtries = 0;
                                    break;
                                }
                                if (!isNaN(offsetX) && !isNaN(offsetY)) {
                                    if (offsetY !== self.axisInfo.y[key].offset && offsetY !== 0) {
                                        self.axisInfo.y[key].offset = offsetY;
                                        self.axisInfo.y[key].vOffset = offsetX;
                                    }
                                    if (offsetX !== self.axisInfo.x.offset && offsetX !== 0) {
                                        self.axisInfo.x.offset = offsetX;
                                        self.axisInfo.x.vOffset = offsetY;
                                    }
                                }
                                maxtries--;
                            } while(maxtries > 0);
                        }

                        self._adjustPlotArea(axisOption.x, self.axisInfo.x);
                        self._adjustPlotArea(axisOption.y, self.axisInfo.y, true);

                        self.innerState.axisInfo = self.axisInfo;
                        self.innerState.canvasBounds = self.canvasBounds;
                    }
                    self._paintAxes();
                    self._paintPlotArea();
                } else {
                    self._paintPlotArea();
                }
            };

            wijchartcore.prototype._getSeriesGroup = function (isMultiYAxis) {
                var self = this, o = self.options, group = {};

                $.each(o.seriesList, function (i, serie) {
                    if (serie.yAxis && isMultiYAxis) {
                        if (group[serie.yAxis.toString()]) {
                            group[serie.yAxis.toString()].push(serie);
                        } else {
                            group[serie.yAxis.toString()] = [serie];
                        }
                    } else {
                        if (group["0"]) {
                            group["0"].push(serie);
                        } else {
                            group["0"] = [serie];
                        }
                    }
                });
                self.seriesGroup = group;
            };

            wijchartcore.prototype._adjustPlotArea = function (axisOptions, axisInfo, isYAxis) {
                var canvasBounds = this.canvasBounds, maxKey, maxOffsets = {
                    east: Number.MIN_VALUE,
                    west: Number.MIN_VALUE,
                    south: Number.MIN_VALUE,
                    north: Number.MIN_VALUE
                };

                if (isYAxis) {
                    $.each(axisInfo, function (key, axisInf) {
                        maxKey = key;
                    });
                    $.each(axisInfo, function (key, axisInf) {
                        var opt = axisOptions[key] || axisOptions, compass = opt.compass;
                        opt.max = axisInf.max;
                        opt.min = axisInf.min;

                        switch (compass) {
                            case "north":
                                maxOffsets.north = Math.max(axisInf.offset, maxOffsets.north);
                                break;
                            case "south":
                                maxOffsets.south = Math.max(axisInf.offset, maxOffsets.south);
                                break;
                            case "east":
                                maxOffsets.east = Math.max(axisInf.offset, maxOffsets.east);
                                break;
                            case "west":
                                maxOffsets.west = Math.max(axisInf.offset, maxOffsets.west);

                                break;
                        }
                    });

                    if (maxOffsets.north !== Number.MIN_VALUE) {
                        canvasBounds.startY += maxOffsets.north;
                    }

                    if (maxOffsets.south !== Number.MIN_VALUE) {
                        canvasBounds.endY -= maxOffsets.south;
                    }

                    if (maxOffsets.east !== Number.MIN_VALUE) {
                        canvasBounds.endX -= maxOffsets.east;
                    }

                    if (maxOffsets.west !== Number.MIN_VALUE) {
                        canvasBounds.startX += maxOffsets.west;
                    }
                } else {
                    axisOptions.max = axisInfo.max;
                    axisOptions.min = axisInfo.min;

                    switch (axisOptions.compass) {
                        case "north":
                            canvasBounds.startY += axisInfo.offset;
                            break;
                        case "south":
                            canvasBounds.endY -= axisInfo.offset;
                            break;
                        case "east":
                            canvasBounds.endX -= axisInfo.offset;
                            break;
                        case "west":
                            canvasBounds.startX += axisInfo.offset;
                            break;
                    }
                }
            };

            wijchartcore.prototype._autoPosition = function (axisInfo, axisOptions, dir, key) {
                // this._adjustCartesianCompass();
                // base._autoPosition();
                return this._autoPositionCartesianAxis(axisInfo, axisOptions, dir, key);
            };

            wijchartcore.prototype._autoPositionCartesianAxis = function (axisInfo, axisOptions, dir, key) {
                var self = this, extent = null, innerAxisInfo, innerAxisOptions, oppositeAxisInfo, oppositeAxisOptions, compass, origin, max, min, lastAxisOffset = self.lastAxisOffset || {}, offset, lastOffset;

                if (dir === "y") {
                    innerAxisInfo = axisInfo.y[key];
                    innerAxisOptions = axisOptions.y[key] || axisOptions.y;
                    oppositeAxisOptions = axisOptions.x;
                    oppositeAxisInfo = axisInfo.x;
                } else {
                    innerAxisInfo = axisInfo.x;
                    innerAxisOptions = axisOptions.x;
                    oppositeAxisInfo = axisInfo.y[key];
                    oppositeAxisOptions = axisOptions.y[key] || axisOptions.y;
                }
                compass = innerAxisOptions.compass;
                origin = oppositeAxisOptions.origin;
                max = oppositeAxisInfo.max;
                min = oppositeAxisInfo.min;

                if (origin !== null && self._isDate(origin)) {
                    origin = $.toOADate(origin);
                }

                self._calculateParameters(innerAxisInfo, innerAxisOptions);
                extent = self._getMaxExtents(innerAxisInfo, innerAxisOptions);
                switch (compass) {
                    case "north":
                    case "south":
                        offset = extent.height;
                        innerAxisInfo.maxExtent = offset;

                        break;
                    case "east":
                    case "west":
                        offset = extent.width;
                        innerAxisInfo.maxExtent = offset;

                        break;
                }
                if (dir === "y" && lastAxisOffset[compass]) {
                    $.each(lastAxisOffset[compass], function (k, offsetObj) {
                        if (k !== key) {
                            lastOffset = offsetObj;
                        }
                    });
                    if (lastOffset && !innerAxisInfo.isPartAxis) {
                        innerAxisInfo.preStartOffset = lastOffset;
                        offset += (lastOffset);
                    }
                }
                if (dir === "y") {
                    if (lastAxisOffset[compass] === undefined) {
                        lastAxisOffset[compass] = {};
                    }

                    lastAxisOffset[compass][key] = offset + self._getAxisLabelBox(innerAxisOptions).width;
                    self.lastAxisOffset = lastAxisOffset;
                }

                return offset;
            };

            wijchartcore.prototype._getAxisLabelBox = function (axisOption) {
                var self = this, o = self.options, text = axisOption.text, marginTop = 0, marginRight = 0, marginLeft = 0, marginBottom = 0, textElement, bbox, isVertical = self._isVertical(axisOption.compass), textStyle = $.extend(true, {}, o.textStyle, axisOption.textStyle);

                if (textStyle["margin-top"]) {
                    marginTop = parseFloat(textStyle["margin-top"]);
                }
                if (textStyle["margin-left"]) {
                    marginLeft = parseFloat(textStyle["margin-left"]);
                }
                if (textStyle["margin-right"]) {
                    marginRight = parseFloat(textStyle["margin-right"]);
                }
                if (textStyle["margin-bottom"]) {
                    marginBottom = parseFloat(textStyle["margin-bottom"]);
                }
                textElement = self._text(0, 0, text);
                textElement.attr(textStyle);
                if (isVertical) {
                    textElement.transform("...R-90");
                }
                bbox = textElement.wijGetBBox();
                textElement.wijRemove();
                textElement = null;
                return {
                    width: bbox.width + marginLeft + marginRight,
                    height: bbox.height + marginBottom + marginTop
                };
            };

            wijchartcore.prototype._getMaxExtents = function (axisInfo, axisOptions, axisRect) {
                var self = this, o = self.options, majorTickValues = null, maxExtent = {
                    width: 0,
                    height: 0
                }, min = axisInfo.min, max = axisInfo.max, isTime = axisInfo.isTime, formatString = axisOptions.annoFormatString, is100pc = o.is100Percent, index = 0, compass = axisOptions.compass, labels = axisOptions.labels, textStyle, hasDefaultRotation = false, canvasBounds = axisInfo.bounds || self.canvasBounds, width, transform;

                axisInfo.majorTickRect = self._getTickRect(axisInfo, axisOptions, true, true, axisRect);
                axisInfo.minorTickRect = self._getTickRect(axisInfo, axisOptions, false, true, axisRect);
                majorTickValues = self._getMajorTickValues(axisInfo, axisOptions);

                //if (axisInfo.id === "x") {
                //	majorTickValues = this._adjustTickValuesForCandlestickChart(majorTickValues);
                //}
                if (!axisOptions.textVisible) {
                    return maxExtent;
                }
                if (!formatString || formatString.length === 0) {
                    formatString = axisInfo.annoFormatString;
                }

                textStyle = $.extend(true, {}, o.textStyle, axisOptions.textStyle, labels.style);
                transform = textStyle.transform;

                //why use the $.each for check the transform string?
                //maybe in the older Raphael, the transform is an array.
                // now just use update it like this.
                hasDefaultRotation = transform && /r/i.test(transform);

                //if (transform && transform.length) {
                //	$.each(transform, function (i, t) {
                //		if (t[0].toLowerCase() === "r") {
                //			hasDefaultRotation = true;
                //			return false;
                //		}
                //	});
                //}
                // hasDefaultRotation = typeof (textStyle.rotation) !== "undefined";
                textStyle = $.extend(true, textStyle, axisInfo.textStyle);
                width = canvasBounds.endX - canvasBounds.startX - axisInfo.vOffset - axisInfo.axisTextOffset;
                if (majorTickValues && majorTickValues.length) {
                    width = width / (majorTickValues.length - 1);
                    $.each(majorTickValues, function (idx, mtv) {
                        var txt, size, txtClone;

                        if (mtv < min || mtv > max) {
                            return true;
                        }

                        //if (axisOptions.annoMethod === "valueLabels") {
                        if (axisInfo.annoMethod === "valueLabels") {
                            if (mtv < 0) {
                                return true;
                            }

                            //if (index >= axisOptions.valueLabels.length) {
                            if (index >= axisInfo.valueLabels.length) {
                                return false;
                            }

                            //// mtv = axisOptions.valueLabels[index].text;
                            //mtv = axisOptions.valueLabels[index];
                            mtv = axisInfo.valueLabels[index];
                            if (mtv.text) {
                                mtv = mtv.text;
                            } else if (typeof mtv.value !== "undefined") {
                                mtv = mtv.value;
                                if (formatString && formatString.length) {
                                    // mtv = $.format(mtv, formatString);
                                    mtv = Globalize.format(mtv, formatString, self._getCulture());
                                }
                            }
                        } else if (axisInfo.annoMethod === "values") {
                            //} else if (axisOptions.annoMethod === "values") {
                            //if (axisInfo.id === "x") {
                            //	mtv = self._getXTickText(mtv);
                            //}
                            if (formatString && formatString.length) {
                                if (isTime) {
                                    mtv = $.fromOADate(mtv);
                                }

                                // mtv = $.format(mtv, formatString);
                                mtv = Globalize.format(mtv, formatString, self._getCulture());
                            } else if (is100pc && axisInfo.id === "y") {
                                // mtv = $.format(mtv, "p0");
                                mtv = Globalize.format(mtv, "p0", self._getCulture());
                            }
                        }

                        if (labels.width) {
                            txt = self.canvas.wrapText(-100, -100, mtv, labels.width, labels.textAlign, textStyle);
                        } else {
                            txt = self._text(-100, -100, mtv).attr(textStyle);
                        }

                        size = txt.wijGetBBox();

                        if (!self._isVertical(compass) && !hasDefaultRotation && axisInfo.annoMethod === "valueLabels") {
                            //axisOptions.annoMethod === "valueLabels") {
                            if (size.width > width) {
                                txt.attr({ transform: "r-45" });
                                size = txt.wijGetBBox();

                                /*
                                * if (!txt.attr().rotation) { txt.attr({ rotation:
                                * -45 }); textStyle.rotation = -45;
                                * axisInfo.textStyle = { rotation: -45 }; size =
                                * txt.wijGetBBox(); }
                                */
                                if (idx === 0) {
                                    textStyle.transform = "r-45";
                                    axisInfo.textStyle = {
                                        transform: "r-45"
                                    };
                                    txtClone = txt.clone();
                                    txtClone.attr({ transform: "r0" });
                                    size = txtClone.wijGetBBox();
                                    if (Math.sqrt(2) * size.height > width) {
                                        txt.attr({ transform: "r-90" });

                                        // textStyle.transform.push(["r", -90]);
                                        textStyle.transform = "r-90";
                                        axisInfo.textStyle = {
                                            transform: "r-90"
                                        };
                                    }
                                    txtClone.wijRemove();
                                    txtClone = null;
                                    size = txt.wijGetBBox();
                                }
                            }
                            /*
                            * if (idx === 0 && txt.attr().rotation &&
                            * txt.attr().rotation === -45) { txtClone =
                            * txt.clone(); txtClone.attr({ rotation: 0 }); size =
                            * txtClone.wijGetBBox(); if (Math.sqrt(2) * size.height >
                            * width) { txt.attr({ rotation: -90 });
                            * textStyle.rotation = -90; axisInfo.textStyle = {
                            * rotation: -90 }; } txtClone.wijRemove(); size =
                            * txt.wijGetBBox(); }
                            */
                        }
                        txt.wijRemove();
                        txt = null;
                        if (size.width > maxExtent.width) {
                            maxExtent.width = size.width;
                        }

                        if (size.height > maxExtent.height) {
                            maxExtent.height = size.height;
                        }

                        index++;
                    });
                }
                if (maxExtent.width < labels.width) {
                    maxExtent.width = labels.width;
                }

                axisInfo.labelWidth = maxExtent.width;
                return maxExtent;
            };

            wijchartcore.prototype._getMajorTickValues = function (axisInfo, axisOptions) {
                var rc = [], autoTick = axisOptions.autoMajor, unitTick = axisOptions.unitMajor, max, min, valueLabels = axisInfo.valueLabels;
                if (valueLabels && valueLabels.length > 0) {
                    $.each(valueLabels, function (idx, valueLabel) {
                        if (typeof valueLabel.text !== "undefined" || typeof valueLabel.value !== "undefined") {
                            return false;
                        }
                        if (typeof valueLabel === "string") {
                            valueLabels[idx] = {
                                text: valueLabel,
                                gridLine: false
                            };
                        } else {
                            valueLabels[idx] = {
                                value: valueLabel,
                                gridLine: false
                            };
                        }
                    });
                }

                //if (axisOptions.annoMethod === "valueLabels" &&
                if (axisInfo.annoMethod === "valueLabels" && valueLabels && valueLabels.length > 0 && typeof valueLabels[0].value !== "undefined") {
                    rc = this._getSortedDataValues(axisInfo, axisOptions);
                    return rc;
                }
                if (axisInfo.id === "x") {
                    max = autoTick ? axisInfo.max : axisInfo.originalMax;
                    min = autoTick ? axisInfo.min : axisInfo.originalMin;
                } else {
                    max = axisInfo.max;
                    min = axisInfo.min;
                }
                rc = this._getTickValues(max, min, unitTick, axisInfo.tprec, !axisInfo.isTime, autoTick);
                return rc;
            };

            wijchartcore.prototype._getSortedDataValues = function (axisInfo, axisOptions) {
                var self = this, rc = [], valueLabels = axisInfo.valueLabels;

                //valueLabels = axisOptions.valueLabels;
                $.each(valueLabels, function (idx, label) {
                    var val = label.value;
                    if (self._isDate(val)) {
                        rc.push($.toOADate(val));
                    } else if (typeof val === 'number') {
                        rc.push(val);
                    } else {
                        rc.push(idx);
                    }
                    // if (self._isDate(label)) {
                    // rc.push($.toOADate(label));
                    // } else if (typeof label === 'number') {
                    // rc.push(label);
                    // } else {
                    // rc.push(idx);
                    // }
                });

                // TODO: ignore blank labels.
                return rc;
            };

            wijchartcore.prototype._getMinorTickValues = function (axisInfo, axisOptions) {
                var rc = [], autoTick = axisOptions.autoMinor, unitTick = axisOptions.unitMinor, max, min;

                if (axisInfo.id === "x") {
                    max = autoTick ? axisInfo.max : axisInfo.originalMax;
                    min = autoTick ? axisInfo.min : axisInfo.originalMin;
                } else {
                    max = axisInfo.max;
                    min = axisInfo.min;
                }
                rc = this._getTickValues(max, min, unitTick, axisInfo.tprec, !axisInfo.isTime, autoTick);
                return rc;
            };

            wijchartcore.prototype._getTickValues = function (smax, smin, unit, tickprec, round, autoTick) {
                var self = this, vals = [], value, sminOriginal = smin, smaxOriginal = smax, i = 0, xs = 0, imax = 0, imin = 0, n = 0, smin2 = 0;

                try  {
                    if (unit === 0) {
                        vals = [smax, smin];
                    } else {
                        if (autoTick) {
                            if (tickprec + 1 < 0) {
                                tickprec = -1;
                            } else if (tickprec + 1 > 15) {
                                tickprec = 14;
                            }
                            smin2 = $.round(ChartDataUtil.signedCeiling(smin / unit) * unit, tickprec + 1);
                            if (smin2 < smax) {
                                smin = smin2;
                            }
                            imax = parseInt($.round(smax / unit, 5).toString(), 10);
                            imin = parseInt($.round(smin / unit, 5).toString(), 10);
                            n = parseInt((imax - imin + 1).toString(), 10);
                            if (n > 1) {
                                xs = imin * unit;
                                if (xs < smin) {
                                    n--;
                                    smin += unit;
                                }
                                xs = smin + (n - 1) * unit;
                                if (xs > smax) {
                                    n--;
                                }
                            }
                            if (n < 1) {
                                n = 2;
                                smin = sminOriginal;
                                unit = smax - smin;
                            }
                        } else {
                            n = parseInt(((smax - smin) / unit + 1).toString(), 10);
                            if (n > 1) {
                                xs = smin + (n - 1) * unit;
                                if (xs > smax) {
                                    n--;
                                }
                            }
                            if (n < 1) {
                                n = 2;
                                unit = smax - smin;
                            }
                        }

                        for (i = 0; i < n; i++) {
                            if (round) {
                                // vals[i] = $.round(smin + i * unit, tickprec + 1);
                                if (autoTick) {
                                    value = $.round(smin + i * unit, tickprec + 1);
                                } else {
                                    value = smin + i * unit;
                                }
                            } else {
                                value = smin + i * unit;
                            }
                            if (value <= smaxOriginal && value >= sminOriginal) {
                                vals.push(value);
                            }
                        }
                    }
                } catch (error) {
                }

                return vals;
            };

            // to do
            wijchartcore.prototype._getTickRect = function (axisInfo, axisOptions, isMajor, inAxisRect, axisRect) {
                var compass = axisOptions.compass, sizeFactor = 0, tick = null, majorSizeFactor = 3, minorSizeFactor = 2, thickness = 2, majorFactor = axisOptions.tickMajor.factor, minorFactor = axisOptions.tickMinor.factor, r = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
                if (isMajor) {
                    tick = axisOptions.tickMajor.position;
                    majorFactor = majorFactor > 0 ? majorFactor : 1;
                    sizeFactor = (majorSizeFactor * majorFactor);
                } else {
                    tick = axisOptions.tickMinor.position;
                    minorFactor = minorFactor > 0 ? minorFactor : 1;
                    sizeFactor = (minorSizeFactor * minorFactor);
                }
                if (tick === "none" || (tick === "inside" && inAxisRect)) {
                    sizeFactor = 0;
                }

                // if(isVertical) {
                if (compass === "east" || compass === "west") {
                    r = {
                        x: 0,
                        y: -1,
                        width: sizeFactor * thickness,
                        height: thickness
                    };
                    if ((compass === "east" && (tick === "outside" || (tick === "cross" && inAxisRect))) || (compass === "west" && tick === "inside")) {
                        // r.x = axisRect.x;
                        // if(inAxisRect) {
                        // r.x += axisRect.width;
                        // }
                        // else {
                        // r.width += axisRect.width;
                        // }
                        r.width += 2; // default value of axisRect is 2.
                    } else {
                        // r.x = axisRect.x - sizeFactor * thickness;
                        if (!inAxisRect) {
                            if (tick === "cross") {
                                r.width <<= 1;
                            }

                            // r.width += axisRect.width;
                            r.width += 2;
                        }
                    }
                } else {
                    r = {
                        x: -1,
                        y: 0,
                        width: thickness,
                        height: sizeFactor * thickness
                    };
                    if ((compass === "south" && (tick === "outside" || (tick === "corss" && inAxisRect))) || (compass === "north" && tick === "inside")) {
                        // r.y = axisRect.y;
                        // if(inAxisRect) {
                        // r.y += axisRect.height;
                        // }
                        // else {
                        // r.height += axisRect.height;
                        // }
                        r.height += 2;
                    } else {
                        // r.y = axisRect.y - sizeFactor * thickness;
                        if (!inAxisRect) {
                            if (tick === "cross") {
                                r.height <<= 1;
                            }

                            // r.height += axisRect.height;
                            r.height += 2;
                        }
                    }
                }
                return r;
            };

            wijchartcore.prototype._applyMargins = function () {
                var self = this, o = self.options, canvasBounds = self.canvasBounds;

                canvasBounds.startX += o.marginLeft;
                canvasBounds.endX -= o.marginRight;
                canvasBounds.startY += o.marginTop;
                canvasBounds.endY -= o.marginBottom;
            };

            wijchartcore.prototype._paintAxes = function () {
                // paint x axis
                var self = this, axis = self.options.axis, axisInfo = self.axisInfo, ox = axis.x, oy = axis.y, x = axisInfo.x, y = axisInfo.y, axisElements, movingElements;

                axisElements = self._paintChartAxis(ox, x, self.chartXAxis);
                if (!self.chartXAxis) {
                    self.chartXAxis = axisElements.axisRenderer;
                }
                movingElements = axisElements.movingElements;

                $.each(y, function (key, yaxis) {
                    var opt = oy[key] || oy;
                    if (opt.origin !== null) {
                        self._translateAxisIfNeeded(movingElements, ox.compass, opt.origin, opt.compass, yaxis.max, yaxis.min);
                    }
                });

                //			if (oy.origin !== null) {
                //				self._translateAxisIfNeeded(axisElements, ox.compass,
                //					oy.origin, oy.compass, y.max, y.min);
                //			}
                $.each(y, function (key, yaxis) {
                    var opt = oy[key] || oy;
                    if (!self.chartYAxis) {
                        self.chartYAxis = [];
                    }

                    axisElements = self._paintChartAxis(opt, yaxis, self.chartYAxis[key]);
                    if (!self.chartYAxis[key]) {
                        self.chartYAxis[key] = axisElements.axisRenderer;
                    }
                    movingElements = axisElements.movingElements;

                    if (ox.origin !== null) {
                        self._translateAxisIfNeeded(movingElements, opt.compass, ox.origin, ox.compass, x.max, x.min);
                    }
                });
            };

            wijchartcore.prototype._getChartAxisRenderOptions = function (axisOption, axisInfo) {
                var self = this, o = self.options, ai = axisInfo, ao = axisOption, compass = ao.compass, isVertical = compass === "east" || compass === "west", formatString = ao.annoFormatString, xAxisRenderOptions;

                if (!formatString || formatString.length === 0) {
                    formatString = ai.annoFormatString;
                }

                xAxisRenderOptions = {
                    /** base */
                    disableDefaultTextStyle: o.disableDefaultTextStyle,
                    canvasBounds: ai.bounds || self.canvasBounds,
                    /** axis options */
                    axisStyle: ao.style,
                    axisCSS: o.wijCSS.axis,
                    origin: ao.origin,
                    max: ai.max,
                    min: ai.min,
                    originalMax: ai.originalMax,
                    originalMin: ai.originalMin,
                    annoMethod: ai.annoMethod,
                    annoFormatString: formatString,
                    visible: ao.visible,
                    compass: compass,
                    valueLabels: ai.valueLabels,
                    axisMaxLabelSize: ai["maxExtent"],
                    axisOffset: (!isVertical || ai.isPartAxis || !ai.preStartOffset) ? 0 : ai.preStartOffset,
                    /** axis title options */
                    titleAlignment: ao.alignment,
                    titleVisible: ao.textVisible,
                    titleText: ao.text,
                    titleStyle: $.extend(true, {}, o.textStyle, ao.textStyle),
                    titleCSS: o.wijCSS.axisText,
                    /** axis label options */
                    axisLabelOffset: ai.axisTextOffset,
                    labelCSS: o.wijCSS.axisLabel,
                    labelStyle: $.extend(true, {}, o.textStyle, ao.textStyle, ao.labels.style, ai["textStyle"]),
                    labelOptions: {
                        textAlign: ao.labels.textAlign,
                        width: (ao.labels.width ? ai.labelWidth : null)
                    },
                    /** axis tick and grid options */
                    tickCSS: o.wijCSS.axisTick,
                    gridCSS: o.wijCSS.axisGridLine,
                    autoMajor: ao.autoMajor,
                    autoMinor: ao.autoMinor,
                    unitMajor: ao.unitMajor,
                    unitMinor: ao.unitMinor,
                    gridMajor: ao.gridMajor,
                    gridMinor: ao.gridMinor,
                    tickMajor: ao.tickMajor,
                    tickMinor: ao.tickMinor,
                    /** Others */
                    is100Percent: o.is100Percent && ai.id === "y",
                    culture: o.culture,
                    cultureCalendar: o.cultureCalendar,
                    tprec: ai.tprec,
                    isTime: ai.isTime
                };

                return xAxisRenderOptions;
            };

            wijchartcore.prototype._paintChartAxis = function (axisOption, axisInfo, renderer) {
                var self = this, axisMovingElements = [], xAxisRenderOptions, breakLineEle, startX, startY;

                xAxisRenderOptions = self._getChartAxisRenderOptions(axisOption, axisInfo);

                if (!renderer) {
                    renderer = new Axis(self.canvas, xAxisRenderOptions);
                    renderer.render();
                } else {
                    renderer.redraw(xAxisRenderOptions);
                }

                if (renderer.axisMainLineEle) {
                    axisMovingElements.push(renderer.axisMainLineEle);
                }

                $.each(renderer.axisDotGroupList, function (idx, dotGroup) {
                    if (dotGroup.tick) {
                        axisMovingElements.push(dotGroup.tick);
                    }
                    if (dotGroup.label) {
                        axisMovingElements.push(dotGroup.label);
                    }
                });

                if (renderer.axisTitleEle) {
                    axisMovingElements.push(renderer.axisTitleEle);
                }

                if (axisInfo.isPartAxis && !axisInfo.isLastAxis) {
                    startX = renderer.startPoint.x;
                    startY = renderer.startPoint.y;
                    breakLineEle = self.canvas.path(["M", startX.toString(), (startY + axisInfo.vOffset / 2).toString(), "H", (startX + axisInfo.maxExtent * 2).toString()].join());
                    axisMovingElements.push(breakLineEle);
                    if (!self.breakLineEles) {
                        self.breakLineEles = [];
                    }
                    self.breakLineEles.push(breakLineEle);
                }

                return {
                    axisRenderer: renderer,
                    movingElements: axisMovingElements
                };
            };

            wijchartcore.prototype._translateAxisIfNeeded = function (xAxisElements, xCompass, yOrigin, yCompass, yMax, yMin) {
                var self = this, isVertical = yCompass === "west" || yCompass === "east", bounds = self.canvasBounds, origin = yOrigin, offset;

                if (self._isDate(origin)) {
                    origin = $.toOADate(origin);
                }

                if (!isVertical) {
                    if (xCompass === "west") {
                        offset = (origin - yMin) / (yMax - yMin) * (bounds.endX - bounds.startX);
                    } else {
                        offset = (origin - yMax) / (yMax - yMin) * (bounds.endX - bounds.startX);
                    }

                    $.each(xAxisElements, function (idx, element) {
                        // element.translate(offset, 0);
                        element.transform(Raphael.format("...T{0},{1}", offset, 0));
                    });
                } else {
                    if (xCompass === "south") {
                        offset = (yMin - origin) / (yMax - yMin) * (bounds.endY - bounds.startY);
                    } else {
                        offset = (yMax - origin) / (yMax - yMin) * (bounds.endY - bounds.startY);
                    }

                    $.each(xAxisElements, function (idx, element) {
                        // element.translate(0, offset);
                        element.transform(Raphael.format("...T{0},{1}", 0, offset));
                    });
                }
            };

            wijchartcore.prototype._paintAxis = function (axisOptions, axisInfo) {
                var self = this, o = self.options, canvasBounds = axisInfo.bounds || self.canvasBounds, startPoint = {
                    x: 0,
                    y: 0
                }, endPoint = {
                    x: 0,
                    y: 0
                }, compass = axisOptions.compass, thickness = 2, isVertical = true, ax = null, majorTickValues = [], tempMinorTickValues = [], minorTickValues = [], max = axisInfo.max, min = axisInfo.min, unitMajor = axisOptions.unitMajor, unitMinor = axisOptions.unitMinor, tickMajor = axisOptions.tickMajor.position, tickMinor = axisOptions.tickMinor.position, axisSize = axisInfo.maxExtent, tickMajorStyle = axisOptions.tickMajor.style, tickMinorStyle = axisOptions.tickMinor.style, tickRectMajor = axisInfo.majorTickRect, tickRectMinor = axisInfo.minorTickRect, axisTextOffset = axisInfo.axisTextOffset, gridMajor = axisOptions.gridMajor, gridMinor = axisOptions.gridMinor, labels = axisOptions.labels, maxLen = 0, textInfos = [], index = 0, formatString = axisOptions.annoFormatString, textStyle = null, axisElements = [];

                tickRectMajor = self._getTickRect(axisInfo, axisOptions, true, false);
                tickRectMinor = self._getTickRect(axisInfo, axisOptions, false, false);

                if (!formatString || formatString.length === 0) {
                    formatString = axisInfo.annoFormatString;
                }
                majorTickValues = self._getMajorTickValues(axisInfo, axisOptions);

                //if (tickMinor !== "none") {
                tempMinorTickValues = self._getMinorTickValues(axisInfo, axisOptions);
                minorTickValues = self._resetMinorTickValues(tempMinorTickValues, majorTickValues);

                switch (compass) {
                    case "south":
                        startPoint.x = canvasBounds.startX;
                        startPoint.y = canvasBounds.endY;
                        endPoint.x = canvasBounds.endX;
                        endPoint.y = canvasBounds.endY;
                        isVertical = false;
                        break;
                    case "north":
                        startPoint.x = canvasBounds.startX;
                        startPoint.y = canvasBounds.startY - thickness;
                        endPoint.x = canvasBounds.endX;
                        endPoint.y = canvasBounds.startY - thickness;
                        isVertical = false;
                        break;
                    case "east":
                        //startPoint.x = canvasBounds.endX;
                        startPoint.x = canvasBounds.endX - thickness;
                        startPoint.y = canvasBounds.endY;

                        //endPoint.x = canvasBounds.endX;
                        endPoint.x = canvasBounds.endX - thickness;
                        endPoint.y = canvasBounds.startY + self._getOffsetOfAxis(axisOptions);
                        if (axisInfo.preStartOffset) {
                            startPoint.x += axisInfo.preStartOffset;
                            endPoint.x += axisInfo.preStartOffset;
                        }
                        break;
                    case "west":
                        //startPoint.x = canvasBounds.startX - thickness;
                        startPoint.x = canvasBounds.startX;
                        startPoint.y = canvasBounds.endY;

                        //endPoint.x = canvasBounds.startX - thickness;
                        endPoint.x = canvasBounds.startX;
                        endPoint.y = canvasBounds.startY + self._getOffsetOfAxis(axisOptions);
                        if (axisInfo.preStartOffset) {
                            startPoint.x -= axisInfo.preStartOffset;
                            endPoint.x -= axisInfo.preStartOffset;
                        }
                        break;
                }

                if (axisOptions.visible) {
                    ax = self.canvas.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y).attr(axisOptions.style);
                    $.wijraphael.addClass($(ax.node), o.wijCSS.axis);

                    self.axisEles.push(ax);
                    axisElements.push(ax);
                }

                $.each(majorTickValues, function (idx, val) {
                    var text = val, isTime = axisInfo.isTime, is100Percent = o.is100Percent, retInfo, textInfo, vlGridLine = false, vlGridLineStyle = {};

                    if (val < min || val > max) {
                        index++;
                        return true;
                    }

                    if (axisInfo.annoMethod === "valueLabels") {
                        //if (axisOptions.annoMethod === "valueLabels") {
                        // if (val < 0) {
                        // return true;
                        // }
                        //if (index >= axisOptions.valueLabels.length) {
                        if (index >= axisInfo.valueLabels.length) {
                            return false;
                        }

                        //// text = axisOptions.valueLabels[index].text;
                        //text = axisOptions.valueLabels[index];
                        text = axisInfo.valueLabels[index];
                        vlGridLine = text.gridLine;
                        vlGridLineStyle = text.gridLineStyle;
                        if (text.text) {
                            text = text.text;
                        } else if (typeof text.value !== "undefined") {
                            text = text.value;
                            if (formatString && formatString.length) {
                                // text = $.format(text, formatString);
                                text = Globalize.format(text, formatString, self._getCulture());
                            }
                        }
                    } else if (axisInfo.annoMethod === "values") {
                        //} else if (axisOptions.annoMethod === "values") {
                        if (axisInfo.id === "x") {
                            text = self._getXTickText(text);
                        }

                        if (formatString && formatString.length) {
                            if (isTime) {
                                text = $.fromOADate(val);
                            }

                            // text = $.format(text, formatString);
                            text = Globalize.format(text, formatString, self._getCulture());
                        } else if (is100Percent && axisInfo.id === "y") {
                            // text = $.format(val, "p0");
                            text = Globalize.format(val, "p0", self._getCulture());
                        }
                    }

                    /*
                    * //TODO: mixed else { }
                    */
                    textStyle = $.extend(true, {}, o.textStyle, axisOptions.textStyle, labels.style, axisInfo.textStyle);

                    retInfo = self._paintMajorMinor(axisOptions.origin, max, min, val, tickMajor, unitMajor, tickRectMajor, compass, startPoint, endPoint, axisSize, axisTextOffset, tickMajorStyle, text, gridMajor, axisOptions.textVisible, textStyle, labels.textAlign, labels.width ? axisInfo.labelWidth : null, vlGridLine, vlGridLineStyle);

                    if (retInfo) {
                        if (retInfo.elements) {
                            axisElements = axisElements.concat(retInfo.elements);
                        }

                        textInfo = retInfo.textInfo;
                    }

                    if (textInfo) {
                        textInfos.push(textInfo);
                        if (maxLen < textInfo.len) {
                            maxLen = textInfo.len;
                        }
                    }

                    index++;
                });

                if (!labels.width) {
                    $.each(textInfos, function (idx, textInfo) {
                        var textElement = textInfo.text, offset = (textInfo.len - maxLen) / 2;
                        offset = labels.textAlign === "near" ? offset * -1 : offset;

                        if (isVertical) {
                            //textElement.translate(offset, 0);
                            textElement.transform(Raphael.format("...T{0},{1}", offset, 0));
                        } else {
                            //textElement.translate(0, offset);
                            textElement.transform(Raphael.format("...T{0},{1}", 0, offset));
                        }
                    });
                }

                $.each(minorTickValues, function (idx, val) {
                    var retInfo;

                    if (val > min && val < max) {
                        retInfo = self._paintMajorMinor(axisOptions.origin, max, min, val, tickMinor, unitMinor, tickRectMinor, compass, startPoint, endPoint, axisSize, axisTextOffset, tickMinorStyle, null, gridMinor, axisOptions.textVisible, textStyle, labels.textAlign, labels.width ? axisInfo.labelWidth : null);

                        if (retInfo && retInfo.elements) {
                            axisElements = axisElements.concat(retInfo.elements);
                        }
                    }
                });

                if (axisOptions.text && axisOptions.text.length > 0) {
                    axisElements.push(self._paintAxisText(axisOptions, axisInfo));
                }

                if (axisInfo.isPartAxis && !axisInfo.isLastAxis) {
                    axisElements.push(self.canvas.path(["M", startPoint.x.toString(), (startPoint.y + axisInfo.vOffset / 2).toString(), "H", (startPoint.x + axisInfo.maxExtent * 2).toString()].join()));
                }

                return axisElements;
            };

            wijchartcore.prototype._paintAxisText = function (axisOptions, axisInfo) {
                if (!axisOptions.text || axisOptions.text.length === 0) {
                    return;
                }
                var self = this, o = self.options, text = axisOptions.text, compass = axisOptions.compass, align = axisOptions.alignment, canvasBounds = axisInfo.bounds || self.canvasBounds, startX = canvasBounds.startX, startY = canvasBounds.startY, endX = canvasBounds.endX, endY = canvasBounds.endY, x = startX, y = startY, textBounds = axisInfo.textBounds, isVertical = self._isVertical(compass), axisTextOffset = axisInfo.axisTextOffset, tickRectMajor = axisInfo.majorTickRect, tick = axisOptions.tickMajor.position, tickLength = isVertical ? tickRectMajor.width : tickRectMajor.height, textStyle = null, textElement = null, marginTop = 0, marginLeft = 0, marginRight = 0, marginBottom = 0;

                textStyle = $.extend(true, {}, self.options.textStyle, axisOptions.textStyle);
                if (textStyle["margin-top"]) {
                    marginTop = parseFloat(textStyle["margin-top"]);
                }
                if (textStyle["margin-left"]) {
                    marginLeft = parseFloat(textStyle["margin-left"]);
                }
                if (textStyle["margin-right"]) {
                    marginRight = parseFloat(textStyle["margin-right"]);
                }
                if (textStyle["margin-bottom"]) {
                    marginBottom = parseFloat(textStyle["margin-bottom"]);
                }
                if (tick === "cross") {
                    tickLength = tickLength / 2;
                } else if (tick === "inside") {
                    tickLength = 0;
                }

                if (isVertical) {
                    switch (align) {
                        case "near":
                            y = endY - textBounds.width / 2;
                            break;
                        case "center":
                            y = (startY + endY) / 2;
                            break;
                        case "far":
                            y = startY + textBounds.width / 2;
                            break;
                    }

                    if (compass === "west") {
                        x = startX - (axisInfo.offset + axisTextOffset + tickLength + textBounds.height / 2 + marginRight);
                    } else {
                        x = endX + axisInfo.offset + axisTextOffset + tickLength + textBounds.height / 2 + marginLeft;
                    }
                } else {
                    switch (align) {
                        case "near":
                            x = startX + textBounds.width / 2;
                            break;
                        case "center":
                            x = (startX + endX) / 2;
                            break;
                        case "far":
                            x = endX - textBounds.width / 2;
                            break;
                    }

                    if (compass === "north") {
                        y = startY - (axisInfo.offset + axisTextOffset + tickLength + textBounds.height / 2 + marginBottom);
                    } else {
                        y = endY + axisInfo.offset + axisTextOffset + tickLength + textBounds.height / 2 + marginTop;
                    }
                }

                textElement = self._text(x, y, text);
                $.wijraphael.addClass($(textElement.node), o.wijCSS.axisText);
                self.axisEles.push(textElement);
                textElement.attr(textStyle);

                if (isVertical) {
                    // textElement.rotate(-90);
                    textElement.transform("...R-90");
                }

                return textElement;
            };

            wijchartcore.prototype._resetMinorTickValues = function (minorTickValues, majorTickValues) {
                var i = 0, j = 0, minorTickValue = null, majorTickValue = null;
                for (i = minorTickValues.length - 1; i >= 0; i--) {
                    minorTickValue = minorTickValues[i];
                    for (j = majorTickValues.length - 1; j >= 0; j--) {
                        majorTickValue = majorTickValues[j];
                        if (minorTickValue === majorTickValue) {
                            minorTickValues.splice(i, 1);
                        }
                    }
                }

                return minorTickValues;
            };

            wijchartcore.prototype._getXTickText = function (txt) {
                return txt;
            };

            wijchartcore.prototype._adjustTickValuesForCandlestickChart = function (tickValues) {
                return tickValues;
            };

            wijchartcore.prototype._paintMajorMinor = function (origin, max, min, val, tick, unit, tickRect, compass, startPoint, endPoint, axisSize, axisTextOffset, tickStyle, text, grid, textVisible, textStyle, textAlign, labelWidth, vlGridLine, vlGridLineStyle) {
                var self = this, x = startPoint.x, y = startPoint.y, o = self.options, tickX = -1, tickY = -1, isVertical = true, bs = self.canvasBounds, textInfo = null, tickElement = null, pathArr = [], arrPath = [], p = null, style = { "stroke-width": 2 }, txt = { text: null, len: 0 }, textBounds = null, retInfo = {}, majorMinorElements = [], axisCompass = self.axisCompass;

                switch (compass) {
                    case "south":
                        if (tick === "inside") {
                            y -= tickRect.height;
                        } else if (tick === "cross") {
                            y -= tickRect.height / 2;
                        }

                        if (labelWidth) {
                            tickY = y + axisTextOffset + tickRect.height;
                        } else {
                            tickY = y + axisTextOffset + tickRect.height + axisSize / 2;
                        }

                        isVertical = false;
                        break;
                    case "west":
                        if (tick === "outside") {
                            x -= tickRect.width;
                        } else if (tick === "cross") {
                            x -= tickRect.width / 2;
                        }

                        if (labelWidth) {
                            tickX = x - (axisTextOffset + axisSize);
                        } else {
                            tickX = x - (axisTextOffset + axisSize / 2);
                        }
                        break;
                    case "north":
                        if (tick === "outside") {
                            y -= tickRect.height;
                        } else if (tick === "cross") {
                            y -= tickRect.height / 2;
                        }

                        if (labelWidth) {
                            tickY = y - (axisTextOffset + axisSize);
                        } else {
                            tickY = y - (axisTextOffset + axisSize / 2);
                        }
                        isVertical = false;
                        break;
                    case "east":
                        if (tick === "inside") {
                            x -= tickRect.width;
                        } else if (tick === "cross") {
                            x -= tickRect.width / 2;
                        }

                        if (labelWidth) {
                            tickX = x + axisTextOffset + tickRect.width;
                        } else {
                            tickX = x + axisTextOffset + tickRect.width + axisSize / 2;
                        }
                        break;
                }

                if (isVertical) {
                    y += (val - min) / (max - min) * (endPoint.y - startPoint.y);
                    arrPath = ["M", bs.startX, y, "H", bs.endX];
                    if (grid.visible) {
                        //if ((y !== bs.startY && compass === "east") ||
                        //		(y !== bs.endY && compass === "west")) {
                        if ((y !== bs.startY || !axisCompass["north"]) && (y !== bs.endY || !axisCompass["south"]) || origin !== val) {
                            p = self.canvas.path(arrPath.join(" "));
                            $.wijraphael.addClass($(p.node), o.wijCSS.axisGridLine);
                            p.attr(grid.style);
                            self.axisEles.push(p);
                        }
                    }
                    if (vlGridLine) {
                        //if ((y !== bs.startY && compass === "east") ||
                        //		(y !== bs.endY && compass === "west")) {
                        if ((y !== bs.startY || !axisCompass["north"]) && (y !== bs.endY || !axisCompass["south"]) || origin !== val) {
                            p = self.canvas.path(arrPath.join(" "));
                            $.wijraphael.addClass($(p.node), o.wijCSS.axisGridLine);
                            p.attr($.extend(true, {}, grid.style, vlGridLineStyle));
                            self.axisEles.push(p);
                        }
                    }

                    tickY = y;

                    if (tick !== "none") {
                        pathArr = ["M", x, y, "h", tickRect.width];
                        tickStyle["stroke-width"] = tickRect.height;
                    }
                } else {
                    x += (val - min) / (max - min) * (endPoint.x - startPoint.x);
                    arrPath = ["M", x, bs.startY, "V", bs.endY];
                    if (grid.visible) {
                        //if ((x !== bs.startX && compass === "south") ||
                        //		(x !== bs.endX && compass === "north")) {
                        if ((x !== bs.startX || !axisCompass["west"]) && (x !== bs.endX || !axisCompass["east"]) || origin !== val) {
                            p = self.canvas.path(arrPath.join(" "));
                            $.wijraphael.addClass($(p.node), o.wijCSS.axisGridLine);
                            p.attr(grid.style);
                            self.axisEles.push(p);
                        }
                    }
                    if (vlGridLine) {
                        //if ((y !== bs.startY && compass === "south") ||
                        //		(y !== bs.endY && compass === "north")) {
                        if ((x !== bs.startX || !axisCompass["west"]) && (x !== bs.endX || !axisCompass["east"]) || origin !== val) {
                            p = self.canvas.path(arrPath.join(" "));
                            $.wijraphael.addClass($(p.node), o.wijCSS.axisGridLine);
                            p.attr($.extend(true, {}, grid.style, vlGridLineStyle));
                            self.axisEles.push(p);
                        }
                    }

                    if (labelWidth) {
                        tickX = x - labelWidth / 2;
                    } else {
                        tickX = x;
                    }

                    if (tick !== "none") {
                        pathArr = ["M", x, y, "v", tickRect.height];
                        tickStyle["stroke-width"] = tickRect.width;
                    }
                }

                if (tick !== "none") {
                    tickElement = self.canvas.path(pathArr.join(" "));
                    $.wijraphael.addClass($(tickElement.node), o.wijCSS.axisTick);
                    style = $.extend(style, tickStyle);
                    tickElement.attr(style);
                    self.axisEles.push(tickElement);
                    majorMinorElements.push(tickElement);
                }

                if (text !== null && textVisible) {
                    if (labelWidth) {
                        txt = self.canvas.wrapText(tickX, tickY, text.toString(), labelWidth, textAlign, textStyle);
                        $.wijraphael.addClass($(txt.node), o.wijCSS.axisLabel);
                        //if (isVertical) {
                        // txt.translate(0, -txt.getBBox().height / 2);
                        //txt.transform(Raphael.format("...T{0},{1}", 0,
                        //-txt.getBBox().height / 2));
                        //}
                    } else {
                        txt = self._text(tickX, tickY, text.toString());
                        $.wijraphael.addClass($(txt.node), o.wijCSS.axisLabel);
                        txt.attr(textStyle);
                    }

                    self.axisEles.push(txt);
                    majorMinorElements.push(txt);
                    if (!textVisible) {
                        txt.hide();
                    }
                    if (textAlign !== "center") {
                        textBounds = txt.getBBox();
                        textInfo = {
                            text: txt,
                            len: isVertical ? textBounds.width : textBounds.height
                        };
                    }
                }

                retInfo = { textInfo: textInfo, elements: majorMinorElements };

                return retInfo;
            };

            wijchartcore.prototype._paintPlotArea = function () {
            };

            wijchartcore.prototype._paintChartLabels = function () {
                var self = this, chartLabels = self.options.chartLabels;

                if (chartLabels && chartLabels.length) {
                    $.each(chartLabels, function (idx, chartLabel) {
                        var point;

                        chartLabel = $.extend(true, {
                            compass: "east",
                            attachMethod: "coordinate",
                            attachMethodData: {
                                seriesIndex: -1,
                                pointIndex: -1,
                                x: -1,
                                y: -1
                            },
                            offset: 0,
                            visible: false,
                            text: "",
                            connected: false
                        }, chartLabel);

                        if (chartLabel.visible) {
                            point = self._getChartLabelPointPosition(chartLabel);
                            if (typeof (point.x) !== "number" || typeof (point.y) !== "number") {
                                return false;
                            }
                            self._setChartLabel(chartLabel, point);
                        }
                    });
                }
            };

            wijchartcore.prototype._getChartLabelPointPosition = function (chartLabel) {
            };

            wijchartcore.prototype._setChartLabel = function (chartLabel, point, angle, calloutStyle) {
                var self = this, compass = chartLabel.compass, o = self.options, textStyle = $.extend(true, {}, o.textStyle, o.chartLabelStyle), text = self._text(0, 0, chartLabel.text).attr(textStyle), offset = chartLabel.offset, transX = 0, transY = 0, position = null, p = null;

                $.wijraphael.addClass($(text.node), o.wijCSS.labelText);
                self.chartLabelEles.push(text);

                position = self._getCompassTextPosition(compass, text.wijGetBBox(), offset, point, angle);

                if (offset && chartLabel.connected) {
                    p = self.canvas.path("M" + point.x + " " + point.y + "L" + position.endPoint.x + " " + position.endPoint.y);
                    $.wijraphael.addClass($(p.node), o.wijCSS.labelConnect);
                    p.attr(calloutStyle);
                    self.chartLabelEles.push(p);
                }

                transX = position.endPoint.x + position.offsetX;
                transY = position.endPoint.y + position.offsetY;

                // text.translate(transX, transY)
                // .toFront();
                text.transform(Raphael.format("...T{0},{1}", transX, transY)).toFront();
            };

            wijchartcore.prototype._getCompassTextPosition = function (compass, box, offset, point, angle) {
                var offsetX = 0, offsetY = 0, endPoint = { x: 0, y: 0 };

                switch (compass.toLowerCase()) {
                    case "east":
                        angle = 0;
                        break;
                    case "west":
                        angle = 180;
                        break;
                    case "north":
                        angle = 90;
                        break;
                    case "south":
                        angle = 270;
                        break;
                    case "northeast":
                        angle = 45;
                        break;
                    case "northwest":
                        angle = 135;
                        break;
                    case "southeast":
                        angle = 315;
                        break;
                    case "southwest":
                        angle = 225;
                        break;
                }

                if ((angle >= 0 && angle < 45 / 2) || (angle > 675 / 2 && angle < 360)) {
                    offsetX = box.width / 2;
                } else if (angle >= 45 / 2 && angle < 135 / 2) {
                    offsetX = box.width / 2;
                    offsetY = -1 * box.height / 2;
                } else if (angle >= 135 / 2 && angle < 225 / 2) {
                    offsetY = -1 * box.height / 2;
                } else if (angle >= 225 / 2 && angle < 315 / 2) {
                    offsetX = -1 * box.width / 2;
                    offsetY = -1 * box.height / 2;
                } else if (angle >= 315 / 2 && angle < 405 / 2) {
                    offsetX = -1 * box.width / 2;
                } else if (angle >= 405 / 2 && angle < 495 / 2) {
                    offsetX = -1 * box.width / 2;
                    offsetY = box.height / 2;
                } else if (angle >= 495 / 2 && angle < 585 / 2) {
                    offsetY = box.height / 2;
                } else {
                    offsetX = box.width / 2;
                    offsetY = box.height / 2;
                }

                endPoint = $.wijraphael.getPositionByAngle(point.x, point.y, offset, angle);

                return {
                    endPoint: endPoint,
                    offsetX: offsetX,
                    offsetY: offsetY
                };
            };

            wijchartcore.prototype._isTouchEnabled = function () {
                return $.support.isTouchEnabled && $.support.isTouchEnabled();
            };

            wijchartcore.prototype._mouseDown = function (e, args) {
                this._trigger("mouseDown", e, args);
            };

            wijchartcore.prototype._mouseUp = function (e, args) {
                this._trigger("mouseUp", e, args);
            };

            wijchartcore.prototype._mouseOver = function (e, args) {
                this._trigger("mouseOver", e, args);
            };

            wijchartcore.prototype._mouseOut = function (e, args) {
                this._trigger("mouseOut", e, args);
            };

            wijchartcore.prototype._mouseMove = function (e, args) {
                this._trigger("mouseMove", e, args);
            };

            wijchartcore.prototype._click = function (e, args) {
                this._trigger("click", e, args);
            };

            wijchartcore.prototype._mouseMoveInsidePlotArea = function (e, mousePos) {
                var self = this, o = self.options, indicator = o.indicator, canvas = self.canvas, point, bounds, path, offset = 0, tooltipObj = [], horizontal = o.horizontal;

                if (indicator && indicator.visible && this.isPlotAreaMouseDown) {
                    if (horizontal) {
                        point = this._calculatePositionByX(mousePos.top);
                    } else {
                        point = this._calculatePositionByX(mousePos.left);
                    }
                    if (point && this.indicatorLine) {
                        if (point.x !== this.lastIndicatorPosition) {
                            $.each(point.data, function (i, obj) {
                                if (obj.visible) {
                                    tooltipObj.push(obj);
                                }
                            });
                            if (tooltipObj.length > 0) {
                                bounds = self.canvasBounds;
                                if (horizontal) {
                                    this.indicatorLine.transform("T0 " + point.x);
                                } else {
                                    this.indicatorLine.transform("T" + point.x + " 0");
                                }

                                //							if (this.tooltip) {
                                //								this.tooltip.destroy();
                                //								this.tooltip = null;
                                //							}
                                //this.tooltip.hide();
                                //this._paintIndicatorTooltip(tooltipObj);
                                this._setTooltipContent(tooltipObj);

                                if (this.tooltip) {
                                    if (horizontal) {
                                        this.tooltip.showAt({ x: bounds.endX, y: point.x });
                                    } else {
                                        this.tooltip.showAt({ x: point.x, y: bounds.startY });
                                    }
                                }
                                this.lastIndicatorPosition = point.x;
                                self._indicatorLineShowing(tooltipObj);
                                this.lastIndicatorObjects = tooltipObj;
                            }
                        }
                    }
                }
            };

            // return a chart element point which is near the mouse.
            wijchartcore.prototype._calculatePositionByX = function (x) {
                var self = this, xArr = self.pointXs, position, points = self.dataPoints;
                if (xArr && xArr.length > 0) {
                    position = this._calculatePositionByXInternal(x, xArr);
                }
                if (points) {
                    return { x: position, data: points[position.toString()] };
                }
                return null;
            };

            wijchartcore.prototype._calculatePositionByXInternal = function (x, arr) {
                var len = arr.length, half, subArr;
                if (len === 1) {
                    return arr[0];
                } else if (len === 2) {
                    if (Math.abs(x - arr[0]) > Math.abs(x - arr[1])) {
                        return arr[1];
                    } else {
                        return arr[0];
                    }
                } else {
                    half = parseInt((len / 2).toString());
                    if (x > arr[half]) {
                        subArr = arr.slice(half);
                    } else {
                        subArr = arr.slice(0, half + 1);
                    }
                    return this._calculatePositionByXInternal(x, subArr);
                }
            };

            wijchartcore.prototype._mouseMoveOutsidePlotArea = function (e, mousePos) {
                if (this.indicatorLine) {
                    this.indicatorLine.wijRemove();
                    this.indicatorLine = null;
                    if (this.tooltip) {
                        this.tooltip.hide();
                    }
                    this._resetTooltip();
                }
            };

            wijchartcore.prototype._mouseDownInsidePlotArea = function (e, mousePos) {
                this.isPlotAreaMouseDown = true;
                var self = this, o = self.options, indicator = o.indicator, canvas = self.canvas, point, bounds, path, tooltipObj = [], horizontal = o.horizontal;

                if (indicator && indicator.visible && this.isPlotAreaMouseDown) {
                    self._setTooltip();
                    if (horizontal) {
                        point = this._calculatePositionByX(mousePos.top);
                    } else {
                        point = this._calculatePositionByX(mousePos.left);
                    }
                    if (point) {
                        // for each the points, if the element is not visible,
                        // don't show the indicator.
                        $.each(point.data, function (i, obj) {
                            if (obj.visible) {
                                tooltipObj.push(obj);
                            }
                        });
                        if (tooltipObj.length > 0) {
                            bounds = self.canvasBounds;
                            if (horizontal) {
                                path = ["M", bounds.startX, 0, "H", bounds.endX];
                            } else {
                                path = ["M", 0, bounds.startY, "V", bounds.endY];
                            }
                            if (this.indicatorLine) {
                                this.indicatorLine.wijRemove();
                            }
                            this.indicatorLine = canvas.path(path);
                            this.indicatorLine.attr(indicator.style);
                            if (horizontal) {
                                this.indicatorLine.transform("T0 " + point.x);
                            } else {
                                this.indicatorLine.transform("T" + point.x + " 0");
                            }

                            //						if (this.tooltip) {
                            //							this.tooltip.destroy();
                            //							this.tooltip = null;
                            //						}
                            // show tooltip
                            //this.tooltip.hide();
                            this._setTooltipContent(tooltipObj);

                            //this._paintIndicatorTooltip(tooltipObj);
                            if (this.tooltip) {
                                if (horizontal) {
                                    this.tooltip.showAt({ x: bounds.endX, y: point.x });
                                } else {
                                    this.tooltip.showAt({ x: point.x, y: bounds.startY });
                                }
                            }
                            this.lastIndicatorPosition = point.x;
                            self._indicatorLineShowing(tooltipObj);
                            this.lastIndicatorObjects = tooltipObj;
                        }
                    }
                    e.preventDefault();
                }
            };

            wijchartcore.prototype._indicatorLineShowing = function (obj) {
                if (this.lastIndicatorObjects) {
                    this._removeIndicatorStyles(this.lastIndicatorObjects);
                }
            };

            wijchartcore.prototype._removeIndicatorStyles = function (lastIndicatorObjects) {
            };

            wijchartcore.prototype._mouseUpInsidePlotArea = function (e, mousePos) {
                this.isPlotAreaMouseDown = false;
                if (this.indicatorLine) {
                    this.indicatorLine.wijRemove();
                    this.indicatorLine = null;
                    if (this.tooltip) {
                        this.tooltip.hide();
                    }
                    this._resetTooltip();
                }
                if (this.lastIndicatorObjects) {
                    this._removeIndicatorStyles(this.lastIndicatorObjects);
                    this.lastIndicatorObjects = null;
                }
            };

            wijchartcore.prototype._bindLiveEvents = function () {
                //this._bindLegendEvents();
                this._bindCanvasEvents();
                this._bindResizeEvent();
            };

            wijchartcore.prototype._bindResizeEvent = function () {
                var _this = this;
                this.resizeIntent = 250;
                if (this.options.autoResize) {
                    this.chartElement.on("resize." + this.widgetName, function () {
                        clearTimeout(_this.resizeTimer);
                        _this.resizeTimer = setTimeout(function () {
                            _this.redraw();
                        }, _this.resizeIntent);
                    });
                }
            };

            wijchartcore.prototype._unbindResizeEvent = function () {
                this.chartElement.off("resize." + this.widgetName);
            };

            wijchartcore.prototype._bindCanvasEvents = function () {
                var self = this, element = self.chartElement, touchEventPre = "", namespace = "." + this.widgetName;

                // In IE11, the -ms-touch-action changed to touch-action.
                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    if (window.navigator["pointerEnabled"]) {
                        element.css("touch-action", "none");
                    } else if (window.navigator.msPointerEnabled) {
                        element.css("-ms-touch-action", "none");
                    }
                }

                // if support touch.
                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    touchEventPre = "wij";
                }
                element.bind(touchEventPre + "mousemove" + namespace, function (e) {
                    var elePos = element.offset(), cBounds = self.canvasBounds, mousePos = {
                        left: (document.compatMode === "CSS1Compat" ? e.pageX : e.clientX) - elePos.left,
                        top: (document.compatMode === "CSS1Compat" ? e.pageY : e.clientY) - elePos.top
                    }, disabled = self._isDisabled();
                    if (disabled || cBounds === undefined) {
                        return;
                    }
                    if (mousePos.left >= cBounds.startX && mousePos.left <= cBounds.endX && mousePos.top >= cBounds.startY && mousePos.top <= cBounds.endY) {
                        self._mouseMoveInsidePlotArea(e, mousePos);
                    }
                });

                // Mousemove event may not catch quick moving,
                // in this condition, bind mouseout event to hide the tooltip.
                element.bind(touchEventPre + "mouseout" + namespace, function (e) {
                    var elePos = element.offset(), cBounds = self.canvasBounds, mousePos = {
                        left: (document.compatMode === "CSS1Compat" ? e.pageX : e.clientX) - elePos.left,
                        top: (document.compatMode === "CSS1Compat" ? e.pageY : e.clientY) - elePos.top
                    }, disabled = self._isDisabled();
                    if (disabled || cBounds === undefined) {
                        return;
                    }
                    if (mousePos.left >= cBounds.startX && mousePos.left <= cBounds.endX && mousePos.top >= cBounds.startY && mousePos.top <= cBounds.endY) {
                        return;
                    } else {
                        self._mouseMoveOutsidePlotArea(e, mousePos);
                    }
                });

                // End comments
                if (self.options.indicator && self.options.indicator.visible) {
                    element.bind(touchEventPre + "mousedown" + namespace, function (e) {
                        var elePos = element.offset(), cBounds = self.canvasBounds, mousePos = {
                            left: (document.compatMode === "CSS1Compat" ? e.pageX : e.clientX) - elePos.left,
                            top: (document.compatMode === "CSS1Compat" ? e.pageY : e.clientY) - elePos.top
                        }, disabled = self._isDisabled();
                        if (disabled || cBounds === undefined) {
                            return;
                        }
                        if (mousePos.left >= cBounds.startX && mousePos.left <= cBounds.endX && mousePos.top >= cBounds.startY && mousePos.top <= cBounds.endY) {
                            self._mouseDownInsidePlotArea(e, mousePos);
                        }
                    }).bind(touchEventPre + "mouseup" + namespace, function (e) {
                        var elePos = element.offset(), cBounds = self.canvasBounds, mousePos = {
                            left: (document.compatMode === "CSS1Compat" ? e.pageX : e.clientX) - elePos.left,
                            top: (document.compatMode === "CSS1Compat" ? e.pageY : e.clientY) - elePos.top
                        }, disabled = self._isDisabled();
                        if (disabled || cBounds === undefined) {
                            return;
                        }
                        if (mousePos.left >= cBounds.startX && mousePos.left <= cBounds.endX && mousePos.top >= cBounds.startY && mousePos.top <= cBounds.endY) {
                            self._mouseUpInsidePlotArea(e, mousePos);
                        }
                    });
                }
            };

            wijchartcore.prototype._unbindCanvasEvents = function () {
                // In IE11, the -ms-touch-action changed to touch-action.
                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    if (window.navigator["pointerEnabled"]) {
                        this.element.css("touch-action", "");
                    } else if (window.navigator.msPointerEnabled) {
                        this.element.css("-ms-touch-action", "");
                    }
                }
                this.element.unbind("." + this.widgetName);
            };

            wijchartcore.prototype._bindLegendEvents = function () {
                var self = this, element = self.chartElement;
                element.delegate("." + self.options.wijCSS.legend, "click.wijchartcore", function (e) {
                    if (self._isDisabled()) {
                        return;
                    }
                    var tar = $(e.target);
                    if (tar[0].tagName && tar[0].tagName === "tspan") {
                        tar = tar.parent();
                    }
                    self._legendClick(tar);
                });
                //$(".wijchart-legend", element[0])
                //	.live("click." + widgetName, function (e) {
                //		if (self.options.disabled) {
                //			return;
                //		}
                //		var tar = $(e.target);
                //		if (tar[0].tagName && tar[0].tagName === "tspan") {
                //			tar = tar.parent();
                //		}
                //		self._legendClick(tar);
                //	});
            };

            wijchartcore.prototype._legendClick = function (obj) {
                if (typeof obj.data("index") === "undefined") {
                    return;
                }
                var self = this, l = self.options.legend, i = obj.data("index"), legendIndex = obj.data("legendIndex"), fields = self.chartElement.data("fields"), seriesEles = self.seriesEles, seriesEle, legendIcon = self.legendIcons[legendIndex], legend = self.legends[legendIndex], legendNode = l.textWidth ? $(legend[0].node) : $(legend.node), idx = i, legendDot;

                if (fields && fields.seriesEles) {
                    seriesEles = fields.seriesEles;
                }

                if (self.legendDots && self.legendDots.length > i) {
                    legendDot = self.legendDots[i];
                }

                if (l.reversed) {
                    idx = self.legends.length - 1 - i;
                }
                seriesEle = seriesEles[idx];

                if (self.legends.length) {
                    if (!legendNode.data("hidden")) {
                        if (seriesEle) {
                            self._hideSerieEles(seriesEle);
                        }
                        if (!legendNode.data("textOpacity")) {
                            if (l.textWidth) {
                                legendNode.data("textOpacity", legend[0].attr("opacity") || 1);
                            } else {
                                legendNode.data("textOpacity", legend.attr("opacity") || 1);
                            }
                        }

                        if (!legendNode.data("iconOpacity")) {
                            legendNode.data("iconOpacity", legendIcon.attr("opacity") || 1);
                        }

                        if (legendDot && !legendNode.data("dotOpacity")) {
                            legendNode.data("dotOpacity", legendIcon.attr("opacity") || 1);
                        }

                        legend.attr("opacity", "0.3");
                        legendIcon.attr("opacity", "0.3");
                        if (legendDot) {
                            legendDot.attr("opacity", "0.3");
                        }
                        legendNode.data("hidden", true);
                    } else {
                        if (seriesEle) {
                            self._showSerieEles(seriesEle);
                        }
                        legend.attr("opacity", legendNode.data("textOpacity"));
                        legendIcon.attr("opacity", legendNode.data("iconOpacity"));
                        if (legendDot) {
                            legendDot.attr("opacity", legendNode.data("dotOpacity"));
                        }
                        legendNode.data("hidden", false);
                    }
                }
            };

            wijchartcore.prototype._showSerieEles = function (seriesEle) {
            };

            wijchartcore.prototype._hideSerieEles = function (seriesEle) {
            };

            wijchartcore.prototype._unbindLiveEvents = function () {
                var self = this, o = self.options, element = this.chartElement, widgetName = self.widgetName;
                element.undelegate("." + o.wijCSS.legend, ".wijchartcore").undelegate("." + o.wijCSS.legend, "wijchartcore");
                this._unbindCanvasEvents();
                this._unbindResizeEvent();
            };

            wijchartcore.prototype._isBarChart = function () {
                return false;
            };

            wijchartcore.prototype._isPieChart = function () {
            };

            wijchartcore.prototype._validateSeriesData = function (series) {
                return false;
            };

            wijchartcore.prototype._getOffsetOfAxis = function (axisOptions) {
                return 0;
            };

            // methods for Axis
            wijchartcore.prototype._calculateParameters = function (axisInfo, axisOptions) {
                var self = this, maxData = axisOptions.max, minData = axisOptions.min, autoMax = axisOptions.autoMax && axisInfo.autoMax, autoMin = axisOptions.autoMin && axisInfo.autoMin, autoMajor = axisOptions.autoMajor && axisInfo.autoMajor, autoMinor = axisOptions.autoMinor && axisInfo.autoMinor, axisAnno = null, prec = null, isVL = axisInfo.annoMethod === "valueLabels", major = 0, newmax = 0, newmin = 0, dx = 0, tinc = 0, isTime = axisInfo.isTime, adjustMinValue = self.options.adjustMinValue;

                if (autoMax && maxData !== Number.MIN_VALUE) {
                    if (axisInfo.id !== "x" && self._isBarChart()) {
                        if (maxData < 0.0 && (0.5 * (maxData - minData) > -maxData)) {
                            maxData = 0.0;
                        }
                    }
                }

                if (autoMin && minData !== Number.MAX_VALUE) {
                    if (axisInfo.id !== "x" && self._isBarChart()) {
                        if (minData > 0.0 && (0.5 * (maxData - minData) > minData)) {
                            minData = 0.0;
                        }
                    }
                }

                if (maxData === minData) {
                    if (minData !== 0) {
                        minData -= 1;
                    }
                    maxData += 1;
                }

                dx = maxData - minData;

                if (isTime) {
                    axisAnno = axisOptions.annoFormatString;
                    if (!axisAnno || axisAnno.length === 0) {
                        axisAnno = ChartDataUtil.getTimeDefaultFormat(maxData, minData);
                        axisInfo.annoFormatString = axisAnno;
                    }
                    tinc = ChartDataUtil.niceTimeUnit(0.0, axisAnno);
                }
                prec = ChartDataUtil.nicePrecision(dx);
                axisInfo.tprec = prec;
                if (autoMax) {
                    if (isTime) {
                        newmax = ChartDataUtil.roundTime(maxData, tinc, true);
                        if (newmax < maxData) {
                            maxData = newmax + tinc;
                        } else {
                            maxData = newmax;
                        }
                    } else {
                        newmax = ChartDataUtil.precCeil(-prec, maxData);
                        if (typeof (newmax) === "number") {
                            maxData = newmax;
                        }
                    }
                }
                if (autoMin) {
                    if (isTime) {
                        newmin = ChartDataUtil.roundTime(minData, tinc, false);
                        if (newmin > minData) {
                            minData = newmin - tinc;
                        } else {
                            minData = newmin;
                        }
                    } else {
                        newmin = ChartDataUtil.precFloor(-prec, minData);
                        if (typeof (newmin) === "number") {
                            minData = newmin;
                        }
                    }
                }

                axisInfo.max = maxData;
                axisInfo.min = minData;
                axisInfo.originalMax = maxData;
                axisInfo.originalMin = minData;
                axisInfo.annoFormatString = axisAnno;
                axisInfo.tinc = tinc;

                if (autoMajor || autoMinor) {
                    dx = maxData - minData;
                    self._calculateMajorMinor(axisOptions, axisInfo);

                    // var minor = axisOptions.unitMinor;
                    major = axisOptions.unitMajor;
                    if (autoMax && major !== 0 && !isTime && !isVL) {
                        dx = maxData - parseInt((maxData / major).toString(), 10) * major;

                        if (dx !== 0) {
                            maxData += (major - dx);
                            maxData = ChartDataUtil.precCeil(-prec, maxData);
                        }
                    }

                    if (autoMin && major !== 0 && !isTime && !isVL) {
                        dx = minData - parseInt((minData / major).toString(), 10) * major;

                        if (dx !== 0) {
                            if (dx < 0) {
                                dx += major;
                            }

                            minData -= Math.abs(dx); // should always be less.
                            minData = ChartDataUtil.precFloor(-prec, minData);
                        }
                    }

                    if (autoMin && major !== 0 && !isVL && (typeof adjustMinValue === "undefined" || adjustMinValue === false) && autoMin && minData === axisOptions.min && minData - major >= 0 && axisInfo.id === "y") {
                        minData -= major;
                    }
                }

                /*
                * //TODO: if (!autoMajor || !autoMinor) { }
                */
                axisInfo.max = maxData;
                axisInfo.min = minData;
                axisInfo.originalMax = maxData;
                axisInfo.originalMin = minData;
            };

            wijchartcore.prototype._supportStacked = function () {
                return false;
            };

            wijchartcore.prototype._getDataExtreme = function (isMultiYAxis) {
                var val = {
                    txx: 0,
                    txn: 0,
                    tyx: 0,
                    tyn: 0
                }, valGroup;

                valGroup = this._getDataExtremes(val, isMultiYAxis);
                if (valGroup) {
                    if (valGroup.txn > valGroup.txx) {
                        valGroup.txn = 0;
                        valGroup.txx = 1;
                    }
                    return valGroup;
                } else {
                    if (val.txn > val.txx) {
                        val.txn = 0;
                        val.txx = 1;
                    }
                    return val;
                }
            };

            wijchartcore.prototype._getDataExtremes = function (val, isMultiYAxis) {
                var self = this, o = self.options, seriesList = o.seriesList, stacked = o.stacked && self._supportStacked(), is100Percent = o.is100Percent, axis = o.axis, axisInfo = self.axisInfo, valuesX = [], tlValsX = [], lastValuesY = [], valueLabels = [], validValue, valGroup = { y: {} }, xValueLabels = axis.x.valueLabels, xAnnoMethod = axisInfo.x.annoMethod, yAnnoMethod = axisInfo.y.annoMethod, seriesIndex = 0;

                if (!seriesList || seriesList.length === 0) {
                    return val;
                }

                //handle the seriesList's xy data
                $.each(seriesList, function (i, series) {
                    var data = series.data, xValues = [], yValues = [], length, k = 0;

                    if (data.xy && $.isArray(data.xy)) {
                        length = data.xy.length;
                        while (k < length) {
                            xValues.push(data.xy[k]);
                            yValues.push(data.xy[k + 1]);
                            k += 2;
                        }
                        data.x = xValues;
                        data.y = yValues;
                    }
                });

                if (self.seriesGroup) {
                    $.each(self.seriesGroup, function (key, seriesL) {
                        var valuesY = [], tlValsY = [], k = parseInt(key, 10);
                        $.each(seriesL, function (i, series) {
                            var data, index = 0, k = 0, valuesXY, len, xMinMax, yMinMax, isTrendLine, tData, isTrendline;
                            if (series.type === "pie" || series.type === "sharedPie") {
                                return true;
                            }

                            // support hole.
                            series = $.extend(true, { display: "show" }, series);

                            // end comments
                            // support hole.
                            if (series.display === "exclude") {
                                return true;
                            }

                            // end comments
                            isTrendline = self._isTrendline(series);

                            data = series.data;
                            valuesXY = [].concat(data.xy);
                            len = valuesXY.length;
                            valuesX = [].concat(data.x);
                            valuesY = [].concat(data.y);
                            if (!isTrendline) {
                                if (data.xy && len) {
                                    valuesX = [];
                                    valuesY = [];

                                    while (k < len) {
                                        valuesX[index] = valuesXY[k];
                                        valuesY[index] = valuesXY[k + 1];
                                        k += 2;
                                        index++;
                                        data.x = valuesX;
                                        data.y = valuesY;
                                    }
                                } else if (!data.x) {
                                    valuesX = [];

                                    $.each(valuesY, function (i) {
                                        valuesX.push(i);
                                    });

                                    data.x = valuesX;
                                }
                                if (stacked && i > 0) {
                                    $.each(valuesY, function (j) {
                                        valuesY[j] += lastValuesY[j];
                                    });
                                }
                                lastValuesY = valuesY;
                            } else {
                                if (!series.isValid || !series.innerData) {
                                    return true;
                                }
                                tlValsX = series.innerData.x;
                                tlValsY = series.innerData.y;
                            }

                            xMinMax = self._getMinMaxValue(isTrendline ? tlValsX : valuesX);
                            yMinMax = self._getMinMaxValue(isTrendline ? tlValsY : valuesY);

                            if (i === 0) {
                                val.tyx = yMinMax.max;
                                val.tyn = yMinMax.min;
                            } else {
                                if (val.tyx < yMinMax.max) {
                                    val.tyx = yMinMax.max;
                                }
                                if (val.tyn > yMinMax.min) {
                                    val.tyn = yMinMax.min;
                                }
                            }

                            if (seriesIndex === 0) {
                                val.txx = xMinMax.max;
                                val.txn = xMinMax.min;
                            } else {
                                if (val.txx < xMinMax.max) {
                                    val.txx = xMinMax.max;
                                }
                                if (val.txn > xMinMax.min) {
                                    val.txn = xMinMax.min;
                                }
                            }
                            seriesIndex++;
                        });

                        if (is100Percent) {
                            val.tyx = 1;
                            val.tyn = 0;
                        }

                        valGroup.y[key] = { tyx: val.tyx, tyn: val.tyn };
                        valGroup.txx = val.txx;
                        valGroup.txn = val.txn;
                        val.tyx = 0;
                        val.tyn = 0;

                        //val = {txx: val.txx, txn: val.txn, tyx: 0, tyn: 0 };
                        if (valuesY.length) {
                            validValue = ChartUtil.getFirstValidListValue(valuesY);
                            if (self._isDate(validValue)) {
                                axisInfo.y[key].isTime = true;
                            } else if (typeof (validValue) === "undefined") {
                                return true;
                            } else if (typeof (validValue) !== "number") {
                                $.each(valuesY, function (idx, valueY) {
                                    // valueLabels.push({
                                    // text: valueY,
                                    // value: idx
                                    // });
                                    // Add comments by RyanWu@20110707.
                                    // For fixing the issue#15881.
                                    // valueLabels.push(valueY);
                                    var formatString = axis.y.annoFormatString, value = valueY;

                                    if (formatString && formatString.length > 0) {
                                        // value = $.format(value, formatString);
                                        value = Globalize.format(value, formatString, self._getCulture());
                                    } else {
                                        value = value.toString();
                                    }

                                    // valueLabels.push(value);
                                    valueLabels.push({
                                        text: value,
                                        value: valueY,
                                        gridLine: false
                                    });
                                    // end by RyanWu@20110707.
                                });

                                //axis.y[k].annoMethod = "valueLabels";
                                axisInfo.y[key].annoMethod = "valueLabels";
                                if (!axis.y[k].valueLabels && axis.y[k].valueLabels.length === 0) {
                                    //axis.y[k].valueLabels = valueLabels;
                                    axisInfo.y[key].valueLabels = valueLabels;
                                } else {
                                    axisInfo.y[key].valueLabels = axis.y[k].valueLabels;
                                }

                                //axis.y[parseInt(key, 10)].valueLabels = valueLabels;
                                axis.x.max = valuesY.length - 1;
                                axis.x.min = 0;
                                axis.y[k].unitMajor = 1;
                                axis.x.unitMinor = 0.5;
                                axisInfo.y[key].autoMax = false;
                                axisInfo.y[key].autoMin = false;
                                axisInfo.y[key].autoMajor = false;
                                axisInfo.y[key].autoMinor = false;
                            }
                        }
                    });
                }

                self._getXAxisInfoValueLabels(axisInfo.x, axis.x);
                if (valuesX.length) {
                    validValue = ChartUtil.getFirstValidListValue(valuesX);
                    xValueLabels = axisInfo.x.valueLabels;

                    if (self._isDate(validValue)) {
                        axisInfo.x.isTime = true;
                    } else if (typeof (validValue) !== "number") {
                        $.each(valuesX, function (idx, valueX) {
                            var vLabel = {}, xvl, xvlType;
                            if (xAnnoMethod === "valueLabels" && xValueLabels && xValueLabels.length && idx < xValueLabels.length) {
                                xvl = xValueLabels[idx];
                                xvlType = typeof xvl;
                                if (xvlType === "string") {
                                    xvl = { text: xvl };
                                } else if (xvlType === "number" || self._isDate(xvl)) {
                                    xvl = { value: xvl };
                                }
                            }
                            vLabel = $.extend({
                                text: valueX,
                                value: idx,
                                gridLine: false
                            }, xvl);
                            valueLabels.push(vLabel);
                            // valueLabels.push(valueX);
                        });

                        //axis.x.annoMethod = "valueLabels";
                        //axis.x.valueLabels = valueLabels;
                        axis.x.max = valuesX.length - 1;
                        axis.x.min = 0;
                        axis.x.unitMajor = 1;
                        axis.x.unitMinor = 0.5;
                        axisInfo.x.annoMethod = "valueLabels";
                        axisInfo.x.valueLabels = valueLabels;
                        axisInfo.x.autoMax = false;
                        axisInfo.x.autoMin = false;
                        axisInfo.x.autoMajor = false;
                        axisInfo.x.autoMinor = false;
                    }
                }

                return valGroup;
                //return val;
            };

            wijchartcore.prototype._getXAxisInfoValueLabels = function (xAxisInfo, xAxisOptions) {
                var xAnnoMethod = xAxisOptions.annoMethod, xValueLabels = xAxisOptions.valueLabels;
                if (xAnnoMethod === "valueLabels" && xValueLabels && xValueLabels.length > 0) {
                    xAxisInfo.valueLabels = xValueLabels;
                }
            };

            wijchartcore.prototype._isVertical = function (compass) {
                return compass === "west" || compass === "east";
            };

            wijchartcore.prototype._isDate = function (obj) {
                if (!obj) {
                    return false;
                }
                return (typeof obj === 'object') && obj.constructor === Date;
            };

            wijchartcore.prototype._getMinMaxValue = function (array) {
                var self = this, val = {
                    min: 0,
                    max: 0
                }, i = 0, validValue;

                if (!array.length) {
                    return val;
                }

                validValue = ChartUtil.getFirstValidListValue(array);
                if (typeof (validValue) !== "number") {
                    if (self._isDate(validValue)) {
                        val.min = validValue;
                        val.max = validValue;
                    } else {
                        val.min = 0;
                        val.max = array.length - 1;
                        return val;
                    }
                } else {
                    val.min = validValue;
                    val.max = validValue;
                }

                for (i = 0; i < array.length; i++) {
                    if (array[i] === null || typeof array[i] === "undefined") {
                        continue;
                    }
                    if (typeof array[i] === "number" && isNaN(array[i])) {
                        continue;
                    }
                    if (array[i] < val.min) {
                        val.min = array[i];
                    } else if (array[i] > val.max) {
                        val.max = array[i];
                    }
                }

                if (self._isDate(val.min)) {
                    val.min = $.toOADate(val.min);
                    val.max = $.toOADate(val.max);
                }

                return val;
            };

            wijchartcore.prototype._getTickTextForCalculateUnit = function (value, axisInfo, prec) {
                var isTime = axisInfo.isTime, formatString = axisInfo.annoFormatString;

                if (isTime) {
                    return Globalize.format($.fromOADate(value), formatString, this._getCulture());
                } else {
                    return $.round(value, prec).toString();
                }
            };

            wijchartcore.prototype._calculateMajorMinor = function (axisOptions, axisInfo) {
                var self = this, o = self.options, canvasBounds = axisInfo.bounds || self.canvasBounds, autoMajor = axisOptions.autoMajor, autoMinor = axisOptions.autoMinor, maxData = axisInfo.max, minData = axisInfo.min, isTime = axisInfo.isTime, tinc = axisInfo.tinc, formatString = axisInfo.annoFormatString, maxText = null, minText = null, sizeMax = null, sizeMin = null, mx = null, mn = null, precision = null, _prec = null, textStyle = null, dx = maxData - minData, width = 0, height = 0, nticks = 0, major = 0;

                if (autoMajor) {
                    textStyle = $.extend(true, {}, o.textStyle, axisOptions.textStyle, axisOptions.labels.style);

                    if (!isTime) {
                        precision = ChartDataUtil.nicePrecision(dx);
                        _prec = precision + 1;

                        if (_prec < 0 || _prec > 15) {
                            _prec = 0;
                        }
                    }

                    maxText = this._getTickTextForCalculateUnit(maxData, axisInfo, precision);
                    minText = this._getTickTextForCalculateUnit(minData, axisInfo, precision);

                    mx = self._text(-1000, -1000, maxText).attr(textStyle);
                    mn = self._text(-1000, -1000, minText).attr(textStyle);

                    sizeMax = mx.wijGetBBox();
                    sizeMin = mn.wijGetBBox();

                    mx.wijRemove();
                    mx = null;
                    mn.wijRemove();
                    mn = null;

                    if (sizeMax.width < sizeMin.width) {
                        sizeMax.width = sizeMin.width;
                    }

                    if (sizeMax.height < sizeMin.height) {
                        sizeMax.height = sizeMin.height;
                    }

                    if (!self._isVertical(axisOptions.compass)) {
                        // Add comments by RyanWu@20100907.
                        // Subtract axisTextOffset because we must left
                        // the space between major text and major rect.
                        width = canvasBounds.endX - canvasBounds.startX - axisInfo.vOffset - axisInfo.axisTextOffset;
                        major = width / sizeMax.width;

                        if (Number.POSITIVE_INFINITY === major) {
                            nticks = 0;
                        } else {
                            nticks = parseInt(major.toString(), 10);
                        }
                    } else {
                        height = canvasBounds.endY - canvasBounds.startY - axisInfo.vOffset - axisInfo.axisTextOffset;
                        major = height / sizeMax.height;

                        if (Number.POSITIVE_INFINITY === major) {
                            nticks = 0;
                        } else {
                            nticks = parseInt(major.toString(), 10);
                        }
                    }

                    major = dx;
                    if (nticks > 0) {
                        dx /= nticks;
                        if (isTime) {
                            if (dx < tinc) {
                                major = tinc;
                            } else {
                                major = ChartDataUtil.niceTimeUnit(dx, axisInfo.annoFormatString);
                            }
                        } else {
                            axisInfo.tprec = ChartDataUtil.nicePrecision(dx);
                            major = ChartDataUtil.niceNumber(2 * dx, -precision, true);

                            if (major < dx) {
                                major = ChartDataUtil.niceNumber(dx, -precision + 1, false);
                            }

                            if (major < dx) {
                                major = ChartDataUtil.niceTickNumber(dx);
                            }
                        }
                    }

                    axisOptions.unitMajor = major;
                }

                if (autoMinor && axisOptions.unitMajor && !isNaN(axisOptions.unitMajor)) {
                    axisOptions.unitMinor = axisOptions.unitMajor / 2;
                }
            };
            return wijchartcore;
        })(wijmo.wijmoWidget);
        chart.wijchartcore = wijchartcore;

        var wijchartcore_options = (function () {
            function wijchartcore_options() {
                /**
                * Creates an array of AnnotationBase objects that contain the settings of the annotations to display in the chart.
                */
                this.annotations = [];
                /**
                * Sets the width of the chart in pixels.
                * @remarks
                * Note that this value overrides any value you may set in the <div> element that
                * you use in the body of the HTML page
                * If you specify a width in the <div> element that is different from this value,
                * the chart and its border go out of synch.
                * @type {?number}
                */
                this.width = null;
                /**
                * Sets the height of the barchart in pixels.
                * @remarks
                * Note that this value overrides any value you may set in the <div> element that
                * you use in the body of the HTML page. If you specify a height in the <div> element that
                * is different from this value, the chart and its border go out of synch.
                * @type {?number}
                */
                this.height = null;
                /**
                * this option uses internal
                * @ignore
                */
                this.wijCSS = new wijchartcore_css();
                /** A value that indicator the culture to format the chart text. */
                this.culture = "";
                /** Assigns the string value of the culture calendar that appears on the calendar.
                *	This option must work with culture option.
                */
                this.cultureCalendar = "";
                /** A value that indicates whether to redraw the chart automatically when resizing the chart element. */
                this.autoResize = true;
                /**
                * Creates an array of series objects that contain data values and labels to display in the chart.
                */
                this.seriesList = [];
                /**
                * Sets an array of style objects to use in rendering the bars for each series in the chart.
                * @remarks
                * Each style object in the array applies to one series in your seriesList,
                * so you need specify only as many style objects as you have series objects
                * in your seriesList. The style is also used in the legend entry for the series
                * in your seriesList. The style is also used in the legend entry for the series
                */
                this.seriesStyles = [
                    {
                        stroke: "#00cc00",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#0099cc",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#0055cc",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#2200cc",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#8800cc",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#d9007e",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#ff0000",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#ff6600",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#ff9900",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#ffcc00",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#ffff00",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, {
                        stroke: "#ace600",
                        opacity: 0.9,
                        "stroke-width": 1
                    }];
                /**
                * Sets an array of styles to use in rendering bars in the chart when you hover over them.
                * @remarks
                * Each style object in the array applies to a series in your seriesList,so you need
                * specify only as many style objects as you have series objects in your seriesList
                */
                this.seriesHoverStyles = [
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, {
                        opacity: 1,
                        "stroke-width": 1.5
                    }];
                /**
                * Sets the amount of space in pixels between the chart area and the top edge of the <div> that defines the widget
                */
                this.marginTop = 25;
                /**
                * Sets the amount of space in pixels between the chart area and the right edge of the <div> that defines the widget
                */
                this.marginRight = 25;
                /**
                *  Sets the amount of space in pixels between the chart area and the bottom edge of the <div> that defines the widget.
                */
                this.marginBottom = 25;
                /**
                * Sets the amount of space in pixels between the chart area and the left edge of the <div> that defines the widget
                */
                this.marginLeft = 25;
                /**
                * Creates an object to use for the fallback style of any chart text that does not
                * have other style options set.
                * @remarks
                * Each type of text in the chart has a different set of styles applied by default, but if those styles are set to null,
                * or if a particular style option is not set by default, the chart falls back on any style options you set in this option.
                * Styles for specific types of chart text that may use this option as a fallback style are set in the following options:
                * axis x labels style
                *		axis x textStyle
                *		axis y labels style
                *		axis y textStyle
                *		chartLabelStyle
                *		footer textStyle
                *		header textStyle
                *		hint contentStyle
                *		hint titleStyle
                *		legend textStyle
                *		legend titleStyle
                * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                * The style is the “attr” method’s parameters.
                */
                this.textStyle = {
                    fill: "#888",
                    "font-size": 10,
                    stroke: "none"
                };
                /** Sets up the object to use as the header of the barchart.*/
                this.header = {
                    /**
                    * A value that indicates the text to display in the header.
                    * @remarks
                    * If you leave this as an empty string, no header renders, regardless of any other header attributes.
                    */
                    text: "",
                    /**
                    * A value that indicates all of the style attributes to use in rendering the header.
                    * @remarks
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr
                    * The style is the “attr” method’s parameters.
                    */
                    style: {
                        fill: "none",
                        stroke: "none"
                    },
                    /**
                    * A value that indicates the style of the header text.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for any
                    * style options that are not set explicitly (or set by default) in this option.
                    */
                    textStyle: {
                        "font-size": 18,
                        fill: "#666",
                        stroke: "none"
                    },
                    /**
                    * A value that indicates the position of the header in relation to the chart.
                    * @remarks
                    * Valid Values:
                    *		"north" Renders the header above the chart.
                    *		"south" Renders the header below the chart.
                    *		"east" Renders the header to the right of the chart, with the text rotated 90 degrees.
                    *		"west" Renders the header to the left of the chart, with the text rotated 270 degrees.
                    */
                    compass: "north",
                    /**
                    * A value that indicates the visibility of the header.
                    */
                    visible: true
                };
                /**
                * Sets up the object to use as the footer of the barchart.
                */
                this.footer = {
                    /**
                    * A value that indicates the text to display in the footer.
                    * @remarks
                    * If you leave this as an empty string, no footer renders, regardless of any other footer attributes.
                    */
                    text: "",
                    /**
                    * A value that indicates all of the style attributes to use in rendering the footer.
                    * @remarks
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the “attr” method’s parameters.
                    */
                    style: {
                        fill: "#fff",
                        stroke: "none"
                    },
                    /**
                    * A value that indicates the style of the footer text.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for
                    * any style options that are not set explicitly (or set by default) in this option.
                    * The style is defined in Raphael here is the documentation:http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the “attr” method’s parameters.
                    */
                    textStyle: {
                        fill: "#000",
                        stroke: "none"
                    },
                    /**
                    * A value that indicates the position of the footer in relation to the chart.
                    * @remarks
                    * Valid Values:
                    * 		"north" Renders the footer above the chart.
                    *		"south" Renders the footer below the chart.
                    *		"east" Renders the footer to the right of the chart, with the text rotated 90 degrees.
                    *		"west" Renders the footer to the left of the chart, with the text rotated 270 degrees.
                    */
                    compass: "south",
                    /**
                    * A value that indicates the visibility of the footer.
                    */
                    visible: false
                };
                /**
                * Creates a legend object to display with the chart.
                * @remarks
                * By default, each series that you create in the seriesList is represented by a color in the legend,
                * using the seriesList label that you specify. If you do not specify a label,
                * it is labeled "undefined." If you do not want a series to appear in the legend,
                * you can set the seriesList legendEntry attribute to false.
                * By default, users can click a legend entry to toggle the data series it
                * represents in the chart.See Clickable Legend for code that allows you to disable this function.
                * @example
                * // This code creates a chart with a legend that is positioned below the chart (south),
                * // with series labels and colors in a row (horizontal), a grey outline and lighter
                * // grey fill (style), has a title that reads "Legend" (text), has 5 pixels of
                * // space around the text (textMargin), has series labels in a black 12-point font
                * // (textStyle), and has a 14-point font title (titleStyle)
                *    $(document).ready(function () {
                *        $("#wijbarchart").wijbarchart({
                *			legend: {
                *			compass: "south",
                *			orientation: "horizontal",
                *			style: {fill: "gainsboro", stroke: "grey"},
                *			text: "Legend",
                *			textMargin: {left: 5, top: 5, right: 5, bottom: 5 },
                *			textStyle: {fill: "black", "font-size": 12},
                *			titleStyle: {"font-size": 14}
                *			},
                *			seriesList: [{
                *			label: "US",
                *			data: {
                *			x: ['PS3', 'XBOX360', 'Wii'],
                *			y: [12.35, 21.50, 30.56]
                *			}
                *			},
                *			{
                *			label: "Japan",
                *			data: {
                *			x: ['PS3', 'XBOX360', 'Wii'],
                *			y: [4.58, 1.23, 9.67]
                *			}
                *			},
                *			{
                *			label: "Other",
                *			data: {
                *			x: ['PS3', 'XBOX360', 'Wii'],
                *			y: [31.59, 37.14, 65.32]
                *			}
                *			}],
                *		});
                *	});
                */
                this.legend = {
                    // / <summary>
                    /**
                    * A value that indicates the text to use as the title at the top of the legend.
                    * @remarks
                    * Set style properties on this text using the titleStyle attribute.
                    */
                    text: "",
                    /**
                    * A value in pixels that indicates the amount of space to leave around the text inside the legend.
                    */
                    textMargin: { left: 2, top: 2, right: 2, bottom: 2 },
                    /**
                    * A value that indicates the background color (fill) and border (stroke) of the legend.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    style: {
                        fill: "none",
                        stroke: "none"
                    },
                    /**
                    * A value that indicates the width of the legend text.
                    */
                    textWidth: null,
                    /**
                    * A value that indicates the style of the series label text. The text values come from the seriesList labels.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for
                    * any style options that are not set explicitly (or set by default) in this option.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    textStyle: {
                        fill: "#333",
                        stroke: "none"
                    },
                    /**
                    * A value that indicates the style of the legend title. The text for the title is set in the text
                    * attribute of the legend.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for any
                    * style options that are not set explicitly (or set by default) in this option.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    titleStyle: {
                        "font-weight": "bold",
                        fill: "#000",
                        stroke: "none"
                    },
                    /**
                    * A value that indicates the compass position of the legend.
                    * @remarks
                    * Valid Values: "north", "south", "east", "west"
                    */
                    compass: "east",
                    /**
                    * A value that indicates the orientation of the legend.
                    * @remarks
                    * Vertical orientation generally works better with an east or west compass setting for the
                    * legend, while horizontal is more useful with a north or south compass setting and a small
                    * number of series in the seriesList.
                    * Valid Values:
                    *		"horizontal" Displays series labels and colors in a row.
                    *		"vertical" Displays series labels and colors in a column.
                    */
                    orientation: "vertical",
                    /**
                    * A value that indicates whether to show the legend. Set this value to false to hide the legend.
                    */
                    visible: true,
                    reversed: false,
                    size: {}
                };
                /**
                * A value that contains all of the information to create the X and Y axes of the chart
                */
                this.axis = {
                    /**
                    * An object containing all of the information to create the X axis of the chart.
                    */
                    x: {
                        /**
                        * Sets the alignment of the X axis title text.
                        * @remarks
                        * Options are 'center', 'near', 'far'.
                        */
                        alignment: "center",
                        /**
                        * A value that indicates the style of the X axis.
                        * @remarks
                        * The style is defined in Raphael here is the documentation:http://raphaeljs.com/reference.html#Element.attr.
                        * The style is the “attr” method’s parameters.
                        */
                        style: {
                            stroke: "#999999",
                            "stroke-width": 0.5
                        },
                        /**
                        * A value that indicates the visibility of the X axis.
                        */
                        visible: true,
                        /**
                        * A value that indicates the visibility of the X axis text.
                        */
                        textVisible: true,
                        /**
                        * Sets the text to use for the X axis title.
                        */
                        text: "",
                        /**
                        * A value that indicates the style of text of the X axis.
                        * @remarks
                        * Note: Any style options set in the fallback textStyle option are used for
                        * any style options that are not set explicitly (or set by default) in this option.
                        * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                        * The style is the “attr” method’s parameters.
                        */
                        textStyle: {
                            fill: "#888",
                            "font-size": 15,
                            "font-weight": "bold"
                        },
                        /**
                        * A value that provides information for the labels.
                        */
                        labels: {
                            /**
                            * A value that indicates the style of major text of the X axis.
                            * @remarks
                            * Note: Any style options set in the fallback textStyle option are used for any style
                            * options that are not set explicitly (or set by default) in this option.
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: {
                                fill: "#333",
                                "font-size": 11
                            },
                            /**
                            * A value that indicates the alignment of major text of the X axis.
                            * @remarks
                            * Options are 'near', 'center' and 'far'.
                            */
                            textAlign: "near",
                            /**
                            * A value that indicates the width of major text of the X axis.
                            * @remarks
                            * If the value is null, then the width will be calculated automatically.
                            */
                            width: null
                        },
                        /**
                        * A value that indicates where to draw the X axis using the four points of a compass.
                        * @remarks
                        *		"north" Draws the axis along the top edge of the chart.
                        *		"south" Draws the axis along the bottom edge of the chart.
                        *		"east" Draws the axis along the right edge of the chart.
                        *		"west" Draws the axis along the left edge of the chart.
                        */
                        compass: "south",
                        /**
                        * A value that indicates whether to calculate the axis minimum value automatically.
                        * @remarks
                        * If you set this value to false, in order to show major tick marks on the axis, you must
                        * specify a value for the min option.
                        */
                        autoMin: true,
                        /**
                        * A value that indicates whether to calculate the axis maximum value automatically.
                        * @remarks
                        * If you set this value to false, in order to show major tick marks on the axis, you must specify a
                        * value for the max option.
                        */
                        autoMax: true,
                        /**
                        * A value that indicates the minimum value of the axis.
                        @type {?number}
                        */
                        min: null,
                        /**
                        * A value that indicates the maximum value of the axis.
                        * @type {?number}
                        */
                        max: null,
                        /**
                        * A value that indicates the origin value of the X axis.
                        * @type {?number}
                        */
                        origin: null,
                        /**
                        * A value that indicates whether to calculate the major tick mark values automatically.
                        * @remarks
                        * If you set this value to false, in order to show major tick marks on the axis, you must
                        * specify a value for the unitMajor option.
                        */
                        autoMajor: true,
                        /**
                        * A value that indicates whether to calculate the minor tick mark values automatically
                        * @remarks
                        * If you set this value to false, in order to show minor tick marks on the axis, you must
                        * specify a value for the unitMinor option.
                        */
                        autoMinor: true,
                        /**
                        * A value that indicates the units between major tick marks.
                        * @type {?number}
                        */
                        unitMajor: null,
                        /**
                        * A value that indicates the units between minor tick marks.
                        * @type {?number}
                        */
                        unitMinor: null,
                        /**
                        * A value that provides information for the major grid line.
                        */
                        gridMajor: {
                            /**
                            * A value that indicates the visibility of the major grid line.
                            */
                            visible: false,
                            /**
                            * A value that indicates the style of the major grid line
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: {
                                stroke: "#CACACA",
                                "stroke-dasharray": "- "
                            }
                        },
                        /**
                        *  A value that provides information for the minor grid line.
                        */
                        gridMinor: {
                            /**
                            * A value that indicates the visibility of the minor grid line.
                            */
                            visible: false,
                            /**
                            * A value that indicates the style of the minor grid line.
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: {
                                stroke: "#CACACA",
                                "stroke-dasharray": "- "
                            }
                        },
                        /**
                        * Creates an object with all of the settings to use in drawing tick marks that appear next to the numeric
                        * labels for major values along the X axis.
                        */
                        tickMajor: {
                            /**
                            * A value that indicates the position of the major tick mark in relation to the axis.
                            * @remarks
                            * Valid Values: none, inside, outside, cross
                            */
                            position: "none",
                            /**
                            * A value that indicates the style of major tick mark
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: { fill: "black" },
                            /**
                            * A value that indicates an integral factor for major tick mark length.
                            */
                            factor: 1
                        },
                        /**
                        * A value that provides information for the minor tick.
                        */
                        tickMinor: {
                            /**
                            * A value that indicates the type of minor tick mark.
                            * @remarks
                            * Valid Values: none, inside, outside, cross
                            */
                            position: "none",
                            /**
                            * A value that indicates the style of minor tick mark
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: { fill: "black" },
                            /**
                            * A value that indicates an integral factor for minor tick mark length.
                            */
                            factor: 1
                        },
                        /**
                        * The annoMethod option indicates how to label values along the axis.
                        * @remarks
                        * Valid Values:
                        *		"values" Uses numeric seriesList data values to annotate the axis.
                        *		"valueLabels" Uses the array of string values that you provide in the valueLabels option to
                        *			annotate the axis.
                        */
                        annoMethod: "values",
                        /**
                        * The annoFormatString option uses Standard Numeric Format Strings to provide formatting for numeric
                        * values in axis labels.
                        */
                        annoFormatString: "",
                        /**
                        * The valueLabels option shows a collection of valueLabels for the X axis.
                        * @remarks
                        * If the annoMethod is "values", this option will lost effect, If the annoMethod is "valueLabels",
                        * the axis's label will set to this option's value.
                        */
                        valueLabels: []
                    },
                    /**
                    * An object containing all of the information to create the Y axis of the chart.
                    */
                    y: {
                        /**
                        * A value that indicates the alignment of the Y axis text.
                        * @remarks
                        * Options are 'center', 'near', 'far'.
                        */
                        alignment: "center",
                        /**
                        * A value that indicates the style of the Y axis.
                        * @remarks
                        * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                        * The style is the “attr” method’s parameters.
                        */
                        style: {
                            stroke: "#999999",
                            "stroke-width": 0.5
                        },
                        /**
                        * A value that indicates the visibility of the Y axis.
                        */
                        visible: false,
                        /**
                        * A value that indicates the visibility of the Y axis text.
                        */
                        textVisible: true,
                        /**
                        * Sets the text to use for the Y axis title.
                        */
                        text: "",
                        /**
                        * A value that indicates the style of text of the Y axis.
                        * @remarks
                        * Note: Any style options set in the fallback textStyle option are used for any style options that are not
                        * set explicitly (or set by default) in this option.
                        * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                        * The style is the “attr” method’s parameters.
                        */
                        textStyle: {
                            fill: "#888",
                            "font-size": 15,
                            "font-weight": "bold"
                        },
                        /**
                        * A value that provides information for the labels.
                        */
                        labels: {
                            /**
                            * A value that indicates the style of major text of the Y axis.
                            * @remarks
                            * Note: Any style options set in the fallback textStyle option are used for any style options
                            * that are not set explicitly (or set by default) in this option.
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: {
                                fill: "#333",
                                "font-size": 11
                            },
                            /**
                            * A value that indicates the alignment of major text of the Y axis.
                            * @remarks
                            * Options are 'near', 'center' and 'far'.
                            */
                            textAlign: "center",
                            /**
                            * A value that indicates the width major text of the Y axis.
                            * @remarks
                            * If the value is null, then the width will be calculated automatically.
                            * @type {?number}
                            */
                            width: null
                        },
                        /**
                        * A value that indicates the compass position of the Y axis.
                        * @remarks
                        * Options are 'north', 'south', 'east' and 'west'.
                        */
                        compass: "west",
                        /**
                        * A value that indicates whether the axis minimum value is calculated automatically.
                        */
                        autoMin: true,
                        /**
                        * A value that indicates whether the axis maximum value is calculated automatically.
                        */
                        autoMax: true,
                        /**
                        * A value that indicates the minimum value of the axis.
                        * @type {?number}
                        */
                        min: null,
                        /**
                        * A value that indicates the maximum value of the axis.
                        * @type {?number}
                        */
                        max: null,
                        /**
                        * A value that indicates the origin value of the Y axis.
                        * @type {?number}
                        */
                        origin: null,
                        /**
                        * A value that indicates whether the major tick mark values are calculated automatically.
                        */
                        autoMajor: true,
                        /**
                        * A value that indicates whether the minor tick mark values are calculated automatically.
                        */
                        autoMinor: true,
                        /**
                        * A value that indicates the units between major tick marks.
                        * @type {?number}
                        */
                        unitMajor: null,
                        /**
                        * A value that indicates the units between minor tick marks.
                        * @type {?number}
                        */
                        unitMinor: null,
                        /**
                        * A value that provides information for the major grid line.
                        */
                        gridMajor: {
                            /**
                            * A value that indicates the visibility of the major grid line.
                            */
                            visible: true,
                            /**
                            * A value that indicates the style of the major grid line.
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: {
                                stroke: "#999999",
                                "stroke-width": 0.5,
                                "stroke-dasharray": "none"
                            }
                        },
                        /**
                        * A value that provides information for the minor grid line.
                        */
                        gridMinor: {
                            /**
                            * A value that indicates the visibility of the minor grid line.
                            */
                            visible: false,
                            /**
                            * A value that indicates the style of the minor grid line.
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: {
                                stroke: "#CACACA",
                                "stroke-dasharray": "- "
                            }
                        },
                        /**
                        * A value that provides information for the major tick.
                        */
                        tickMajor: {
                            /**
                            * A value that indicates the type of major tick mark.
                            * @remarks
                            * Options are 'none', 'inside', 'outside' and 'cross'.
                            */
                            position: "none",
                            /**
                            * A value that indicates the style of major tick mark.
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: { fill: "black" },
                            /**
                            * A value that indicates an integral factor for major tick mark length.
                            */
                            factor: 1
                        },
                        /**
                        * A value that provides information for the minor tick.
                        */
                        tickMinor: {
                            /**
                            * A value that indicates the type of minor tick mark.
                            * @remarks
                            * Options are 'none', 'inside', 'outside' and 'cross'.
                            */
                            position: "none",
                            /**
                            * A value that indicates the style of minor tick mark.
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            style: { fill: "black" },
                            /**
                            * A value that indicates an integral factor for minor tick mark length.
                            */
                            factor: 1
                        },
                        /**
                        * A value that indicates the method of annotation.
                        * @remarks
                        * Options are 'values', 'valueLabels'. If the value is “values”, when paint axis,
                        * the axis’s label will set to the data value of the series. If the value is “valueLabels”, when paint
                        * the axis, The axis’s label will set to a value which is set in axis’s valueLabels option.
                        */
                        annoMethod: "values",
                        /**
                        * The annoFormatString option uses Standard Numeric Format Strings to provide formatting for numeric
                        * values in axis labels.
                        */
                        annoFormatString: "",
                        /**
                        * The valueLabels option shows a collection of valueLabels for the X axis.
                        * @remarks
                        * If the annoMethod is "values", this option will lost effect, If the annoMethod is "valueLabels",
                        * the axis's label will set to this option's value.
                        */
                        valueLabels: []
                    }
                };
                /**
                * Creates an object to use as the tooltip, or hint, when the mouse is over a chart element.
                * @remarks
                * By default, it displays the value of the seriesList label and Y data for the chart
                */
                this.hint = {
                    /**
                    * A value that indicates whether to show the tooltip.
                    * @remarks
                    * Set this value to false to hide hints even when the mouse is over a chart element.
                    */
                    enable: true,
                    /**
                    * A value that appears in the content part of the tooltip or a function which is
                    * used to get a value for the tooltip shown.
                    * @remarks
                    * If you do not set the content here, the hint displays content in the following order:
                    *  The hint option's title attribute
                    *  The seriesList option's label attribute, which shows "undefined" if you do not provide a label value
                    *  The seriesList option's data y attribute
                    * You can format the numeric Y data in this attribute using a function
                    */
                    content: null,
                    /**
                    * A value that indicates the style of content text.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for any style
                    * options that are not set explicitly (or set by default) in this option.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    contentStyle: {
                        fill: "#d1d1d1",
                        "font-size": 16
                    },
                    /**
                    * A text value (or a function returning a text value) to display in the hint on a line
                    * above the content.
                    */
                    title: null,
                    /**
                    * A value that indicates the style to use for the hint title text.
                    * @remarks
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * he style is the 'attr' method's parameters.
                    */
                    titleStyle: {
                        fill: "#d1d1d1",
                        "font-size": 16
                    },
                    /**
                    * A value that indicates the fill color or gradient and outline thickness and color
                    * (stroke) of the rectangle used to display the hint.
                    * @remarks
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    style: {
                        fill: "#000000",
                        "stroke-width": 2
                    },
                    /**
                    * A value that indicates the effect to use when showing or hiding the hint when showAnimated
                    * or hideAnimated is not specified.
                    * @remarks
                    * The only animation style included is "fade." If you want a different one, you can create a custom animation
                    */
                    animated: "fade",
                    /**
                    * A value that indicates the animation effect to use when the hint appears after you mouse into the chart element.
                    * @remarks
                    * This allows you to use a different effect when you mouse out of a bar than when you mouse in. (See also
                    * hideAnimated.) If you set this value to null, the animated property supplies the animation effect to use.
                    * The only animation style included is "fade." If you want a different one, you can create a custom animation
                    */
                    showAnimated: "fade",
                    /**
                    * A value that indicates the animation effect to use when the hint goes away after you mouse out of the chart element.
                    * @remarks
                    * This allows you to use a different effect when you mouse into a chart elemrnt than when you mouse out.
                    * (See also showAnimated.) If you set this value to null, the animated property supplies the animation
                    * effect to use. The only animation style included is "fade." If you want a different one, you can create
                    * a custom animation
                    */
                    hideAnimated: "fade",
                    /**
                    * A value that indicates the number of milliseconds it takes to show or hide the hint when you mouse over
                    * or mouse out of a bar with the showDuration or hideDuration attribute set to null.
                    */
                    duration: 120,
                    /**
                    * A value that indicates the number of milliseconds it takes for the indicated animation effect to completely
                    * show the tooltip.
                    * @remarks
                    * This allows you to use a different number of milliseconds when you mouse out of a bar than when you mouse in.
                    */
                    showDuration: 120,
                    /**
                    * A value that indicates the number of milliseconds it takes for the indicated animation effect to completely
                    * hide the tooltip.
                    * @remarks
                    * This allows you to use a different number of milliseconds when you mouse into a bar than when you mouse out.
                    */
                    hideDuration: 120,
                    /**
                    * A value that indicates the easing animation used to show or hide the hint when you mouse over or mouse out
                    * of a bar with the showEasing or hideEasing attribute set to null.
                    * @remarks
                    * The easing is defined in Raphael, the documentation is:http://raphaeljs.com/reference.html#Raphael.easing_formulas
                    */
                    easing: "",
                    /**
                    * A value that indicates the easing effect to use when the hint appears after you mouse into the chart element.
                    * @remarks
                    * This allows you to use a different effect when you mouse out of a bar than when you mouse in. (See also
                    * hideEasing.) If you set this value to null, the easing property supplies the easing effect to use.
                    */
                    showEasing: "",
                    /**
                    * A value that indicates the easing effect to use when the hint goes away after you mouse out of the chart element.
                    * @remarks
                    * This allows you to use a different effect when you mouse into a bar than when you mouse out. (See also
                    * showEasing.) If you set this value to null, the easing property supplies the easing effect to use.
                    */
                    hideEasing: "",
                    /**
                    * A value that indicates the number of milliseconds to wait before showing the hint after the mouse moves
                    * into the chart element
                    * @remarks
                    * This allows you to use a different number of milliseconds when you mouse out of a bar than when you mouse in.
                    */
                    showDelay: 0,
                    /**
                    * A value that indicates the number of milliseconds to wait before hiding the hint after the mouse leaves
                    * the chart element
                    * @remarks
                    * This allows you to use a different number of milliseconds when you mouse into a bar than when you mouse out.
                    */
                    hideDelay: 150,
                    /**
                    * A value that indicates the compass position of the callout (the small triangle that points from the main
                    * hint box to the bar it describes) in relation to the hint box.
                    * @remarks
                    * Valid Values: west, east, south, southeast, southwest, northeast and northwest
                    */
                    compass: "north",
                    /**
                    * A value that indicates the horizontal distance in pixels from the mouse pointer to the callout triangle
                    * of the hint.
                    * @remarks
                    * The position of the callout triangle depends on the compass setting of the hint callout.
                    */
                    offsetX: 0,
                    /**
                    * A value that indicates the vertical distance in pixels from the mouse pointer to the callout triangle
                    * of the hint.
                    * @remarks
                    * The position of the callout triangle depends on the compass setting of the hint callout.
                    */
                    offsetY: 0,
                    /**
                    * Determines whether to show the callout element, the small triangle that points from the main hint box
                    * to the bar it describes.
                    * @remarks
                    * To change the appearance of the callout, see these other hint attributes: calloutFilled,calloutFilledStyle,
                    * and compass.
                    */
                    showCallout: true,
                    /**
                    * Determines whether to fill the callout (the small triangle that points from the main hint box to the bar
                    * it describes).
                    * @remarks
                    * If you set it to true, the callout triangle uses the colors you specify in the calloutFilledStyle
                    * attribute. Otherwise, it takes on the colors of the style attribute of the hint.
                    */
                    calloutFilled: false,
                    /**
                    * A value that indicates the style to use in rendering the callout (the small triangle that points from the
                    * main hint box to the bar it describes).
                    * @remarks
                    * In order for this attribute of the callout to take effect, you must also set the calloutFilled attribute
                    * to true. Otherwise, it takes on the colors of the style attribute of the hint.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the “attr” method’s parameters.
                    */
                    calloutFilledStyle: {
                        fill: "#000"
                    },
                    /** @ignore*/
                    beforeShowing: null,
                    /** Determines how to close the tooltip. Behaviors include auto or sticky.
                    * @remarks Options: "auto", "none" and "sticky".
                    */
                    closeBehavior: "auto",
                    /** Determines tooltip should related to mouse or element.
                    * @remarks Options: "mouse" and "element".
                    */
                    relativeTo: "mouse",
                    //bounds: null
                    /**
                    * Determine whether to use a tooltip in html style.
                    * @remarks
                    * If you want display the tooltip with html style, set this property as true.
                    * Note that: This property must work with wijtooltip, if wijmo.wijtooltip is not included,
                    * the tooltip will display as SVG whatever this property is.
                    */
                    isContentHtml: false
                };
                /**
                * Sets up an object that can display an indicator line running horizontally/vertically through the center
                * of each chart element in the chart when the user clicks the chart element.
                */
                this.indicator = {
                    /**
                    * A value that indicates whether to show indicator lines when the user clicks a chart element in the chart.
                    */
                    visible: false,
                    /**
                    * A value that contains the fill color and outline color (stroke) of the indicator lines.
                    * @remarks
                    * Note that when you set the stroke color of the indicator line, it extends this color to the outline
                    * of the #hint:hint for the duration of the click.
                    */
                    style: {
                        stroke: "#000000"
                    }
                };
                /**
                * A value that indicates whether to show default chart labels.
                */
                this.showChartLabels = true;
                /**
                * Sets all of the style options of the chart labels that show the value of each chart element.
                * @remarks
                * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                * The style is the “attr” method’s parameters.
                */
                this.chartLabelStyle = {};
                /**
                * Sets the numeric format of the chart labels that show the value of each chart element. You can use Standard
                * Numeric Format Strings.
                */
                this.chartLabelFormatString = "";
                /**
                * A value that indicates a function which is used to obtain the content part of the chart label for each chart element.
                * @type {function}
                */
                this.chartLabelFormatter = null;
                /**
                * Sets a value indicating whether you can set the font-family of the text using a class instead of options.
                * @remarks
                * Note: This applies only to the font-family in the current version.
                */
                this.disableDefaultTextStyle = false;
                /**
                * A value that indicates whether to show a shadow around the edge of the chart.
                */
                this.shadow = true;
                /**
                * Sets the array to use as a source for data that you can bind to the axes in your seriesList.
                * @remarks
                * Use the data option, and bind values to your X and Y axes. For more information please see the datasource demo:
                * http://wijmo.com/demo/explore/?widget=BarChartsample=Array%20as%20datasource.
                */
                this.dataSource = null;
                /**
                * Bind a field to each series's data x array
                */
                this.data = null;
                /**
                * This event fires before the series changes. This event can be cancelled. "return false;" to cancel the event.
                * @event
                * @dataKey {array} oldSeriesList The old series list before changes.
                * @dataKey {array} newSeriesList The new series list that will replace the old one.
                */
                this.beforeSeriesChange = null;
                /**
                * This event fires when the series changes.
                * @event
                * @dataKey {object} data An object that contains new series values.
                */
                this.seriesChanged = null;
                /**
                * This event fires before the canvas is painted. This event can be cancelled. "return false;" to cancel the event.
                * @event
                */
                this.beforePaint = null;
                /**
                * This event fires after the canvas is painted.
                * @event
                */
                this.painted = null;
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
            }
            return wijchartcore_options;
        })();
        chart.wijchartcore_options = wijchartcore_options;

        var wijchartcore_css = (function (_super) {
            __extends(wijchartcore_css, _super);
            function wijchartcore_css() {
                _super.apply(this, arguments);
                this.headerText = "wijchart-header-text";
                this.headerContainer = "wijchart-header-container";
                this.footerText = "wijchart-footer-text";
                this.footerContainer = "wijchart-footer-container";
                this.legendTitle = "wijchart-legend-title";
                this.legendText = "wijchart-legend-text";
                this.legend = "wijchart-legend";
                this.legendDot = "chart-legend-dot";
                this.legendIcon = "wijchart-legend-icon";
                this.legendContainer = "wijchart-legend-container";
                this.legendTextCover = "wijchart-legend-textCover";
                this.axis = "wijchart-axis";
                this.axisText = "wijchart-axis-text";
                this.axisGridLine = "wijchart-axis-gridline";
                this.axisTick = "wijchart-axis-tick";
                this.axisLabel = "wijchart-axis-label";
                this.labelText = "wijchart-label-text";
                this.labelConnect = "wijchart-label-connect";
                this.canvasObject = "wijchart-canvas-object";
                this.stateDisabled = "ui-state-disabled";
                this.trendlineElement = "trendlineElement";
                this.trendlineTracker = "trendlinetracker";
            }
            return wijchartcore_css;
        })(wijmo.wijmo_css);
        chart.wijchartcore_css = wijchartcore_css;

        wijchartcore.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijchartcore_options());

        

        

        //export class StrokeStyle
        //{
        //    constructor(stroke: string, width: number = 0.5, dasharray: string = "- ")
        //    {
        //        this.stroke = stroke;
        //        this["stroke-width"] = width;
        //        this["stroke-dasharray"] = dasharray;
        //    }
        //    stroke: string;
        //    "stroke-width": number;
        //    "stroke-dasharray": string;
        //}
        //export class TextStyle {
        //    constructor(fill : string, fontSize : number = 14, fontWeight: string = "normal") {
        //        this.fill = fill;
        //        this["font-size"] = fontSize;
        //        this["font-weight"] = fontWeight;
        //    }
        //    fill: string;
        //    "font-size": number;
        //    "font-weight": string;
        //}
        var ChartRendererUtil = (function () {
            function ChartRendererUtil() {
            }
            ChartRendererUtil._text = function (canvas, x, y, text, disableDefaultTextStyle) {
                var textElement = canvas.text(x, y, text);

                if (disableDefaultTextStyle) {
                    textElement.node["style"].cssText = "";
                }

                return textElement;
            };

            ChartRendererUtil._calculateRectPositionByCompass = function (bounds, compass, width, height) {
                var point = { x: 0, y: 0 }, marginX = 5, marginY = 5, canvasBounds = bounds;
                switch (compass) {
                    case "north":
                        point.x = (canvasBounds.endX - canvasBounds.startX) / 2;
                        point.y = canvasBounds.startY + height / 2 + marginY;
                        break;
                    case "south":
                        point.x = (canvasBounds.endX - canvasBounds.startX) / 2;
                        point.y = canvasBounds.endY - height / 2 - marginY;
                        break;
                    case "east":
                        point.x = canvasBounds.endX - width / 2 - marginX;
                        point.y = (canvasBounds.endY - canvasBounds.startY) / 2;
                        break;
                    case "west":
                        point.x = canvasBounds.startX + width / 2 + marginX;
                        point.y = (canvasBounds.endY - canvasBounds.startY) / 2;
                        break;
                }
                return point;
            };

            ChartRendererUtil._updateCanvasBoundsByCompass = function (bounds, compass, width, height) {
                var marginX = 5, marginY = 5, canvasBounds = bounds;
                switch (compass) {
                    case "north":
                        canvasBounds.startY = canvasBounds.startY + marginY * 2 + height;
                        break;
                    case "south":
                        canvasBounds.endY = canvasBounds.endY - marginY * 2 - height;
                        break;
                    case "east":
                        canvasBounds.endX = canvasBounds.endX - marginX * 2 - width;
                        break;
                    case "west":
                        canvasBounds.startX = canvasBounds.startX + marginX * 2 + width;
                        break;
                }
                return canvasBounds;
            };

            ChartRendererUtil._removeRaphaelEle = function (element) {
                if (element) {
                    var node = $(element.node);
                    node.unbind().removeData();
                    element.wijRemove();
                    node.remove();
                    node = null;
                }
                element = null;
            };

            ChartRendererUtil._getCulture = function (culture, cultureCalendar) {
                return $.wijGetCulture(culture, cultureCalendar);
            };
            return ChartRendererUtil;
        })();

        // ** ChartRenderers **
        /** @ignore */
        // ** BaseRendererOption **
        var BaseRendererOptions = (function () {
            function BaseRendererOptions() {
            }
            return BaseRendererOptions;
        })();
        chart.BaseRendererOptions = BaseRendererOptions;

        /** @ignore */
        // ** Base **
        var BaseRenderer = (function () {
            function BaseRenderer(canvas, options) {
                this.canvas = canvas;
                this._initData(options);
            }
            BaseRenderer.prototype.render = function () {
                this._clearElements();

                this._paint();
                this._bindLiveEvents();
            };

            BaseRenderer.prototype.redraw = function (newOpitons) {
                this._initData(newOpitons);
                this.render();
            };

            BaseRenderer.prototype.destroy = function () {
                this._clearElements();
                this.options = null;
                this.canvas = null;
            };

            BaseRenderer.prototype._initData = function (opts) {
                this.options = $.extend(false, {}, this.options, opts);
            };

            BaseRenderer.prototype._paint = function () {
            };

            BaseRenderer.prototype._bindLiveEvents = function () {
            };

            BaseRenderer.prototype._unbindLiveEvents = function () {
            };

            BaseRenderer.prototype._clearElements = function () {
                this._unbindLiveEvents();
            };

            BaseRenderer.prototype._text = function (x, y, text) {
                return ChartRendererUtil._text(this.canvas, x, y, text, this.options.disableDefaultTextStyle);
            };
            return BaseRenderer;
        })();
        chart.BaseRenderer = BaseRenderer;

        /** @ignore */
        // ** EdgeElement : Base of Title, Legend **
        // This element will be located at the edge of canvas,
        // rendering this element will make canvasBounds changed.
        var EdgeElement = (function (_super) {
            __extends(EdgeElement, _super);
            function EdgeElement() {
                _super.apply(this, arguments);
            }
            EdgeElement.prototype._initData = function (opts) {
                _super.prototype._initData.call(this, opts);

                this.updatedCanvasBounds = this.options.canvasBounds;
            };

            EdgeElement.prototype.render = function () {
                _super.prototype.render.call(this);
                this._getUpdatedCanvasBounds();
            };

            EdgeElement.prototype._getUpdatedCanvasBounds = function () {
                var o = this.options, bounds = o.canvasBounds, compass = o.compass, textBBox;

                if (this.container) {
                    textBBox = this.container.wijGetBBox();
                    this.updatedCanvasBounds = ChartRendererUtil._updateCanvasBoundsByCompass(bounds, compass, textBBox.width, textBBox.height);
                }
            };
            return EdgeElement;
        })(BaseRenderer);
        chart.EdgeElement = EdgeElement;

        /** @ignore */
        // ** Title **
        /*
        Options for title:
        text,
        visible,
        
        compass,
        canvasBounds,
        position,
        offset,
        
        textCSS,
        textStyle,
        containerCSS,
        containerStyle
        */
        var Title = (function (_super) {
            __extends(Title, _super);
            function Title(canvas, options) {
                _super.call(this, canvas, options);
                this.titleMargin = 2;
            }
            Title.prototype._paint = function () {
                this._paintTitle();
            };

            Title.prototype._paintTitle = function () {
                var o = this.options, text = o.text, visible = o.visible, compass = o.compass, rotation, titleTextClass = o.textCSS, titleTextStyle = o.textStyle, titleClass = o.containerCSS, titleStyle = o.containerStyle, textBox, rectBox, bounds = o.canvasBounds, position = o.position, offset = $.extend(offset, { x: 0, y: 0 }, o.offset);

                if (text && text.length > 0 && visible) {
                    this.titleTextEle = this._text(0, 0, text);
                    $.wijraphael.addClass($(this.titleTextEle.node), titleTextClass);

                    rotation = this._getTitleRotationByCompass(compass);

                    this.titleTextEle.attr(titleTextStyle);
                    this.titleTextEle.transform("...R" + rotation);
                    textBox = this.titleTextEle.wijGetBBox();

                    rectBox = {
                        width: textBox.width + 2 * this.titleMargin,
                        height: textBox.height + 2 * this.titleMargin
                    };
                    this.container = this.canvas.rect(0, 0, rectBox.width, rectBox.height);

                    if (compass && !position) {
                        position = ChartRendererUtil._calculateRectPositionByCompass(bounds, compass, textBox.width, textBox.height);
                    }
                    if (position) {
                        this._setTitlePosition(position);
                    }

                    $.wijraphael.addClass($(this.container.node), titleClass);
                    this.container.attr(titleStyle);
                    this.container.toBack();
                }
            };

            Title.prototype._getTitleRotationByCompass = function (compass) {
                var rotation = 0;

                if (compass === "east") {
                    rotation = 90;
                } else if (compass === "west") {
                    rotation = -90;
                }

                return rotation;
            };

            Title.prototype._setTitlePosition = function (position) {
                var offset = $.extend(offset, { x: 0, y: 0 }, this.options.offset), newPosition = {
                    x: position.x += offset.x,
                    y: position.y += offset.y
                }, containerSize = this.container.wijGetBBox();

                this.titleTextEle.transform(Raphael.format("...T{0},{1}", newPosition.x, newPosition.y));
                this.container.transform(Raphael.format("...T{0},{1}", newPosition.x - containerSize.width / 2, newPosition.y - containerSize.height / 2));
            };

            Title.prototype._clearElements = function () {
                _super.prototype._clearElements.call(this);
                var txtNode, retNode;

                ChartRendererUtil._removeRaphaelEle(this.titleTextEle);
                ChartRendererUtil._removeRaphaelEle(this.container);

                this.titleTextEle = null;
                this.container = null;
            };
            return Title;
        })(EdgeElement);
        chart.Title = Title;

        

        /** @ignore */
        // ** LegendOptions **
        var LegendRendererOptions = (function (_super) {
            __extends(LegendRendererOptions, _super);
            function LegendRendererOptions() {
                _super.apply(this, arguments);
            }
            return LegendRendererOptions;
        })(BaseRendererOptions);
        chart.LegendRendererOptions = LegendRendererOptions;

        

        

        /** @ignore */
        // ** Legend **
        var Legend = (function (_super) {
            __extends(Legend, _super);
            function Legend(canvas, options) {
                this.nodeSetList = [];
                this.nodeClass = "wijlegend-node";
                _super.call(this, canvas, options);
            }
            Legend.prototype._initData = function (opts) {
                if (this.options && opts.legendInfoList) {
                    this.options.legendInfoList = [];
                }
                _super.prototype._initData.call(this, opts);
            };

            Legend.prototype._paint = function () {
                this._paintLegend();
            };

            Legend.prototype._paintLegend = function () {
                var self = this, o = self.options, labelSet, iconSet, position;

                this.titleEle = this._paintTitle();

                $.each(o.legendInfoList, function (idx, legendInfo) {
                    labelSet = self._paintLabelSet(legendInfo);
                    iconSet = self._paintIconSet(legendInfo);

                    self.nodeSetList[idx] = $.extend(true, {}, self.nodeSetList[idx], {
                        label: labelSet.label,
                        labelCover: labelSet.labelCover,
                        icon: iconSet.icon,
                        marker: iconSet.marker
                    });
                });

                // Calculate layout informations
                self.layoutInfo = self._calculateLayout();
                position = self.layoutInfo.position;

                self.container = self._paintContainer(position.x, position.y, self.layoutInfo.width, self.layoutInfo.height);

                self._setElementsPosition();
            };

            // Position of title will be calculated and set after labels and icons rendered.
            Legend.prototype._paintTitle = function () {
                var o = this.options, titleText = o.title, titleEle;

                if (titleText && titleText.length) {
                    titleEle = this._text(0, 0, titleText);
                    $.wijraphael.addClass($(titleEle.node), o.titleCSS);
                    titleEle.wijAttr(o.titleStyle);
                }

                return titleEle;
            };

            Legend.prototype._paintContainer = function (x, y, width, height) {
                var o = this.options, container;

                container = this.canvas.rect(x, y, width, height);
                $.wijraphael.addClass($(container.node), o.legendCSS);
                container.attr(o.legendStyle);
                container.toBack();

                return container;
            };

            Legend.prototype._paintLabelSet = function (legendInfo) {
                var self = this, o = self.options, labelStyle = o.labelStyle, labelEles, labelEle, labelCover, bBox;

                if (o.labelWidth) {
                    labelEles = self.canvas.wrapText(0, 0, legendInfo.label, o.labelWidth, "far", labelStyle);
                    bBox = labelEles.wijGetBBox();
                } else {
                    labelEle = this._text(0, 0, legendInfo.label);
                    labelEle.wijAttr(labelStyle);
                    bBox = labelEle.wijGetBBox();
                    labelEles = [labelEle];
                }

                $.each(labelEles, function (i, t) {
                    $.wijraphael.addClass($(t.node), o.labelCSS + " " + self.nodeClass);
                    $(t.node).data("vOpacity", t.attr("opacity")).data("legendIndex", legendInfo.legendIdx).data("index", legendInfo.seriesIdx);

                    self._setElementVisibility(t, legendInfo.seriesVisible);
                });

                if (Raphael.vml) {
                    labelCover = self.canvas.rect(0, 0, bBox.width, bBox.height);
                    labelCover.attr({
                        stroke: "none",
                        fill: "#000000",
                        opacity: 0.01
                    });
                    $.wijraphael.addClass($(labelCover.node), o.labelCoverCSS + " " + self.nodeClass);
                    $(labelCover.node).data("legendIndex", legendInfo.legendIdx).data("index", legendInfo.seriesIdx);
                }

                return {
                    label: o.labelWidth ? labelEles : labelEle,
                    labelCover: labelCover
                };
            };

            Legend.prototype._paintIconSet = function (legendInfo) {
                var o = this.options, iconWidth = o.iconSize.width || 0, iconHeight = o.iconSize.height || 0, r, legendIndex = legendInfo.legendIdx, seriesIndex = legendInfo.seriesIdx, iconStyle = legendInfo.iconStyle, strokeWidth = iconStyle["stroke-width"] || 0, iconType = legendInfo.icon, markerType = legendInfo.markers, markerStyle = legendInfo.markerStyle, icon, marker;

                if (iconType === "rect") {
                    icon = this.canvas.rect(0, 0, iconWidth, iconHeight);
                } else if (iconType === "line") {
                    icon = this.canvas.path(Raphael.format("M{0},{1}L{2},{3}", 0, 0, iconWidth, 0));
                } else {
                    if (legendInfo.iconSize) {
                        r = legendInfo.iconSize.r;
                    }
                    if (!r) {
                        r = o.iconSize.r || 0;
                    }
                    icon = icon = this.canvas.paintMarker(iconType, 0, 0, r / 2);
                }
                if (iconStyle) {
                    icon.attr(iconStyle);
                }

                $(icon.node).data("vOpacity", icon.attr("opacity")).data("legendIndex", legendIndex).data("index", seriesIndex);

                $.wijraphael.addClass($(icon.node), o.iconCSS + " " + this.nodeClass);

                this._setElementVisibility(icon, legendInfo.seriesVisible);

                if (markerType && legendInfo.markerVisible) {
                    markerStyle = $.extend({
                        fill: iconStyle.fill,
                        stroke: iconStyle.stroke,
                        opacity: 1
                    }, markerStyle);

                    if (!markerType) {
                        markerType = "circle";
                    }
                    marker = this.canvas.paintMarker(markerType, 0, 0, 3);
                    $.wijraphael.addClass($(marker.node), this.options.markerCSS + " " + this.nodeClass);
                    marker.attr(markerStyle);
                    $(marker.node).data("vOpacity", marker.attr("opacity")).data("index", seriesIndex).data("legendIndex", legendIndex);

                    this._setElementVisibility(marker, legendInfo.seriesVisible);
                }
                return {
                    icon: icon,
                    marker: marker
                };
            };

            Legend.prototype._setElementVisibility = function (legendEle, eleVisible) {
                if (!legendEle) {
                    return;
                }
                var node = $(legendEle.node), vOpacity;
                if (!node || node.length === 0) {
                    return;
                }
                if (!eleVisible) {
                    legendEle.attr("opacity", "0.3");
                    node.data("hidden", true);
                } else {
                    vOpacity = node.data("vOpacity") || 1;
                    legendEle.attr("opacity", vOpacity);
                    node.data("hidden", false);
                }
            };

            Legend.prototype._calculateLayout = function () {
                var self = this, o = self.options, compass = o.compass, orientation = o.orientation, titleBox, titleHeight = 0, titleWidth = 0, bBox, maxLabelWidth = 0, maxLabelHeight = 0, legendLen = self.nodeSetList.length, totalWidth = 0, totalHeight = 0, iconWidth = o.iconSize.width || 0, iconHeight = o.iconSize.height || 0, legendMargin = o.legendMargin || 0, labelMargin = o.labelMargin, canvasBounds = o.canvasBounds, canvasWidth = canvasBounds.endX - canvasBounds.startX, canvasHeight = canvasBounds.endY - canvasBounds.startY, columnNum = 1, rowNum = 1, legendNodeWidth, legendNodeHeight, width, height, position;

                if (this.titleEle) {
                    titleBox = this.titleEle.wijGetBBox();
                    titleHeight = titleBox.height;
                    titleWidth = titleBox.width;
                }

                $.each(self.nodeSetList, function (idx, legendNodeSet) {
                    bBox = legendNodeSet.label.wijGetBBox();
                    if (bBox.width > maxLabelWidth) {
                        maxLabelWidth = bBox.width;
                    }
                    if (bBox.height > maxLabelHeight) {
                        maxLabelHeight = bBox.height;
                    }
                });

                legendNodeWidth = iconWidth + maxLabelWidth + legendMargin + labelMargin.left + labelMargin.right;
                legendNodeHeight = maxLabelHeight + labelMargin.top + labelMargin.bottom;

                totalWidth = legendLen * legendNodeWidth;
                totalHeight = legendLen * legendNodeHeight + titleHeight;
                if (compass === "east" || compass === "west") {
                    if (orientation === "horizontal") {
                        if (totalWidth > canvasWidth / 2) {
                            columnNum = Math.floor(canvasWidth / 2 / legendNodeWidth);
                            if (columnNum < 1) {
                                columnNum = 1;
                            }
                        } else {
                            columnNum = legendLen;
                        }
                    } else if (orientation === "vertical") {
                        if (totalHeight > canvasHeight) {
                            columnNum = Math.ceil(totalHeight / canvasHeight);
                        } else {
                            columnNum = 1;
                        }
                    }
                } else if (compass === "south" || compass === "north") {
                    if (orientation === "horizontal") {
                        if (totalWidth > canvasWidth) {
                            columnNum = Math.floor(legendLen / totalWidth * canvasWidth);
                            if (columnNum < 1) {
                                columnNum = 1;
                            }
                        } else {
                            columnNum = legendLen;
                        }
                    } else if (orientation === "vertical") {
                        if (totalHeight > canvasHeight / 2) {
                            rowNum = Math.floor(canvasHeight - titleHeight) / 2 / maxLabelHeight;
                            columnNum = Math.ceil(legendLen / rowNum);
                        } else {
                            columnNum = 1;
                        }
                    }
                }

                if (columnNum === 0) {
                    columnNum = 1;
                }

                width = columnNum * (maxLabelWidth + iconWidth + legendMargin) + columnNum * (labelMargin.left + labelMargin.right);
                rowNum = Math.ceil(legendLen / columnNum);
                height = maxLabelHeight * rowNum + titleHeight + rowNum * (labelMargin.top + labelMargin.bottom);

                width = width > titleWidth ? width : titleWidth;

                position = ChartRendererUtil._calculateRectPositionByCompass(canvasBounds, compass, width, height);
                position.x -= width / 2;
                position.y -= height / 2;

                return {
                    width: width,
                    height: height,
                    legendNodeWidth: legendNodeWidth,
                    legendNodeHeight: legendNodeHeight,
                    columnNum: columnNum,
                    rowNum: rowNum,
                    position: position
                };
            };

            Legend.prototype._setElementsPosition = function () {
                var self = this, o = self.options, compass = o.compass, legendMargin = o.legendMargin || 0, iconWidth = o.iconSize.width || 0, iconHeight = o.iconSize.height || 0, legendLayout = self.layoutInfo, position = legendLayout.position, width = legendLayout.width, height = legendLayout.height, legendNodeWidth = legendLayout.legendNodeWidth, legendNodeHeight = legendLayout.legendNodeHeight, columnNum = legendLayout.columnNum, columnIndex = 0, centerPoint, left, top, titleHeight = 0, offsetY;

                left = position.x;
                top = position.y;

                if (self.titleEle) {
                    titleHeight = self.titleEle.wijGetBBox().height;
                    self.titleEle.transform(Raphael.format("...T{0},{1}", left + width / 2, top + titleHeight / 2));
                }

                offsetY = titleHeight;

                $.each(self.nodeSetList, function (idx, legendNodeSet) {
                    var legendInfo = self.options.legendInfoList[idx], iconType = legendInfo.icon, label = legendNodeSet.label, labelCover = legendNodeSet.labelCover, icon = legendNodeSet.icon, marker = legendNodeSet.marker, labelBBox, strokeWidth, label0, x, y;

                    strokeWidth = legendInfo.iconStyle["stroke-width"] || 0;

                    x = left + columnIndex * legendNodeWidth + o.labelMargin.left + columnIndex * strokeWidth;
                    y = top + offsetY + legendNodeHeight / 2;

                    labelBBox = label.wijGetBBox();
                    label0 = o.labelWidth ? label[0] : label;

                    if (iconType === "rect") {
                        icon.transform(Raphael.format("...T{0},{1}", x, y - iconHeight / 2 - strokeWidth));
                    } else if (iconType === "line") {
                        icon.transform(Raphael.format("...T{0},{1}", x, y));
                    } else {
                        icon.transform(Raphael.format("...T{0},{1}", x + iconWidth / 2, y));
                    }
                    if (marker) {
                        marker.transform(Raphael.format("...T{0},{1}", x + iconWidth / 2, y));
                    }

                    if (o.labelStyle["text-anchor"] === "start") {
                        x -= labelBBox.width / 2;
                    }

                    if (o.labelWidth) {
                        label.transform(Raphael.format("...T{0},{1}", x + iconWidth + legendMargin, y - labelBBox.height / 2));
                    } else {
                        label.transform(Raphael.format("...T{0},{1}", x + iconWidth + legendMargin + labelBBox.width / 2, y));
                    }
                    if (labelCover) {
                        labelCover.transform(Raphael.format("...T{0},{1}", x + iconWidth + legendMargin, y - labelBBox.height / 2));
                        labelCover.toFront();
                    }
                    label.toFront();

                    columnIndex++;
                    if (columnIndex === columnNum) {
                        columnIndex = 0;
                        offsetY += legendNodeHeight;
                    }
                });
            };

            Legend.prototype._bindLiveEvents = function () {
                var self = this, o = self.options;

                $(self.canvas.canvas).on("click.Legend", "." + this.nodeClass, function (e) {
                    self._triggerNodeClick($(e.currentTarget));
                });
            };

            Legend.prototype._triggerNodeClick = function (node) {
                var legendIdx = node.data("legendIndex"), seriesIdx = node.data("index"), nodeVisible = !node.data("hidden"), clickFunc = this.options.legendClickFunc, eventData, vOpacity, legendNodeSet, labelCover;

                if (this.options.disabled) {
                    return;
                }

                eventData = {
                    seriesIdx: node.data("index"),
                    legendIdx: node.data("legendIndex"),
                    visible: nodeVisible
                };
                legendNodeSet = this.nodeSetList[legendIdx];

                var result = true;
                if (clickFunc && typeof clickFunc === "function") {
                    result = (clickFunc(eventData) !== "false");
                }
                if (result) {
                    this._setElementVisibility(legendNodeSet.label, !nodeVisible);
                    this._setElementVisibility(legendNodeSet.icon, !nodeVisible);
                    this._setElementVisibility(legendNodeSet.marker, !nodeVisible);

                    labelCover = legendNodeSet.labelCover;
                    if (labelCover) {
                        if (nodeVisible) {
                            $(labelCover.node).data("hidden", true);
                        } else {
                            $(labelCover.node).data("hidden", false);
                        }
                    }
                }
            };

            Legend.prototype._unbindLiveEvents = function () {
                _super.prototype._unbindLiveEvents.call(this);

                $(this.canvas.canvas).off("click.Legend");
            };

            Legend.prototype._clearElements = function () {
                _super.prototype._clearElements.call(this);

                ChartRendererUtil._removeRaphaelEle(this.titleEle);
                this.titleEle = null;

                for (var i = 0; i < this.nodeSetList.length; i++) {
                    ChartRendererUtil._removeRaphaelEle(this.nodeSetList[i].label);
                    ChartRendererUtil._removeRaphaelEle(this.nodeSetList[i].labelCover);
                    ChartRendererUtil._removeRaphaelEle(this.nodeSetList[i].icon);
                    ChartRendererUtil._removeRaphaelEle(this.nodeSetList[i].marker);
                    this.nodeSetList[i] = null;
                }
                this.nodeSetList = [];
            };
            return Legend;
        })(EdgeElement);
        chart.Legend = Legend;

        /** @ignore */
        // ** AxisOptions **
        var AxisRendererOptions = (function (_super) {
            __extends(AxisRendererOptions, _super);
            function AxisRendererOptions() {
                _super.apply(this, arguments);
            }
            return AxisRendererOptions;
        })(BaseRendererOptions);
        chart.AxisRendererOptions = AxisRendererOptions;

        /** @ignore */
        // ** Axis **
        var Axis = (function (_super) {
            __extends(Axis, _super);
            function Axis(canvas, options) {
                this.thickness = 2;
                this.majorSizeFactor = 3;
                this.minorSizeFactor = 2;
                this.canvasBounds = options.canvasBounds;
                _super.call(this, canvas, options);

                this.axisDotGroupList = [];
                this.axisElements = [];
            }
            Axis.prototype._initData = function (opts) {
                _super.prototype._initData.call(this, opts);

                this._initStartEndPoints();

                this.majorTickRect = this._getTickRect(true);
                this.minorTickRect = this._getTickRect(false);

                this.majorTickValues = this._getMajorTickValues();
                this.minorTickValues = this._getMinorTickValues();
            };

            Axis.prototype._initStartEndPoints = function () {
                var o = this.options, compass = o.compass, bounds = o.canvasBounds;

                var startPoint = { x: 0, y: 0 }, endPoint = { x: 0, y: 0 }, thickness = this.thickness;

                switch (compass) {
                    case "south":
                        startPoint.x = bounds.startX;
                        startPoint.y = bounds.endY;
                        endPoint.x = bounds.endX;
                        endPoint.y = bounds.endY;
                        break;
                    case "north":
                        startPoint.x = bounds.startX;
                        startPoint.y = bounds.startY - thickness;
                        endPoint.x = bounds.endX;
                        endPoint.y = bounds.startY - thickness;
                        break;
                    case "east":
                        startPoint.x = bounds.endX - thickness;
                        startPoint.y = bounds.endY;
                        endPoint.x = bounds.endX - thickness;
                        endPoint.y = bounds.startY;
                        if (o.axisOffset) {
                            startPoint.x += o.axisOffset;
                            endPoint.x += o.axisOffset;
                        }
                        break;
                    case "west":
                        startPoint.x = bounds.startX;
                        startPoint.y = bounds.endY;
                        endPoint.x = bounds.startX;
                        endPoint.y = bounds.startY;
                        if (o.axisOffset) {
                            startPoint.x -= o.axisOffset;
                            endPoint.x -= o.axisOffset;
                        }
                        break;
                }

                this.startPoint = startPoint;
                this.endPoint = endPoint;
            };

            Axis.prototype._paint = function () {
                var self = this;
                self.axisElements = [];
                self._paintAxis();

                if (self.axisMainLineEle) {
                    self.axisElements.push(self.axisMainLineEle);
                }

                $.each(self.axisDotGroupList, function (idx, dotGroup) {
                    if (dotGroup.tick) {
                        self.axisElements.push(dotGroup.tick);
                    }
                    if (dotGroup.label) {
                        self.axisElements.push(dotGroup.label);
                    }
                    if (dotGroup.gridSet) {
                        if (dotGroup.gridSet.gridLine) {
                            self.axisElements.push(dotGroup.gridSet.gridLine);
                        }
                        if (dotGroup.gridSet.vlGridLine) {
                            self.axisElements.push(dotGroup.gridSet.vlGridLine);
                        }
                    }
                });

                if (self.axisTitleEle) {
                    self.axisElements.push(self.axisTitleEle);
                }
            };

            Axis.prototype._paintAxis = function () {
                var self = this, o = self.options, canvasBounds = o.canvasBounds, startPoint = self.startPoint, endPoint = self.endPoint, compass = o.compass, isVertical = (compass === "east" || compass === "west"), max = o.max, min = o.min, labelInfo = o.labelOptions, maxLen = 0, index = 0, formatString = o.annoFormatString, labelObjs = [], labelEle, labelEleBox, len, labelOffset;

                self.axisMainLineEle = self._paintMainAxisLine();

                $.each(this.majorTickValues, function (idx, val) {
                    var text = val, isTime = o.isTime, is100Percent = o.is100Percent, vlGridLine = false, vlGridLineStyle = {}, singleDotGroup;

                    if (val < min || val > max) {
                        index++;
                        return true;
                    }

                    if (o.annoMethod === "valueLabels") {
                        if (index >= o.valueLabels.length) {
                            return false;
                        }
                        text = o.valueLabels[index];
                        vlGridLine = text.gridLine;
                        vlGridLineStyle = text.gridLineStyle;
                        if (text.text !== null && text.text !== undefined) {
                            text = text.text;
                        } else if (typeof text.value !== "undefined") {
                            text = text.value;
                            if (o.annoFormatString && o.annoFormatString.length) {
                                text = Globalize.format(text, o.annoFormatString, ChartRendererUtil._getCulture(o.culture, o.cultureCalendar));
                            }
                        }
                    } else if (o.annoMethod === "values") {
                        if (o.annoFormatString && o.annoFormatString.length) {
                            if (isTime) {
                                text = $.fromOADate(val);
                            }
                            text = Globalize.format(text, o.annoFormatString, ChartRendererUtil._getCulture(o.culture, o.cultureCalendar));
                        } else if (is100Percent) {
                            text = Globalize.format(val, "p0", ChartRendererUtil._getCulture(o.culture, o.cultureCalendar));
                        }
                    }
                    singleDotGroup = self._paintSingleDotGroup(val, text, true, vlGridLine, vlGridLineStyle);

                    self.axisDotGroupList.push(singleDotGroup);

                    labelEle = singleDotGroup.label;
                    if (labelEle) {
                        labelEleBox = labelEle.getBBox();
                        len = isVertical ? labelEleBox.width : labelEleBox.height;
                        if (maxLen < len) {
                            maxLen = len;
                        }
                        labelObjs.push({
                            label: labelEle,
                            length: len
                        });
                    }

                    index++;
                });

                if (!labelInfo.width && labelInfo.textAlign !== "center") {
                    $.each(labelObjs, function (idx, labelObj) {
                        labelEle = labelObj.label;
                        if (labelEle) {
                            len = labelObj.length;
                            labelOffset = (len - maxLen) / 2;
                            labelOffset = labelInfo.textAlign === "near" ? labelOffset * -1 : labelOffset;
                            if (isVertical) {
                                labelEle.transform(Raphael.format("...T{0},{1}", labelOffset, 0));
                            } else {
                                labelEle.transform(Raphael.format("...T{0},{1}", 0, labelOffset));
                            }
                        }
                    });
                }

                $.each(this.minorTickValues, function (idx, val) {
                    self.axisDotGroupList.push(self._paintSingleDotGroup(val, null, false));
                });

                self.axisTitleEle = this._paintAxisTitle();
            };

            Axis.prototype._paintMainAxisLine = function () {
                var axisMainLineEle, o = this.options, startPoint = this.startPoint, endPoint = this.endPoint;

                if (o.visible) {
                    axisMainLineEle = this.canvas.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y).attr(o.axisStyle);
                    $.wijraphael.addClass($(axisMainLineEle.node), o.axisCSS);
                }

                return axisMainLineEle;
            };

            Axis.prototype._paintSingleDotGroup = function (tickValue, text, isMajor, vlGridLine, vlGridLineStyle) {
                var tickElement, singleGridSet, labelElement, self = this, o = self.options, tickInfo = (isMajor ? o.tickMajor : o.tickMinor), tickRect = (isMajor ? this.majorTickRect : this.minorTickRect), grid = (isMajor ? o.gridMajor : o.gridMinor), positionInfo;

                positionInfo = self._getSingleDotPositionInfo(tickValue, tickInfo, tickRect);

                singleGridSet = this._paintGridLine(positionInfo.x, positionInfo.y, grid, vlGridLine, vlGridLineStyle);
                tickElement = this._paintTick(positionInfo.x, positionInfo.y, tickInfo, tickRect);

                if (text != null && text !== undefined) {
                    labelElement = this._paintLabel(positionInfo.labelX, positionInfo.labelY, text.toString());
                }
                return {
                    tick: tickElement,
                    label: labelElement,
                    gridSet: singleGridSet
                };
            };

            Axis.prototype._getSingleDotPositionInfo = function (tickValue, tickInfo, tickRect) {
                var x, y, labelX = -1, labelY = -1, o = this.options, max = o.max, min = o.min, tick = tickInfo.position, tHeight = tickRect.height, tWidth = tickRect.width, labelWidth = o.labelOptions.width, axisMaxLabelSize = o.axisMaxLabelSize, axisLabelOffset = o.axisLabelOffset, startPoint = this.startPoint, endPoint = this.endPoint, compass = o.compass, isVertical = (compass === "east" || compass === "west");

                x = startPoint.x;
                y = startPoint.y;

                switch (compass) {
                    case "south":
                        if (tick === "inside") {
                            y -= tHeight;
                        } else if (tick === "cross") {
                            y -= tHeight / 2;
                        }
                        if (labelWidth) {
                            labelY = y + axisLabelOffset + tHeight;
                        } else {
                            labelY = y + axisLabelOffset + tHeight + axisMaxLabelSize / 2;
                        }
                        break;
                    case "north":
                        if (tick === "outside") {
                            y -= tHeight;
                        } else if (tick === "cross") {
                            y -= tHeight / 2;
                        }
                        if (labelWidth) {
                            labelY = y - (axisLabelOffset + axisMaxLabelSize);
                        } else {
                            labelY = y - (axisLabelOffset + axisMaxLabelSize / 2);
                        }
                        break;
                    case "west":
                        if (tick === "outside") {
                            x -= tWidth;
                        } else if (tick === "cross") {
                            x -= tWidth / 2;
                        }
                        if (labelWidth) {
                            labelX = x - (axisLabelOffset + axisMaxLabelSize);
                        } else {
                            labelX = x - (axisLabelOffset + axisMaxLabelSize / 2);
                        }
                        break;
                    case "east":
                        if (tick === "inside") {
                            x -= tWidth;
                        } else if (tick === "cross") {
                            x -= tWidth / 2;
                        }
                        if (labelWidth) {
                            labelX = x + axisLabelOffset + tWidth;
                        } else {
                            labelX = x + axisLabelOffset + tWidth + axisMaxLabelSize / 2;
                        }
                        break;
                }

                if (isVertical) {
                    y += (tickValue - min) / (max - min) * (endPoint.y - startPoint.y);
                    labelY = y;
                } else {
                    x += (tickValue - min) / (max - min) * (endPoint.x - startPoint.x);
                    if (labelWidth) {
                        labelX = x - labelWidth / 2;
                    } else {
                        labelX = x;
                    }
                }

                return {
                    x: x, y: y,
                    labelX: labelX, labelY: labelY
                };
            };

            Axis.prototype._paintGridLine = function (x, y, gridInfo, vGridLine, vlGridLineStyle) {
                var o = this.options, bs = o.canvasBounds, isVertical = (o.compass === "east" || o.compass === "west"), arrPath, gridEle, vlGridEle;

                if (isVertical) {
                    arrPath = ["M", bs.startX, y, "H", bs.endX];
                } else {
                    arrPath = ["M", x, bs.startY, "V", bs.endY];
                }

                if (gridInfo.visible) {
                    gridEle = this.canvas.path(arrPath.join(" "));
                    $.wijraphael.addClass($(gridEle.node), o.gridCSS);
                    gridEle.attr(gridInfo.style);
                }
                if (vGridLine) {
                    vlGridEle = this.canvas.path(arrPath.join(" "));
                    $.wijraphael.addClass($(vlGridEle.node), o.gridCSS);
                    vlGridEle.attr($.extend(true, {}, gridInfo.style, vlGridLineStyle));
                }

                return {
                    gridLine: gridEle,
                    vlGridLine: vlGridEle
                };
                // TODO in chartcore: Hide or remove the gridLine which has same position with other "Axis Main Line".
            };

            Axis.prototype._paintTick = function (x, y, tickInfo, tickRect) {
                var o = this.options, tickPosition = tickInfo.position, tickStyle = tickInfo.style, isVertical = (o.compass === "east" || o.compass === "west"), style = { "stroke-width": 2 }, pathArr, tickElement;

                if (isVertical) {
                    if (tickPosition !== "none") {
                        pathArr = ["M", x, y, "h", tickRect.width];
                        tickStyle["stroke-width"] = tickRect.height;
                    }
                } else {
                    if (tickPosition !== "none") {
                        pathArr = ["M", x, y, "v", tickRect.height];
                        tickStyle["stroke-width"] = tickRect.width;
                    }
                }

                if (tickPosition !== "none") {
                    tickElement = this.canvas.path(pathArr.join(" "));
                    $.wijraphael.addClass($(tickElement.node), o.tickCSS);
                    style = $.extend(style, tickStyle);
                    tickElement.attr(style);
                }

                return tickElement;
            };

            Axis.prototype._paintLabel = function (x, y, text) {
                var self = this, o = self.options, textVisible = o.titleVisible, textStyle = o.labelStyle, textAlign = o.labelOptions.textAlign, labelWidth = o.labelOptions.width, txt, textBounds, textEle, isVertical = o.compass === "east" || o.compass === "west";

                if (text !== null && textVisible) {
                    if (labelWidth) {
                        txt = self.canvas.wrapText(x, y, text.toString(), labelWidth, textAlign, textStyle);
                        $.wijraphael.addClass($(txt.node), o.labelCSS);
                    } else {
                        txt = this._text(x, y, text.toString());
                        $.wijraphael.addClass($(txt.node), o.labelCSS);
                        txt.attr(textStyle);
                    }
                }
                return txt;
            };

            Axis.prototype._paintAxisTitle = function () {
                var axisTitleElement, self = this, o = self.options, canvasBounds = o.canvasBounds, titleText = o.titleText, titleTextStyle = o.titleStyle, compass = o.compass, align = o.titleAlignment, isVertical = (compass === "east" || compass === "west"), axisOffset = o.axisOffset, axisLabelOffset = o.axisLabelOffset, tickRectMajor = this.majorTickRect, tickPosition = o.tickMajor.position, tickLength = isVertical ? tickRectMajor.width : tickRectMajor.height, startX = canvasBounds.startX, startY = canvasBounds.startY, endX = canvasBounds.endX, endY = canvasBounds.endY, x = startX, y = startY, margin = { top: 0, bottom: 0, left: 0, right: 0 }, titleBounds;

                if (!(titleText && titleText.length)) {
                    return null;
                }
                axisTitleElement = this._text(0, 0, titleText.toString());
                axisTitleElement.attr(titleTextStyle);
                $.wijraphael.addClass($(axisTitleElement.node), o.titleCSS);

                titleBounds = axisTitleElement.wijGetBBox();

                $.each(["top", "bottom", "left", "right"], function (idx, marginKey) {
                    var value = titleTextStyle["margin-" + marginKey];
                    if (value) {
                        margin[marginKey] = parseFloat(value);
                    }
                });

                if (tickPosition === "cross") {
                    tickLength = tickLength / 2;
                } else if (tickPosition === "inside") {
                    tickLength = 0;
                }

                if (isVertical) {
                    switch (align) {
                        case "near":
                            y = endY - titleBounds.width / 2;
                            break;
                        case "center":
                            y = (startY + endY) / 2;
                            break;
                        case "far":
                            y = startY + titleBounds.width / 2;
                            break;
                    }
                    if (compass === "west") {
                        x = startX - (o.axisMaxLabelSize + axisOffset + axisLabelOffset + tickLength + titleBounds.height / 2 + margin["right"]);
                    } else {
                        x = endX + o.axisMaxLabelSize + axisOffset + axisLabelOffset + tickLength + titleBounds.height / 2 + margin["left"];
                    }
                } else {
                    switch (align) {
                        case "near":
                            x = startX + titleBounds.width / 2;
                            break;
                        case "center":
                            x = (startX + endX) / 2;
                            break;
                        case "far":
                            x = endX - titleBounds.width / 2;
                            break;
                    }
                    if (compass === "north") {
                        y = startY - (o.axisMaxLabelSize + axisLabelOffset + tickLength + titleBounds.height / 2 + margin["bottom"]);
                    } else {
                        y = endY + o.axisMaxLabelSize + axisLabelOffset + tickLength + titleBounds.height / 2 + margin["top"];
                    }
                }

                axisTitleElement.attr({ x: x, y: y });

                if (isVertical) {
                    axisTitleElement.transform("...R-90");
                }

                return axisTitleElement;
            };

            Axis.prototype._getTickRect = function (isMajor) {
                var o = this.options, compass = o.compass, sizeFactor = 0, tickInfo = isMajor ? o.tickMajor : o.tickMinor, factor = tickInfo.factor, position = tickInfo.position, tickSizeFactor = isMajor ? this.majorSizeFactor : this.minorSizeFactor, r = { x: 0, y: 0, width: 0, height: 0 };

                factor = factor > 0 ? factor : 1;
                sizeFactor = (tickSizeFactor * factor);

                if (position === "none") {
                    sizeFactor = 0;
                }
                if (compass === "east" || compass === "west") {
                    r = { x: 0, y: -1, width: sizeFactor * this.thickness, height: this.thickness };
                    if ((compass === "east" && position === "outside") || (compass === "west" && position === "inside")) {
                        r.width += 2; // TODO: make sure what the "2" is for.
                    } else {
                        if (position === "cross") {
                            r.width <<= 1;
                        }
                        r.width += 2;
                    }
                } else {
                    r = { x: -1, y: 0, width: this.thickness, height: sizeFactor * this.thickness };
                    if ((compass === "south" && position === "outside") || (compass === "north" && position === "inside")) {
                        r.height += 2;
                    } else {
                        if (position === "cross") {
                            r.height <<= 1;
                        }
                        r.height += 2;
                    }
                }

                return r;
            };

            Axis.prototype._getMajorTickValues = function () {
                var o = this.options, rc = [], autoTick = o.autoMajor, unitTick = o.unitMajor, max, min, valueLabels = o.valueLabels;

                if (o.annoMethod === "valueLabels") {
                    if (valueLabels && valueLabels.length > 0) {
                        $.each(valueLabels, function (idx, valueLabel) {
                            if (typeof valueLabel.text !== "undefined" || typeof valueLabel.value !== "undefined") {
                                return false;
                            }
                            if (typeof valueLabel === "string") {
                                valueLabels[idx] = {
                                    text: valueLabel,
                                    gridLine: false
                                };
                            } else {
                                valueLabels[idx] = {
                                    value: valueLabel,
                                    gridLine: false
                                };
                            }
                        });

                        if (typeof valueLabels[0].value !== "undefined") {
                            rc = this._getSortedDataValues();
                            return rc;
                        }
                    }
                }

                max = autoTick ? o.max : o.originalMax;
                min = autoTick ? o.min : o.originalMin;

                rc = this._getTickValues(max, min, unitTick, o.tprec, !o.isTime, autoTick);

                return rc;
            };

            Axis.prototype._getMinorTickValues = function () {
                var o = this.options, rc = [], autoTick = o.autoMinor, unitTick = o.unitMinor, max, min, i = 0, j = 0, minorTickValue = null, majorTickValue = null;

                max = autoTick ? o.max : o.originalMax;
                min = autoTick ? o.min : o.originalMin;

                rc = this._getTickValues(max, min, unitTick, o.tprec, !o.isTime, autoTick);

                for (i = rc.length - 1; i >= 0; i--) {
                    minorTickValue = rc[i];
                    for (j = this.majorTickValues.length - 1; j >= 0; j--) {
                        majorTickValue = this.majorTickValues[j];
                        if (minorTickValue === majorTickValue) {
                            rc.splice(i, 1);
                        }
                    }
                }
                return rc;
            };

            Axis.prototype._getSortedDataValues = function () {
                var self = this, o = this.options, rc = [], valueLabels = o.valueLabels;
                $.each(valueLabels, function (idx, label) {
                    var val = label.value;
                    if (ChartUtil.isDate(val)) {
                        rc.push($.toOADate(val));
                    } else if (typeof val === 'number') {
                        rc.push(val);
                    } else {
                        rc.push(idx);
                    }
                });

                // TODO: ignore blank labels.
                return rc;
            };

            Axis.prototype._getTickValues = function (smax, smin, unit, tickprec, round, autoTick) {
                var self = this, vals = [], value, sminOriginal = smin, smaxOriginal = smax, i = 0, xs = 0, imax = 0, imin = 0, n = 0, smin2 = 0;

                try  {
                    if (unit === 0) {
                        vals = [smax, smin];
                    } else {
                        if (autoTick) {
                            if (tickprec + 1 < 0) {
                                tickprec = -1;
                            } else if (tickprec + 1 > 15) {
                                tickprec = 14;
                            }
                            smin2 = $.round(ChartDataUtil.signedCeiling(smin / unit) * unit, tickprec + 1);
                            if (smin2 < smax) {
                                smin = smin2;
                            }
                            imax = parseInt($.round(smax / unit, 5).toString(), 10);
                            imin = parseInt($.round(smin / unit, 5).toString(), 10);
                            n = parseInt((imax - imin + 1).toString(), 10);
                            if (n > 1) {
                                xs = imin * unit;
                                if (xs < smin) {
                                    n--;
                                    smin += unit;
                                }
                                xs = smin + (n - 1) * unit;
                                if (xs > smax) {
                                    n--;
                                }
                            }
                            if (n < 1) {
                                n = 2;
                                smin = sminOriginal;
                                unit = smax - smin;
                            }
                        } else {
                            n = parseInt(((smax - smin) / unit + 1).toString(), 10);
                            if (n > 1) {
                                xs = smin + (n - 1) * unit;
                                if (xs > smax) {
                                    n--;
                                }
                            }
                            if (n < 1) {
                                n = 2;
                                unit = smax - smin;
                            }
                        }

                        for (i = 0; i < n; i++) {
                            if (round) {
                                // vals[i] = $.round(smin + i * unit, tickprec + 1);
                                if (autoTick) {
                                    value = $.round(smin + i * unit, tickprec + 1);
                                } else {
                                    value = smin + i * unit;
                                }
                            } else {
                                value = smin + i * unit;
                            }
                            if (value <= smaxOriginal && value >= sminOriginal) {
                                vals.push(value);
                            }
                        }
                    }
                } catch (error) {
                }

                return vals;
            };

            Axis.prototype._clearElements = function () {
                _super.prototype._clearElements.call(this);

                for (var i = 0; i < this.axisElements.length; i++) {
                    ChartRendererUtil._removeRaphaelEle(this.axisElements[i]);
                    this.axisElements[i] = null;
                }

                this.axisMainLineEle = null;
                this.axisTitleEle = null;
                this.axisDotGroupList = [];
                this.axisElements = [];
            };
            return Axis;
        })(BaseRenderer);
        chart.Axis = Axis;

        /** @ignore */
        // ** Series **
        var Series = (function (_super) {
            __extends(Series, _super);
            function Series(canvas, options) {
                _super.call(this, canvas, options);
            }
            Series.prototype.render = function () {
                _super.prototype.render.call(this);
            };
            return Series;
        })(BaseRenderer);
        chart.Series = Series;

        /** @ignore */
        var BaseChartRender = (function () {
            function BaseChartRender(element, options) {
                var self = this;
                self.options = options;
                self.element = element;
                self._init();
            }
            BaseChartRender.prototype._init = function () {
                var self = this, o = self.options, bounds = o.bounds;
                self.fields = self.element.data("fields") || {};
                self.chartElements = self.fields.chartElements || {};
                self.canvas = o.canvas;
                self.annoTooltip = new ChartTooltip(self.canvas, null, {
                    contentStyle: {
                        fill: "#d1d1d1",
                        "font-size": 16
                    },
                    style: {
                        fill: "#000000",
                        "stroke-width": 2
                    },
                    compass: "north",
                    offsetX: 0,
                    offsetY: 0,
                    relativeTo: "mouse",
                    mouseTrailing: true,
                    showDelay: 0,
                    hideDelay: 0,
                    isContentHtml: (o.widget.options.hint ? o.widget.options.hint.isContentHtml : false),
                    beforeShowing: function (e, d) {
                        var tooltip = o.widget.tooltip;
                        if (tooltip && !tooltip.isContentHtml) {
                            tooltip.hide(true);
                        }

                        self.annoTooltip.setOptions({ content: $(this.target).data("tooltip") });
                    }
                });
                if (bounds) {
                    self.width = bounds.endX - bounds.startX;
                    self.height = bounds.endY - bounds.startY;
                }
            };

            /**Gets the position of the chart element specified by the series index and point index.
            * @ignore
            */
            BaseChartRender.prototype.getChartElementPosition = function (seriesIndex, pointIndex) {
                var self = this, widget = self.options.widget, series, loc, valuesX, valuesY;
                if (!self.annoPoints[seriesIndex] || !self.annoPoints[seriesIndex][pointIndex]) {
                    // trendLine
                    series = (widget.options.seriesList)[seriesIndex];
                    if (series.isTrendline) {
                        valuesX = ChartUtil.getNumberValues(series.data.x);
                        valuesY = ChartUtil.getNumberValues(series.data.y);
                        return self.getDataPosition(valuesX[pointIndex], valuesY[pointIndex]);
                    }
                    return;
                }
                loc = self.annoPoints[seriesIndex][pointIndex];
                return { x: loc.x, y: loc.y };
            };

            /**
            * Gets the position of the data specified by x data and y data.
            * @param {any} x The data value for axis x.
            * @param {any} y The data value for axis y.
            * @returns {Point} a Point object which indicates the position of the data.
            */
            BaseChartRender.prototype.getDataPosition = function (x, y) {
                return BaseChartRender.calculateDataPosition(x, y, this);
            };

            BaseChartRender.calculateDataPosition = function (x, y, chartRender, inverted) {
                if (typeof inverted === "undefined") { inverted = false; }
                var _x, _y, o = chartRender.options, axisX = o.axis.x, axisY = $.isArray(o.axis.y) ? o.axis.y[0] : o.axis.y;

                if (x instanceof Date) {
                    x = $.toOADate(x);
                }
                if (y instanceof Date) {
                    y = $.toOADate(y);
                }
                _x = BaseChartRender._convertDataToLen(chartRender.width, inverted ? axisY : axisX, inverted ? y : x) + o.bounds.startX;
                _y = BaseChartRender._convertDataToLen(chartRender.height, inverted ? axisX : axisY, inverted ? x : y, true) + o.bounds.startY;
                return { x: _x, y: _y };
            };

            BaseChartRender._convertDataToLen = function (total, axis, val, converted) {
                if (typeof converted === "undefined") { converted = false; }
                var min = axis.min == null ? axis.actualMin : axis.min, max = axis.max == null ? axis.actualMax : axis.max;
                if (converted) {
                    return total * (1 - (val - min) / (max - min));
                } else {
                    return total * (val - min) / (max - min);
                }
            };

            /**
            * Render the chart.
            */
            BaseChartRender.prototype.render = function () {
                this.paintAnnotations();
            };

            BaseChartRender.prototype.paintAnnotations = function () {
                var self = this, annotations = self.options.annotations;
                if (!$.isArray(annotations) || annotations.length === 0) {
                    return;
                }

                if (self.fields.annotationTrackers) {
                    self.fields.annotationTrackers = null;
                }

                $.each(annotations, function (i, annotation) {
                    // add the codes to render annotation.
                    // build the relationship for the annotation which attachment is DataIndex.
                    self._paintAnnotation(annotation);
                });
                if (annotations.length && self.fields.annotationTrackers) {
                    self.annoTooltip.setOptions({ relatedElement: self.fields.annotationTrackers[0] });
                }
            };

            BaseChartRender.prototype._changeFirstCharUpper = function (val) {
                var tmp = val;
                tmp = val[0].toUpperCase();
                tmp += val.substr(1);
                return tmp;
            };

            // draw the annotation and build/manage the relationship.
            BaseChartRender.prototype._paintAnnotation = function (annotationOpt) {
                var self = this, annotation, annotationCtor = wijmo.chart[self._changeFirstCharUpper(annotationOpt.type)], seriesList = self.options.seriesList;

                if (annotationCtor == null) {
                    return;
                }
                annotation = new annotationCtor(annotationOpt);
                annotation.render(self);
                if (annotation.attachment == "dataIndex") {
                    self._updateBoundAnnotations(annotation);
                }
                return annotation;
            };

            //build/manage the relationship.
            BaseChartRender.prototype._updateBoundAnnotations = function (annotation) {
                var self = this, seriesIndex = annotation.seriesIndex, pointIndex = annotation.pointIndex;

                if (seriesIndex == null || pointIndex == null) {
                    return;
                }
                if (self.fields.boundAnnotations == null) {
                    self.fields.boundAnnotations = {};
                }
                if (self.fields.boundAnnotations[seriesIndex] == null) {
                    self.fields.boundAnnotations[seriesIndex] = {};
                }
                self.fields.boundAnnotations[seriesIndex][pointIndex] = annotation;
            };
            return BaseChartRender;
        })();
        chart.BaseChartRender = BaseChartRender;

        

        /** @ignore */
        var AnnotationBase = (function () {
            /**
            * Initializes a new instance of an @see:AnnotationBase object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function AnnotationBase(options) {
                this.attachment = "absolute";
                this.point = { x: 0, y: 0 };
                this.seriesIndex = 0;
                this.pointIndex = 0;
                this.position = "center";
                this.offset = { x: 0, y: 0 };
                this.style = {};
                this.isVisible = true;
                this.tooltip = "";
            }
            //only copy properties
            AnnotationBase.prototype._setOptions = function (options) {
                var self = this;
                $.each(options, function (key, value) {
                    self[key] = value;
                });
            };

            /**
            * Render the annotation.
            * @param {BaseChartRender} engine The engine used to render the annotation.
            */
            AnnotationBase.prototype.render = function (engine) {
                var self = this, position;

                // calculate the location of the annotation.
                position = self._getPosition(engine);
                if (position == null) {
                    // don't paint annotation for piechart and unexisted series.
                    return;
                }

                // draw the annotation.
                self.paintAnnotation(engine, position);
                if (!self.isVisible) {
                    self.toggleVisibility(false);
                }
            };

            /**
            * Toggle the visibility of the annotation.
            * @param {boolean} visible A boolean value indicates whether to show the annotation.
            */
            AnnotationBase.prototype.toggleVisibility = function (visible) {
                // show/hide the annotation.
                var self = this;
                if (!self._annoText) {
                    return;
                }
                if (visible && self.isVisible) {
                    self._annoText.show();
                } else {
                    self._annoText.hide();
                }
            };

            // draw the annotation in the specified position.
            AnnotationBase.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
            };

            // get the size of the annotation.
            AnnotationBase.prototype.getSize = function (engine) {
                return { width: 0, height: 0 };
            };

            // Get the position of the annotation.
            AnnotationBase.prototype._getPosition = function (engine) {
                //Todo add the codes to calculate the location of the annotation.
                var self = this, position = self._getAttachmentPosition(engine), offset = self._getOffset(engine);

                if (position) {
                    position.x += offset.x;
                    position.y += offset.y;
                }
                return position;
            };

            AnnotationBase.prototype._getPlotAreaXY = function (engine, point) {
                var bounds = engine.options.bounds;
                var point = { x: point.x + bounds.startX, y: point.y + bounds.startY };
                return point;
            };

            // get the base position.
            AnnotationBase.prototype._getAttachmentPosition = function (engine) {
                var self = this, position;
                switch (self.attachment) {
                    case "dataIndex":
                        position = engine.getChartElementPosition(self.seriesIndex, self.pointIndex);
                        break;
                    case "dataCoordinate":
                        position = engine.getDataPosition(self.point.x, self.point.y);
                        break;
                    case "relative":
                        position = self._getPlotAreaXY(engine, { x: self.point.x * engine.width, y: self.point.y * engine.height });
                        break;
                    case "absolute":
                    default:
                        position = self._getPlotAreaXY(engine, { x: self.point.x, y: self.point.y });
                        break;
                }
                return position;
            };

            // get the offset.
            AnnotationBase.prototype._getOffset = function (engine) {
                var self = this, posOffset = { x: 0, y: 0 }, pos = self.position, size = self.getSize(engine);

                if (pos.indexOf("top") > -1) {
                    //top
                    posOffset.y -= size.height / 2;
                } else if (pos.indexOf("bottom") > -1) {
                    //bottom
                    posOffset.y += size.height / 2;
                }
                if (pos.indexOf("left") > -1) {
                    //left
                    posOffset.x -= size.width / 2;
                } else if (pos.indexOf("right") > -1) {
                    //right
                    posOffset.x += size.width / 2;
                }
                posOffset.x += self.offset.x;
                posOffset.y += self.offset.y;

                return posOffset;
            };

            AnnotationBase.prototype._paintAnnotation = function (engine, elements) {
                var self = this, tracker, annoTooltip = engine.annoTooltip, firstTracker;
                if (!self.isVisible) {
                    return;
                }
                if (elements && elements.length && elements[0].node) {
                    tracker = elements[0].clone();
                    if ($.browser.msie && parseInt($.browser.version) < 9) {
                        tracker.attr({
                            opacity: 0.01, fill: "white",
                            "stroke-width": 0, "fill-opacity": 0.01
                        });
                    } else {
                        tracker.attr({
                            opacity: 0.01, fill: "white",
                            "fill-opacity": 0.01
                        });
                    }
                    if (self.tooltip) {
                        $(tracker).data("tooltip", self.tooltip);
                    }
                    if (engine.fields.annotationTrackers == null) {
                        engine.fields.annotationTrackers = engine.canvas.set();
                    }
                    engine.fields.annotationTrackers.push(tracker);
                }
                if (!engine.fields.annotationTrackers) {
                    return;
                }
                firstTracker = engine.fields.trackers ? engine.fields.trackers[0] : engine.fields.annotationTrackers[0];
                $.each(elements, function (i, annoObj) {
                    annoObj.insertBefore(firstTracker);
                });
                if (self.tooltip) {
                    self._bindTooltip(engine, tracker);
                }
            };

            AnnotationBase.prototype._bindTooltip = function (engine, tracker) {
                engine.annoTooltip.setTargets(tracker);
            };
            return AnnotationBase;
        })();
        chart.AnnotationBase = AnnotationBase;

        /** @ignore */
        var Shape = (function (_super) {
            __extends(Shape, _super);
            function Shape() {
                _super.apply(this, arguments);
            }
            Shape.prototype.toggleVisibility = function (visible) {
                // show/hide the annotation.
                _super.prototype.toggleVisibility.call(this, visible);
                var self = this;
                if (!self._annoShape) {
                    return;
                }
                if (visible && self.isVisible) {
                    self._annoShape.show();
                } else {
                    self._annoShape.hide();
                }
            };
            Shape.prototype.paintAnnotation = function (engine, position) {
                var self = this;
                self._paintAnnotation(engine, [self._annoShape, self._annoText]);
            };
            return Shape;
        })(AnnotationBase);
        chart.Shape = Shape;

        /** @ignore */
        var Circle = (function (_super) {
            __extends(Circle, _super);
            /**
            * Initializes a new instance of an @see:Circle object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function Circle(options) {
                _super.call(this, options);
                this.radius = 25;
                this._setOptions(options);
            }
            // draw the annotation in the specified position.
            Circle.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
                this._annoShape = engine.canvas.circle(position.x, position.y, this.radius);
                this._annoText = engine.canvas.text(position.x, position.y, this.content);
                this._annoShape.wijAttr(this.style);
                _super.prototype.paintAnnotation.call(this, engine, position);
            };

            // get the size of the annotation.
            Circle.prototype.getSize = function (engine) {
                return { width: this.radius * 2, height: this.radius * 2 };
            };
            return Circle;
        })(Shape);
        chart.Circle = Circle;

        /** @ignore */
        var Square = (function (_super) {
            __extends(Square, _super);
            /**
            * Initializes a new instance of an @see:Square object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function Square(options) {
                _super.call(this, options);
                this.width = 50;
                this._setOptions(options);
            }
            // draw the annotation in the specified position.
            Square.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
                var self = this;
                self._annoShape = engine.canvas.box(position.x, position.y, self.width);
                self._annoText = engine.canvas.text(position.x, position.y, self.content);
                self._annoShape.wijAttr(self.style);
                _super.prototype.paintAnnotation.call(this, engine, position);
            };

            // get the size of the annotation.
            Square.prototype.getSize = function (engine) {
                return { width: this.width, height: this.width };
            };
            return Square;
        })(Shape);
        chart.Square = Square;

        /** @ignore */
        var Rect = (function (_super) {
            __extends(Rect, _super);
            /**
            * Initializes a new instance of an @see:Rect object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function Rect(options) {
                _super.call(this, options);
                this.width = 60;
                this.height = 30;
                this.r = 2;
                this._setOptions(options);
            }
            // draw the annotation in the specified position.
            Rect.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
                var self = this, _x = position.x - self.width / 2, _y = position.y - self.height / 2;
                self._annoShape = engine.canvas.rect(_x, _y, self.width, self.height, self.r);
                self._annoText = engine.canvas.text(position.x, position.y, self.content);
                self._annoShape.wijAttr(self.style);
                _super.prototype.paintAnnotation.call(this, engine, position);
            };

            // get the size of the annotation.
            Rect.prototype.getSize = function (engine) {
                return { width: this.width, height: this.height };
            };
            return Rect;
        })(Shape);
        chart.Rect = Rect;

        /** @ignore */
        var Ellipse = (function (_super) {
            __extends(Ellipse, _super);
            /**
            * Initializes a new instance of an @see:Ellipse object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function Ellipse(options) {
                _super.call(this, options);
                this.width = 60;
                this.height = 30;
                this._setOptions(options);
            }
            // draw the annotation in the specified position.
            Ellipse.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
                var self = this;
                self._annoShape = engine.canvas.ellipse(position.x, position.y, self.width / 2, self.height / 2);
                self._annoText = engine.canvas.text(position.x, position.y, self.content);
                self._annoShape.wijAttr(self.style);
                _super.prototype.paintAnnotation.call(this, engine, position);
            };

            // get the size of the annotation.
            Ellipse.prototype.getSize = function (engine) {
                return { width: this.width, height: this.height };
            };
            return Ellipse;
        })(Shape);
        chart.Ellipse = Ellipse;

        /** @ignore */
        var Line = (function (_super) {
            __extends(Line, _super);
            /**
            * Initializes a new instance of an @see:Line object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function Line(options) {
                _super.call(this, options);
                this._setOptions(options);
            }
            Line.prototype._getContentCenter = function () {
                var start = this.start, end = this.end;

                return {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2
                };
            };

            // draw the annotation in the specified position.
            Line.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
                var self = this, x = engine.options.bounds.startX, y = engine.options.bounds.startY, centerPos, start = self.start, end = self.end, offsetX, offsetY, len, strokeWidth, radian, pos;

                if (!start || !end) {
                    return;
                }

                pos = self._getOffset(engine);

                start.x += pos.x;
                start.y += pos.y;
                end.x += pos.x;
                end.y += pos.y;
                centerPos = self._getContentCenter();

                self._annoShape = engine.canvas.path("M" + (start.x + x) + "," + (start.y + y) + "L" + (end.x + x) + "," + (end.y + y));
                var angle = Math.atan2((end.y - start.y), (end.x - start.x)) * 180 / Math.PI;
                angle = angle < -90 ? angle + 180 : (angle > 90 ? angle - 180 : angle);
                self._annoText = engine.canvas.text(centerPos.x, centerPos.y, self.content);
                self._annoShape.wijAttr(self.style);

                //Move the string above the line
                strokeWidth = self.style["stroke-width"] || 1;
                len = self._annoText.getBBox().height / 2 + strokeWidth;
                radian = angle * Math.PI / 180;
                offsetX = len * Math.sin(radian);
                offsetY = len * Math.cos(radian);

                self._annoText.attr({
                    x: centerPos.x + x + offsetX,
                    y: centerPos.y + y - offsetY,
                    transform: "r" + angle
                });
                _super.prototype.paintAnnotation.call(this, engine, position);
            };

            // get the size of the annotation.
            Line.prototype.getSize = function (engine) {
                var self = this;
                if (!self.start || !self.end) {
                    return { width: 0, height: 0 };
                }
                return { width: self.end.x - self.start.x, height: self.end.y - self.start.x };
            };
            return Line;
        })(Shape);
        chart.Line = Line;

        /** @ignore */
        var Polygon = (function (_super) {
            __extends(Polygon, _super);
            /**
            * Initializes a new instance of an @see:Polygon object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function Polygon(options) {
                _super.call(this, options);
                this._setOptions(options);
            }
            // draw the annotation in the specified position.
            Polygon.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
                var self = this, points = self.points, path, bounds = engine.options.bounds, x, y, centerPoint, pos;

                if (!points || points.length == 0) {
                    return;
                }
                pos = self._getOffset(engine);

                $.each(points, function (i, point) {
                    point.x += pos.x;
                    point.y += pos.y;
                });

                //Calculate the points to draw the polygon
                x = bounds.startX, y = bounds.startY;
                path = "M" + (points[0].x + x) + " " + (points[0].y + y);
                for (var i = 1; i < points.length; i++) {
                    path += "L" + (points[i].x + x) + " " + (points[i].y + y);
                }
                path += "Z";
                centerPoint = self._getContentCenter();

                self._annoShape = engine.canvas.path(path);
                self._annoText = engine.canvas.text(centerPoint.x + x, centerPoint.y + y, self.content);
                self._annoShape.wijAttr(self.style);
                _super.prototype.paintAnnotation.call(this, engine, position);
            };

            Polygon.prototype._getContentCenter = function () {
                var pts = this.points, len = pts.length, x = 0, y = 0, i;

                for (i = 0; i < len; i++) {
                    x += pts[i].x;
                    y += pts[i].y;
                }
                return { x: x / len, y: y / len };
            };

            // get the size of the annotation.
            Polygon.prototype.getSize = function (engine) {
                var self = this, xMin, xMax, yMin, yMax, i, pt, len, pts = self.points;

                if (!pts || pts.length == 0) {
                    return { width: 0, height: 0 };
                }
                len = pts.length;

                for (i = 0; i < len; i++) {
                    pt = pts[i];
                    if (i === 0) {
                        xMin = xMax = pt.x;
                        yMin = yMax = pt.y;
                        continue;
                    }
                    if (pt.x < xMin) {
                        xMin = pt.x;
                    } else if (pt.x > xMax) {
                        xMax = pt.x;
                    }
                    if (pt.y < yMin) {
                        yMin = pt.y;
                    } else if (pt.y > yMax) {
                        yMax = pt.y;
                    }
                }
                return { width: xMax - xMin, height: yMax - yMin };
            };
            return Polygon;
        })(Shape);
        chart.Polygon = Polygon;

        /** @ignore */
        var Image = (function (_super) {
            __extends(Image, _super);
            /**
            * Initializes a new instance of an @see:Image object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function Image(options) {
                _super.call(this, options);
                this.width = 60;
                this.height = 60;
                this._setOptions(options);
            }
            // draw the annotation in the specified position.
            Image.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
                var self = this;
                self._annoShape = engine.canvas.image(self.href, position.x - (self.width / 2), position.y - (self.height / 2), self.width, self.height);
                self._annoText = engine.canvas.text(position.x, position.y, self.content);
                self._annoShape.wijAttr(self.style);
                _super.prototype.paintAnnotation.call(this, engine, position);
            };

            // get the size of the annotation.
            Image.prototype.getSize = function (engine) {
                return { width: this.width, height: this.height };
            };
            return Image;
        })(Shape);
        chart.Image = Image;

        /** @ignore */
        var Text = (function (_super) {
            __extends(Text, _super);
            /**
            * Initializes a new instance of an @see:Text object.
            * @param options A JavaScript object containing initialization data
            * for @see:AnnotationBase.
            */
            function Text(options) {
                _super.call(this, options);
                this.text = "Text";
                this._setOptions(options);
            }
            // draw the annotation in the specified position.
            Text.prototype.paintAnnotation = function (engine, position) {
                //Todo: override this method to render the annotation for every type of annotation.
                var self = this;
                self._annoText = engine.canvas.text(position.x, position.y, self.text);
                self._annoText.wijAttr(self.style);
                self._paintAnnotation(engine, [self._annoText]);
            };

            // get the size of the annotation.
            Text.prototype.getSize = function (engine) {
                var tmp = engine.canvas.text(0, 0, this.text);
                var size = { width: tmp.getBBox().width, height: tmp.getBBox().height };
                tmp.remove();
                return size;
            };
            return Text;
        })(AnnotationBase);
        chart.Text = Text;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));


