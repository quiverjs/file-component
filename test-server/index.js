
'use strict'

var pathLib = require('path')
var serverLib = require('quiver-server')
var fileComponentModule = require('../lib/file-component').quiverModule

var quiverComponents = [
  {
    name: 'demo file server',
    type: 'stream handler',
    middlewares: [
      'quiver file index path filter',
      'quiver content type filter'
    ],
    handler: 'quiver file directory handler'
  }
]

var quiverModule = {
  name: 'test-server',
  quiverComponents: quiverComponents,
  dependencies: [
    fileComponentModule
  ]
}

module.exports = {
  quiverModule: quiverModule
}