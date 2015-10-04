import { error } from 'quiver-core/util/error'
import { fileStreamable } from 'quiver-core/file-stream'
import { simpleHandler } from 'quiver-core/component/constructor'

import { contentTypeFilter } from './mime-filter'
import { fileStatsFilter } from './file-stats'

export const fileHandler = simpleHandler(
  args => {
    const fileStats = args.get('fileStats')
    const filePath = args.get('filePath')

    if(!fileStats.isFile)
      throw error(404, 'path is not a file')

    return fileStreamable(filePath, fileStats)
  }, {
    inputType: 'empty',
    outputType: 'streamable'
  })
  .setName('fileStreamHandler')
  .addMiddleware(contentTypeFilter)
  .addMiddleware(fileStatsFilter)

export const makeFileHandler = fileHandler.export()
