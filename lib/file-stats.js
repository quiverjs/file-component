import { exists, stat } from 'fs'
import { error } from 'quiver-error'
import { join as joinPath } from 'path'
import { 
  resolve, reject, promisify, createPromise 
} from 'quiver-promise'

import { 
  argsBuilderFilter,
  simpleHandlerBuilder, 
  privateInputMiddleware
} from 'quiver-component'

import { watchFileMiddleware } from './file-watch.js'
import { normalizePathFilter } from './normalize.js'

var statFile = promisify(stat)
var fileExists = filePath =>
  createPromise(resolve =>
    exists(filePath, resolve))

var initKey = Symbol('fileStatsInitialized')

var fileStatsToJson = stats => ({
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

export var fileStatsHandler = simpleHandlerBuilder(
config => {
  var { fileEvents, cacheInterval=300*1000 } = config

  var statsCache = { }
  var notFoundCache = { }

  setInterval(() => {
    statsCache = { }
    notFoundCache = { }
  },  cacheInterval)

  fileEvents.on('change', (filePath, fileStats) => {
    statsCache[filePath] = fileStatsToJson(fileStats)
  })

  fileEvents.on('add', (filePath, fileStats) => {
    statsCache[filePath] = fileStatsToJson(fileStats)
    notFoundCache[filePath] = false
  })

  fileEvents.on('unlink', filePath => {
    statsCache[filePath] = null
    notFoundCache[filePath] = true
  })

  return args => {
    var { filePath } = args

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
        var fileStats = fileStatsToJson(stats)
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

export var fileStatsMiddleware = privateInputMiddleware(
  fileStatsHandler, 'getFileStats')

export var fileStatsFilter = argsBuilderFilter(
config => {
  var { dirPath, getFileStats } = config

  return args => {
    if(args.filePath && args.fileStats) return args

    var { path='.' } = args
    var filePath = joinPath(dirPath, path)

    return getFileStats({filePath}).then(fileStats => {
      args.filePath = filePath
      args.fileStats = fileStats

      return args
    })
  }
}, {
  name: 'Quiver File Stats Filter'
})
.addMiddleware(fileStatsMiddleware)