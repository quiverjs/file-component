"use strict";
require('traceur');
var readFileSync = $traceurRuntime.assertObject(require('fs')).readFileSync;
var joinPath = $traceurRuntime.assertObject(require('path')).join;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    promisify = $__0.promisify,
    timeout = $__0.timeout;
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    loadSimpleHandler = $__0.loadSimpleHandler,
    ExtendedHandler = $__0.ExtendedHandler;
var streamToSimpleHandler = $traceurRuntime.assertObject(require('quiver-simple-handler')).streamToSimpleHandler;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    emptyStreamable = $__0.emptyStreamable;
var $__0 = $traceurRuntime.assertObject(require('../lib/file-component.js')),
    fileHandler = $__0.fileHandler,
    fileStreamHandler = $__0.fileStreamHandler,
    indexPathFilter = $__0.indexPathFilter;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
var touch = promisify(require('touch'));
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
    return loadSimpleHandler({dirPath: dirPath}, fileStreamHandler, 'void', 'text').then((function(handler) {
      var args = {path: testPaths[0]};
      return handler(args).should.eventually.equal(expectedResults[0]);
    }));
  }));
  it('file handleable test', (function() {
    return fileHandler.loadHandler({dirPath: dirPath}).then((function(handler) {
      return Promise.all(testPaths.map((function(path, index) {
        return handler({path: path}).then(streamableToText).should.eventually.equal(expectedResults[$traceurRuntime.toProperty(index)]);
      })));
    }));
  }));
  it('file cache id test', (function() {
    return fileHandler.loadHandleable({dirPath: dirPath}).then((function(handleable) {
      var cacheHandler = handleable.meta.cacheHandler;
      should.exist(cacheHandler);
      var path = testPaths[1];
      var file = testFiles[1];
      cacheHandler = streamToSimpleHandler(cacheHandler, 'void', 'json');
      return cacheHandler({path: path}).then((function(result1) {
        should.exist(result1.cacheId);
        should.exist(result1.lastModified);
        return touch(file, {}).then((function() {
          return timeout(100);
        })).then((function() {
          return cacheHandler({path: path}).then((function(result2) {
            should.equal(result1.cacheId, result2.cacheId);
            should.not.equal(result1.lastModified, result2.lastModified);
          }));
        }));
      }));
    }));
  }));
  it('list path handler test', (function() {
    return fileHandler.loadHandleable({dirPath: dirPath}).then((function(handleable) {
      var listPathHandler = handleable.meta.listPathHandler;
      should.exist(listPathHandler);
      listPathHandler = streamToSimpleHandler(listPathHandler, 'void', 'json');
      var p1 = listPathHandler({path: '/'}).then((function(result) {
        var files = result.subpaths;
        should.equal(files.length, 3);
        should.equal(files[0], '00.txt');
        should.equal(files[1], '01.txt');
        should.equal(files[2], 'subdir');
      }));
      var p2 = listPathHandler({path: 'subdir'}).then((function(result) {
        var files = result.subpaths;
        should.equal(files.length, 2);
        should.equal(files[0], '02.txt');
        should.equal(files[1], 'index.html');
      }));
      return Promise.all([p1, p2]);
    }));
  }));
  it('index path handler test', (function() {
    var component = new ExtendedHandler(fileHandler).addMiddleware(indexPathFilter);
    return loadSimpleHandler({dirPath: dirPath}, component, 'void', 'text').then((function(handler) {
      return handler({path: '/subdir'}).should.eventually.equal(expectedResults[3]);
    }));
  }));
}));
