"use strict";
Object.defineProperties(exports, {
  makeFileBundle: {get: function() {
      return makeFileBundle;
    }},
  __esModule: {value: true}
});
var makeFileHandler = $traceurRuntime.assertObject(require('./file-handler.js')).makeFileHandler;
var makeFileStatsHandler = $traceurRuntime.assertObject(require('./file-stats.js')).makeFileStatsHandler;
var makeFileCacheHandler = $traceurRuntime.assertObject(require('./file-cache.js')).makeFileCacheHandler;
var makeListDirPathHandler = $traceurRuntime.assertObject(require('./list-dir.js')).makeListDirPathHandler;
var makeIndexFileFilter = $traceurRuntime.assertObject(require('./file-index.js')).makeIndexFileFilter;
var makeFileBundle = (function() {
  var privateTable = arguments[0] !== (void 0) ? arguments[0] : {};
  return ({
    fileHandler: makeFileHandler(privateTable),
    fileStatsHandler: makeFileStatsHandler(privateTable),
    fileCacheHandler: makeFileCacheHandler(privateTable),
    listDirPathHandler: makeListDirPathHandler(privateTable),
    indexFileFilter: makeIndexFileFilter(privateTable)
  });
});
