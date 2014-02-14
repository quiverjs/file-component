
var pathLib = require('path')
var filterLib = require('quiver-filter')

var sanitizePathFilter = filterLib.argsFilter(function(args, callback) {
  var path = args.path || '/'

  path = pathLib.join('/', path)
  args.path = path

  callback(null, args)
})

var quiverComponents = [
  {
    name: 'quiver sanitize path filter',
    type: 'stream filter',
    filter: sanitizePathFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}