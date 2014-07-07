import { 
  HandleableBuilder, loadSimpleHandler 
} from 'quiver-component'

import { fileStreamMiddleware } from './file-handler.js'
import { fileCacheMiddleware } from './file-cache.js'
import { listDirMiddleware } from'./list-dir.js'
import { fileStatsMiddleware } from './file-stats.js'

export var fileHandleable = new HandleableBuilder(
config => {
  var {
    fileHandler,
    fileCacheHandler,
    listDirHandler
  } = config

  return {
    streamHandler: fileHandler,
    meta: {
      cacheHandler: fileCacheHandler,
      listPathHandler: listDirHandler
    }
  }
}, {
  name: 'Quiver File Handleable'
})
.addMiddleware(fileStreamMiddleware)
.addMiddleware(fileCacheMiddleware)
.addMiddleware(listDirMiddleware)
.addMiddleware(fileStatsMiddleware)

fileHandleable.loadHandler = (config, options) =>
  loadSimpleHandler(config, fileHandleable, 
    'void', 'streamable', options)