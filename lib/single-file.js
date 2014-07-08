import { stat } from 'fs'
import { error } from 'quiver-error'
import { promisify, reject } from 'quiver-promise'
import { 
  ArgsFilter, ConfigMiddleware, ExtendedHandler 
} from 'quiver-component'

import { fileHandleable } from './file-handleable.js'

var statFile = promisify(stat)

var singleFilePathFilter = new ArgsFilter(
args => {
  args.path = '.'
  return args
})

var singleFileMiddleware = new ConfigMiddleware(
config => {
  var filePath = config.filePath

  return statFile(filePath).then(fileStats => {
    if(!fileStats.isFile()) return reject(
      error(400, 'config.filePath does not point to a file'))

    config.dirPath = filePath
    return config
  })
})

export var singleFileHandler = new ExtendedHandler(
  fileHandleable, { name: 'Quiver Single File Handler' })
  .addMiddleware(singleFilePathFilter)
  .addMiddleware(singleFileMiddleware)