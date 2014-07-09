"use strict";
Object.defineProperties(exports, {
  fileStreamHandler: {get: function() {
      return fileStreamHandler;
    }},
  fileStreamMiddleware: {get: function() {
      return fileStreamMiddleware;
    }},
  __esModule: {value: true}
});
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var reject = $traceurRuntime.assertObject(require('quiver-promise')).reject;
var fileStreamable = $traceurRuntime.assertObject(require('quiver-file-stream')).fileStreamable;
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    simpleHandler = $__0.simpleHandler,
    privateInputMiddleware = $__0.privateInputMiddleware;
var fileStatsFilter = $traceurRuntime.assertObject(require('./file-stats.js')).fileStatsFilter;
var fileStreamHandler = simpleHandler((function(args) {
  var $__0 = $traceurRuntime.assertObject(args),
      fileStats = $__0.fileStats,
      filePath = $__0.filePath;
  if (!fileStats.isFile)
    return reject(error(404, 'path is not a file'));
  return fileStreamable(filePath, fileStats);
}), 'void', 'streamable', {name: 'Quiver File Stream Handler'}).addMiddleware(fileStatsFilter);
var fileStreamMiddleware = privateInputMiddleware(fileStreamHandler, 'fileHandler');
