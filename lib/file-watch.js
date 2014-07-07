import { watch as watchFile } from 'chokidar'
import { ConfigMiddleware } from 'quiver-component'

var initKey = Symbol('middlewareInitialized')

export var watchFileMiddleware = new ConfigMiddleware(
config => {
  if(config[initKey]) return config

  var dirPath = config.dirPath

  config.fileEvents = watchFile(dirPath)
  config[initKey] = true

  return config
})