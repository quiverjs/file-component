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
var $__quiver_45_core_47_error__,
    $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_file_45_stream__,
    $__quiver_45_core_47_component__,
    $__mime_45_filter__,
    $__file_45_stats__;
var error = ($__quiver_45_core_47_error__ = require("quiver-core/error"), $__quiver_45_core_47_error__ && $__quiver_45_core_47_error__.__esModule && $__quiver_45_core_47_error__ || {default: $__quiver_45_core_47_error__}).error;
var reject = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}).reject;
var fileStreamable = ($__quiver_45_core_47_file_45_stream__ = require("quiver-core/file-stream"), $__quiver_45_core_47_file_45_stream__ && $__quiver_45_core_47_file_45_stream__.__esModule && $__quiver_45_core_47_file_45_stream__ || {default: $__quiver_45_core_47_file_45_stream__}).fileStreamable;
var $__3 = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}),
    simpleHandlerBuilder = $__3.simpleHandlerBuilder,
    inputHandlerMiddleware = $__3.inputHandlerMiddleware;
var contentTypeFilter = ($__mime_45_filter__ = require("./mime-filter"), $__mime_45_filter__ && $__mime_45_filter__.__esModule && $__mime_45_filter__ || {default: $__mime_45_filter__}).contentTypeFilter;
var fileStatsFilter = ($__file_45_stats__ = require("./file-stats"), $__file_45_stats__ && $__file_45_stats__.__esModule && $__file_45_stats__ || {default: $__file_45_stats__}).fileStatsFilter;
var fileHandler = simpleHandlerBuilder((function(config) {
  return (function(args) {
    var $__6 = args,
        fileStats = $__6.fileStats,
        filePath = $__6.filePath;
    if (!fileStats.isFile)
      return reject(error(404, 'path is not a file'));
    return fileStreamable(filePath, fileStats);
  });
}), 'void', 'streamable', {name: 'Quiver File Stream Handler'}).middleware(contentTypeFilter).middleware(fileStatsFilter);
var makeFileHandler = fileHandler.factory();
