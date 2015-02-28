import { 
  argsBuilderFilter, inputHandlerMiddleware 
} from 'quiver-core/component'

import { error } from 'quiver-core/error'
import { async } from 'quiver-core/promise'

import pathLib from 'path'
let { join: joinPath } = pathLib

import { fileStatsFilter } from './file-stats'
import { listDirPathHandler } from './list-dir'

let defaultIndexes = ['index.html']

let getIndexFile = (indexNames, files) => {
  for(let i=0; i<indexNames.length; i++) {
    let indexName = indexNames[i]
    let index = files.indexOf(indexName)
    if(index > -1) return indexName
  }

  return null
}

export let indexFileFilter = argsBuilderFilter((config) => {
  let {
    indexFiles = defaultIndexes,
    listPathHandler 
  } = config

  return async(function*(args) {
    let { path, filePath, fileStats } = args
    if(!fileStats.isDirectory) return args

    let { subpaths } = yield listPathHandler({path})
    let indexFile = getIndexFile(indexFiles, subpaths)

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

export let makeIndexFileFilter = indexFileFilter
  .factory()