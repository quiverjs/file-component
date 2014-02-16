
'use strict'

var fs = require('fs')
var pathLib = require('path')
var watchr = require('watchr')
var error = require('quiver-error').error
var configLib = require('quiver-config')
var streamChannel = require('quiver-stream-channel')

var watchFilePath = function(watchPath, listener, callback) {
  watchr.watch({
    path: watchPath,
    listener: function(changeType, filePath, fileCurrentStat, filePreviousStat) {
      listener(changeType, filePath, fileCurrentStat)
    },
    catchupDelay: 100,
    next: callback
  })
}

var getEtagFromFileStats = function(fileStats) {
  return '' + fileStats.mtime.getTime()
}

var fileCacheValidatorHandlerBuilder = function(config, callback) {
  var filePath = config.filePath
  var currentEtag

  fs.stat(filePath, function(err, fileStats) {
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

      callback(null, handler)
    })
  })
}

var dirCacheValidatorHandlerBuilder = function(config, callback) {
  var handler = function(args, callback) {
    var etag = args.etag
    var fileStats = args.fileStats

    var fileEtag = '' + fileStats.mtime.getTime()

    if(etag != fileEtag) return callback(
      error(410, 'cache expired'))

    callback(null)
  }

  callback(null, handler)
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
    configParam: [
      {
        key: 'filePath',
        type: 'string',
        required: true
      }
    ],
    handlerBuilder: fileCacheValidatorHandlerBuilder
  },
  {
    name: 'quiver dir cache validator handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'void',
    middlewares: [
      'quiver file stats filter'
    ],
    handlerBuilder: dirCacheValidatorHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}