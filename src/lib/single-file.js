import { error } from 'quiver/error'
import { promisify, reject } from 'quiver/promise'
import { 
  argsFilter, configMiddleware, extendHandler 
} from 'quiver/component'

import { makeFileHandler } from './file-handler'

import fs from 'fs'
const { stat } = fs

const statFile = promisify(stat)

const singleFilePathFilter = argsFilter(
args => {
  args.path = '.'
  return args
}, {
  name: 'Quiver Single File Path Filter'
})

const singleFileMiddleware = configMiddleware(
config => {
  const filePath = config.filePath

  return statFile(filePath).then(fileStats => {
    if(!fileStats.isFile()) return reject(
      error(400, 'config.filePath does not point to a file'))

    config.dirPath = filePath
    return config
  })
}, {
  name: 'Quiver Single File Middleware'
})

export const singleFileHandler = makeFileHandler()
  .middleware(singleFilePathFilter)
  .middleware(singleFileMiddleware)

export const makeSingleFileHandler = 
  singleFileHandler.factory()