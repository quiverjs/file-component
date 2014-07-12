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
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var reject = $traceurRuntime.assertObject(require('quiver-promise')).reject;
var fileStreamable = $traceurRuntime.assertObject(require('quiver-file-stream')).fileStreamable;
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    inputHandlerMiddleware = $__0.inputHandlerMiddleware;
var fileStatsFilter = $traceurRuntime.assertObject(require('./file-stats.js')).fileStatsFilter;
var fileHandler = simpleHandlerBuilder((function(config) {
  return (function(args) {
    var $__0 = $traceurRuntime.assertObject(args),
        fileStats = $__0.fileStats,
        filePath = $__0.filePath;
    if (!fileStats.isFile)
      return reject(error(404, 'path is not a file'));
    return fileStreamable(filePath, fileStats);
  });
}), 'void', 'streamable', {name: 'Quiver File Stream Handler'}).addMiddleware(fileStatsFilter);
var makeFileHandler = fileHandler.privatizedConstructor();
