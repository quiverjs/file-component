"use strict";
var makeFileHandler = $traceurRuntime.assertObject(require('./file-handler.js')).makeFileHandler;
var makeFileStatsHandler = $traceurRuntime.assertObject(require('./file-stats.js')).makeFileStatsHandler;
var makeFileCacheHandler = $traceurRuntime.assertObject(require('./file-cache.js')).makeFileCacheHandler;
var makeListDirPathHandler = $traceurRuntime.assertObject(require('./list-dir.js')).makeListDirPathHandler;
var makeFileBundle = (function(bundle) {
  return ({
    fileHandler: makeFileHandler(bundle),
    fileStatsHandler: makeFileStatsHandler(bundle),
    fileCacheHandler: makeFileCacheHandler(bundle),
    listDirPathHandler: makeListDirPathHandler(bundle)
  });
});
