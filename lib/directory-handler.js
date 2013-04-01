
var fs = require('fs')
var pathUtil = require('path')
var createFileStreamHandler = require('./file-handler').createFileStreamHandler

var createFileDirectoryHandler = function(config, callback) {
  var dirPath = config.dirPath
  var fileHandlerFactory = config.fileHandlerFactory || createFileStreamHandler

  fs.readdir(dirPath, function(err) {
    if(err) return callback(err)

    var fileHandlers = { }

    var handler = function(args, inputStreamable, callback) {
      var path = args.path

      if(fileHandlers[path]) return fileHandlers[path](args, inputStreamable, callback)

      var filePath = pathUtil.join(dirPath, path)
      fileHandlerFactory({ filePath: filePath }, 
        function(err, fileHandler) {
          if(err) return callback(err)

          fileHandlers[path] = fileHandler
          fileHandler(args, inputStreamable, callback)
        })
    }

    callback(null, handler)
  })
}

module.exports = {
  createFileDirectoryHandler: createFileDirectoryHandler
}