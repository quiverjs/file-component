"use strict";
Object.defineProperties(exports, {
  watchFileMiddleware: {get: function() {
      return watchFileMiddleware;
    }},
  makeWatchFileMiddleware: {get: function() {
      return makeWatchFileMiddleware;
    }},
  __esModule: {value: true}
});
var $__quiver_45_component__,
    $__chokidar__;
var configMiddleware = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}).configMiddleware;
var chokidar = ($__chokidar__ = require("chokidar"), $__chokidar__ && $__chokidar__.__esModule && $__chokidar__ || {default: $__chokidar__}).default;
var watchFile = chokidar.watch;
var watchFileMiddleware = configMiddleware((function(config) {
  var dirPath = config.dirPath;
  config.fileEvents = watchFile(dirPath);
  return config;
}), {
  name: 'Quiver Watch File Middleware',
  repeat: 'once'
});
var makeWatchFileMiddleware = watchFileMiddleware.factory();
