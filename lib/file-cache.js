import { 
  simpleHandler,
} from 'quiver-component'

import crypto from 'crypto'
var { createHash } = crypto

import { fileStatsFilter } from './file-stats'

var hash = string => {
  var checksum = createHash('md5')
  checksum.update(string)
  return checksum.digest('hex')
}

export var fileCacheHandler = simpleHandler(
args => {
  var { filePath, fileStats } = args

  var cacheId = hash(filePath)
  var lastModified = fileStats.mtime

  return {
    cacheId, lastModified
  }

}, 'void', 'json')
.addMiddleware(fileStatsFilter)

export var makeFileCacheHandler = 
  fileCacheHandler.privatizedConstructor()