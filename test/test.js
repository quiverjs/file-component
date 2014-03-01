
'use strict'

var fs = require('fs')
var touch = require('touch')
var async = require('async')
var pathLib = require('path')
var should = require('should')
var error = require('quiver-error').error
var moduleLib = require('quiver-module')
var copyObject = require('quiver-copy').copyObject
var componentLib = require('quiver-component')
var streamChannel = require('quiver-stream-channel')
var streamConvert = require('quiver-stream-convert')
var simpleHandlerLib = require('quiver-simple-handler')
var fileCacheId = require('../component/handler/file-cache-id-handler').fileCacheId

var fileComponentModule = require('../lib/file-component').quiverModule
var quiverComponents = moduleLib.loadComponentsFromQuiverModule(fileComponentModule)

quiverComponents.push({
  name: 'test index file handler',
  type: 'stream handler',
  middlewares: [
    'quiver file index path filter'
  ],
  handler: 'quiver file directory stream handler'
})

describe('file component test', function() {
  var testContents
  var componentConfig

  var testDir = pathLib.join(__dirname, '../test-content/')

  var testFiles = [
    '00.txt',
    '01.txt',
    'subdir/02.txt',
    'subdir/index.html',
  ].map(function(testFile) {
    return pathLib.join(__dirname, '../test-content/', testFile)
  })

  before(function(callback) {
    async.map(testFiles, function(testFile, callback) {
      fs.readFile(testFile, { encoding: 'utf8' }, callback)
    }, function(err, contents) {
      if(err) return callback(err)

      testContents = contents
      callback()
    })
  })

  before(function(callback) {
    componentLib.installComponents(quiverComponents, function(err, config) {
      if(err) return callback(err)

      componentConfig = config
      callback()
    })
  })

  it('file stream handler test', function(callback) {
    var config = copyObject(componentConfig)
    var fileHandlerBuilder = config.quiverHandleableBuilders[
      'quiver single file stream handler']

    config.filePath = testFiles[0]
    fileHandlerBuilder(config, function(err, handleable) {
      if(err) return callback(err)

      var handler = handleable.toStreamHandler()
      handler({}, streamChannel.createEmptyStreamable(),
        function(err, resultStreamable) {
          if(err) return callback(err)

          streamConvert.streamableToText(resultStreamable, 
            function(err, content) {
              if(err) return callback(err)
              should.equal(content, testContents[0])
              callback()
            })
        })
    })
  })

  it('dir stream handler test', function(callback) {
    var config = copyObject(componentConfig)
    var dirHandlerBuilder = config.quiverHandleableBuilders[
      'quiver file directory stream handler']

    config.dirPath = testDir

    dirHandlerBuilder(config, function(err, handleable) {
      if(err) return callback(err)

      var handler = handleable.toStreamHandler()
      var args = {
        path: '/subdir/02.txt'
      }

      handler(args, streamChannel.createEmptyStreamable(),
        function(err, resultStreamable) {
          if(err) return callback(err)

          streamConvert.streamableToText(resultStreamable, 
            function(err, content) {
              if(err) return callback(err)

              should.equal(content, testContents[2])
              callback()
            })
        })
    })
  })

  it('list path handler test', function(callback) {
    var config = copyObject(componentConfig)
    config.dirPath = testDir

    var handlerBuilder = config.quiverHandleableBuilders[
      'quiver file list path handler']

    handlerBuilder(config, function(err, handleable) {
      if(err) return callback(err)
      
      var handler = handleable.toStreamHandler()

      var listFiles = function(path, callback) {
        var args = { path: path }
        handler(args, streamChannel.createEmptyStreamable(),
          function(err, resultStreamable) {
            if(err) return callback(err)
            
            streamConvert.streamableToJson(resultStreamable, 
              function(err, json) {
                if(err) return callback(err)
                
                callback(null, json.subpaths)
              })
          })
      }

      listFiles('/', function(err, files) {
        if(err) return callback(err)
        process.nextTick(function() {
          should.equal(files.length, 3)
          should.equal(files[0], '00.txt')
          should.equal(files[1], '01.txt')
          should.equal(files[2], 'subdir')

          listFiles('/subdir', function(err, files) {
            if(err) return callback(err)
            
            should.equal(files.length, 2)
            should.equal(files[0], '02.txt')
            should.equal(files[1], 'index.html')
            callback()
          })
        })
      })
    })
  })

  it('dir cache id test', function(callback) {
    var testFile = testFiles[1]
    var testPath = '/01.txt'

    var fileStats1 = fs.statSync(testFile)
    var cacheId1 = fileCacheId(testFile, fileStats1)

    var config = copyObject(componentConfig)
    config.dirPath = testDir

    var handlerBuilder = config.quiverHandleableBuilders[
      'quiver file directory cache id handler']

    handlerBuilder(config, function(err, handleable) {
      if(err) return callback(err)

      var streamHandler = handleable.toStreamHandler()
      var handler = simpleHandlerLib.streamHandlerToSimpleHandler(
        'void', 'text', streamHandler)

      var args = {
        path: testPath
      }

      handler(args, function(err, cacheId) {
        if(err) return callback(err)
        
        should.equal(cacheId, cacheId1)

        touch(testFile, {}, function(err) { if(err) console.trace(err) })

        setTimeout(function() {
          handler(args, function(err, cacheId) {
            if(err) return callback(err)
          
            var fileStats2 = fs.statSync(testFile)
            var cacheId2 = fileCacheId(testFile, fileStats2)

            should.equal(cacheId, cacheId2)
          
            callback()
          })
        }, 500)

      })
    })
  })

  it('file cache id test', function(callback) {
    var testFile = testFiles[2]

    var fileStats1 = fs.statSync(testFile)
    var cacheId1 = fileCacheId(testFile, fileStats1)

    var config = copyObject(componentConfig)
    config.filePath = testFile

    var handlerBuilder = config.quiverHandleableBuilders[
      'quiver single file cache id handler']

    handlerBuilder(config, function(err, handleable) {
      if(err) return callback(err)

      var streamHandler = handleable.toStreamHandler()
      var handler = simpleHandlerLib.streamHandlerToSimpleHandler(
        'void', 'text', streamHandler)

      var args = { }

      handler(args, function(err, cacheId) {
        if(err) return callback(err)
        
        should.equal(cacheId, cacheId1)

        touch(testFile, {}, function(err) { if(err) console.trace(err) })

        setTimeout(function() {
          handler(args, function(err, cacheId) {
            if(err) return callback(err)
          
            var fileStats2 = fs.statSync(testFile)
            var cacheId2 = fileCacheId(testFile, fileStats2)

            should.equal(cacheId, cacheId2)
          
            callback()
          })
        }, 500)

      })
    })
  })

  it('dir handleable test', function(callback) {
    var config = copyObject(componentConfig)

    var handleableBuilder = config.quiverHandleableBuilders[
      'quiver file directory handler']

    config.dirPath = testDir

    handleableBuilder(config, function(err, handleable) {
      if(err) return callback(err)
      
      should.exists(handleable.toStreamHandler)
      should.exists(handleable.toListPathHandler)
      should.exists(handleable.toCacheIdHandler)

      callback()
    })
  })

  it('file handleable test', function(callback) {
    var config = copyObject(componentConfig)

    var handleableBuilder = config.quiverHandleableBuilders[
      'quiver single file handler']

    config.filePath = testFiles[1]

    handleableBuilder(config, function(err, handleable) {
      if(err) return callback(err)
      
      should.exists(handleable.toStreamHandler)
      should.exists(handleable.toCacheIdHandler)

      callback()
    })
  })
})