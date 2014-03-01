
'use strict'

var fs = require('fs')
var pathLib = require('path')
var crypto = require('crypto')
var error = require('quiver-error').error
var configLib = require('quiver-config')
var streamChannel = require('quiver-stream-channel')

var fileCacheId = function(filePath, fileStats) {
  var checksum = crypto.createHash('sha1')
  checksum.update(filePath)
  var pathChecksum = checksum.digest('hex')

  var cacheId = pathChecksum + '-' + fileStats.mtime.getTime()
  return cacheId
}

var fileCacheIdHandlerBuilder = function(config, callback) {
  var handler = function(args, callback) {
    var filePath = args.filePath
    var fileStats = args.fileStats

    var cacheId = fileCacheId(filePath, fileStats)

    callback(null, cacheId)
  }

  callback(null, handler)
}

var quiverComponents = [
  {
    name: 'quiver file directory cache id handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'text',
    middlewares: [
      'quiver file stats filter'
    ],
    handlerBuilder: fileCacheIdHandlerBuilder
  },
  {
    name: 'quiver single file cache id handler',
    type: 'stream handler',
    middlewares: [
      'quiver dir to file middleware'
    ],
    handler: 'quiver file directory cache id handler'
  }
]

module.exports = {
  fileCacheId: fileCacheId,
  quiverComponents: quiverComponents
}