import { error } from 'quiver-core/error'
import { promisify, reject } from 'quiver-core/promise'
import { 
  argsFilter, configMiddleware, extendHandler 
} from 'quiver-core/component'

import { makeFileHandler } from './file-handler'

import fs from 'fs'
let { stat } = fs

let statFile = promisify(stat)

let singleFilePathFilter = argsFilter(
args => {
  args.path = '.'
  return args
}, {
  name: 'Quiver Single File Path Filter'
})

let singleFileMiddleware = configMiddleware(
config => {
  let filePath = config.filePath

  return statFile(filePath).then(fileStats => {
    if(!fileStats.isFile()) return reject(
      error(400, 'config.filePath does not point to a file'))

    config.dirPath = filePath
    return config
  })
}, {
  name: 'Quiver Single File Middleware'
})

export let singleFileHandler = makeFileHandler()
  .middleware(singleFilePathFilter)
  .middleware(singleFileMiddleware)

export let makeSingleFileHandler = 
  singleFileHandler.factory()