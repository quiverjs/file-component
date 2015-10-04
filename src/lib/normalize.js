import { normalize } from 'path'
import { argsFilter } from 'quiver-core/component/constructor'

const $normalized = Symbol('@normalized')

export const normalizePathFilter = argsFilter(
  args => {
    if(args.get($normalized)) return args

    const path = args.get('path') || '/'

    return args
      .set('path', normalize(path))
      .set($normalized, true)
  })
