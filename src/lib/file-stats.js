import { error } from 'quiver-core/error'

import { 
  resolve, reject, promisify, createPromise 
} from 'quiver-core/promise'

import fs from 'fs'
let { exists, stat } = fs

import pathLib from 'path'
let { join: joinPath } = pathLib

import { 
  argsBuilderFilter,
  simpleHandlerBuilder, 
  inputHandlerMiddleware
} from 'quiver-core/component'

import { watchFileMiddleware } from './file-watch'
import { normalizePathFilter } from './normalize'

let statFile = promisify(stat)
let fileExists = filePath =>
  createPromise(resolve =>
    exists(filePath, resolve))

let fileStatsToJson = (filePath, stats) => ({
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

export let fileStatsHandler = simpleHandlerBuilder(
config => {
  let { dirPath, fileEvents, cacheInterval=300*1000 } = config

  let statsCache = { }
  let notFoundCache = { }

  setInterval(() => {
    statsCache = { }
    notFoundCache = { }
  },  cacheInterval)

  fileEvents.on('change', (filePath, fileStats) => {
    statsCache[filePath] = fileStatsToJson(filePath, fileStats)
  })

  fileEvents.on('add', (filePath, fileStats) => {
    statsCache[filePath] = fileStatsToJson(filePath, fileStats)
    notFoundCache[filePath] = false
  })

  fileEvents.on('unlink', filePath => {
    statsCache[filePath] = null
    notFoundCache[filePath] = true
  })

  return args => {
    let { path='.' } = args
    let filePath = joinPath(dirPath, path)

    if(statsCache[filePath]) 
      return resolve(statsCache[filePath])

    if(notFoundCache[filePath]) 
      return reject(error(404, 'file not found'))

    return fileExists(filePath).then(exists => {
      if(!exists) {
        notFoundCache[filePath] = true
        return reject(error(404, 'file not found'))
      }

      return statFile(filePath).then(stats => {
        let fileStats = fileStatsToJson(filePath, stats)

        statsCache[filePath] = fileStats

        return fileStats
      })
    })
  }

}, 'void', 'json', {
  name: 'Quiver File Stats Handler'
})
.addMiddleware(watchFileMiddleware)
.addMiddleware(normalizePathFilter)

export let fileStatsMiddleware = inputHandlerMiddleware(
  fileStatsHandler, 'getFileStats')

export let fileStatsFilter = argsBuilderFilter(
config => {
  let { dirPath, getFileStats } = config

  return args => {
    let { path } = args

    if(args.filePath && args.fileStats) return args

    return getFileStats({ path }).then(fileStats => {
      args.filePath = fileStats.filePath
      args.fileStats = fileStats

      return args
    })
  }
}, {
  name: 'Quiver File Stats Filter'
})
.middleware(fileStatsMiddleware)

export let makeFileStatsHandler = 
  fileStatsHandler.factory()

export let makeFileStatsFilter = 
  fileStatsFilter.factory()