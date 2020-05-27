const { pick } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const moveService = require('../../../common/services/move')

class CancelController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkAllocation)
  }

  checkAllocation(req, res, next) {
    const { allocation, id } = res.locals.move

    if (allocation) {
      return res.redirect(`/move/${id}`)
    }

    next()
  }

  async successHandler(req, res, next) {
    const { id: moveId } = res.locals.move

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
