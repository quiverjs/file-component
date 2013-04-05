
var fs = require('fs')
var moment = require('moment')
var error = require('quiver-error').error

var getFileLastModified = function(filePath, callback) {
  fs.stat(filePath, function(err, stat) {
    if(err) return callback(err)

    var lastModified = moment(stat.mtime)
    callback(null, lastModified)
  })
}

var createFileCacheValidator = function(config, callback) {
  var filePath = config.filePath

  getFileLastModified(filePath, function(err, lastModified) {
    if(err) return callback(err)

    fs.watch(filePath, function() {
      lastModified = moment()
    })

    var validator = function(args, callback) {
      var argLastModified = args.lastModified

      if(argLastModified.isBefore(lastModified)) {
        callback(null)
      } else {
        callback(304)
      }
    }

    callback(null, validator)
  })
}

module.exports = {
  getFileLastModified: getFileLastModified,
  createFileCacheValidator: createFileCacheValidator
}