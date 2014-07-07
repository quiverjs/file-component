import 'traceur'
import { readFileSync } from 'fs'
import { join as joinPath } from 'path'
import { loadSimpleHandler } from 'quiver-component'

import { 
  fileHandler, fileStreamHandler
} from '../lib/file-component.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

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

  it('file stream handler test', () => {
    var config = { dirPath }

    return loadSimpleHandler(config, fileStreamHandler, 
      'void', 'text')
    .then(handler => {
      var args = { path: testPaths[0] }

      return handler(args).should.eventually.equal(expectedResults[0])
    })
  })
})