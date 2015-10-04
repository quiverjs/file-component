import mime from 'mime'
import { streamFilter } from 'quiver-core/component/constructor'

export const contentTypeFilter = streamFilter(
(config, handler) =>
  async function(args, inputStreamable) {
    const filePath = args.get('filePath') || '/'
    const contentType = mime.lookup(filePath)

    const resultStreamable = await handler(args, inputStreamable)

    if(!resultStreamable.contentType)
      resultStreamable.contentType = contentType

    return resultStreamable
  })
