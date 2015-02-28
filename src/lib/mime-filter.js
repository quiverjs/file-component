import mime from 'mime'
import { async } from 'quiver-core/promise'
import { streamFilter } from 'quiver-core/component'

export let contentTypeFilter = streamFilter(
(config, handler) =>
  async(function*(args, inputStreamable) {
    let { filePath='/' } = args
    let contentType = mime.lookup(filePath)

    let resultStreamable = yield handler(
      args, inputStreamable)

    if(!resultStreamable.contentType)
      resultStreamable.contentType = contentType

    return resultStreamable
  }))