"use strict";
Object.defineProperties(exports, {
  normalizePathFilter: {get: function() {
      return normalizePathFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_component__,
    $__path__;
var argsFilter = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}).argsFilter;
var pathLib = ($__path__ = require("path"), $__path__ && $__path__.__esModule && $__path__ || {default: $__path__}).default;
var normalize = pathLib.normalize;
var normalized = Symbol('pathNormalized');
var normalizePathFilter = argsFilter((function(args) {
  var $__4;
  if (args[normalized])
    return args;
  var $__3 = args,
      path = ($__4 = $__3.path) === void 0 ? '/' : $__4;
  args[normalized] = true;
  args.path = normalize(path);
  return args;
}), {name: 'Quiver Normalize Path Filter'});
