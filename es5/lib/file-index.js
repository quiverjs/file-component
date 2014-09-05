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
    $__file_45_stats_46_js__,
    $__list_45_dir_46_js__;
var $__0 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    argsBuilderFilter = $__0.argsBuilderFilter,
    inputHandlerMiddleware = $__0.inputHandlerMiddleware;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var pathLib = ($__path__ = require("path"), $__path__ && $__path__.__esModule && $__path__ || {default: $__path__}).default;
var joinPath = pathLib.join;
var fileStatsFilter = ($__file_45_stats_46_js__ = require("./file-stats.js"), $__file_45_stats_46_js__ && $__file_45_stats_46_js__.__esModule && $__file_45_stats_46_js__ || {default: $__file_45_stats_46_js__}).fileStatsFilter;
var listDirPathHandler = ($__list_45_dir_46_js__ = require("./list-dir.js"), $__list_45_dir_46_js__ && $__list_45_dir_46_js__.__esModule && $__list_45_dir_46_js__ || {default: $__list_45_dir_46_js__}).listDirPathHandler;
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
  var $__7;
  var $__6 = config,
      indexFiles = ($__7 = $__6.indexFiles) === void 0 ? defaultIndexes : $__7,
      listPathHandler = $__6.listPathHandler;
  return async($traceurRuntime.initGeneratorFunction(function $__8(args) {
    var $__6,
        path,
        filePath,
        fileStats,
        subpaths,
        indexFile,
        $__9,
        $__10,
        $__11;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__6 = args, path = $__6.path, filePath = $__6.filePath, fileStats = $__6.fileStats;
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
            $__9 = listPathHandler({path: path});
            $ctx.state = 9;
            break;
          case 9:
            $ctx.state = 5;
            return $__9;
          case 5:
            $__10 = $ctx.sent;
            $ctx.state = 7;
            break;
          case 7:
            $__11 = $__10.subpaths;
            subpaths = $__11;
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
    }, $__8, this);
  }));
})).addMiddleware(inputHandlerMiddleware(listDirPathHandler, 'listPathHandler')).addMiddleware(fileStatsFilter);
var makeIndexFileFilter = indexFileFilter.privatizedConstructor();
