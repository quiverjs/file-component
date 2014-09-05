import { configMiddleware } from 'quiver-component'

import chokidar from 'chokidar'
var { watch: watchFile } = chokidar

export var watchFileMiddleware = configMiddleware(
config => {
  var dirPath = config.dirPath

  config.fileEvents = watchFile(dirPath)

  return config
}, {
  name: 'Quiver Watch File Middleware',
  repeat: 'once'
})

export var makeWatchFileMiddleware = 
  watchFileMiddleware.privatizedConstructor()