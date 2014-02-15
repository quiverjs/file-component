
'use strict'

var fs = require('fs')
var pathLib = require('path')
var filterLib = require('quiver-filter')

var fileStatsFilter = filterLib.metaFilter(
  filterLib.argsFilter,
  function(config, callback) {
    var dirPath = config.dirPath

    var argsFilter = function(args, callback) {
      var path = args.path
      var filePath = pathLib.join(dirPath, path)

      fs.exists(filePath, function(exists) {
        if(!exists) return callback(error(404, 'file not found'))

        fs.stat(filePath, function(err, fileStats) {
          if(err) return callback(error(404, 'error reading file'))

          args.filePath = filePath
          args.fileStats = fileStats

          callback(null, args)
        })
      })
    }

    callback(null, argsFilter)
  })

var quiverComponents = [
  {
    name: 'quiver file stats filter',
    type: 'stream filter',
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
    filter: fileStatsFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}