import { argsFilter } from 'quiver-core/component'

import pathLib from 'path'
let { normalize } = pathLib

let normalized = Symbol('pathNormalized')

export let normalizePathFilter = argsFilter(
args => {
  if(args[normalized]) return args

  let { path='/' } = args

  args[normalized] = true
  args.path = normalize(path)

  return args
}, {
  name: 'Quiver Normalize Path Filter',
})