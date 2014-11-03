import { makeFileHandler } from './file-handler'
import { makeFileStatsHandler } from './file-stats'
import { makeFileCacheHandler } from './file-cache'
import { makeListDirPathHandler } from './list-dir'
import { makeIndexFileFilter } from './file-index'

export var makeFileBundle = (privateTable={}) => ({
  fileHandler: makeFileHandler(privateTable),
  fileStatsHandler: makeFileStatsHandler(privateTable),
  fileCacheHandler: makeFileCacheHandler(privateTable),
  listDirPathHandler: makeListDirPathHandler(privateTable),
  indexFileFilter: makeIndexFileFilter(privateTable)
})