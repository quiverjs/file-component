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
var readdir = $traceurRuntime.assertObject(require('fs')).readdir;
var simpleHandler = $traceurRuntime.assertObject(require('quiver-component')).simpleHandler;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    reject = $__0.reject,
    promisify = $__0.promisify;
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    inputHandlerMiddleware = $__0.inputHandlerMiddleware,
    loadStreamHandler = $__0.loadStreamHandler;
var fileStatsFilter = $traceurRuntime.assertObject(require('./file-stats.js')).fileStatsFilter;
var watchFileMiddleware = $traceurRuntime.assertObject(require('./file-watch.js')).watchFileMiddleware;
var readDirectory = promisify(readdir);
var listDirPathHandler = simpleHandlerBuilder((function(config) {
  var $__1;
  var $__0 = $traceurRuntime.assertObject(config),
      fileEvents = $__0.fileEvents,
      cacheInterval = ($__1 = $__0.cacheInterval) === void 0 ? 300 * 1000 : $__1;
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
    var $__0 = $traceurRuntime.assertObject(args),
        filePath = $__0.filePath,
        fileStats = $__0.fileStats;
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
