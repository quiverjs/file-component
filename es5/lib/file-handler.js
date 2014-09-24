"use strict";
Object.defineProperties(exports, {
  fileHandler: {get: function() {
      return fileHandler;
    }},
  makeFileHandler: {get: function() {
      return makeFileHandler;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__quiver_45_promise__,
    $__quiver_45_file_45_stream__,
    $__quiver_45_component__,
    $__mime_45_filter_46_js__,
    $__file_45_stats_46_js__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var reject = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).reject;
var fileStreamable = ($__quiver_45_file_45_stream__ = require("quiver-file-stream"), $__quiver_45_file_45_stream__ && $__quiver_45_file_45_stream__.__esModule && $__quiver_45_file_45_stream__ || {default: $__quiver_45_file_45_stream__}).fileStreamable;
var $__3 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    simpleHandlerBuilder = $__3.simpleHandlerBuilder,
    inputHandlerMiddleware = $__3.inputHandlerMiddleware;
var contentTypeFilter = ($__mime_45_filter_46_js__ = require("./mime-filter.js"), $__mime_45_filter_46_js__ && $__mime_45_filter_46_js__.__esModule && $__mime_45_filter_46_js__ || {default: $__mime_45_filter_46_js__}).contentTypeFilter;
var fileStatsFilter = ($__file_45_stats_46_js__ = require("./file-stats.js"), $__file_45_stats_46_js__ && $__file_45_stats_46_js__.__esModule && $__file_45_stats_46_js__ || {default: $__file_45_stats_46_js__}).fileStatsFilter;
var fileHandler = simpleHandlerBuilder((function(config) {
  return (function(args) {
    var $__6 = args,
        fileStats = $__6.fileStats,
        filePath = $__6.filePath;
    if (!fileStats.isFile)
      return reject(error(404, 'path is not a file'));
    return fileStreamable(filePath, fileStats);
  });
}), 'void', 'streamable', {name: 'Quiver File Stream Handler'}).addMiddleware(contentTypeFilter).addMiddleware(fileStatsFilter);
var makeFileHandler = fileHandler.privatizedConstructor();
