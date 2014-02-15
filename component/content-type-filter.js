
'use strict'

var mime = require('mime')

var defaultMimeLookup = mime.lookup.bind(mime)

var contentTypeFilter = function(config, handler, callback) {
  var mimeLookup = config.mimeLookup || defaultMimeLookup

  var filteredHandler = function(args, inputStreamable, callback) {
    var path = args.path
    var contentType = mimeLookup(path)

    handler(args, inputStreamable, function(err, resultStreamable) {
      if(err) return callback(err)

      if(!resultStreamable.contentType) {
        resultStreamable.contentType = contentType
      }

      callback(null, resultStreamable)
    })
  }

  callback(null, filteredHandler)
}

var quiverComponents = [
  {
    name: 'quiver content type filter',
    type: 'stream filter',
    filter: contentTypeFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}