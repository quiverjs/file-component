import fs from 'fs'
let { readFileSync } = fs

import pathLib from 'path'
let { join: joinPath } = pathLib

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

let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
let should = chai.should()

let touch = promisify(require('touch'))

describe('file component test', () => {
  let dirPath = process.cwd() + '/test-content'

  let testPaths = [
    '00.txt',
    '01.txt',
    'subdir/02.txt',
    'subdir/index.html',
  ]

  let testFiles = testPaths.map(file => 
    joinPath(dirPath, file))

  let expectedResults = testFiles.map(
    file => readFileSync(file).toString())

  it('file handler test', async(function*() {
    let component = fileHandler()
      .setLoader(simpleHandlerLoader('void', 'text'))

    let handler = yield component.loadHandler({dirPath})

    let args = { path: testPaths[0] }

    yield handler(args).should.eventually.equal(
      expectedResults[0])
  }))

  it('file handler test all', async(function*() {
    let handler = yield fileHandler().loadHandler({dirPath})

    yield Promise.all(testPaths.map(
      (path, index) =>
        handler({path})
          .then(streamableToText)
          .should.eventually.equal(
            expectedResults[index])))
  }))

  it('file cache id test', async(function*() {
    let cacheHandler = yield fileCacheHandler()
      .loadHandler({dirPath})

    let path = testPaths[1]
    let file = testFiles[1]

    let result1 = yield cacheHandler({ path })
    should.exist(result1.cacheId)
    should.exist(result1.lastModified)

    yield touch(file, {}).then(() => timeout(100))
    let result2 = yield cacheHandler({ path })

    should.equal(result1.cacheId, result2.cacheId)

    should.not.equal(result1.lastModified, 
      result2.lastModified)
  }))

  it('list path handler test', async(function*() {
    let listPathHandler = yield listDirPathHandler()
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
    let filePath = testFiles[1]
    let expected = expectedResults[1]

    let component = singleFileHandler()
      .setLoader(simpleHandlerLoader('void', 'text'))

    let handler = yield component.loadHandler({filePath})

    yield handler({path:'/random'})
      .should.eventually.equal(expected)
  }))

  it('router test', async(function*() {
    let filePath = testFiles[1]
    let expected = expectedResults[1]

    let router = createRouter()
      .staticRoute('/static-file', singleFileHandler())
      .paramRoute('/api/:restpath', fileHandler())
      .setLoader(simpleHandlerLoader('void', 'text'))

    let config = { filePath, dirPath }
    
    let handler = yield router.loadHandler(config)

    yield handler({path: '/static-file'})
      .should.eventually.equal(expected)

    yield handler({path: '/api/subdir/index.html'})
        .should.eventually.equal(expectedResults[3])
  }))

  it('index path handler test', async(function*() {
    let privateTable = { }

    let component = fileHandler(privateTable)
      .middleware(indexFileFilter(privateTable))
      .setLoader(simpleHandlerLoader('void', 'text'))

    let handler = yield component.loadHandler({dirPath})
    
    yield handler({path: '/subdir'})
      .should.eventually.equal(expectedResults[3])
  }))
})