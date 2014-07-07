import { normalize } from 'path'
import { ArgsFilter } from 'quiver-component'

var normalized = Symbol('pathNormalized')

export var normalizePathFilter = new ArgsFilter(
args => {
  if(args[normalized]) return args

  var { path='/' } = args

  args[normalized] = true
  args.path = normalize(path)

  return args
}, {
  name: 'Quiver Normalize Path Filter',
})