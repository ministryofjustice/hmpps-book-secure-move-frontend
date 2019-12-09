const { get } = require('lodash')

const documentService = require('../../../../common/services/document')
const moveService = require('../../../../common/services/move')
const CreateBaseController = require('./base')
const { parseMultipartForm } = require('../../../../common/middleware/upload')

class DocumentUploadController extends CreateBaseController {
  middlewareChecks() {
    this.use(parseMultipartForm)
    super.middlewareChecks()
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.populateDocumentUpload)
  }

  async populateDocumentUpload(req, res, next) {
    const { id } = req.sessionModel.get('move') || {}
    const { document_upload: documentUpload } = req.form.options.fields

    try {
      if (id) {
        res.locals.move = await moveService.getById(id)
        documentUpload.documents = res.locals.move.documents
      }
    } catch (error) {
      return next(error)
    }

    documentUpload.xhrUrl = req.originalUrl

    next()
  }

  /**
   * Xhr implementation of delete document
   * @param req
   * @param res
   * @returns {Promise<any>}
   */
  async delete(req, res, next) {
    const { document_id: documentId } = req.query
    const { id: moveId } = res.locals.move

    if (!documentId) {
      return next(new Error('No document Id supplied'))
    }

    try {
      await documentService
        .delete(moveId, documentId)
        .then(response => res.status(200).json(response))
    } catch (error) {
      const status = get(error, 'response.status', 500)
      return res.status(status).json([
        {
          href: '#document_upload',
          text: `${req.t('fields::document_upload.label')} ${req.t(
            'validation::server_error'
          )}`,
        },
      ])
    }
  }

  processDocumentUpload(req, res) {
    const promises = []
    const { files } = req.body
    const { id: moveId } = res.locals.move

    files.forEach(file => {
      if (file.size) {
        promises.push(documentService.upload(file, moveId))
      }
    })

    return Promise.all(promises)
  }

  serverError(req, res, field) {
    return new this.Error(
      field,
      {
        type: 'server_error',
        errorGroup: field,
      },
      req,
      res
    )
  }

  async post(req, res, next) {
    const { document_id: documentId, files } = req.body
    const { id: moveId } = res.locals.move
    const isXhr = req.xhr

    if (files && isXhr) {
      try {
        const response = await this.processDocumentUpload(req, res)
        return res.status(200).json(response)
      } catch (error) {
        const status = get(error, 'response.status', 500)

        return res.status(status).json([
          {
            href: '#document_upload',
            text: `${req.t('fields::document_upload.label')} ${req.t(
              'validation::server_error'
            )}`,
          },
        ])
      }
    }

    if (files && !isXhr) {
      try {
        await this.processDocumentUpload(req, res)
      } catch (error) {
        return next({
          document_upload: this.serverError(req, res, 'document_upload'),
        })
      }
    }

    if (documentId && !isXhr) {
      try {
        await documentService.delete(moveId, documentId)
      } catch (error) {
        return next({
          document_upload: this.serverError(req, res, 'document_upload'),
        })
      }
    }

    super.post(req, res, next)
  }

  successHandler(req, res, next) {
    const { document_id: documentId, upload } = req.body

    if (upload === 'upload' || documentId) {
      return res.redirect(req.originalUrl)
    }

    super.successHandler(req, res, next)
  }
}

module.exports = DocumentUploadController
