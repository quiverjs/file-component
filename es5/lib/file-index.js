"use strict";
Object.defineProperties(exports, {
  indexFileFilter: {get: function() {
      return indexFileFilter;
    }},
  makeIndexFileFilter: {get: function() {
      return makeIndexFileFilter;
    }},
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    argsBuilderFilter = $__0.argsBuilderFilter,
    inputHandlerMiddleware = $__0.inputHandlerMiddleware;
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var joinPath = $traceurRuntime.assertObject(require('path')).join;
var fileStatsFilter = $traceurRuntime.assertObject(require('./file-stats.js')).fileStatsFilter;
var listDirPathHandler = $traceurRuntime.assertObject(require('./list-dir.js')).listDirPathHandler;
var defaultIndexes = ['index.html'];
var getIndexFile = (function(indexNames, files) {
  for (var i = 0; i < indexNames.length; i++) {
    var indexName = indexNames[$traceurRuntime.toProperty(i)];
    var index = files.indexOf(indexName);
    if (index > -1)
      return indexName;
  }
  return null;
});
var indexFileFilter = argsBuilderFilter((function(config) {
  var $__1;
  var $__0 = $traceurRuntime.assertObject(config),
      indexFiles = ($__1 = $__0.indexFiles) === void 0 ? defaultIndexes : $__1,
      listPathHandler = $__0.listPathHandler;
  return async($traceurRuntime.initGeneratorFunction(function $__2(args) {
    var $__0,
        path,
        filePath,
        fileStats,
        subpaths,
        indexFile,
        $__3,
        $__4,
        $__5,
        $__6,
        $__7;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__0 = $traceurRuntime.assertObject(args), path = $__0.path, filePath = $__0.filePath, fileStats = $__0.fileStats;
            $ctx.state = 15;
            break;
          case 15:
            $ctx.state = (!fileStats.isDirectory) ? 1 : 2;
            break;
          case 1:
            $ctx.returnValue = args;
            $ctx.state = -2;
            break;
          case 2:
            $__3 = $traceurRuntime.assertObject;
            $__4 = listPathHandler({path: path});
            $ctx.state = 9;
            break;
          case 9:
            $ctx.state = 5;
            return $__4;
          case 5:
            $__5 = $ctx.sent;
            $ctx.state = 7;
            break;
          case 7:
            $__6 = $__3.call($traceurRuntime, $__5);
            $__7 = $__6.subpaths;
            subpaths = $__7;
            $ctx.state = 11;
            break;
          case 11:
            indexFile = getIndexFile(indexFiles, subpaths);
            if (!indexFile)
              throw error(404, 'Not Found');
            args.path = joinPath(path, indexFile);
            args.filePath = joinPath(filePath, indexFile);
            args.fileStats = null;
            $ctx.state = 17;
            break;
          case 17:
            $ctx.returnValue = args;
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__2, this);
  }));
})).addMiddleware(inputHandlerMiddleware(listDirPathHandler, 'listPathHandler')).addMiddleware(fileStatsFilter);
var makeIndexFileFilter = indexFileFilter.privatizedConstructor();
