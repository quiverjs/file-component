import { simpleHandler } from 'quiver-core/component'
import { reject, promisify } from 'quiver-core/promise'
import {
  simpleHandlerBuilder, inputHandlerMiddleware,
  loadStreamHandler 
} from 'quiver-core/component'

import fs from 'fs'
let { readdir } = fs

import { fileStatsFilter } from './file-stats'
import { watchFileMiddleware } from './file-watch'

let readDirectory = promisify(readdir)

export let listDirPathHandler = simpleHandlerBuilder(
config => {
  let { fileEvents, cacheInterval=300*1000 } = config

  let dirCache = { }

  setInterval(() => {
    dirCache = { }
  },  cacheInterval)

  let removeCache = (filePath, fileStats) => {
    if(fileStats.isDirectory())
      dirCache[filePath] = null
  }

  fileEvents.on('change', removeCache)
  fileEvents.on('addDir', removeCache)
  fileEvents.on('unlinkDir', removeCache)

  return args => {
    let { filePath, fileStats } = args

    if(!fileStats.isDirectory)
      return reject(error(404, 'path is not a directory'))

    let subpaths = dirCache[filePath]
    if(subpaths) return resolve({subpaths})

    return readDirectory(filePath).then(subpaths => {
      dirCache[filePath] = subpaths
      return {subpaths}
    })
  }
}, 'void', 'json', {
  name: 'Quiver List Directory Path Handler'
})
.middleware(watchFileMiddleware)
.middleware(fileStatsFilter)

export let makeListDirPathHandler = 
  listDirPathHandler.factory()