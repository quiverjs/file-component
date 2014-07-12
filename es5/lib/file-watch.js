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
var watchFile = $traceurRuntime.assertObject(require('chokidar')).watch;
var configMiddleware = $traceurRuntime.assertObject(require('quiver-component')).configMiddleware;
var watchFileMiddleware = configMiddleware((function(config) {
  var dirPath = config.dirPath;
  config.fileEvents = watchFile(dirPath);
  return config;
}), {
  name: 'Quiver Watch File Middleware',
  repeat: 'once'
});
var makeWatchFileMiddleware = watchFileMiddleware.privatizedConstructor();
