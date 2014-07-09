import { error } from 'quiver-error'
import { reject } from 'quiver-promise'
import { fileStreamable } from 'quiver-file-stream'
import { 
  simpleHandler, privateInputMiddleware 
} from 'quiver-component'

import { fileStatsFilter } from './file-stats.js'

export var fileStreamHandler = simpleHandler(
args => {
  var { fileStats, filePath } = args

  if(!fileStats.isFile)
    return reject(error(404, 'path is not a file'))

  return fileStreamable(filePath, fileStats)

}, 'void', 'streamable', {
  name: 'Quiver File Stream Handler'
})
.addMiddleware(fileStatsFilter)

export var fileStreamMiddleware = privateInputMiddleware(
  fileStreamHandler, 'fileHandler')