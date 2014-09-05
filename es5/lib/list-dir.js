"use strict";
Object.defineProperties(exports, {
  listDirPathHandler: {get: function() {
      return listDirPathHandler;
    }},
  makeListDirPathHandler: {get: function() {
      return makeListDirPathHandler;
    }},
  __esModule: {value: true}
});
var $__quiver_45_component__,
    $__quiver_45_promise__,
    $__quiver_45_component__,
    $__fs__,
    $__file_45_stats_46_js__,
    $__file_45_watch_46_js__;
var simpleHandler = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}).simpleHandler;
var $__1 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    reject = $__1.reject,
    promisify = $__1.promisify;
var $__2 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    simpleHandlerBuilder = $__2.simpleHandlerBuilder,
    inputHandlerMiddleware = $__2.inputHandlerMiddleware,
    loadStreamHandler = $__2.loadStreamHandler;
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var readdir = fs.readdir;
var fileStatsFilter = ($__file_45_stats_46_js__ = require("./file-stats.js"), $__file_45_stats_46_js__ && $__file_45_stats_46_js__.__esModule && $__file_45_stats_46_js__ || {default: $__file_45_stats_46_js__}).fileStatsFilter;
var watchFileMiddleware = ($__file_45_watch_46_js__ = require("./file-watch.js"), $__file_45_watch_46_js__ && $__file_45_watch_46_js__.__esModule && $__file_45_watch_46_js__ || {default: $__file_45_watch_46_js__}).watchFileMiddleware;
var readDirectory = promisify(readdir);
var listDirPathHandler = simpleHandlerBuilder((function(config) {
  var $__7;
  var $__6 = config,
      fileEvents = $__6.fileEvents,
      cacheInterval = ($__7 = $__6.cacheInterval) === void 0 ? 300 * 1000 : $__7;
  var dirCache = {};
  setInterval((function() {
    dirCache = {};
  }), cacheInterval);
  var removeCache = (function(filePath, fileStats) {
    if (fileStats.isDirectory())
      $traceurRuntime.setProperty(dirCache, filePath, null);
  });
  fileEvents.on('change', removeCache);
  fileEvents.on('addDir', removeCache);
  fileEvents.on('unlinkDir', removeCache);
  return (function(args) {
    var $__6 = args,
        filePath = $__6.filePath,
        fileStats = $__6.fileStats;
    if (!fileStats.isDirectory)
      return reject(error(404, 'path is not a directory'));
    var subpaths = dirCache[$traceurRuntime.toProperty(filePath)];
    if (subpaths)
      return resolve({subpaths: subpaths});
    return readDirectory(filePath).then((function(subpaths) {
      $traceurRuntime.setProperty(dirCache, filePath, subpaths);
      return {subpaths: subpaths};
    }));
  });
}), 'void', 'json', {name: 'Quiver List Directory Path Handler'}).addMiddleware(watchFileMiddleware).addMiddleware(fileStatsFilter);
var makeListDirPathHandler = listDirPathHandler.privatizedConstructor();
