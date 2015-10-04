import { error } from 'quiver-core/util/error'
import { promisify } from 'quiver-core/util/promise'
import {
  argsFilter, configMiddleware
} from 'quiver-core/component/constructor'

import { makeFileHandler } from './file-handler'

import { stat } from 'fs'

const statFile = promisify(stat)

const singleFilePathFilter = argsFilter(
  args =>
    args.set('path', '.'))

const singleFileMiddleware = configMiddleware(
  async function(config) {
    const filePath = config.get('filePath')
    const fileStats = await statFile(filePath)

    if(!fileStats.isFile())
      throw error(400, 'config.filePath does not point to a file')

    return config
      .set('dirPath', filePath)
  })

export const singleFileHandler = makeFileHandler()
  .addMiddleware(singleFilePathFilter)
  .addMiddleware(singleFileMiddleware)

export const makeSingleFileHandler = singleFileHandler.export()
