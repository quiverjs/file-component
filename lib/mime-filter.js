import mime from 'mime'
import { async } from 'quiver-core/promise'
import { streamFilter } from 'quiver-core/component'

export var contentTypeFilter = streamFilter(
(config, handler) =>
  async(function*(args, inputStreamable) {
    var { filePath='/' } = args
    var contentType = mime.lookup(filePath)

    var resultStreamable = yield handler(
      args, inputStreamable)

    if(!resultStreamable.contentType)
      resultStreamable.contentType = contentType

    return resultStreamable
  }))