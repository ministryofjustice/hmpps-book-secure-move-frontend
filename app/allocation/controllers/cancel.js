const { omit } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')

class CancelController extends FormWizardController {
  middlewareChecks() {
    this.use(this.checkStatus)
    super.middlewareChecks()
  }

  checkStatus(req, res, next) {
    const { id, status } = req.allocation

    if (['cancelled'].includes(status)) {
      return res.redirect(`/allocation/${id}`)
    }

    next()
  }

  async successHandler(req, res, next) {
    const { id } = req.allocation
    const data = omit(req.sessionModel.toJSON(), [
      'csrf-secret',
      'errors',
      'errorValues',
    ])

    data.cancellation_reason_comment = data.cancellation_reason_other_comment

    try {
      await req.services.allocation.cancel(id, {
        reason: data.cancellation_reason,
        comment: data.cancellation_reason_comment,
      })

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/allocation/${id}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CancelController
