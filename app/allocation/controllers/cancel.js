const { omit } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const allocationService = require('../../../common/services/allocation')

class CancelController extends FormWizardController {
  async successHandler(req, res, next) {
    const { id } = req.allocation
    const data = omit(req.sessionModel.toJSON(), [
      'csrf-secret',
      'errors',
      'errorValues',
    ])

    data.cancellation_reason_comment = data.cancellation_reason_other_comment

    try {
      await allocationService.cancel(id, {
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
