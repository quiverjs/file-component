import { 
  argsBuilderFilter, inputHandlerMiddleware 
} from 'quiver-core/component'

import { error } from 'quiver-core/error'
import { async } from 'quiver-core/promise'

import pathLib from 'path'
const { join: joinPath } = pathLib

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

export const indexFileFilter = argsBuilderFilter((config) => {
  const {
    indexFiles = defaultIndexes,
    listPathHandler 
  } = config

  return async(function*(args) {
    const { path, filePath, fileStats } = args
    if(!fileStats.isDirectory) return args

    const { subpaths } = yield listPathHandler({path})
    const indexFile = getIndexFile(indexFiles, subpaths)

    if(!indexFile) throw error(404, 'Not Found')

    args.path = joinPath(path, indexFile)
    args.filePath = joinPath(filePath, indexFile)
    args.fileStats = null

    return args
  })
})
.middleware(inputHandlerMiddleware(
  listDirPathHandler, 'listPathHandler'))
.middleware(fileStatsFilter)

export const makeIndexFileFilter = indexFileFilter
  .factory()