import 'quiver-core/traceur'

import fs from 'fs'
var { readFileSync } = fs

import pathLib from 'path'
var { join: joinPath } = pathLib

import { async, promisify, timeout } from 'quiver-core/promise'
import { streamToSimpleHandler } from 'quiver-core/simple-handler'

import { 
  simpleHandlerLoader,
  router as createRouter
} from 'quiver-core/component'

import { 
  streamableToText, emptyStreamable 
} from 'quiver-core/stream-util'

import { 
  fileHandler, fileCacheHandler, 
  listDirPathHandler, 
  indexFileFilter,
  singleFileHandler,
} from '../lib/file-component'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

var touch = promisify(require('touch'))

describe('file component test', () => {
  var dirPath = process.cwd() + '/test-content'

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

  it('file handler test', async(function*() {
    var component = fileHandler()
      .setLoader(simpleHandlerLoader('void', 'text'))

    var handler = yield component.loadHandler({dirPath})

    var args = { path: testPaths[0] }

    yield handler(args).should.eventually.equal(
      expectedResults[0])
  }))

  it('file handler test all', async(function*() {
    var handler = yield fileHandler().loadHandler({dirPath})

    yield Promise.all(testPaths.map(
      (path, index) =>
        handler({path})
          .then(streamableToText)
          .should.eventually.equal(
            expectedResults[index])))
  }))

  it('file cache id test', async(function*() {
    var cacheHandler = yield fileCacheHandler()
      .loadHandler({dirPath})

    var path = testPaths[1]
    var file = testFiles[1]

    var result1 = yield cacheHandler({ path })
    should.exist(result1.cacheId)
    should.exist(result1.lastModified)

    yield touch(file, {}).then(() => timeout(100))
    var result2 = yield cacheHandler({ path })

    should.equal(result1.cacheId, result2.cacheId)

    should.not.equal(result1.lastModified, 
      result2.lastModified)
  }))

  it('list path handler test', async(function*() {
    var listPathHandler = yield listDirPathHandler()
      .loadHandler({dirPath})

    var { subpaths: files } = yield listPathHandler(
      { path: '/' })

    should.equal(files.length, 3)
    should.equal(files[0], '00.txt')
    should.equal(files[1], '01.txt')
    should.equal(files[2], 'subdir')

    var { subpaths: files } = yield listPathHandler(
      { path: 'subdir' })

    should.equal(files.length, 2)
    should.equal(files[0], '02.txt')
    should.equal(files[1], 'index.html')
  }))

  it('single file handler', async(function*() {
    var filePath = testFiles[1]
    var expected = expectedResults[1]

    var component = singleFileHandler()
      .setLoader(simpleHandlerLoader('void', 'text'))

    var handler = yield component.loadHandler({filePath})

    yield handler({path:'/random'})
      .should.eventually.equal(expected)
  }))

  it('router test', async(function*() {
    var filePath = testFiles[1]
    var expected = expectedResults[1]

    var router = createRouter()
      .staticRoute('/static-file', singleFileHandler())
      .paramRoute('/api/:restpath', fileHandler())
      .setLoader(simpleHandlerLoader('void', 'text'))

    var config = { filePath, dirPath }
    
    var handler = yield router.loadHandler(config)

    yield handler({path: '/static-file'})
      .should.eventually.equal(expected)

    yield handler({path: '/api/subdir/index.html'})
        .should.eventually.equal(expectedResults[3])
  }))

  it('index path handler test', async(function*() {
    var privateTable = { }

    var component = fileHandler(privateTable)
      .middleware(indexFileFilter(privateTable))
      .setLoader(simpleHandlerLoader('void', 'text'))

    var handler = yield component.loadHandler({dirPath})
    
    yield handler({path: '/subdir'})
      .should.eventually.equal(expectedResults[3])
  }))
})