"use strict";
Object.defineProperties(exports, {
  indexPathFilter: {get: function() {
      return indexPathFilter;
    }},
  __esModule: {value: true}
});
var joinPath = $traceurRuntime.assertObject(require('path')).join;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    promisify = $__0.promisify,
    reject = $__0.reject;
var ArgsBuilderFilter = $traceurRuntime.assertObject(require('quiver-component')).ArgsBuilderFilter;
var listDirMiddleware = $traceurRuntime.assertObject(require('./list-dir.js')).listDirMiddleware;
var getIndexFile = (function(indexNames, files) {
  for (var i = 0; i < indexNames.length; i++) {
    var indexName = indexNames[$traceurRuntime.toProperty(i)];
    var index = files.indexOf(indexName);
    if (index > -1)
      return indexName;
  }
  return null;
});
var indexPathFilter = new ArgsBuilderFilter((function(config) {
  var listDir = config.listDirHandler;
  return (function(args) {
    var $__0 = $traceurRuntime.assertObject(args),
        path = $__0.path,
        filePath = $__0.filePath,
        fileStats = $__0.fileStats;
    if (!fileStats.isDirectory)
      return args;
    return listDir(args).then((function($__0) {
      var files = $__0.subpaths;
      var indexFile = getIndexFile(indexNames, files);
      if (!indexFile)
        return reject(error(404, 'file not found'));
      args.path = joinPath(path, indexFile);
      args.filePath = joinPath(filePath, indexFile);
      args.fileStats = null;
      return args;
    }));
  });
}), {name: 'Quiver Index Path Filter'}).addMiddleware(listDirMiddleware);
