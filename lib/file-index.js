import { 
  argsBuilderFilter, inputHandlerMiddleware 
} from 'quiver-core/component'

import { error } from 'quiver-core/error'
import { async } from 'quiver-core/promise'

import pathLib from 'path'
var { join: joinPath } = pathLib

import { fileStatsFilter } from './file-stats'
import { listDirPathHandler } from './list-dir'

var defaultIndexes = ['index.html']

var getIndexFile = (indexNames, files) => {
  for(var i=0; i<indexNames.length; i++) {
    var indexName = indexNames[i]
    var index = files.indexOf(indexName)
    if(index > -1) return indexName
  }

  return null
}

export var indexFileFilter = argsBuilderFilter((config) => {
  var {
    indexFiles = defaultIndexes,
    listPathHandler 
  } = config

  return async(function*(args) {
    var { path, filePath, fileStats } = args
    if(!fileStats.isDirectory) return args

    var { subpaths } = yield listPathHandler({path})
    var indexFile = getIndexFile(indexFiles, subpaths)

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

export var makeIndexFileFilter = indexFileFilter
  .factory()