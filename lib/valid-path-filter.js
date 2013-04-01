
var pathUtil = require('path')
var error = require('quiver-error').error

var validatePath = function(path, callback) {
  var normalizedPath = pathUtil.normalize(path)
  if(normalizedPath != path || path.match(/^\.\./)) {
    return error(400, 'invalid url path')
  }
  return null
}

var createValidPathFilter = function(config, handler, callback) {
  var filteredHandler = function(args, inputStreamable, callback) {
    var path = args.path
    var err = validatePath(path)
    if(err) return callback(err)

    handler(args, inputStreamable, callback)
  }

  callback(null, filteredHandler)
}

module.exports = {
  validatePath: validatePath,
  createValidPathFilter: createValidPathFilter
}