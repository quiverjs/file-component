
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
      callback = null
    })
}

var createIndexPathArgsFilter = function(config, callback) {
  var dirPath = config.dirPath
  var indexNames = config.indexNames || defaultIndexNames

  var argsFilter = function(args, callback) {
    var path = args.path

    if(!isDirectoryPath(path)) return handler(args, inputStreamable, callback)

    var basePath = pathUtil.join(dirPath, path)
    searchIndexFiles(basePath, indexNames, function(err, indexFile) {
      if(err) return callback(err)

      var newPath = pathUtil.join(path, indexFile)

      args.path = newPath
      callback(null, args)
    })
  }

  callback(null, argsFilter)
}

var createIndexPathFilter = function(config, handler, callback) {
  createIndexPathArgsFilter(config, function(err, indexPathArgsFilter) {
    
    var filteredHandler = function(args, inputStreamable, callback) {
      indexPathArgsFilter(args, function(err, args) {
        if(err) return callback(err)

        handler(args, inputStreamable, callback)
      })
    }

    callback(null, filteredHandler)
  })
}

module.exports = {
  isDirectoryPath: isDirectoryPath,
  searchIndexFiles: searchIndexFiles,
  createIndexPathFilter: createIndexPathFilter
}