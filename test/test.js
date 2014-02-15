
'use strict'

var fs = require('fs')
var async = require('async')
var pathLib = require('path')
var should = require('should')
var moduleLib = require('quiver-module')
var copyObject = require('quiver-copy').copyObject
var componentLib = require('quiver-component')
var streamChannel = require('quiver-stream-channel')
var streamConvert = require('quiver-stream-convert')
var fileHandlerLib = require('../lib/file-handler')

describe('file component test', function() {
  var testContents

  var quiverComponents
  var componentConfig

  var testDir = pathLib.join(__dirname, '../test-content/')

  var testFiles = [
    '00.txt',
    '01.txt',
    'subdir/02.txt',
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

        quiverComponents = components
        componentLib.installComponents(quiverComponents, 
          function(err, config) {
            if(err) return callback(err)

            componentConfig = config
            callback()
          })
      })
  })

  it('file handler test', function(callback) {
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

  it('dir handler test', function(callback) {
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
})