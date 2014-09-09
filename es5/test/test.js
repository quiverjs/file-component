"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__fs__,
    $__path__,
    $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__quiver_45_component__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_file_45_component_46_js__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var readFileSync = fs.readFileSync;
var pathLib = ($__path__ = require("path"), $__path__ && $__path__.__esModule && $__path__ || {default: $__path__}).default;
var joinPath = pathLib.join;
var $__2 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__2.async,
    promisify = $__2.promisify,
    timeout = $__2.timeout;
var streamToSimpleHandler = ($__quiver_45_simple_45_handler__ = require("quiver-simple-handler"), $__quiver_45_simple_45_handler__ && $__quiver_45_simple_45_handler__.__esModule && $__quiver_45_simple_45_handler__ || {default: $__quiver_45_simple_45_handler__}).streamToSimpleHandler;
var $__4 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    loadSimpleHandler = $__4.loadSimpleHandler,
    createRouter = $__4.router;
var $__5 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__5.streamableToText,
    emptyStreamable = $__5.emptyStreamable;
var $__6 = ($___46__46__47_lib_47_file_45_component_46_js__ = require("../lib/file-component.js"), $___46__46__47_lib_47_file_45_component_46_js__ && $___46__46__47_lib_47_file_45_component_46_js__.__esModule && $___46__46__47_lib_47_file_45_component_46_js__ || {default: $___46__46__47_lib_47_file_45_component_46_js__}),
    fileHandler = $__6.fileHandler,
    fileCacheHandler = $__6.fileCacheHandler,
    listDirPathHandler = $__6.listDirPathHandler,
    indexFileFilter = $__6.indexFileFilter,
    singleFileHandler = $__6.singleFileHandler;
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
  it('file handler test', async($traceurRuntime.initGeneratorFunction(function $__8() {
    var handler,
        args;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = 2;
            return loadSimpleHandler({dirPath: dirPath}, fileHandler(), 'void', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            args = {path: testPaths[0]};
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return handler(args).should.eventually.equal(expectedResults[0]);
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })));
  it('file handler test all', async($traceurRuntime.initGeneratorFunction(function $__9() {
    var handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = 2;
            return fileHandler().loadHandler({dirPath: dirPath});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return Promise.all(testPaths.map((function(path, index) {
              return handler({path: path}).then(streamableToText).should.eventually.equal(expectedResults[$traceurRuntime.toProperty(index)]);
            })));
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__9, this);
  })));
  it('file cache id test', async($traceurRuntime.initGeneratorFunction(function $__10() {
    var cacheHandler,
        path,
        file,
        result1,
        result2;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = 2;
            return fileCacheHandler().loadHandler({dirPath: dirPath});
          case 2:
            cacheHandler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            path = testPaths[1];
            file = testFiles[1];
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 6;
            return cacheHandler({path: path});
          case 6:
            result1 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            should.exist(result1.cacheId);
            should.exist(result1.lastModified);
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 10;
            return touch(file, {}).then((function() {
              return timeout(100);
            }));
          case 10:
            $ctx.maybeThrow();
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return cacheHandler({path: path});
          case 14:
            result2 = $ctx.sent;
            $ctx.state = 16;
            break;
          case 16:
            should.equal(result1.cacheId, result2.cacheId);
            should.not.equal(result1.lastModified, result2.lastModified);
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__10, this);
  })));
  it('list path handler test', async($traceurRuntime.initGeneratorFunction(function $__11() {
    var listPathHandler,
        files,
        $__12,
        $__13,
        $__14,
        $__15,
        $__16,
        $__17;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = 2;
            return listDirPathHandler().loadHandler({dirPath: dirPath});
          case 2:
            listPathHandler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__12 = listPathHandler({path: '/'});
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return $__12;
          case 6:
            $__13 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $__14 = $__13.subpaths;
            files = $__14;
            $ctx.state = 12;
            break;
          case 12:
            should.equal(files.length, 3);
            should.equal(files[0], '00.txt');
            should.equal(files[1], '01.txt');
            should.equal(files[2], 'subdir');
            $ctx.state = 22;
            break;
          case 22:
            $__15 = listPathHandler({path: 'subdir'});
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 14;
            return $__15;
          case 14:
            $__16 = $ctx.sent;
            $ctx.state = 16;
            break;
          case 16:
            $__17 = $__16.subpaths;
            files = $__17;
            $ctx.state = 20;
            break;
          case 20:
            should.equal(files.length, 2);
            should.equal(files[0], '02.txt');
            should.equal(files[1], 'index.html');
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__11, this);
  })));
  it('single file handler', async($traceurRuntime.initGeneratorFunction(function $__18() {
    var filePath,
        expected,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            filePath = testFiles[1];
            expected = expectedResults[1];
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return loadSimpleHandler({filePath: filePath}, singleFileHandler(), 'void', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({path: '/random'}).should.eventually.equal(expected);
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__18, this);
  })));
  it('router test', async($traceurRuntime.initGeneratorFunction(function $__19() {
    var filePath,
        expected,
        router,
        config,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            filePath = testFiles[1];
            expected = expectedResults[1];
            router = createRouter().addStaticRoute(singleFileHandler(), '/static-file').addParamRoute(fileHandler(), '/api/:restpath');
            config = {
              filePath: filePath,
              dirPath: dirPath
            };
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return loadSimpleHandler(config, router, 'void', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({path: '/static-file'}).should.eventually.equal(expected);
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return handler({path: '/api/subdir/index.html'}).should.eventually.equal(expectedResults[3]);
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__19, this);
  })));
  it('index path handler test', async($traceurRuntime.initGeneratorFunction(function $__20() {
    var privateTable,
        component,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            privateTable = {};
            component = fileHandler(privateTable).addMiddleware(indexFileFilter(privateTable));
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return loadSimpleHandler({dirPath: dirPath}, component, 'void', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({path: '/subdir'}).should.eventually.equal(expectedResults[3]);
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__20, this);
  })));
}));
