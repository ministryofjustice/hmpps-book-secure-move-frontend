const { omit } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')

class CancelController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setAdditionalLocals)
  }

  setAdditionalLocals(req, res, next) {
    const { allocation } = req

    res.locals.allocation = allocation
    res.locals.summary = presenters.allocationToMetaListComponent(allocation)

    next()
  }

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
