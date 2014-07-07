"use strict";
Object.defineProperties(exports, {
  fileHandleable: {get: function() {
      return fileHandleable;
    }},
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    HandleableBuilder = $__0.HandleableBuilder,
    loadSimpleHandler = $__0.loadSimpleHandler;
var fileStreamMiddleware = $traceurRuntime.assertObject(require('./file-handler.js')).fileStreamMiddleware;
var fileCacheMiddleware = $traceurRuntime.assertObject(require('./file-cache.js')).fileCacheMiddleware;
var listDirMiddleware = $traceurRuntime.assertObject(require('./list-dir.js')).listDirMiddleware;
var fileStatsMiddleware = $traceurRuntime.assertObject(require('./file-stats.js')).fileStatsMiddleware;
var fileHandleable = new HandleableBuilder((function(config) {
  var $__0 = $traceurRuntime.assertObject(config),
      fileHandler = $__0.fileHandler,
      fileCacheHandler = $__0.fileCacheHandler,
      listDirHandler = $__0.listDirHandler;
  return {
    streamHandler: fileHandler,
    meta: {
      cacheHandler: fileCacheHandler,
      listPathHandler: listDirHandler
    }
  };
}), {name: 'Quiver File Handleable'}).addMiddleware(fileStreamMiddleware).addMiddleware(fileCacheMiddleware).addMiddleware(listDirMiddleware).addMiddleware(fileStatsMiddleware);
fileHandleable.loadHandler = (function(config, options) {
  return loadSimpleHandler(config, fileHandleable, 'void', 'streamable', options);
});
