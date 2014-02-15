
'use strict'

var pathLib = require('path')
var filterLib = require('quiver-filter')

var normalizePathFilter = filterLib.argsFilter(function(args, callback) {
  var path = args.path || '/'

  path = pathLib.join('/', path)
  args.path = path

  callback(null, args)
})

var quiverComponents = [
  {
    name: 'quiver normalize path filter',
    type: 'stream filter',
    filter: normalizePathFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}