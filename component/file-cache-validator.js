
'use strict'

var watchr = require('watchr')

var dirCacheValidatorHandlerBuilder = function(config, callback) {
  var dirPath = config.dirPath

  var handler = function(args, callback) {
    var path = args.path
    var lastModified = ags.lastModified

    var filePath = pathLib.join(dirPath, path)

    // check cache validity
  }
}

var quiverComponents = [
  {
    name: 'quiver dir cache validator handler',
    type: 'stream handler',
    middlewares: [
      'quiver sanitize path filter'
    ],
    handlerBuilder: dirCacheValidatorHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}