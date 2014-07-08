"use strict";
Object.defineProperties(exports, {
  singleFileHandler: {get: function() {
      return singleFileHandler;
    }},
  __esModule: {value: true}
});
var stat = $traceurRuntime.assertObject(require('fs')).stat;
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    promisify = $__0.promisify,
    reject = $__0.reject;
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    ArgsFilter = $__0.ArgsFilter,
    ConfigMiddleware = $__0.ConfigMiddleware,
    ExtendedHandler = $__0.ExtendedHandler;
var fileHandleable = $traceurRuntime.assertObject(require('./file-handleable.js')).fileHandleable;
var statFile = promisify(stat);
var singleFilePathFilter = new ArgsFilter((function(args) {
  args.path = '.';
  return args;
}));
var singleFileMiddleware = new ConfigMiddleware((function(config) {
  var filePath = config.filePath;
  return statFile(filePath).then((function(fileStats) {
    if (!fileStats.isFile())
      return reject(error(400, 'config.filePath does not point to a file'));
    config.dirPath = filePath;
    return config;
  }));
}));
var singleFileHandler = new ExtendedHandler(fileHandleable, {name: 'Quiver Single File Handler'}).addMiddleware(singleFilePathFilter).addMiddleware(singleFileMiddleware);
