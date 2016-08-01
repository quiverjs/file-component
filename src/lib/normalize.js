import { error } from 'quiver-util/error'
import { normalize, isAbsolute } from 'path'
import { argsFilter } from 'quiver-core/component/constructor'

const $normalized = Symbol('@normalized')

const normalizePath = path => {
  const normalized = normalize(path)

  if(!isAbsolute(normalized)) {
    throw error(400, 'input path must be absolute')
  }

  if(normalized[normalized.length-1] === '/') {
    return normalized.slice(0, normalized.length-1)
  } else {
    return normalized
  }
}

export const normalizePathFilter = argsFilter(
  args => {
    if(args.get($normalized)) return args

    const path = args.get('path', '/')
    const normalized = normalizePath(path)

    return args
      .set('path', normalized)
      .set($normalized, true)
  })
