
var fileHandler = require('../lib/index')
var fileStream = require('quiver-file-stream')
var streamConvert = require('quiver-stream-convert')
var streamChannel = require('quiver-stream-channel')
var should = require('should')
var async = require('async')
var pathUtil = require('path')
var getLastModified = require('../lib/file-cache-validator').getFileLastModified
var childProcess = require('child_process')

var testDirectory = pathUtil.join(__dirname, '../lib')
var testFileName1 = 'file-handler.js'
var testFileName2 = 'directory-handler.js'
var testFile1 = pathUtil.join(testDirectory, testFileName1)
var testFile2 = pathUtil.join(testDirectory, testFileName2)

var getFileContent = function(filePath, callback) {
  fileStream.createFileReadStream(filePath, function(err, readStream) {
    if(err) throw err

    streamConvert.streamToText(readStream, function(err, text) {
      if(err) throw err

      callback(text)    
    })
  })
}

var assertSameContent = function(originalContent, readStream, callback) {
  streamConvert.streamToText(readStream, function(err, text) {
    if(err) throw err

    text.should.equal(originalContent)
    callback()
  })
}

var assertHandlerCreatesContent = function(originalContent, handler, args, callback) {
  handler(args, streamChannel.createEmptyStreamable(),
    function(err, resultStreamable) {
      if(err) throw err

      resultStreamable.toStream(function(err, readStream) {
        if(err) throw err

        assertSameContent(originalContent, readStream, callback)
      })
    })
}

describe('file handler test', function() {
  it('should return same content as reading file directly', function(callback) {
    getFileContent(testFile1, function(originalContent) {
      fileHandler.createFileStreamHandler({
        filePath: testFile1
      }, function(err, handler) {
        if(err) throw err

        assertHandlerCreatesContent(originalContent, handler, 
          { path: 'ignored' },
          function() {
            assertHandlerCreatesContent(originalContent, handler, 
              { path: 'still the same cotent' }, callback)
          })
      })
    })
  })
})

describe('directory handler test', function() {
  it('should return different files content based on path', function(callback) {
    getFileContent(testFile1, function(content1) {
      getFileContent(testFile2, function(content2) {
        
        fileHandler.createFileDirectoryHandler({ dirPath: testDirectory }, 
          function(err, handler) {

            assertHandlerCreatesContent(content1, handler, 
              { path: '/' + testFileName1 }, function() {

                assertHandlerCreatesContent(content2, handler, 
                  { path: '/' + testFileName2 }, callback)
              })
          })
      })
    })
  })

  it('should return error 404 for non-existing files', function(callback) {
    fileHandler.createFileDirectoryHandler({ dirPath: testDirectory }, 
      function(err, handler) {
        handler({ path: '/non-existing-file' }, streamChannel.createEmptyStreamable(),
          function(err, resultStreamable) {
            should.exist(err)
            should.not.exist(resultStreamable)

            err.errorCode.should.equal(404)
            callback(null)
          })
      })
  })
})

describe('test valid path filter', function() {

  it('should reject invalid paths', function(callback) {
    var mockHandler = function() {
      throw new Error('should never called')
    }

    fileHandler.createValidPathFilter({ }, mockHandler, function(err, handler) {
      if(err) throw err

      var invalidPaths = ['./current', '../parent', '/child/../parent', '/two//slashes']
      async.each(invalidPaths, function(path, callback) {
        var args = { path: path }
        handler(args, streamChannel.createEmptyStreamable(), function(err) {
          err.errorCode.should.equal(400)
          callback(null)
        })
      }, callback)
    })
  })

  it('should accept valid paths', function(callback) {
    var mockHandler = function(args, inputStreamable, callback) {
      callback(null, streamChannel.createEmptyStreamable())
    }

    fileHandler.createValidPathFilter({ }, mockHandler, function(err, handler) {
      if(err) throw err

      var validPaths = ['/file', 'name', 'dir/', '/dir/']
      async.each(validPaths, function(path, callback) {
        var args = { path: path }
        handler(args, streamChannel.createEmptyStreamable(), function(err, resultStreamable) {
          should.not.exist(err)
          should.exist(resultStreamable)
          callback(null)
        })
      }, callback)
    })
  })

})

describe('test index path filter', function(callback) {
  it('should found index file in directory', function(callback) {
    var mockHandler = function(args, inputStreamable, callback) {
      callback(null, streamConvert.textToStreamable(args.path))
    }

    var indexNames = ['index.js']
    var config = {
      dirPath: testDirectory,
      indexNames: indexNames
    }

    fileHandler.createIndexPathFilter(config, mockHandler, function(err, handler) {
      if(err) throw err

      var args = {
        path: '/'
      }

      handler(args, streamChannel.createEmptyStreamable(), function(err, resultStreamable) {
        if(err) throw err

        streamConvert.streamableToText(resultStreamable, function(err, text) {
          if(err) throw err

          text.should.equal('/index.js')
          callback(null)
        })
      })
    })
  })

  it('should fail to find index.html', function(callback) {
    var mockHandler = function() {
      throw new Error('should never called')
    }

    var indexNames = ['index.html']
    var config = {
      dirPath: testDirectory,
      indexNames: indexNames
    }

    fileHandler.createIndexPathFilter(config, mockHandler, function(err, handler) {
      if(err) throw err

      var args = { path: '/' }

      handler(args, streamChannel.createEmptyStreamable(), function(err, resultStreamable) {
        should.not.exist(resultStreamable)
        err.errorCode.should.equal(404)
        callback(null)
      })
    })
  })
})

describe('test content type filter', function(callback) {
  it('should detect and add content type to result streamable', function(callback) {
    var mockHandler = function(args, inputStreamable, callback) {
      callback(null, streamChannel.createEmptyStreamable())
    }

    fileHandler.createContentTypeFilter({ }, mockHandler, function(err, handler) {
      if(err) throw err

      var testTypes = [
        { path: '/a/file.txt', contentType: 'text/plain' },
        { path: '/index.html', contentType: 'text/html' },
        { path: '/path/to/image.jpg', contentType: 'image/jpeg'}
      ]

      async.each(testTypes, function(testType, callback) {
        var args = { path: testType.path }

        handler(args, streamChannel.createEmptyStreamable(), function(err, resultStreamable) {
          should.not.exist(err)
          should.exist(resultStreamable.contentType)
          resultStreamable.contentType.should.equal(testType.contentType)

          callback(null)
        })
      }, callback)
    })
  })
})

var touchFile = function(filePath, callback) {
  var proc = childProcess.spawn('touch', [filePath])
  proc.on('exit', callback)
}

describe('test file cache validator', function(callback) {
  it('should report cache invalid when file changes', function(callback) {
    var testFile = pathUtil.join(__dirname, '/test-file.txt')

    touchFile(testFile, function() {
      getLastModified(testFile, function(err, lastModified) {
        if(err) throw err

        var config = { filePath: testFile }
        fileHandler.createFileCacheValidator(config, function(err, validator) {
          if(err) throw err

          var args = { lastModified: lastModified }
          validator(args, function(status) {
            status.should.equal(304)

            // modify the file after a bit of time gap
            setTimeout(function() {
              touchFile(testFile, function() {

                // check validator a bit later after it receives update
                setTimeout(function() {
                  validator(args, function(status) {
                    should.not.exist(status)

                    callback()
                  })
                }, 100)
              })
            }, 100)
          })
        })
      })
    })
  })
})
