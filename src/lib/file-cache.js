import { 
  simpleHandler,
} from 'quiver-core/component'

import crypto from 'crypto'
let { createHash } = crypto

import { fileStatsFilter } from './file-stats'

let hash = string => {
  let checksum = createHash('md5')
  checksum.update(string)
  return checksum.digest('hex')
}

export let fileCacheHandler = simpleHandler(
args => {
  let { filePath, fileStats } = args

  let cacheId = hash(filePath)
  let lastModified = fileStats.mtime

  return {
    cacheId, lastModified
  }

}, 'void', 'json')
.middleware(fileStatsFilter)

export let makeFileCacheHandler = 
  fileCacheHandler.factory()