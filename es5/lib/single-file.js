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
    argsFilter = $__0.argsFilter,
    configMiddleware = $__0.configMiddleware,
    extendHandler = $__0.extendHandler;
var fileHandleable = $traceurRuntime.assertObject(require('./file-handleable.js')).fileHandleable;
var statFile = promisify(stat);
var singleFilePathFilter = argsFilter((function(args) {
  args.path = '.';
  return args;
}));
var singleFileMiddleware = configMiddleware((function(config) {
  var filePath = config.filePath;
  return statFile(filePath).then((function(fileStats) {
    if (!fileStats.isFile())
      return reject(error(400, 'config.filePath does not point to a file'));
    config.dirPath = filePath;
    return config;
  }));
}));
var singleFileHandler = extendHandler(fileHandleable, {name: 'Quiver Single File Handler'}).addMiddleware(singleFilePathFilter).addMiddleware(singleFileMiddleware);
