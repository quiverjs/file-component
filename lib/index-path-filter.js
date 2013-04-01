
var fs = require('fs')
var async = require('async')
var pathUtil = require('path')
var error = require('quiver-error').error

var defaultIndexNames = [
  'index.html'
]

var isDirectoryPath = function(path) {
  return path.match(/\/$/) ? true : false
}

var searchIndexFiles = function(basePath, indexNames, callback) {
  async.detect(indexNames, 
    function(indexFile, callback) {
      var indexPath = pathUtil.join(basePath, indexFile)
      fs.exists(indexPath, callback)
    }, function(indexFile) {
      if(!indexFile) return callback(error(404, 'file not found'))

      callback(null, indexFile)
    })
}

var createIndexPathFilter = function(config, handler, callback) {
  var dirPath = config.dirPath
  var indexNames = config.indexNames || defaultIndexNames

  var filteredHandler = function(args, inputStreamable, callback) {
    var path = args.path

    if(!isDirectoryPath(path)) return handler(args, inputStreamable, callback)

    var basePath = pathUtil.join(dirPath, path)
    searchIndexFiles(basePath, indexNames, function(err, indexFile) {
      if(err) return callback(err)

      var newPath = pathUtil.join(path, indexFile)

      args.path = newPath
      handler(args, inputStreamable, callback)
    })
  }

  callback(null, filteredHandler)
}

module.exports = {
  isDirectoryPath: isDirectoryPath,
  searchIndexFiles: searchIndexFiles,
  createIndexPathFilter: createIndexPathFilter
}