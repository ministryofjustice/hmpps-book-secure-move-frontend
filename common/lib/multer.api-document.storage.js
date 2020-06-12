const concat = require('concat-stream')
const MulterError = require('multer/lib/multer-error')

const documentService = require('../services/document')

function APIDocumentStorage() {}

APIDocumentStorage.prototype = {
  _handleFile: function (req, file, cb) {
    file.stream.pipe(
      concat({ encoding: 'buffer' }, data => {
        documentService
          .create(file, data)
          .then(document => cb(null, document))
          .catch(error => {
            const code = 'API_DOCUMENT_STORAGE_FAILED'
            const multerError = new MulterError(code)
            multerError.message = multerError.message || error.message
            cb(multerError)
          })
      })
    )
  },

  _removeFile: function (req, file, cb) {
    cb(null)
  },
}

module.exports = function (opts) {
  return new APIDocumentStorage(opts)
}
