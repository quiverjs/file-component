import { error } from 'quiver-error'
import { promisify, reject } from 'quiver-promise'
import { 
  argsFilter, configMiddleware, extendHandler 
} from 'quiver-component'

import { makeFileHandler } from './file-handler'

import fs from 'fs'
var { stat } = fs

var statFile = promisify(stat)

var singleFilePathFilter = argsFilter(
args => {
  args.path = '.'
  return args
}, {
  name: 'Quiver Single File Path Filter'
})

var singleFileMiddleware = configMiddleware(
config => {
  var filePath = config.filePath

  return statFile(filePath).then(fileStats => {
    if(!fileStats.isFile()) return reject(
      error(400, 'config.filePath does not point to a file'))

    config.dirPath = filePath
    return config
  })
}, {
  name: 'Quiver Single File Middleware'
})

export var singleFileHandler = makeFileHandler()
  .addMiddleware(singleFilePathFilter)
  .addMiddleware(singleFileMiddleware)

export var makeSingleFileHandler = 
  singleFileHandler.privatizedConstructor()