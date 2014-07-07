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
    SimpleHandler = $__0.SimpleHandler,
    PrivateInputMiddleware = $__0.PrivateInputMiddleware;
var fileStatsFilter = $traceurRuntime.assertObject(require('./file-stats.js')).fileStatsFilter;
var hash = (function(string) {
  var checksum = createHash('md5');
  checksum.update(string);
  return checksum.digest('hex');
});
var fileCacheHandler = new SimpleHandler((function(args) {
  var $__0 = $traceurRuntime.assertObject(args),
      filePath = $__0.filePath,
      fileStats = $__0.fileStats;
  var cacheId = hash(filePath);
  var lastModified = fileStats.mtime.getTime();
  return {
    cacheId: cacheId,
    lastModified: lastModified
  };
}), 'void', 'json').addMiddleware(fileStatsFilter);
var fileCacheMiddleware = new PrivateInputMiddleware(fileCacheHandler, 'fileCacheHandler');
