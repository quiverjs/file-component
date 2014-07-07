import { createHash } from 'crypto'

import { 
  SimpleHandler, PrivateInputMiddleware 
} from 'quiver-component'

import { fileStatsFilter } from './file-stats.js'

var hash = string => {
  var checksum = createHash('md5')
  checksum.update(string)
  return checksum.digest('hex')
}

export var fileCacheHandler = new SimpleHandler(
args => {
  var { filePath, fileStats } = args

  var cacheId = hash(filePath)
  var lastModified = fileStats.mtime.getTime()

  return {
    cacheId, lastModified
  }

}, 'void', 'json')
.addMiddleware(fileStatsFilter)

export var fileCacheMiddleware = new PrivateInputMiddleware(
  fileCacheHandler, 'fileCacheHandler')