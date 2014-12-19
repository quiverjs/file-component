"use strict";
Object.defineProperties(exports, {
  fileStatsHandler: {get: function() {
      return fileStatsHandler;
    }},
  fileStatsMiddleware: {get: function() {
      return fileStatsMiddleware;
    }},
  fileStatsFilter: {get: function() {
      return fileStatsFilter;
    }},
  makeFileStatsHandler: {get: function() {
      return makeFileStatsHandler;
    }},
  makeFileStatsFilter: {get: function() {
      return makeFileStatsFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_core_47_error__,
    $__quiver_45_core_47_promise__,
    $__fs__,
    $__path__,
    $__quiver_45_core_47_component__,
    $__file_45_watch__,
    $__normalize__;
var error = ($__quiver_45_core_47_error__ = require("quiver-core/error"), $__quiver_45_core_47_error__ && $__quiver_45_core_47_error__.__esModule && $__quiver_45_core_47_error__ || {default: $__quiver_45_core_47_error__}).error;
var $__1 = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}),
    resolve = $__1.resolve,
    reject = $__1.reject,
    promisify = $__1.promisify,
    createPromise = $__1.createPromise;
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var $__7 = fs,
    exists = $__7.exists,
    stat = $__7.stat;
var pathLib = ($__path__ = require("path"), $__path__ && $__path__.__esModule && $__path__ || {default: $__path__}).default;
var joinPath = pathLib.join;
var $__4 = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}),
    argsBuilderFilter = $__4.argsBuilderFilter,
    simpleHandlerBuilder = $__4.simpleHandlerBuilder,
    inputHandlerMiddleware = $__4.inputHandlerMiddleware;
var watchFileMiddleware = ($__file_45_watch__ = require("./file-watch"), $__file_45_watch__ && $__file_45_watch__.__esModule && $__file_45_watch__ || {default: $__file_45_watch__}).watchFileMiddleware;
var normalizePathFilter = ($__normalize__ = require("./normalize"), $__normalize__ && $__normalize__.__esModule && $__normalize__ || {default: $__normalize__}).normalizePathFilter;
var statFile = promisify(stat);
var fileExists = (function(filePath) {
  return createPromise((function(resolve) {
    return exists(filePath, resolve);
  }));
});
var fileStatsToJson = (function(filePath, stats) {
  return ({
    filePath: filePath,
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    isSocket: stats.isSocket(),
    dev: stats.dev,
    ino: stats.ino,
    mode: stats.mode,
    nlink: stats.nlink,
    uid: stats.uid,
    gid: stats.gid,
    rdev: stats.rdev,
    size: stats.size,
    blksize: stats.blksize,
    blocks: stats.blocks,
    atime: stats.atime.getTime(),
    mtime: stats.mtime.getTime(),
    ctime: stats.ctime.getTime()
  });
});
var fileStatsHandler = simpleHandlerBuilder((function(config) {
  var $__10;
  var $__9 = config,
      dirPath = $__9.dirPath,
      fileEvents = $__9.fileEvents,
      cacheInterval = ($__10 = $__9.cacheInterval) === void 0 ? 300 * 1000 : $__10;
  var statsCache = {};
  var notFoundCache = {};
  setInterval((function() {
    statsCache = {};
    notFoundCache = {};
  }), cacheInterval);
  fileEvents.on('change', (function(filePath, fileStats) {
    statsCache[filePath] = fileStatsToJson(filePath, fileStats);
  }));
  fileEvents.on('add', (function(filePath, fileStats) {
    statsCache[filePath] = fileStatsToJson(filePath, fileStats);
    notFoundCache[filePath] = false;
  }));
  fileEvents.on('unlink', (function(filePath) {
    statsCache[filePath] = null;
    notFoundCache[filePath] = true;
  }));
  return (function(args) {
    var $__12;
    var $__11 = args,
        path = ($__12 = $__11.path) === void 0 ? '.' : $__12;
    var filePath = joinPath(dirPath, path);
    if (statsCache[filePath])
      return resolve(statsCache[filePath]);
    if (notFoundCache[filePath])
      return reject(error(404, 'file not found'));
    return fileExists(filePath).then((function(exists) {
      if (!exists) {
        notFoundCache[filePath] = true;
        return reject(error(404, 'file not found'));
      }
      return statFile(filePath).then((function(stats) {
        var fileStats = fileStatsToJson(filePath, stats);
        statsCache[filePath] = fileStats;
        return fileStats;
      }));
    }));
  });
}), 'void', 'json', {name: 'Quiver File Stats Handler'}).addMiddleware(watchFileMiddleware).addMiddleware(normalizePathFilter);
var fileStatsMiddleware = inputHandlerMiddleware(fileStatsHandler, 'getFileStats');
var fileStatsFilter = argsBuilderFilter((function(config) {
  var $__9 = config,
      dirPath = $__9.dirPath,
      getFileStats = $__9.getFileStats;
  return (function(args) {
    var path = args.path;
    if (args.filePath && args.fileStats)
      return args;
    return getFileStats({path: path}).then((function(fileStats) {
      args.filePath = fileStats.filePath;
      args.fileStats = fileStats;
      return args;
    }));
  });
}), {name: 'Quiver File Stats Filter'}).middleware(fileStatsMiddleware);
var makeFileStatsHandler = fileStatsHandler.factory();
var makeFileStatsFilter = fileStatsFilter.factory();
