import { startServer } from 'quiver-core/http'
import { createConfig } from 'quiver-core/component/util'

import { fileBundle } from '../lib/constructor'

const config = createConfig({
  dirPath: './test-content',
  serverListen: 8080
})

const fileComponents = fileBundle()
const fileHandler = fileComponents.getComponent('fileHandler')
const indexFileFilter = fileComponents.getComponent('indexFileFilter')

fileHandler.addMiddleware(indexFileFilter)

startServer(config, fileHandler)
.then(server => {
  console.log('simple file server running at port 8080...')
})
.catch(err => {
  console.log('error starting server:', err.stack)
})
