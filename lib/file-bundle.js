import { makeFileHandler } from './file-handler.js'
import { makeFileStatsHandler } from './file-stats.js'
import { makeFileCacheHandler } from './file-cache.js'
import { makeListDirPathHandler } from './list-dir.js'
import { makeIndexFileFilter } from './file-index.js'

export var makeFileBundle = (privateTable={}) => ({
  fileHandler: makeFileHandler(privateTable),
  fileStatsHandler: makeFileStatsHandler(privateTable),
  fileCacheHandler: makeFileCacheHandler(privateTable),
  listDirPathHandler: makeListDirPathHandler(privateTable),
  indexFileFilter: makeIndexFileFilter(privateTable)
})