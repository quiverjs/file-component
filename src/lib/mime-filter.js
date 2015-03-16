import mime from 'mime'
import { async } from 'quiver-core/promise'
import { streamFilter } from 'quiver-core/component'

export const contentTypeFilter = streamFilter(
(config, handler) =>
  async(function*(args, inputStreamable) {
    const { filePath='/' } = args
    const contentType = mime.lookup(filePath)

    const resultStreamable = yield handler(
      args, inputStreamable)

    if(!resultStreamable.contentType)
      resultStreamable.contentType = contentType

    return resultStreamable
  }))