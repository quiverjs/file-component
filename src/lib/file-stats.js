import { exists, stat } from 'fs'
import { join as joinPath } from 'path'
import { error } from 'quiver-core/util/error'
import { createArgs } from 'quiver-core/component/util'
import { inputHandler } from 'quiver-core/component/method'
import { promisify, createPromise } from 'quiver-core/util/promise'

import {
  argsBuilderFilter, simpleHandlerBuilder,
} from 'quiver-core/component/constructor'

import { watchFileMiddleware } from './file-watch'
import { normalizePathFilter } from './normalize'

const statFile = promisify(stat)

const fileExists = filePath =>
  createPromise(resolve =>
    exists(filePath, resolve))

const fileStatsToJson = (filePath, stats) => ({
  filePath: filePath,
  isFile: stats.isFile(),
  isDirectory: stats.isDirectory(),
  isSocket: stats.isSocket(),
  dev: stats.dev,
  ino: stats.ino,
  mode: stats.mode,
  nlink: stats.nlink,
  uid: stats.uid,
  gid: stats.gid,
  rdev: stats.rdev,
  size: stats.size,
  blksize: stats.blksize,
  blocks: stats.blocks,
  atime: stats.atime.getTime(),
  mtime: stats.mtime.getTime(),
  ctime: stats.ctime.getTime()
})

export const fileStatsHandler = simpleHandlerBuilder(
  config => {
    const dirPath = config.get('dirPath')
    const fileEvents = config.get('fileEvents')
    const cacheInterval = config.get('cacheInterval') || 300*1000

    let statsCache = new Map()
    let notFoundCache = new Set()

    setInterval(() => {
      statsCache.clear()
      notFoundCache.clear()
    },  cacheInterval)

    fileEvents.on('change', filePath => {
      notFoundCache.delete(filePath)
    })

    fileEvents.on('add', filePath => {
      statsCache.delete(filePath)
      notFoundCache.delete(filePath)
    })

    fileEvents.on('unlink', filePath => {
      statsCache.delete(filePath)
      notFoundCache.add(filePath)
    })

    return async function(args) {
      const path = args.get('path') || '.'
      const filePath = joinPath(dirPath, path)

      if(statsCache.has(filePath))
        return statsCache.get(filePath)

      if(notFoundCache.has(filePath))
        throw error(404, 'file not found')

      const exists = await fileExists(filePath)
      if(!exists) {
        notFoundCache.add(filePath)
        throw error(404, 'file not found')
      }

      const fileStats = await statFile(filePath)
      const fileStatsJson = fileStatsToJson(filePath, fileStats)

      statsCache.set(filePath, fileStatsJson)

      return fileStatsJson
    }

  }, {
    inputType: 'empty',
    outputType: 'json'
  })
  .setName('fileStatsHandler')
  .addMiddleware(watchFileMiddleware)
  .addMiddleware(normalizePathFilter)

export const fileStatsFilter = argsBuilderFilter(
  config => {
    const getFileStats = config.get('getFileStats')

    return async function(args) {
      const path = args.get('path')

      if(args.get('filePath') && args.get('fileStats'))
        return args

      const inArgs = createArgs({ path })
      const fileStats = await getFileStats(inArgs)

      return args
        .set('fileStats', fileStats)
        .set('filePath', fileStats.filePath)
    }
  })
  .setName('fileStatsFilter')
  ::inputHandler('getFileStats', fileStatsHandler)

export const makeFileStatsFilter = fileStatsFilter.export()
export const makeFileStatsHandler = fileStatsHandler.export()
