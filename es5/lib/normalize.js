"use strict";
Object.defineProperties(exports, {
  normalizePathFilter: {get: function() {
      return normalizePathFilter;
    }},
  __esModule: {value: true}
});
var normalize = $traceurRuntime.assertObject(require('path')).normalize;
var ArgsFilter = $traceurRuntime.assertObject(require('quiver-component')).ArgsFilter;
var normalized = Symbol('pathNormalized');
var normalizePathFilter = new ArgsFilter((function(args) {
  var $__1;
  if (args[$traceurRuntime.toProperty(normalized)])
    return args;
  var $__0 = $traceurRuntime.assertObject(args),
      path = ($__1 = $__0.path) === void 0 ? '/' : $__1;
  $traceurRuntime.setProperty(args, normalized, true);
  args.path = normalize(path);
  return args;
}), {name: 'Quiver Normalize Path Filter'});
