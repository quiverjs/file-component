import 'traceur'

import { join as joinPath } from 'path'
import { startServer } from 'quiver-http'
import { makeFileHandler } from '../lib/file-component.js'

var config = {
  dirPath: './test-content'
}

var fileHandler = makeFileHandler()

startServer(fileHandler, config, 8080)
.then(server => {
  console.log('simple file server running at port 8080...')
})
.catch(err => {
  console.log('error starting server:', err.stack)
})