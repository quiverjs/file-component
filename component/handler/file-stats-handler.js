
'use strict'

var fs = require('fs')
var pathLib = require('path')
var watchr = require('watchr')
var error = require('quiver-error').error
var streamChannel = require('quiver-stream-channel')

var watchFilePath = function(watchPath, listener) {
  watchr.watch({
    path: watchPath,
    listener: function(changeType, filePath, fileCurrentStat, filePreviousStat) {
      listener(changeType, filePath, fileCurrentStat)
    },
    catchupDelay: 100
  })
}

var fileStatsHandlerBuilder = function(config, callback) {
  var dirPath = config.dirPath
  var cacheInterval = config.cacheInterval || 300 * 1000

  var statsCache = { }
  var notFoundCache = { }

  // clear the file stats cache every now and then 
  // in case file watcher is not working
  setInterval(function() {
    statsCache = { }
    notFoundCache = { }
  },  cacheInterval)

  var watcher = function(changeType, filePath, newFileStats) {
    switch(changeType) {
      case 'update':
        statsCache[filePath] = newFileStats
      break;
      case 'create':
        statsCache[filePath] = newFileStats
        notFoundCache[filePath] = false
      break;
      case 'delete':
        statsCache[filePath] = null
        notFoundCache[filePath] = true
      break;
    }
  }

  watchFilePath(dirPath, watcher)

  var getFileStats = function(filePath, callback) {
    if(statsCache[filePath]) return callback(null, 
      statsCache[filePath])

    if(notFoundCache[filePath]) return callback(
      error(404, 'file not found'))

    fs.exists(filePath, function(exists) {
      if(!exists) {
        notFoundCache[filePath] = true
        return callback(error(404, 'file not found'))
      }

      fs.stat(filePath, function(err, fileStats) {
        if(err) return callback(err)

        statsCache[filePath] = fileStats
        callback(null, fileStats)
      })
    })
  }

  var handler = function(args, callback) {
    var path = args.path
    var filePath = pathLib.join(dirPath, path)

    getFileStats(filePath, callback)
  }

  callback(null, handler)
}

var quiverComponents = [
  {
    name: 'quiver file stats handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'json',
    middlewares: [
      'quiver normalize path filter'
    ],
    configParam: [
      {
        key: 'dirPath',
        type: 'string',
        required: true
      }
    ],
    handlerBuilder: fileStatsHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}