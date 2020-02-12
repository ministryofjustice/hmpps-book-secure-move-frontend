const concat = require('concat-stream')

const documentService = require('../services/document')

function APIDocumentStorage() {}

APIDocumentStorage.prototype = {
  _handleFile: function(req, file, cb) {
    file.stream.pipe(
      concat({ encoding: 'buffer' }, data => {
        documentService
          .create(file, data)
          .then(document => cb(null, document))
          .catch(cb)
      })
    )
  },

  _removeFile: function(req, file, cb) {
    cb(null)
  },
}

module.exports = function(opts) {
  return new APIDocumentStorage(opts)
}
