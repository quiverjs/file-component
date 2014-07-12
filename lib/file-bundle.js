import { makeFileHandler } from './file-handler.js'
import { makeFileStatsHandler } from './file-stats.js'
import { makeFileCacheHandler } from './file-cache.js'
import { makeListDirPathHandler } from './list-dir.js'

var makeFileBundle = bundle => ({
  fileHandler: makeFileHandler(bundle),
  fileStatsHandler: makeFileStatsHandler(bundle),
  fileCacheHandler: makeFileCacheHandler(bundle),
  listDirPathHandler: makeListDirPathHandler(bundle)
})