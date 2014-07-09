"use strict";
Object.defineProperties(exports, {
  fileCacheHandler: {get: function() {
      return fileCacheHandler;
    }},
  fileCacheMiddleware: {get: function() {
      return fileCacheMiddleware;
    }},
  __esModule: {value: true}
});
var createHash = $traceurRuntime.assertObject(require('crypto')).createHash;
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    simpleHandler = $__0.simpleHandler,
    privateInputMiddleware = $__0.privateInputMiddleware,
    loadStreamHandler = $__0.loadStreamHandler;
var fileStatsFilter = $traceurRuntime.assertObject(require('./file-stats.js')).fileStatsFilter;
var hash = (function(string) {
  var checksum = createHash('md5');
  checksum.update(string);
  return checksum.digest('hex');
});
var fileCacheHandler = simpleHandler((function(args) {
  var $__0 = $traceurRuntime.assertObject(args),
      filePath = $__0.filePath,
      fileStats = $__0.fileStats;
  var cacheId = hash(filePath);
  var lastModified = fileStats.mtime;
  return {
    cacheId: cacheId,
    lastModified: lastModified
  };
}), 'void', 'json').addMiddleware(fileStatsFilter);
var fileCacheMiddleware = privateInputMiddleware(fileCacheHandler, 'fileCacheHandler', {loader: loadStreamHandler});
