const { get, pick } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const moveService = require('../../../common/services/move')

class CancelController extends FormWizardController {
  async successHandler(req, res, next) {
    const moveId = get(res.locals, 'move.id')

    try {
      const data = pick(
        req.sessionModel.toJSON(),
        Object.keys(req.form.options.allFields)
      )

      await moveService.cancel(moveId, {
        reason: data.cancellation_reason,
        comment: data.cancellation_reason_comment,
      })

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/move/${moveId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CancelController
