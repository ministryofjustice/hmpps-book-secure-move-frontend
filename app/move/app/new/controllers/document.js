const { reject } = require('lodash')
const multer = require('multer')

const APIDocumentStorage = require('../../../../../common/lib/multer.api-document.storage')
const { FILE_UPLOADS } = require('../../../../../config')

const CreateBaseController = require('./base')

const upload = multer({
  storage: APIDocumentStorage(),
  limits: {
    fileSize: FILE_UPLOADS.MAX_FILE_SIZE,
  },
})

class DocumentUploadController extends CreateBaseController {
  configure(req, res, next) {
    req.form.options.fields.documents.xhrUrl = req.originalUrl
    super.configure(req, res, next)
  }

  middlewareSetup() {
    this.use(upload.array('documents'))
    super.middlewareSetup()
    // must be called after multer to correctly parse the form body
    this.use(this.setNextStep)
  }

  setNextStep(req, res, next) {
    if (req.body.upload || req.body.delete) {
      req.form.options.next = req.originalUrl
    }

    next()
  }

  saveValues(req, res, next) {
    const { delete: deletedId } = req.body
    const sessionDocuments = req.sessionModel.get('documents') || []
    const uploadedDocuments = req.files || []

    req.form.values.documents = reject(
      [...sessionDocuments, ...uploadedDocuments],
      {
        id: deletedId,
      }
    )

    super.saveValues(req, res, next)
  }

  errorHandler(err, req, res, next) {
    const isXhr = req.xhr
    let uploadError

    if (err instanceof multer.MulterError) {
      const key = err.field

      uploadError = {
        [key]: new this.Error(key, { type: err.code }, req, res),
      }

      if (isXhr) {
        return res.status(500).send(req.t(`validation::${err.code}`))
      }
    }

    super.errorHandler(uploadError || err, req, res, next)
  }

  successHandler(req, res, next) {
    const isXhr = req.xhr

    if (isXhr) {
      const response =
        req.files && req.files.length === 1 ? req.files[0] : req.files

      return res.status(200).json(response || [])
    }

    super.successHandler(req, res, next)
  }
}

module.exports = DocumentUploadController
