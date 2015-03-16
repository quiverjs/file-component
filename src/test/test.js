import fs from 'fs'
const { readFileSync } = fs

import pathLib from 'path'
const { join: joinPath } = pathLib

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

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const should = chai.should()

const touch = promisify(require('touch'))

describe('file component test', () => {
  const dirPath = process.cwd() + '/test-content'

  const testPaths = [
    '00.txt',
    '01.txt',
    'subdir/02.txt',
    'subdir/index.html',
  ]

  const testFiles = testPaths.map(file => 
    joinPath(dirPath, file))

  const expectedResults = testFiles.map(
    file => readFileSync(file).toString())

  it('file handler test', async(function*() {
    const component = fileHandler()
      .setLoader(simpleHandlerLoader('void', 'text'))

    const handler = yield component.loadHandler({dirPath})

    const args = { path: testPaths[0] }

    yield handler(args).should.eventually.equal(
      expectedResults[0])
  }))

  it('file handler test all', async(function*() {
    const handler = yield fileHandler().loadHandler({dirPath})

    yield Promise.all(testPaths.map(
      (path, index) =>
        handler({path})
          .then(streamableToText)
          .should.eventually.equal(
            expectedResults[index])))
  }))

  it('file cache id test', async(function*() {
    const cacheHandler = yield fileCacheHandler()
      .loadHandler({dirPath})

    const path = testPaths[1]
    const file = testFiles[1]

    const result1 = yield cacheHandler({ path })
    should.exist(result1.cacheId)
    should.exist(result1.lastModified)

    yield touch(file, {}).then(() => timeout(100))
    const result2 = yield cacheHandler({ path })

    should.equal(result1.cacheId, result2.cacheId)

    should.not.equal(result1.lastModified, 
      result2.lastModified)
  }))

  it('list path handler test', async(function*() {
    const listPathHandler = yield listDirPathHandler()
      .loadHandler({dirPath})

    let { subpaths: files } = yield listPathHandler(
      { path: '/' })

    should.equal(files.length, 3)
    should.equal(files[0], '00.txt')
    should.equal(files[1], '01.txt')
    should.equal(files[2], 'subdir')

    ;({ subpaths: files }) = yield listPathHandler(
      { path: 'subdir' })

    should.equal(files.length, 2)
    should.equal(files[0], '02.txt')
    should.equal(files[1], 'index.html')
  }))

  it('single file handler', async(function*() {
    const filePath = testFiles[1]
    const expected = expectedResults[1]

    const component = singleFileHandler()
      .setLoader(simpleHandlerLoader('void', 'text'))

    const handler = yield component.loadHandler({filePath})

    yield handler({path:'/random'})
      .should.eventually.equal(expected)
  }))

  it('router test', async(function*() {
    const filePath = testFiles[1]
    const expected = expectedResults[1]

    const router = createRouter()
      .staticRoute('/static-file', singleFileHandler())
      .paramRoute('/api/:restpath', fileHandler())
      .setLoader(simpleHandlerLoader('void', 'text'))

    const config = { filePath, dirPath }
    
    const handler = yield router.loadHandler(config)

    yield handler({path: '/static-file'})
      .should.eventually.equal(expected)

    yield handler({path: '/api/subdir/index.html'})
        .should.eventually.equal(expectedResults[3])
  }))

  it('index path handler test', async(function*() {
    const privateTable = { }

    const component = fileHandler(privateTable)
      .middleware(indexFileFilter(privateTable))
      .setLoader(simpleHandlerLoader('void', 'text'))

    const handler = yield component.loadHandler({dirPath})
    
    yield handler({path: '/subdir'})
      .should.eventually.equal(expectedResults[3])
  }))
})