import { argsFilter } from 'quiver-core/component'

import pathLib from 'path'
const { normalize } = pathLib

const normalized = Symbol('pathNormalized')

export const normalizePathFilter = argsFilter(
args => {
  if(args[normalized]) return args

  const { path='/' } = args

  args[normalized] = true
  args.path = normalize(path)

  return args
}, {
  name: 'Quiver Normalize Path Filter',
})