import { readdir, stat } from 'fs'
import { error } from 'quiver-core/util/error'
import { promisify } from 'quiver-core/util/promise'
import {
  simpleHandlerBuilder
} from 'quiver-core/component/constructor'

import { fileStatsFilter } from './file-stats'
import { watchFileMiddleware } from './file-watch'

const statFile = promisify(stat)
const readDirectory = promisify(readdir)

export const listDirPathHandler = simpleHandlerBuilder(
  config => {
    const fileEvents = config.get('fileEvents')
    const cacheInterval = config.get('cacheInterval') || 300*1000

    const dirCache = new Map()

    setInterval(() => {
      dirCache.clear()
    },  cacheInterval)

    const removeCache = async (filePath, fileStats) => {
      if(!fileStats)
        fileStats = await statFile(filePath)

      if(fileStats.isDirectory())
        dirCache.delete(filePath)
    }

    fileEvents.on('change', removeCache)
    fileEvents.on('addDir', removeCache)
    fileEvents.on('unlinkDir', removeCache)

    return async function(args) {
      const filePath = args.get('filePath')
      const fileStats = args.get('fileStats')

      if(!fileStats.isDirectory)
        throw error(404, 'path is not a directory')

      const cachedPaths = dirCache.get(filePath)
      if(cachedPaths) return { subpaths: cachedPaths }

      const subpaths = await readDirectory(filePath)
      dirCache.set(filePath, subpaths)

      return { subpaths }
    }
  }, {
    inputType: 'empty',
    outputType: 'json'
  })
  .setName('listDirPathHandler')
  .addMiddleware(watchFileMiddleware)
  .addMiddleware(fileStatsFilter)

export const makeListDirPathHandler = listDirPathHandler.export()
