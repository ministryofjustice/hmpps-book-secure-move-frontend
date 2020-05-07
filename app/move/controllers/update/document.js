const { get, reject } = require('lodash')

const moveService = require('../../../../common/services/move')
const DocumentUploadController = require('../create/document')

const UpdateBase = require('./base')

class UpdateDocumentUploadController extends UpdateBase {
  configure(req, res, next) {
    const canUploadDocuments = get(
      req,
      'session.currentLocation.can_upload_documents'
    )
    if (!canUploadDocuments) {
      const error = new Error(
        "Forbidden. Document upload not allowed for this move}'"
      )
      error.statusCode = 403
      return next(error)
    }
    DocumentUploadController.prototype.configure.apply(this, [req, res, next])
  }

  getUpdateValues(req, res) {
    const move = req.getMove()
    if (!move) {
      return {}
    }
    const values = {}
    if (req.initialStep) {
      req.sessionModel.set('documents', move.documents)
    }
    values.documents = req.sessionModel.get('documents')
    return values
  }

  async saveDocumentRelationships(req, res, next) {
    try {
      await moveService.update({
        id: req.getMoveId(),
        documents: req.form.values.documents,
        // TODO: remove this - it's just to force the addition of any attributes
        // currently the api 500s if not attribute present
        move_type: req.getMove().move_type,
      })
      next()
    } catch (err) {
      next(err)
    }
  }

  async saveValues(req, res, next) {
    const { delete: deletedId } = req.body
    const sessionDocuments = req.sessionModel.get('documents') || []
    const uploadedDocuments = req.files || []
    req.form.values.documents = reject(
      [...sessionDocuments, ...uploadedDocuments],
      {
        id: deletedId,
      }
    )

    const isXhr = req.xhr
    if (!isXhr) {
      this.saveDocumentRelationships(req, res, next)
    } else {
      super.saveValues(req, res, next)
    }
  }

  successHandler(req, res, next) {
    const isXhr = req.xhr
    if (isXhr) {
      const response =
        req.files && req.files.length === 1 ? req.files[0] : req.files
      return res.status(200).json(response || [])
    }

    res.redirect(this.getBaseUrl(req))
  }
}

UpdateBase.mixin(UpdateDocumentUploadController, DocumentUploadController)

module.exports = UpdateDocumentUploadController
