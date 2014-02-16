
'use strict'

var dirToFileMiddleware = function(config, handlerBuilder, callback) {
  config.dirPath = config.filePath

  handlerBuilder(config, function(err, handler) {
    if(err) return callback(err)
    
    var filteredHandler = function(args, inputStreamable, callback) {
      args.path = '.'

      handler(args, inputStreamable, callback)
    }

    callback(null, filteredHandler)
  })
}

var quiverComponents = [
  {
    name: 'quiver dir to file middleware',
    type: 'stream middleware',
    configParam: [
      {
        key: 'filePath',
        type: 'string',
        required: true
      }
    ],
    middleware: dirToFileMiddleware
  }
]

module.exports = {
  quiverComponents: quiverComponents
}