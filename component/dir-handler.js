
'use strict'

var fs = require('fs')
var pathLib = require('path')
var error = require('quiver-error').error
var configLib = require('quiver-config')
var fileStreamLib = require('quiver-file-stream')
var handleableLib = require('quiver-handleable')

var directoryHandlerBuilder = function(config, callback) {
  var dirPath = config.dirPath

  var handler = function(args, callback) {
    var path = args.path
    var filePath = pathLib.join(dirPath, path)

    fileStreamLib.createFileStreamable(filepath, callback)
  }

  callback(null, handler)
}

var directoryHandleableBuilder = function(config, callback) {
  var directoryStreamHandler = configLib.getStreamHandler(
    config, 'quiver file directory stream handler')

  var dirCacheValidatorHandler = configLib.getStreamHandler(
    config, 'quiver dir cache validator handler')

  var fileListPathHandler = configLib.getStreamHandler(
    config, 'quiver file list path handler')

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
}

var quiverComponents = [
  {
    name: 'quiver file directory stream handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'streamable'
    middlewares: [
      'quiver sanitize path filter'
    ],
    configParam: [
      {
        key: 'dirPath',
        type: 'string',
        required: true
      }
    ],
    handlerBuilder: directoryHandlerBuilder
  },
  {
    name: 'quiver file directory handler',
    type: 'handleable',
    handleables: [
      {
        handler: 'quiver file directory stream handler',
        type: 'stream handler',
        rebuild: true
      },
      {
        handler: 'quiver dir cache validator handler',
        type: 'stream handler',
        rebuild: true
      },
      {
        handler: 'quiver file list path handler',
        type: 'stream handler',
        rebuild: true
      }
    ],
    handlerBuilder: directoryHandleableBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}