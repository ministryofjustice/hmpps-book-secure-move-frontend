const { pick } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

class CancelController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkAllocation)
    this.use(this.setAdditionalInfo)
  }

  setAdditionalInfo(req, res, next) {
    const { move } = res.locals
    res.locals.moveSummary = presenters.moveToMetaListComponent(move)
    // TODO: update to use profile
    res.locals.person = move.person || {}

    next()
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
