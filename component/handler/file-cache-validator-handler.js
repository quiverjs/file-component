
'use strict'

var fs = require('fs')
var watchr = require('watchr')
var error = require('quiver-error').error
var streamChannel = require('quiver-stream-channel')

var watchFilePath = function(watchPath, listener, callback) {
  watchr.watch({
    path: watchPath,
    listeners: {
      change: function(changeType, filePath, fileCurrentStat, filePreviousStat) {
        console.log('change event:', changeType, filePath, fileCurrentStat, filePreviousStat)
        listener(changeType, filePath, fileCurrentStat)
      }
    },
    next: callback
  })
}

var getEtagFromFileStats = function(fileStats) {
  return '' + fileStats.mtime.getTime()
}

var fileCacheValidatorHandlerBuilder = function(config, callback) {
  var filePath = config.filePath
  var currentEtag

  fs.stats(filePath, function(err, fileStats) {
    if(err) return callback(err)

    currentEtag = getEtagFromFileStats(fileStats)

    var watcher = function(changeType, changePath, newFileStats) {
      if(changePath != filePath) return

      if(changeType == 'update' || changeType == 'create') {
        currentEtag = getEtagFromFileStats(newFileStats)
      } else if(changeType == 'delete') {
        currentEtag = null
      }
    }

    watchFilePath(filePath, watcher, function(err) {
      if(err) return callback(err)

      var handler = function(args, callback) {
        var etag = args.etag

        if(etag != currentEtag) return callback(
          error(410, 'cache expired'))

        callback()
      }
    })
  })
}

var dirCacheValidatorHandlerBuilder = function(config, callback) {
  var dirPath = config.dirPath

  var etagTable = { }

  var watcher = function(changeType, filePath, newFileStats) {
    if(changeType == 'update' || changeType == 'create') {
      etagTable[filePath] = getEtagFromFileStats(newFileStats)
    } else if(changeType == 'delete') {
      etagTable[filePath] = null
    }
  }

  var getFileEtag = function(filePath, callback) {
    if(etagTable[filePath]) return callback(null, 
      etagTable[filePath])

    fs.stat(filePath, function(err, fileStats) {
      if(err) return callback(err)

      var etag = getEtagFromFileStats(fileStats)
      etagTable[filePath] = etag
      callback(null, etag)
    })
  }

  watchFilePath(dirPath, watcher, function(err) {
    if(err) return callback(err)

    var handler = function(args, callback) {
      var path = args.path
      var etag = args.etag

      var filePath = pathLib.join(dirPath, path)

      getFileEtag(filePath, function(err, fileEtag) {
        if(err) return callback(err)

        if(etag != fileEtag) return callback(
          error(410, 'cache expired'))

        callback()
      })
    }

    callback(null, handler)
  })
}

var quiverComponents = [
  {
    name: 'quiver file cache validator handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'void',
    middlewares: [
      'quiver normalize path filter'
    ],
    handlerBuilder: fileCacheValidatorHandlerBuilder
  },
  {
    name: 'quiver dir cache validator handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'void',
    middlewares: [
      'quiver normalize path filter'
    ],
    handlerBuilder: dirCacheValidatorHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}