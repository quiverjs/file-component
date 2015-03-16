import { configMiddleware } from 'quiver-core/component'

import chokidar from 'chokidar'
const { watch: watchFile } = chokidar

export const watchFileMiddleware = configMiddleware(
config => {
  const dirPath = config.dirPath
  config.fileEvents = watchFile(dirPath)

  return config
}, {
  name: 'Quiver Watch File Middleware',
  repeat: 'once'
})

export const makeWatchFileMiddleware = 
  watchFileMiddleware.factory()