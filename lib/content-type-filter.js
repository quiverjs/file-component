
var mime = require('mime')

var defaultMimeLookup = mime.lookup.bind(mime)

var createContentTypeFilter = function(config, handler, callback) {
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
      callback = null
    })
  }

  callback(null, filteredHandler)
  callback = null
}

module.exports = {
  createContentTypeFilter: createContentTypeFilter
}