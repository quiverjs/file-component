
'use strict'

var fs = require('fs')
var moment = require('moment')
var watchr = require('watchr')
var streamChannel = require('quiver-stream-channel')

var watchDirectory = function(dirPath, listener, callback) {
  watchr.watch({
    paths: [dirPath],
    listeners: {
      change: function(changeType, filePath, fileCurrentStat, filePreviousStat) {
        console.log('change event:', changeType, filePath, fileCurrentStat, filePreviousStat)
        listener(changeType, filePath, fileCurrentStat)
      }
    },
    next: callback
  })
}

var dirCacheValidatorHandlerBuilder = function(config, callback) {
  var dirPath = config.dirPath

  var fileStatsTable = { }

  var watcher = function(changeType, filePath, newFileStats) {
    if(changeType == 'update' || changeType == 'create') {
      fileStatsTable[filePath] = newFileStats
    } else if(changeType == 'delete') {
      fileStatsTable[filePath] = null
    }
  }

  var getFileStats = function(filePath, callback) {
    if(fileStatsTable[filePath]) return callback(null, 
      fileStatsTable[filePath])

    fs.stat(filePath, function(err, fileStats) {
      if(err) return callback(err)

      fileStatsTable[filePath] = fileStats
      callback(null, fileStats)
    })
  }

  watchDirectory(dirPath, watcher, function(err) {
    if(err) return callback(err)

    var handler = function(args, callback) {
      var path = args.path
      var lastModified = moment(args.lastModified)

      var filePath = pathLib.join(dirPath, path)

      getFileStats(filePath, function(err, fileStats) {
        if(err) return callback(err)

        if(lastModified.diff(fileStats.mtime, 'seconds') < 0) {
          return callback(error(410, 'cache expired'))
        }

        callback(null)
      })
    }

    callback(null, handler)
  })
}

var quiverComponents = [
  {
    name: 'quiver dir cache validator handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'void',
    handlerBuilder: dirCacheValidatorHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}