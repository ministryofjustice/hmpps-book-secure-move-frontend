const multer = require('multer')
const { reject } = require('lodash')

const CreateBaseController = require('./base')
const documentService = require('../../../../common/services/document')
const { FILE_UPLOADS, FEATURE_FLAGS } = require('../../../../config')

const upload = multer({
  dest: FILE_UPLOADS.UPLOAD_DIR,
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
    super.middlewareSetup()
    this.use(upload.array('documents'))
    // must be called after multer to correctly parse the form body
    this.use(this.setNextStep)
  }

  middlewareChecks() {
    this.use(this.isEnabled(FEATURE_FLAGS.DOCUMENTS))
    super.middlewareChecks()
  }

  setNextStep(req, res, next) {
    if (req.body.upload || req.body.delete) {
      req.form.options.next = req.originalUrl
    }
    next()
  }

  isEnabled(enabled) {
    return (req, res, next) => {
      if (!enabled) {
        req.form.options.skip = true
      }

      next()
    }
  }

  async saveValues(req, res, next) {
    const sessionDocuments = req.sessionModel.get('documents') || []
    const { delete: deletedId } = req.body
    let documents = []

    try {
      if (req.files) {
        const uploaded = await Promise.all(
          req.files.map(file => documentService.create(file))
        )
        documents = [...sessionDocuments, ...uploaded]
      }

      if (deletedId) {
        await documentService.destroy(deletedId)
        documents = reject(sessionDocuments, { id: deletedId })
      }

      req.form.values.documents = documents

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
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
        return res.status(500).json([
          {
            href: `#${key}`,
            text: `${req.t('fields::documents.label')} ${req.t(
              `validation::${err.code}`
            )}`,
          },
        ])
      }
    }

    super.errorHandler(uploadError || err, req, res, next)
  }

  successHandler(req, res, next) {
    const isXhr = req.xhr

    if (isXhr) {
      const documents = req.sessionModel.get('documents') || []
      return res.status(200).json(documents)
    }

    super.successHandler(req, res, next)
  }
}

module.exports = DocumentUploadController
