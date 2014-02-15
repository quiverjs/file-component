
'use strict'

var fs = require('fs')
var error = require('quiver-error').error
var fileStreamLib = require('quiver-file-stream')

var singleFileHandlerBuilder = function(config, callback) {
  var filePath = config.filePath

  fs.stat(filePath, function(err, fileStats) {
    if(err) return callback(err)

    if(!fileStats.isFile()) return callback(
      error(400, 'config file path is not a file'))

    var handler = function(args, callback) {
      fileStreamLib.createFileStreamable(filePath, callback)
    }

    callback(null, handler)
  })
}

var singleFileHandleableBuilder = function(config, callback) {
  var fileHandler = configLib.getStreamHandler(
    config, 'quiver single file stream handler')

  var fileCacheValidatorHandler = configLib.getStreamHandler(
    config, 'quiver file cache validator handler')

  var handleable = {
    toStreamHandler: function() {
      return fileHandler
    },
    toEtagCacheValidatorHandler: function() {
      return fileCacheValidatorHandler
    }
  }

  handleableLib.makeExtensible(handleable.toEtagCacheValidatorHandler)
}

var quiverComponents = [
  {
    name: 'quiver single file stream handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'streamable',
    configParam: [
      {
        key: 'filePath',
        type: 'string',
        required: true
      }
    ],
    handlerBuilder: singleFileHandlerBuilder
  },
  {
    name: 'quiver single file handler',
    type: 'handleable',
    handleables: [
      {
        handler: 'quiver single file stream handler',
        type: 'stream handler',
        rebuild: true
      },
      {
        handler: 'quiver file cache validator handler',
        type: 'stream handler',
        rebuild: true
      },
    ],
    handlerBuilder: singleFileHandleableBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}