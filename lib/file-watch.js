import { watch as watchFile } from 'chokidar'
import { configMiddleware } from 'quiver-component'

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