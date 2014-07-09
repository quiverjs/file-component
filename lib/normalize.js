import { normalize } from 'path'
import { argsFilter } from 'quiver-component'

var normalized = Symbol('pathNormalized')

export var normalizePathFilter = argsFilter(
args => {
  if(args[normalized]) return args

  var { path='/' } = args

  args[normalized] = true
  args.path = normalize(path)

  return args
}, {
  name: 'Quiver Normalize Path Filter',
})