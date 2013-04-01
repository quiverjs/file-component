
var fs = require('fs')
var fileStream = require('quiver-file-stream')
var streamConvert = require('quiver-stream-convert')

var createFileStreamHandler = function(config, callback) {
  var filePath = config.filePath

  fileStream.createFileReadStream(filePath, function(err, readStream) {
    if(err) return callback(err)

    var fileStreamable = streamConvert.streamToReusableStreamable(readStream)

    fs.watch(filePath, function(event, filename) {
      if(event == 'change' && filename == filePath) {
        fileStream.createFileReadStream(filePath, function(err, readStream) {
          if(err) return

          fileStreamable = streamConvert.streamToReusableStreamable(readStream)
        })
      }
    })

    var handler = function(args, inputStreamable, callback) {
      callback(null, fileStreamable)
    }

    callback(null, handler)
  })
}

module.exports = {
  createFileStreamHandler: createFileStreamHandler
}