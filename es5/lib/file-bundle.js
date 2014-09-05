"use strict";
Object.defineProperties(exports, {
  makeFileBundle: {get: function() {
      return makeFileBundle;
    }},
  __esModule: {value: true}
});
var $__file_45_handler_46_js__,
    $__file_45_stats_46_js__,
    $__file_45_cache_46_js__,
    $__list_45_dir_46_js__,
    $__file_45_index_46_js__;
var makeFileHandler = ($__file_45_handler_46_js__ = require("./file-handler.js"), $__file_45_handler_46_js__ && $__file_45_handler_46_js__.__esModule && $__file_45_handler_46_js__ || {default: $__file_45_handler_46_js__}).makeFileHandler;
var makeFileStatsHandler = ($__file_45_stats_46_js__ = require("./file-stats.js"), $__file_45_stats_46_js__ && $__file_45_stats_46_js__.__esModule && $__file_45_stats_46_js__ || {default: $__file_45_stats_46_js__}).makeFileStatsHandler;
var makeFileCacheHandler = ($__file_45_cache_46_js__ = require("./file-cache.js"), $__file_45_cache_46_js__ && $__file_45_cache_46_js__.__esModule && $__file_45_cache_46_js__ || {default: $__file_45_cache_46_js__}).makeFileCacheHandler;
var makeListDirPathHandler = ($__list_45_dir_46_js__ = require("./list-dir.js"), $__list_45_dir_46_js__ && $__list_45_dir_46_js__.__esModule && $__list_45_dir_46_js__ || {default: $__list_45_dir_46_js__}).makeListDirPathHandler;
var makeIndexFileFilter = ($__file_45_index_46_js__ = require("./file-index.js"), $__file_45_index_46_js__ && $__file_45_index_46_js__.__esModule && $__file_45_index_46_js__ || {default: $__file_45_index_46_js__}).makeIndexFileFilter;
var makeFileBundle = (function() {
  var privateTable = arguments[0] !== (void 0) ? arguments[0] : {};
  return ({
    fileHandler: makeFileHandler(privateTable),
    fileStatsHandler: makeFileStatsHandler(privateTable),
    fileCacheHandler: makeFileCacheHandler(privateTable),
    listDirPathHandler: makeListDirPathHandler(privateTable),
    indexFileFilter: makeIndexFileFilter(privateTable)
  });
});
