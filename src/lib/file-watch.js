import { configMiddleware } from 'quiver-core/component/constructor'

import { watch as watchFile } from 'chokidar'

export const watchFileMiddleware = configMiddleware(
  config => {
    if(config.has('fileEvents')) return config

    const dirPath = config.get('dirPath')
    const fileEvents = watchFile(dirPath)

    return config.set('fileEvents', fileEvents)
  })
  .setName('watchFileMiddleware')

export const makeWatchFileMiddleware = watchFileMiddleware.export()
