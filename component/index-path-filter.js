
'use strict'

var fs = require('fs')
var filterLib = require('quiver-filter')

var defaultIndexNames = [
  'index.html'
]

var getIndexFile = function(indexNames, files) {
  for(var i=0; i<indexNames.length; i++) {
    var indexName = indexNames[i]
    var index = files.indexOf(indexName)
    if(index > -1) return indexName
  }

  return null
}

var indexPathFilter = filterLib.metaFilter(
  filterLib.argsFilter,
  function(config, callback) {
    var indexNames = config.indexNames || defaultIndexNames

    var argsFilter = function(args, callback) {
      var fileStats = args.fileStats
      if(!fileStats.isDirectory()) return callback(null, args)

      var path = args.path
      var dirPath = args.filePath
      fs.readdir(dirPath, function(err, files) {
        if(err) return callback(err)

        var indexName = getIndexFile(indexNames, files)

        if(!indexName) return callback(
          error(404, 'index file not found in this directory'))

        var indexPath = pathLib.join(path, indexName)
        var indexFilePath = pathLib.join(dirPath, indexName)

        fs.stat(indexFilePath, function(err, indexFileStats) {
          if(err) return callback(err)

          args.path = indexPath
          args.filePath = indexFilePath
          args.fileStats = indexFileStats

          callback(null, args)
        })
      })
    }

    callback(null, argsFilter)
  })

var quiverComponents = [
  {
    name: 'quiver file index path filter',
    type: 'stream filter',
    middlewares: [
      'quiver file stats filter'
    ],
    filter: indexPathFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}