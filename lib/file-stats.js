import { error } from 'quiver-error'

import { 
  resolve, reject, promisify, createPromise 
} from 'quiver-promise'

import fs from 'fs'
var { exists, stat } = fs

import pathLib from 'path'
var { join: joinPath } = pathLib

import { 
  argsBuilderFilter,
  simpleHandlerBuilder, 
  inputHandlerMiddleware
} from 'quiver-component'

import { watchFileMiddleware } from './file-watch'
import { normalizePathFilter } from './normalize'

var statFile = promisify(stat)
var fileExists = filePath =>
  createPromise(resolve =>
    exists(filePath, resolve))

var fileStatsToJson = (filePath, stats) => ({
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

export var fileStatsHandler = simpleHandlerBuilder(
config => {
  var { dirPath, fileEvents, cacheInterval=300*1000 } = config

  var statsCache = { }
  var notFoundCache = { }

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
    var { path='.' } = args
    var filePath = joinPath(dirPath, path)

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
        var fileStats = fileStatsToJson(filePath, stats)

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

export var fileStatsMiddleware = inputHandlerMiddleware(
  fileStatsHandler, 'getFileStats')

export var fileStatsFilter = argsBuilderFilter(
config => {
  var { dirPath, getFileStats } = config

  return args => {
    var { path } = args

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

export var makeFileStatsHandler = 
  fileStatsHandler.factory()

export var makeFileStatsFilter = 
  fileStatsFilter.factory()