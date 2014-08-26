"use strict";
require('traceur');
var joinPath = $traceurRuntime.assertObject(require('path')).join;
var startServer = $traceurRuntime.assertObject(require('quiver-http')).startServer;
var makeFileBundle = $traceurRuntime.assertObject(require('../lib/file-component.js')).makeFileBundle;
var config = {
  dirPath: './test-content',
  serverListen: 8080
};
var $__0 = $traceurRuntime.assertObject(makeFileBundle()),
    fileHandler = $__0.fileHandler,
    indexFileFilter = $__0.indexFileFilter;
fileHandler.addMiddleware(indexFileFilter);
startServer(fileHandler, config).then((function(server) {
  console.log('simple file server running at port 8080...');
})).catch((function(err) {
  console.log('error starting server:', err.stack);
}));
