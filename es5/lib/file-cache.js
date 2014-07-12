"use strict";
Object.defineProperties(exports, {
  fileCacheHandler: {get: function() {
      return fileCacheHandler;
    }},
  makeFileCacheHandler: {get: function() {
      return makeFileCacheHandler;
    }},
  __esModule: {value: true}
});
var createHash = $traceurRuntime.assertObject(require('crypto')).createHash;
var simpleHandler = $traceurRuntime.assertObject(require('quiver-component')).simpleHandler;
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
var makeFileCacheHandler = fileCacheHandler.privatizedConstructor();
