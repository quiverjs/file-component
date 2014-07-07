"use strict";
require('traceur');
var readFileSync = $traceurRuntime.assertObject(require('fs')).readFileSync;
var joinPath = $traceurRuntime.assertObject(require('path')).join;
var loadSimpleHandler = $traceurRuntime.assertObject(require('quiver-component')).loadSimpleHandler;
var $__0 = $traceurRuntime.assertObject(require('../lib/file-component.js')),
    fileHandler = $__0.fileHandler,
    fileStreamHandler = $__0.fileStreamHandler;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('file component test', (function() {
  var dirPath = './test-content/';
  var testPaths = ['00.txt', '01.txt', 'subdir/02.txt', 'subdir/index.html'];
  var testFiles = testPaths.map((function(file) {
    return joinPath(dirPath, file);
  }));
  var expectedResults = testFiles.map((function(file) {
    return readFileSync(file).toString();
  }));
  it('file stream handler test', (function() {
    var config = {dirPath: dirPath};
    return loadSimpleHandler(config, fileStreamHandler, 'void', 'text').then((function(handler) {
      var args = {path: testPaths[0]};
      return handler(args).should.eventually.equal(expectedResults[0]);
    }));
  }));
}));
