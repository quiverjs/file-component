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
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('fs')),
    exists = $__0.exists,
    stat = $__0.stat;
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var joinPath = $traceurRuntime.assertObject(require('path')).join;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__0.resolve,
    reject = $__0.reject,
    promisify = $__0.promisify,
    createPromise = $__0.createPromise;
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    argsBuilderFilter = $__0.argsBuilderFilter,
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    privateInputMiddleware = $__0.privateInputMiddleware;
var watchFileMiddleware = $traceurRuntime.assertObject(require('./file-watch.js')).watchFileMiddleware;
var normalizePathFilter = $traceurRuntime.assertObject(require('./normalize.js')).normalizePathFilter;
var statFile = promisify(stat);
var fileExists = (function(filePath) {
  return createPromise((function(resolve) {
    return exists(filePath, resolve);
  }));
});
var initKey = Symbol('fileStatsInitialized');
var fileStatsToJson = (function(stats) {
  return ({
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
  var $__1;
  var $__0 = $traceurRuntime.assertObject(config),
      fileEvents = $__0.fileEvents,
      cacheInterval = ($__1 = $__0.cacheInterval) === void 0 ? 300 * 1000 : $__1;
  var statsCache = {};
  var notFoundCache = {};
  setInterval((function() {
    statsCache = {};
    notFoundCache = {};
  }), cacheInterval);
  fileEvents.on('change', (function(filePath, fileStats) {
    $traceurRuntime.setProperty(statsCache, filePath, fileStatsToJson(fileStats));
  }));
  fileEvents.on('add', (function(filePath, fileStats) {
    $traceurRuntime.setProperty(statsCache, filePath, fileStatsToJson(fileStats));
    $traceurRuntime.setProperty(notFoundCache, filePath, false);
  }));
  fileEvents.on('unlink', (function(filePath) {
    $traceurRuntime.setProperty(statsCache, filePath, null);
    $traceurRuntime.setProperty(notFoundCache, filePath, true);
  }));
  return (function(args) {
    var filePath = $traceurRuntime.assertObject(args).filePath;
    if (statsCache[$traceurRuntime.toProperty(filePath)])
      return resolve(statsCache[$traceurRuntime.toProperty(filePath)]);
    if (notFoundCache[$traceurRuntime.toProperty(filePath)])
      return reject(error(404, 'file not found'));
    return fileExists(filePath).then((function(exists) {
      if (!exists) {
        $traceurRuntime.setProperty(notFoundCache, filePath, true);
        return reject(error(404, 'file not found'));
      }
      return statFile(filePath).then((function(stats) {
        var fileStats = fileStatsToJson(stats);
        $traceurRuntime.setProperty(statsCache, filePath, fileStats);
        return fileStats;
      }));
    }));
  });
}), 'void', 'json', {name: 'Quiver File Stats Handler'}).addMiddleware(watchFileMiddleware).addMiddleware(normalizePathFilter);
var fileStatsMiddleware = privateInputMiddleware(fileStatsHandler, 'getFileStats');
var fileStatsFilter = argsBuilderFilter((function(config) {
  var $__0 = $traceurRuntime.assertObject(config),
      dirPath = $__0.dirPath,
      getFileStats = $__0.getFileStats;
  return (function(args) {
    var $__1;
    if (args.filePath && args.fileStats)
      return args;
    var $__0 = $traceurRuntime.assertObject(args),
        path = ($__1 = $__0.path) === void 0 ? '.' : $__1;
    var filePath = joinPath(dirPath, path);
    return getFileStats({filePath: filePath}).then((function(fileStats) {
      args.filePath = filePath;
      args.fileStats = fileStats;
      return args;
    }));
  });
}), {name: 'Quiver File Stats Filter'}).addMiddleware(fileStatsMiddleware);
