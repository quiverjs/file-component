import 'traceur'
import { readFileSync } from 'fs'
import { join as joinPath } from 'path'
import { promisify, timeout } from 'quiver-promise'
import { streamToSimpleHandler } from 'quiver-simple-handler'

import { 
  loadSimpleHandler, ExtendedHandler, Router
} from 'quiver-component'

import { 
  streamableToText, emptyStreamable 
} from 'quiver-stream-util'

import { 
  fileHandler, fileStreamHandler,
  singleFileHandler
} from '../lib/file-component.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

var touch = promisify(require('touch'))

describe('file component test', () => {
  var dirPath = './test-content/'

  var testPaths = [
    '00.txt',
    '01.txt',
    'subdir/02.txt',
    'subdir/index.html',
  ]

  var testFiles = testPaths.map(file => 
    joinPath(dirPath, file))

  var expectedResults = testFiles.map(
    file => readFileSync(file).toString())

  it('file stream handler test', () =>
    loadSimpleHandler({dirPath}, fileStreamHandler, 
      'void', 'text')
    .then(handler => {
      var args = { path: testPaths[0] }

      return handler(args).should.eventually.equal(
        expectedResults[0])
    }))

  it('file handleable test', () => 
    fileHandler.loadHandler({dirPath})
    .then(handler => 
      Promise.all(testPaths.map((path, index) =>
        handler({path}).then(streamableToText)
        .should.eventually.equal(
          expectedResults[index])))))

  it('file cache id test', () =>
    fileHandler.loadHandleable({dirPath})
    .then(handleable => {
      var cacheHandler = handleable.meta.cacheHandler
      should.exist(cacheHandler)

      var path = testPaths[1]
      var file = testFiles[1]

      cacheHandler = streamToSimpleHandler(
        cacheHandler, 'void', 'json')

      return cacheHandler({ path })
      .then(result1 => {
        should.exist(result1.cacheId)
        should.exist(result1.lastModified)

        return touch(file, {}).then(() => timeout(100))
        .then(() => 
          cacheHandler({ path })
          .then(result2 => {
            should.equal(result1.cacheId, result2.cacheId)

            should.not.equal(result1.lastModified, 
              result2.lastModified)
          }))
      })
    }))

  it('list path handler test', () =>
    fileHandler.loadHandleable({dirPath}).then(handleable => {
      var listPathHandler = handleable.meta.listPathHandler
      should.exist(listPathHandler)

      listPathHandler = streamToSimpleHandler(
        listPathHandler, 'void', 'json')

      var p1 = listPathHandler({ path: '/' })
      .then(result => {
        var files = result.subpaths

        should.equal(files.length, 3)
        should.equal(files[0], '00.txt')
        should.equal(files[1], '01.txt')
        should.equal(files[2], 'subdir')
      })

      var p2 = listPathHandler({ path: 'subdir' })
      .then(result => {
        var files = result.subpaths

        should.equal(files.length, 2)
        should.equal(files[0], '02.txt')
        should.equal(files[1], 'index.html')
      })

      return Promise.all([p1, p2])
    }))

  it('single file handler', () => {
    var filePath = testFiles[1]
    var expected = expectedResults[1]

    return loadSimpleHandler({filePath}, singleFileHandler, 
      'void', 'text').then(handler =>
      handler({path:'/random'}).should.eventually.equal(expected))
  })

  it('router test', () => {
    var filePath = testFiles[1]
    var expected = expectedResults[1]

    var router = new Router()
      .addStaticRoute(singleFileHandler, '/static-file')
      .addParamRoute(fileHandler, '/api/:restpath')

    var config = { filePath, dirPath }
    
    return loadSimpleHandler(config, router, 'void', 'text')
    .then(handler => {
      var p1 = handler({path: '/static-file'})
        .should.eventually.equal(expected)

      var p2 = handler({path: '/api/subdir/index.html'})
        .should.eventually.equal(expectedResults[3])

      return Promise.all([p1, p2])
    })
  })
})