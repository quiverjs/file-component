import { readdir } from 'fs'
import { SimpleHandler } from 'quiver-component'
import { reject, promisify } from 'quiver-promise'
import {
  SimpleHandlerBuilder, PrivateInputMiddleware
} from 'quiver-component'

import { fileStatsFilter } from './file-stats.js'
import { watchFileMiddleware } from './file-watch.js'

var readDirectory = promisify(readdir)

export var listDirPathHandler = new SimpleHandlerBuilder(
config => {
  var { fileEvents, cacheInterval=300*1000 } = config

  var dirCache = { }

  setInterval(() => {
    dirCache = { }
  },  cacheInterval)

  var removeCache = (filePath, fileStats) => {
    if(fileStats.isDirectory())
      dirCache[filePath] = null
  }

  fileEvents.on('change', removeCache)
  fileEvents.on('addDir', removeCache)
  fileEvents.on('unlinkDir', removeCache)

  return args => {
    var { filePath, fileStats } = args

    if(!fileStats.isDirectory)
      return reject(error(404, 'path is not a directory'))

    var subpaths = dirCache[filePath]
    if(subpaths) return resolve({subpaths})

    return readDirectory(filePath).then(subpaths => {
      dirCache[filePath] = subpaths
      return {subpaths}
    })
  }
}, 'void', 'json', {
  name: 'Quiver List Directory Path Handler'
})
.addMiddleware(watchFileMiddleware)
.addMiddleware(fileStatsFilter)

export var listDirMiddleware = new PrivateInputMiddleware(
  listDirPathHandler, 'listDirHandler')