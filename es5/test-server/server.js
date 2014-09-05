"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__path__,
    $__quiver_45_http__,
    $___46__46__47_lib_47_file_45_component_46_js__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var joinPath = ($__path__ = require("path"), $__path__ && $__path__.__esModule && $__path__ || {default: $__path__}).join;
var startServer = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}).startServer;
var makeFileBundle = ($___46__46__47_lib_47_file_45_component_46_js__ = require("../lib/file-component.js"), $___46__46__47_lib_47_file_45_component_46_js__ && $___46__46__47_lib_47_file_45_component_46_js__.__esModule && $___46__46__47_lib_47_file_45_component_46_js__ || {default: $___46__46__47_lib_47_file_45_component_46_js__}).makeFileBundle;
var config = {
  dirPath: './test-content',
  serverListen: 8080
};
var $__3 = makeFileBundle(),
    fileHandler = $__3.fileHandler,
    indexFileFilter = $__3.indexFileFilter;
fileHandler.addMiddleware(indexFileFilter);
startServer(fileHandler, config).then((function(server) {
  console.log('simple file server running at port 8080...');
})).catch((function(err) {
  console.log('error starting server:', err.stack);
}));
