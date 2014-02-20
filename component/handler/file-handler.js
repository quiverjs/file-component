
'use strict'

var async = require('async')
var error = require('quiver-error').error
var copyObject = require('quiver-copy').copyObject
var configLib = require('quiver-config')
var fileStreamLib = require('quiver-file-stream')
var handleableLib = require('quiver-handleable')

var directoryHandlerBuilder = function(config, callback) {
  var handler = function(args, callback) {
    var filePath = args.filePath
    var fileStats = args.fileStats

    if(!fileStats.isFile()) return callback(
      error(404, 'path is not a file'))
    callback(null, fileStreamLib.createFileStreamableWithStats(
      filePath, fileStats))
  }

  callback(null, handler)
}

var dirHandlerNames = [
  'quiver file directory stream handler',
  'quiver file directory cache validator handler',
  'quiver file list path handler',
]

var fileHandlerNames = [
  'quiver single file stream handler',
  'quiver file cache validator handler'
]

var buildStreamHandlers = function(config, handlerNames, callback) {
  if(!config.quiverHandleableBuilders) return callback(
    error(400, 'no handleable builder found'))

  async.map(handlerNames, function(handlerName, callback) {
    var handleableBuilder = config.quiverHandleableBuilders[handlerName]

    if(!handleableBuilder) return callback(
      error(400, 'no handleable builder found for ' + handlerName))

    handleableBuilder(copyObject(config), function(err, handleable) {
      if(err) return callback(err)
      
      if(!handleable.toStreamHandler) return callback(
        error(400, 'handler is not a stream handler'))

      callback(null, handleable.toStreamHandler())
    })
  }, callback)
}

var directoryHandleableBuilder = function(config, callback) {
  buildStreamHandlers(config, dirHandlerNames, function(err, dirHandlers) {
    if(err) return callback(err)
    
    var directoryStreamHandler = dirHandlers[0]
    var dirCacheValidatorHandler = dirHandlers[1]
    var fileListPathHandler = dirHandlers[2]

    var handleable = {
      toStreamHandler: function() {
        return directoryStreamHandler
      },
      toCacheValidatorHandler: function() {
        return dirCacheValidatorHandler
      },
      toListPathHandler: function() {
        return fileListPathHandler
      }
    }

    handleableLib.makeExtensible(handleable.toCacheValidatorHandler)
    handleableLib.makeExtensible(handleable.toListPathHandler)

    callback(null, handleable)
  })
}

var fileHandleableBuilder = function(config, callback) {
  buildStreamHandlers(config, fileHandlerNames, function(err, fileHandlers) {
    if(err) return callback(err)
    
    var fileStreamHandler = fileHandlers[0]
    var fileCacheValidatorHandler = fileHandlers[1]

    var handleable = {
      toStreamHandler: function() {
        return fileStreamHandler
      },
      toCacheValidatorHandler: function() {
        return fileCacheValidatorHandler
      }
    }

    handleableLib.makeExtensible(handleable.toCacheValidatorHandler)

    callback(null, handleable)
  })
}

var quiverComponents = [
  {
    name: 'quiver file directory stream handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'streamable',
    middlewares: [
      'quiver file stats filter',
    ],
    handlerBuilder: directoryHandlerBuilder
  },
  {
    name: 'quiver single file stream handler',
    type: 'stream handler',
    middlewares: [
      'quiver dir to file middleware'
    ],
    handler: 'quiver file directory stream handler'
  },
  {
    name: 'quiver file directory handler',
    type: 'handleable',
    handleables: [
      'quiver file stats handler'
    ],
    handlerBuilder: directoryHandleableBuilder
  },

  {
    name: 'quiver single file handler',
    type: 'handleable',
    handleables: [
      'quiver file stats handler'
    ],
    configAlias: {
      dirPath: 'filePath'
    },
    handlerBuilder: fileHandleableBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}