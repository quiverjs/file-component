"use strict";
require('traceur');
var joinPath = $traceurRuntime.assertObject(require('path')).join;
var startServer = $traceurRuntime.assertObject(require('quiver-http')).startServer;
var makeFileHandler = $traceurRuntime.assertObject(require('../lib/file-component.js')).makeFileHandler;
var config = {dirPath: './test-content'};
var fileHandler = makeFileHandler();
startServer(fileHandler, config, 8080).then((function(server) {
  console.log('simple file server running at port 8080...');
})).catch((function(err) {
  console.log('error starting server:', err.stack);
}));
