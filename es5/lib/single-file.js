"use strict";
Object.defineProperties(exports, {
  singleFileHandler: {get: function() {
      return singleFileHandler;
    }},
  makeSingleFileHandler: {get: function() {
      return makeSingleFileHandler;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__quiver_45_promise__,
    $__quiver_45_component__,
    $__file_45_handler__,
    $__fs__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var $__1 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    promisify = $__1.promisify,
    reject = $__1.reject;
var $__2 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    argsFilter = $__2.argsFilter,
    configMiddleware = $__2.configMiddleware,
    extendHandler = $__2.extendHandler;
var makeFileHandler = ($__file_45_handler__ = require("./file-handler"), $__file_45_handler__ && $__file_45_handler__.__esModule && $__file_45_handler__ || {default: $__file_45_handler__}).makeFileHandler;
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var stat = fs.stat;
var statFile = promisify(stat);
var singleFilePathFilter = argsFilter((function(args) {
  args.path = '.';
  return args;
}), {name: 'Quiver Single File Path Filter'});
var singleFileMiddleware = configMiddleware((function(config) {
  var filePath = config.filePath;
  return statFile(filePath).then((function(fileStats) {
    if (!fileStats.isFile())
      return reject(error(400, 'config.filePath does not point to a file'));
    config.dirPath = filePath;
    return config;
  }));
}), {name: 'Quiver Single File Middleware'});
var singleFileHandler = makeFileHandler().middleware(singleFilePathFilter).middleware(singleFileMiddleware);
var makeSingleFileHandler = singleFileHandler.factory();
