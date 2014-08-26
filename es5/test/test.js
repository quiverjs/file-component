"use strict";
require('traceur');
var readFileSync = $traceurRuntime.assertObject(require('fs')).readFileSync;
var joinPath = $traceurRuntime.assertObject(require('path')).join;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    promisify = $__0.promisify,
    timeout = $__0.timeout;
var streamToSimpleHandler = $traceurRuntime.assertObject(require('quiver-simple-handler')).streamToSimpleHandler;
var $__0 = $traceurRuntime.assertObject(require('quiver-component')),
    loadSimpleHandler = $__0.loadSimpleHandler,
    createRouter = $__0.router;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    emptyStreamable = $__0.emptyStreamable;
var $__0 = $traceurRuntime.assertObject(require('../lib/file-component.js')),
    makeFileHandler = $__0.makeFileHandler,
    makeFileCacheHandler = $__0.makeFileCacheHandler,
    makeListDirPathHandler = $__0.makeListDirPathHandler,
    makeFileBundle = $__0.makeFileBundle,
    makeIndexFileFilter = $__0.makeIndexFileFilter,
    makeSingleFileHandler = $__0.makeSingleFileHandler;
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
  it('file handler test', (function() {
    return loadSimpleHandler({dirPath: dirPath}, makeFileHandler(), 'void', 'text').then((function(handler) {
      var args = {path: testPaths[0]};
      return handler(args).should.eventually.equal(expectedResults[0]);
    }));
  }));
  it('file handler test all', (function() {
    return makeFileHandler().loadHandler({dirPath: dirPath}).then((function(handler) {
      return Promise.all(testPaths.map((function(path, index) {
        return handler({path: path}).then(streamableToText).should.eventually.equal(expectedResults[$traceurRuntime.toProperty(index)]);
      })));
    }));
  }));
  it('file cache id test', (function() {
    return makeFileCacheHandler().loadHandler({dirPath: dirPath}).then((function(cacheHandler) {
      var path = testPaths[1];
      var file = testFiles[1];
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
    return makeListDirPathHandler().loadHandler({dirPath: dirPath}).then((function(listPathHandler) {
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
  it('single file handler', (function() {
    var filePath = testFiles[1];
    var expected = expectedResults[1];
    return loadSimpleHandler({filePath: filePath}, makeSingleFileHandler(), 'void', 'text').then((function(handler) {
      return handler({path: '/random'}).should.eventually.equal(expected);
    }));
  }));
  it('router test', (function() {
    var filePath = testFiles[1];
    var expected = expectedResults[1];
    var singleFileHandler = makeSingleFileHandler();
    var fileHandler = makeFileHandler();
    var router = createRouter().addStaticRoute(singleFileHandler, '/static-file').addParamRoute(fileHandler, '/api/:restpath');
    var config = {
      filePath: filePath,
      dirPath: dirPath
    };
    return loadSimpleHandler(config, router, 'void', 'text').then((function(handler) {
      var p1 = handler({path: '/static-file'}).should.eventually.equal(expected);
      var p2 = handler({path: '/api/subdir/index.html'}).should.eventually.equal(expectedResults[3]);
      return Promise.all([p1, p2]);
    }));
  }));
  it('index path handler test', (function() {
    var privateTable = {};
    var component = makeFileHandler(privateTable).addMiddleware(makeIndexFileFilter(privateTable));
    return loadSimpleHandler({dirPath: dirPath}, component, 'void', 'text').then((function(handler) {
      return handler({path: '/subdir'}).should.eventually.equal(expectedResults[3]);
    }));
  }));
}));
