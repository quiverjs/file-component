import { 
  simpleHandler,
} from 'quiver-core/component'

import crypto from 'crypto'
const { createHash } = crypto

import { fileStatsFilter } from './file-stats'

const hash = string => {
  const checksum = createHash('md5')
  checksum.update(string)
  return checksum.digest('hex')
}

export const fileCacheHandler = simpleHandler(
args => {
  const { filePath, fileStats } = args

  const cacheId = hash(filePath)
  const lastModified = fileStats.mtime

  return {
    cacheId, lastModified
  }

}, 'void', 'json')
.middleware(fileStatsFilter)

export const makeFileCacheHandler = 
  fileCacheHandler.factory()