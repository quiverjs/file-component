"use strict";
Object.defineProperties(exports, {
  watchFileMiddleware: {get: function() {
      return watchFileMiddleware;
    }},
  __esModule: {value: true}
});
var watchFile = $traceurRuntime.assertObject(require('chokidar')).watch;
var ConfigMiddleware = $traceurRuntime.assertObject(require('quiver-component')).ConfigMiddleware;
var initKey = Symbol('middlewareInitialized');
var watchFileMiddleware = new ConfigMiddleware((function(config) {
  if (config[$traceurRuntime.toProperty(initKey)])
    return config;
  var dirPath = config.dirPath;
  config.fileEvents = watchFile(dirPath);
  $traceurRuntime.setProperty(config, initKey, true);
  return config;
}));
