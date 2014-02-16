
'use strict'

var fs = require('fs')
var touch = require('touch')
var async = require('async')
var pathLib = require('path')
var should = require('should')
var watchr = require('watchr')
var error = require('quiver-error').error
var moduleLib = require('quiver-module')
var copyObject = require('quiver-copy').copyObject
var componentLib = require('quiver-component')
var streamChannel = require('quiver-stream-channel')
var streamConvert = require('quiver-stream-convert')
var fileHandlerLib = require('../lib/file-handler')

var watchOnce = function(watchPath, callback) {
  var callbackCalled = false

  watchr.watch({
    path: watchPath,
    listener: function(changeType, filePath, fileCurrentStat, filePreviousStat) {
      if(callbackCalled) return

      callbackCalled = true
      callback()
    }
  })
}

describe('file component test', function() {
  var testContents
  var componentConfig

  var quiverComponents = [
    {
      name: 'test index file handler',
      type: 'stream handler',
      middlewares: [
        'quiver file index path filter'
      ],
      handler: 'quiver file directory stream handler'
    }
  ]

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
    moduleLib.loadComponentsFromQuiverModule(
      fileHandlerLib.quiverModule, 
      function(err, components) {
        if(err) return callback(err)

        quiverComponents = quiverComponents.concat(components)
        componentLib.installComponents(quiverComponents, 
          function(err, config) {
            if(err) return callback(err)

            componentConfig = config
            callback()
          })
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

  it('validate dir cache handler test', function(callback) {
    var testFile = testFiles[1]
    var testPath = '/01.txt'

    fs.stat(testFile, function(err, stats) {
      if(err) return callback(err)

      var etag = '' + stats.mtime.getTime()
      var config = copyObject(componentConfig)

      var handlerBuilder = config.quiverHandleableBuilders[
        'quiver dir cache validator handler']

      config.dirPath = testDir

      handlerBuilder(config, function(err, handleable) {
        if(err) return callback(err)

        var handler = handleable.toStreamHandler()
        
        var validate = function(path, etag, callback) {
          var args = {
            path: path,
            etag: etag
          }

          handler(args, streamChannel.createEmptyStreamable(), callback)
        }

        validate(testPath, etag, function(err) {
          should.not.exist(err)

          watchOnce(testFile, function() {
            validate(testPath, etag, function(err) {
              if(!err) return callback(error(500, 'cache should be invalidated'))

              callback()
            })
          })

          touch(testFile, {}, function(err) { })
        })
      })
    })
  })

  it('validate file cache handler test', function(callback) {
    var testFile = testFiles[2]

    fs.stat(testFile, function(err, stats) {
      if(err) return callback(err)

      var etag = '' + stats.mtime.getTime()
      var config = copyObject(componentConfig)

      var handlerBuilder = config.quiverHandleableBuilders[
        'quiver file cache validator handler']

      config.filePath = testFile

      handlerBuilder(config, function(err, handleable) {
        if(err) return callback(err)

        var handler = handleable.toStreamHandler()
        
        var validate = function(etag, callback) {
          var args = {
            etag: etag
          }

          handler(args, streamChannel.createEmptyStreamable(), callback)
        }

        validate(etag, function(err) {
          should.not.exist(err)

          watchOnce(testFile, function() {
            validate(etag, function(err) {
              if(!err) return callback(error(500, 'cache should be invalidated'))

              callback()
            })
          })

          touch(testFile, {}, function(err) { })
        })
      })
    })
  })
})