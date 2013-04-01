
var fileHandler = require('./file-handler')
var directoryHandler = require('./directory-handler')
var indexPathFilter = require('./index-path-filter')
var contentTypeFilter = require('./content-type-filter')
var validPathFilter = require('./valid-path-filter')

module.exports = {
  createFileStreamHandler: fileHandler.createFileStreamHandler,
  createFileDirectoryHandler: directoryHandler.createFileDirectoryHandler,
  createIndexPathFilter: indexPathFilter.createIndexPathFilter,
  createContentTypeFilter: contentTypeFilter.createContentTypeFilter,
  createValidPathFilter: validPathFilter.createValidPathFilter
}