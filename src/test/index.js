import test from 'tape'
import touchAsync from 'touch'
import { readFileSync } from 'fs'
import { join as joinPath } from 'path'
import { asyncTest, rejected } from 'quiver-core/util/tape'
import { promisify, timeout } from 'quiver-core/util/promise'
import { streamRouter } from 'quiver-core/component/constructor'
import {
  createConfig as Config, createArgs as Args,
  loadHandler, simpleHandlerLoader
} from 'quiver-core/component/util'

import {
  fileBundle,
  fileHandler,
  fileCacheHandler,
  listDirPathHandler,
  singleFileHandler,
} from '../lib/constructor'

const touch = promisify(touchAsync)

test('file component test', assert => {
  const dirPath = process.cwd() + '/test-content'

  const testPaths = [
    '/00.txt',
    '/01.txt',
    '/subdir/02.txt',
    '/subdir/index.html',
  ]

  const testFiles = testPaths.map(file =>
    joinPath(dirPath, file))

  const expectedResults = testFiles.map(
    file => readFileSync(file).toString())

  assert::asyncTest('file handler test', async assert => {
    const component = fileHandler()
      .setLoader(simpleHandlerLoader('empty', 'text'))

    const config = Config({ dirPath })
    const handler = await loadHandler(config, component)

    const args = Args({ path: testPaths[0] })

    const result = await handler(args)
    assert.equal(result, expectedResults[0])

    assert.end()
  })

  assert::asyncTest('file handler test all', async assert => {
    const component = fileHandler()
      .setLoader(simpleHandlerLoader('empty', 'text'))

    const config = Config({ dirPath })

    const handler = await loadHandler(config, component)

    for(let [i, path] of testPaths.entries()) {
      const args = Args({ path })
      const result = await handler(args)
      assert.equal(result, expectedResults[i])
    }

    assert.end()
  })

  assert::asyncTest('file cache id test', async assert => {
    const component = fileCacheHandler()
    const config = Config({ dirPath })
    const cacheHandler = await loadHandler(config, component)

    const path = testPaths[1]
    const file = testFiles[1]

    const args = Args({ path })
    const result1 = await cacheHandler(args)

    assert.ok(result1.cacheId)
    assert.ok(result1.lastModified)

    await touch(file, {}).then(() => timeout(100))

    const result2 = await cacheHandler(args)

    assert.equal(result1.cacheId, result2.cacheId)

    assert.notEqual(result1.lastModified,
      result2.lastModified)

    assert.end()
  })

  assert::asyncTest('list path handler test', async assert => {
    const component = listDirPathHandler()
    const config = Config({ dirPath })
    const listPathHandler = await loadHandler(config, component)

    const args1 = Args({ path: '/' })
    const { subpaths: files1 } = await listPathHandler(args1)

    assert.deepEqual(files1, ['00.txt', '01.txt', 'subdir'])

    const args2 = Args({ path: '/subdir' })
    const { subpaths: files2 } = await listPathHandler(args2)

    assert.deepEqual(files2, ['02.txt', 'index.html'])

    assert.end()
  })

  assert::asyncTest('single file handler', async assert => {
    const filePath = testFiles[1]
    const expected = expectedResults[1]

    const component = singleFileHandler()
      .setLoader(simpleHandlerLoader('void', 'text'))

    const config = Config({ filePath })
    const handler = await loadHandler(config, component)

    const args = Args({ path: '/random' })
    const result = await handler(args)
    assert.equal(result, expected)

    assert.end()
  })

  assert::asyncTest('router test', async assert => {
    const filePath = testFiles[1]
    const expected = expectedResults[1]

    const router = streamRouter()
      .addStaticRoute('/static-file', singleFileHandler())
      .addParamRoute('/api/:restpath', fileHandler())
      .setLoader(simpleHandlerLoader('empty', 'text'))

    const config = Config({ filePath, dirPath })
    const handler = await loadHandler(config, router)

    const args1 = Args({ path: '/static-file' })
    const res1 = await handler(args1)
    assert.equal(res1, expected)

    const args2 = Args({ path: '/api/subdir/index.html' })
    const res2 = await handler(args2)
    assert.equal(res2, expectedResults[3])

    assert.end()
  })

  assert::asyncTest('index path handler test', async assert => {
    const bundle = fileBundle()

    const fileHandler = bundle.getComponent('fileHandler')
    const indexFileFilter = bundle.getComponent('indexFileFilter')

    const component = fileHandler
      .addMiddleware(indexFileFilter)
      .setLoader(simpleHandlerLoader('void', 'text'))

    const config = Config({ dirPath })
    const handler = await loadHandler(config, component)

    const args = Args({ path: '/subdir' })
    const result = await handler(args)
    assert.equal(result, expectedResults[3])

    assert.end()
  })

  assert::asyncTest('relative path test', async assert => {
    const component = fileHandler()
      .setLoader(simpleHandlerLoader('empty', 'text'))

    const config = Config({ dirPath })
    const handler = await loadHandler(config, component)

    const args = Args({ path: '../index.js' })

    await assert::rejected(handler(args))

    assert.end()
  })

  assert.end()
})

test('teardown', assert => {
  assert.end()
  process.exit()
})
