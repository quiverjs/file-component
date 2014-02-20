
'use strict'

var fs = require('fs')
var pathLib = require('path')
var error = require('quiver-error').error
var configLib = require('quiver-config')
var streamChannel = require('quiver-stream-channel')

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
    name: 'quiver file directory cache validator handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'void',
    middlewares: [
      'quiver file stats filter'
    ],
    handlerBuilder: dirCacheValidatorHandlerBuilder
  },
  {
    name: 'quiver file cache validator handler',
    type: 'stream handler',
    middlewares: [
      'quiver dir to file middleware'
    ],
    handler: 'quiver file directory cache validator handler'
  }
]

module.exports = {
  quiverComponents: quiverComponents
}