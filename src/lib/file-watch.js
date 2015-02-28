import { configMiddleware } from 'quiver-core/component'

import chokidar from 'chokidar'
let { watch: watchFile } = chokidar

export let watchFileMiddleware = configMiddleware(
config => {
  let dirPath = config.dirPath
  config.fileEvents = watchFile(dirPath)

  return config
}, {
  name: 'Quiver Watch File Middleware',
  repeat: 'once'
})

export let makeWatchFileMiddleware = 
  watchFileMiddleware.factory()