import { createHash } from 'crypto'
import { simpleHandler } from 'quiver-core/component/constructor'

import { fileStatsFilter } from './file-stats'

const hash = string => {
  const checksum = createHash('md5')
  checksum.update(string)
  return checksum.digest('hex')
}

export const fileCacheHandler = simpleHandler(
  args => {
    const filePath = args.get('filePath')
    const fileStats = args.get('fileStats')

    const cacheId = hash(filePath)
    const lastModified = fileStats.mtime

    return { cacheId, lastModified }

  }, {
    inputType: 'empty',
    outputType: 'json'
  })
  .addMiddleware(fileStatsFilter)

export const makeFileCacheHandler = fileCacheHandler.export()
