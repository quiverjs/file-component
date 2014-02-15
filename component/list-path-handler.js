
'use strict'

var fs = require('fs')
var error = require('quiver-error').error

var listPathHandlerBuilder = function(config, callback) {
  var handler = function(args, callback) {
    var fileStats = args.fileStats
    if(!fileStats.isDirectory()) return callback(
      error(404, 'path is not a directory'))

    var subdirPath = args.filePath

    fs.readdir(subdirPath, function(err, files) {
      if(err) return callback(
        error(500, 'error reading directory'))

      callback(null, { subpaths: files })
    })
  }

  callback(null, handler)
}

var quiverComponents = [
  {
    name: 'quiver file list path handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'json',
    middlewares: [
      'quiver normalize path filter',
      'quiver file stats filter'
    ],
    configParam: [
      {
        key: 'dirPath',
        type: 'string',
        required: true
      }
    ],
    handlerBuilder: listPathHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}