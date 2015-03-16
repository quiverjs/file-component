import { makeFileHandler } from './file-handler'
import { makeFileStatsHandler } from './file-stats'
import { makeFileCacheHandler } from './file-cache'
import { makeListDirPathHandler } from './list-dir'
import { makeIndexFileFilter } from './file-index'

export const makeFileBundle = (forkTable={}) => ({
  fileHandler: makeFileHandler(forkTable),
  fileStatsHandler: makeFileStatsHandler(forkTable),
  fileCacheHandler: makeFileCacheHandler(forkTable),
  listDirPathHandler: makeListDirPathHandler(forkTable),
  indexFileFilter: makeIndexFileFilter(forkTable)
})