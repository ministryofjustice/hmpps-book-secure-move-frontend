const { reject } = require('lodash')

const moveService = require('../../../../common/services/move')
const Documents = require('../create/document')

const UpdateBase = require('./base')

class UpdateDocumentsController extends UpdateBase {
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
      try {
        await moveService.update({
          id: req.getMoveId(),
          documents: req.form.values.documents,
        })
        next()
      } catch (err) {
        next(err)
      }
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

    // TODO: what should actually happen

    super.successHandler(req, res, next)
  }
}

UpdateBase.mixin(UpdateDocumentsController, Documents)

module.exports = UpdateDocumentsController
