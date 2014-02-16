
'use strict'

var fs = require('fs')
var pathLib = require('path')
var error = require('quiver-error').error
var configLib = require('quiver-config')
var filterLib = require('quiver-filter')

var fileStatsArgsFilter = function(config, callback) {
  var dirPath = config.dirPath
  
  var fileStatsHandler = configLib.getSimpleHandler(config,
    'quiver file stats handler')

  var argsFilter = function(args, callback) {
    var path = args.path
    var filePath = pathLib.join(dirPath, path)

    fileStatsHandler({ path: path }, function(err, fileStats) {
      if(err) return callback(err)
      
      args.filePath = filePath
      args.fileStats = fileStats

      callback(null, args)
    })
  }

  callback(null, argsFilter)
}

var quiverComponents = [
  {
    name: 'quiver file stats filter',
    type: 'stream filter',
    middlewares: [
      'quiver normalize path filter'
    ],
    handleables: [
      {
        handler: 'quiver file stats handler',
        type: 'simple handler',
        inputType: 'void',
        outputType: 'json'
      }
    ],
    configParam: [
      {
        key: 'dirPath',
        type: 'string',
        required: true
      }
    ],
    filter: filterLib.metaFilter(filterLib.argsFilter, 
      fileStatsArgsFilter)
  }
]

module.exports = {
  quiverComponents: quiverComponents
}