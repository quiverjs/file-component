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
var $__quiver_45_component__,
    $__quiver_45_error__,
    $__quiver_45_promise__,
    $__path__,
    $__file_45_stats__,
    $__list_45_dir__;
var $__0 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    argsBuilderFilter = $__0.argsBuilderFilter,
    inputHandlerMiddleware = $__0.inputHandlerMiddleware;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var pathLib = ($__path__ = require("path"), $__path__ && $__path__.__esModule && $__path__ || {default: $__path__}).default;
var joinPath = pathLib.join;
var fileStatsFilter = ($__file_45_stats__ = require("./file-stats"), $__file_45_stats__ && $__file_45_stats__.__esModule && $__file_45_stats__ || {default: $__file_45_stats__}).fileStatsFilter;
var listDirPathHandler = ($__list_45_dir__ = require("./list-dir"), $__list_45_dir__ && $__list_45_dir__.__esModule && $__list_45_dir__ || {default: $__list_45_dir__}).listDirPathHandler;
var defaultIndexes = ['index.html'];
var getIndexFile = (function(indexNames, files) {
  for (var i = 0; i < indexNames.length; i++) {
    var indexName = indexNames[i];
    var index = files.indexOf(indexName);
    if (index > -1)
      return indexName;
  }
  return null;
});
var indexFileFilter = argsBuilderFilter((function(config) {
  var $__8;
  var $__7 = config,
      indexFiles = ($__8 = $__7.indexFiles) === void 0 ? defaultIndexes : $__8,
      listPathHandler = $__7.listPathHandler;
  return async($traceurRuntime.initGeneratorFunction(function $__11(args) {
    var $__9,
        path,
        filePath,
        fileStats,
        subpaths,
        indexFile,
        $__12,
        $__13,
        $__14;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__9 = args, path = $__9.path, filePath = $__9.filePath, fileStats = $__9.fileStats;
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
            $__12 = listPathHandler({path: path});
            $ctx.state = 9;
            break;
          case 9:
            $ctx.state = 5;
            return $__12;
          case 5:
            $__13 = $ctx.sent;
            $ctx.state = 7;
            break;
          case 7:
            $__14 = $__13.subpaths;
            subpaths = $__14;
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
    }, $__11, this);
  }));
})).addMiddleware(inputHandlerMiddleware(listDirPathHandler, 'listPathHandler')).addMiddleware(fileStatsFilter);
var makeIndexFileFilter = indexFileFilter.privatizedConstructor();
