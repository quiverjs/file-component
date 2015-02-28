import { error } from 'quiver-core/error'
import { reject } from 'quiver-core/promise'
import { fileStreamable } from 'quiver-core/file-stream'
import { 
  simpleHandlerBuilder, inputHandlerMiddleware 
} from 'quiver-core/component'

import { contentTypeFilter } from './mime-filter'
import { fileStatsFilter } from './file-stats'

export let fileHandler = simpleHandlerBuilder(
config => {
  return args => {
    let { fileStats, filePath } = args

    if(!fileStats.isFile)
      return reject(error(404, 'path is not a file'))

    return fileStreamable(filePath, fileStats)
  }
}, 'void', 'streamable', {
  name: 'Quiver File Stream Handler'
})
.middleware(contentTypeFilter)
.middleware(fileStatsFilter)

export let makeFileHandler = fileHandler.factory()