"use strict";
Object.defineProperties(exports, {
  makeFileBundle: {get: function() {
      return makeFileBundle;
    }},
  __esModule: {value: true}
});
var $__file_45_handler__,
    $__file_45_stats__,
    $__file_45_cache__,
    $__list_45_dir__,
    $__file_45_index__;
var makeFileHandler = ($__file_45_handler__ = require("./file-handler"), $__file_45_handler__ && $__file_45_handler__.__esModule && $__file_45_handler__ || {default: $__file_45_handler__}).makeFileHandler;
var makeFileStatsHandler = ($__file_45_stats__ = require("./file-stats"), $__file_45_stats__ && $__file_45_stats__.__esModule && $__file_45_stats__ || {default: $__file_45_stats__}).makeFileStatsHandler;
var makeFileCacheHandler = ($__file_45_cache__ = require("./file-cache"), $__file_45_cache__ && $__file_45_cache__.__esModule && $__file_45_cache__ || {default: $__file_45_cache__}).makeFileCacheHandler;
var makeListDirPathHandler = ($__list_45_dir__ = require("./list-dir"), $__list_45_dir__ && $__list_45_dir__.__esModule && $__list_45_dir__ || {default: $__list_45_dir__}).makeListDirPathHandler;
var makeIndexFileFilter = ($__file_45_index__ = require("./file-index"), $__file_45_index__ && $__file_45_index__.__esModule && $__file_45_index__ || {default: $__file_45_index__}).makeIndexFileFilter;
var makeFileBundle = (function() {
  var forkTable = arguments[0] !== (void 0) ? arguments[0] : {};
  return ({
    fileHandler: makeFileHandler(forkTable),
    fileStatsHandler: makeFileStatsHandler(forkTable),
    fileCacheHandler: makeFileCacheHandler(forkTable),
    listDirPathHandler: makeListDirPathHandler(forkTable),
    indexFileFilter: makeIndexFileFilter(forkTable)
  });
});
