import { join as joinPath } from 'path'
import { startServer } from 'quiver/http'
import { fileBundle } from '../lib/file-component.js'

const config = {
  dirPath: './test-content',
  serverListen: 8080
}

const { 
  fileHandler,
  indexFileFilter
} = fileBundle()

fileHandler.middleware(indexFileFilter)

startServer(fileHandler, config)
.then(server => {
  console.log('simple file server running at port 8080...')
})
.catch(err => {
  console.log('error starting server:', err.stack)
})