import { reject } from 'quiver-promise'
import { fileStreamable } from 'quiver-file-stream'
import { 
  SimpleHandler, PrivateInputMiddleware 
} from 'quiver-component'

import { fileStatsFilter } from './file-stats.js'

export var fileStreamHandler = new SimpleHandler(
args => {
  var { fileStats, filePath } = args

  if(!fileStats.isFile)
    return reject(error(404, 'path is not a file'))

  return fileStreamable(filePath, fileStats)

}, 'void', 'streamable', {
  name: 'Quiver File Stream Handler'
})
.addMiddleware(fileStatsFilter)

export var fileStreamMiddleware = new PrivateInputMiddleware(
  fileStreamHandler, 'fileHandler')