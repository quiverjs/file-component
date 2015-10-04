import { MapComponent } from 'quiver-core/component'

import { fileHandler } from './file-handler'
import { fileStatsHandler } from './file-stats'
import { fileCacheHandler } from './file-cache'
import { listDirPathHandler } from './list-dir'
import { indexFileFilter } from './file-index'

const fileBundle = new MapComponent()
  .setComponent('fileHandler', fileHandler)
  .setComponent('fileStatsHandler', fileStatsHandler)
  .setComponent('fileCacheHandler', fileCacheHandler)
  .setComponent('listDirPathHandler', listDirPathHandler)
  .setComponent('indexFileFilter', indexFileFilter)

export const makeFileBundle = fileBundle.export()
