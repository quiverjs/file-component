import { join as joinPath } from 'path'

import { error } from 'quiver-core/util/error'
import { createArgs } from 'quiver-core/component/util'
import { inputHandler } from 'quiver-core/component/method'
import { argsBuilderFilter } from 'quiver-core/component/constructor'

import { fileStatsFilter } from './file-stats'
import { listDirPathHandler } from './list-dir'

const defaultIndexes = ['index.html']

const getIndexFile = (indexNames, files) => {
  for(let i=0; i<indexNames.length; i++) {
    const indexName = indexNames[i]
    const index = files.indexOf(indexName)
    if(index > -1) return indexName
  }

  return null
}

export const indexFileFilter = argsBuilderFilter(
  config => {
    const indexFiles = config.get('indexFiles') || defaultIndexes
    const listPathHandler = config.get('listPathHandler')

    return async function(args) {
      const path = args.get('path')
      const filePath = args.get('filePath')
      const fileStats = args.get('fileStats')

      if(!fileStats.isDirectory) return args

      const inArgs = createArgs({ path })
      const { subpaths } = await listPathHandler(inArgs)

      const indexFile = getIndexFile(indexFiles, subpaths)

      if(!indexFile) throw error(404, 'Not Found')

      return args
        .delete('fileStats')
        .set('path', joinPath(path, indexFile))
        .set('filePath', joinPath(filePath, indexFile))
    }
  })
  ::inputHandler('listPathHandler', listDirPathHandler)
  .addMiddleware(fileStatsFilter)

export const makeIndexFileFilter = indexFileFilter.export()
