import 'traceur'

import fs from 'fs'
var { readFileSync } = fs

import pathLib from 'path'
var { join: joinPath } = pathLib

import { promisify, timeout } from 'quiver-promise'
import { streamToSimpleHandler } from 'quiver-simple-handler'

import { 
  loadSimpleHandler,
  router as createRouter
} from 'quiver-component'

import { 
  streamableToText, emptyStreamable 
} from 'quiver-stream-util'

import { 
  makeFileHandler, makeFileCacheHandler, 
  makeListDirPathHandler, makeFileBundle,
  makeIndexFileFilter,
  makeSingleFileHandler,
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

  it('file handler test', () =>
    loadSimpleHandler({dirPath}, makeFileHandler(), 
      'void', 'text')
    .then(handler => {
      var args = { path: testPaths[0] }

      return handler(args).should.eventually.equal(
        expectedResults[0])
    }))

  it('file handler test all', () => 
    makeFileHandler().loadHandler({dirPath})
    .then(handler => 
      Promise.all(testPaths.map((path, index) =>
        handler({path}).then(streamableToText)
        .should.eventually.equal(
          expectedResults[index])))))

  it('file cache id test', () =>
    makeFileCacheHandler().loadHandler({dirPath})
    .then(cacheHandler => {
      var path = testPaths[1]
      var file = testFiles[1]

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
    makeListDirPathHandler().loadHandler({dirPath})
    .then(listPathHandler => {
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

    return loadSimpleHandler({filePath}, makeSingleFileHandler(), 
      'void', 'text').then(handler =>
      handler({path:'/random'}).should.eventually.equal(expected))
  })

  it('router test', () => {
    var filePath = testFiles[1]
    var expected = expectedResults[1]

    var singleFileHandler = makeSingleFileHandler()
    var fileHandler = makeFileHandler()

    var router = createRouter()
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

  it('index path handler test', () => {
    var privateTable = { }

    var component = makeFileHandler(privateTable)
      .addMiddleware(makeIndexFileFilter(privateTable))

    return loadSimpleHandler({dirPath}, component, 'void', 'text')
    .then(handler => 
      handler({path: '/subdir'}).should.eventually.equal(
        expectedResults[3]))
  })
})