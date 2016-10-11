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
/// <reference path="../wijevcal/jquery.wijmo.wijevcal.ts"/>
/// <reference path="exportUtil.ts" />
var wijmo;
(function (wijmo) {
    (function (exporter) {
        

        /** @ignore */
        var EventsCalendarExport = (function () {
            function EventsCalendarExport(serviceUrl, method) {
                this.serviceUrl = serviceUrl;
                this.method = method;
            }
            EventsCalendarExport.prototype.getExportData = function (options) {
                var result;
                this.options = options;
                this._handleExportOption();
                result = {
                    fileName: options.fileName,
                    width: options.width,
                    height: options.height,
                    type: options.type,
                    pdfSettings: options.pdfSetting,
                    styleString: options.styleString,
                    linkList: options.linkList,
                    theme: options.theme
                };
                if (this.method === 0 /* Content */) {
                    result.content = options.HTMLContent;
                } else {
                    result.options = options.widgetOptions;
                    result.widgetName = options.widgetName;
                }
                return exporter.toJSON(result, function (key, val) {
                    if (key === "type") {
                        switch (val) {
                            case 6 /* Bmp */:
                                return "bmp";
                            case 7 /* Gif */:
                                return "gif";
                            case 5 /* Jpg */:
                                return "jpg";
                            case 3 /* Pdf */:
                                return "pdf";
                            case 8 /* Tiff */:
                                return "tiff";
                            default:
                                return "png";
                        }
                    }
                    return val;
                });
            };

            EventsCalendarExport.prototype._handleExportOption = function () {
                var o = this.options, styleString, linkList = new Array();
                if (o.widget) {
                    if (this.method === 0 /* Content */) {
                        o.HTMLContent = o.widget.element[0].outerHTML;
                    } else {
                        o.widgetName = this._getWidgetName();
                        o.widgetOptions = exporter.toJSON(o.widget.options, function (k, v) {
                            if (v != null) {
                                if (k === "webServiceUrl") {
                                    return "";
                                }
                                return v;
                            }
                        });
                    }

                    $.each($("head").children(), function (index, element) {
                        if (element.tagName === "STYLE") {
                            if ($(element).text()) {
                                styleString += $(element).text();
                            }
                        } else if (element.tagName === "LINK") {
                            linkList.push({
                                className: element.className,
                                href: element.href,
                                rel: element.rel,
                                linkType: element.type
                            });
                        }
                    });
                    o.styleString = styleString;
                    o.linkList = linkList;
                    o.width = o.widget.element.width();
                    o.height = o.widget.element.height();
                }
            };

            EventsCalendarExport.prototype._getWidgetName = function () {
                return this.options.widget ? "wijevcal" : "";
            };
            return EventsCalendarExport;
        })();
        exporter.EventsCalendarExport = EventsCalendarExport;

        

        /** @ignore */
        function innerExportEventsCalendar(exportSettings, type, settings, serviceUrl, exportMethod) {
            var t, mode, pdfSetting = {}, sUrl, data, self = this, o = self.options, eventsCalendarExporter, options, eventsCalendarExportSettings;
            t = type === undefined ? "png" : type;
            t = t.substr(0, 1).toUpperCase() + t.substr(1);
            mode = exportMethod === undefined ? "Options" : exportMethod;
            mode = mode.substr(0, 1).toUpperCase() + mode.substr(1);
            if (typeof settings === "string" && arguments.length === 3) {
                sUrl = settings;
            } else {
                sUrl = serviceUrl === undefined ? "http://demos.componentone.com/ASPNET/ExportService/exportapi/EventsCalendar" : serviceUrl;
                pdfSetting = settings;
            }

            if (!$.isPlainObject(exportSettings)) {
                eventsCalendarExportSettings = {
                    serviceUrl: sUrl,
                    fileName: exportSettings === undefined ? "export" : exportSettings,
                    pdf: pdfSetting,
                    method: exporter.ExportMethod[mode],
                    exportFileType: wijmo.exporter.ExportFileType[t]
                };
            } else {
                eventsCalendarExportSettings = exportSettings;
            }

            eventsCalendarExporter = new EventsCalendarExport(eventsCalendarExportSettings.serviceUrl, eventsCalendarExportSettings.method);
            options = {
                fileName: eventsCalendarExportSettings.fileName,
                widget: self,
                type: eventsCalendarExportSettings.exportFileType,
                pdfSetting: eventsCalendarExportSettings.pdf,
                theme: !!o.theme ? o.theme : eventsCalendarExportSettings.theme
            };
            data = eventsCalendarExporter.getExportData(options);
            exporter.exportFile(eventsCalendarExportSettings, data);
        }
        exporter.innerExportEventsCalendar = innerExportEventsCalendar;

        if (wijmo.evcal && wijmo.evcal.wijevcal) {
            wijmo.evcal.wijevcal.prototype.exportEventsCalendar = innerExportEventsCalendar;
        }

        if ($.wijmo.wijevcal) {
            $.wijmo.wijevcal.prototype.exportEventsCalendar = innerExportEventsCalendar;
        }
    })(wijmo.exporter || (wijmo.exporter = {}));
    var exporter = wijmo.exporter;
})(wijmo || (wijmo = {}));
