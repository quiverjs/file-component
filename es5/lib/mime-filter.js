"use strict";
Object.defineProperties(exports, {
  contentTypeFilter: {get: function() {
      return contentTypeFilter;
    }},
  __esModule: {value: true}
});
var $__mime__,
    $__quiver_45_promise__,
    $__quiver_45_component__;
var mime = ($__mime__ = require("mime"), $__mime__ && $__mime__.__esModule && $__mime__ || {default: $__mime__}).default;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var streamFilter = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}).streamFilter;
var contentTypeFilter = streamFilter((function(config, handler) {
  return async($traceurRuntime.initGeneratorFunction(function $__5(args, inputStreamable) {
    var $__4,
        $__3,
        filePath,
        contentType,
        resultStreamable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__3 = args, filePath = ($__4 = $__3.filePath) === void 0 ? '/' : $__4;
            contentType = mime.lookup(filePath);
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 2;
            return handler(args, inputStreamable);
          case 2:
            resultStreamable = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            if (!resultStreamable.contentType)
              resultStreamable.contentType = contentType;
            $ctx.state = 10;
            break;
          case 10:
            $ctx.returnValue = resultStreamable;
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  }));
}));
