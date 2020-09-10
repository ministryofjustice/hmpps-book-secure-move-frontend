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
    const { move } = req
    res.locals.moveSummary = presenters.moveToMetaListComponent(move)
    res.locals.person = move.profile.person || {}
    res.locals.move = move

    next()
  }

  checkAllocation(req, res, next) {
    const { allocation, id: moveId } = req.move

    if (allocation) {
      return res.redirect(`/move/${moveId}`)
    }

    next()
  }

  async successHandler(req, res, next) {
    const { id: moveId } = req.move

    try {
      const data = pick(
        req.sessionModel.toJSON(),
        Object.keys(req.form.options.allFields)
      )

      data.cancellation_reason_comment = data.cancellation_reason_other_comment

      await moveService.cancel(moveId, {
        reason: data.cancellation_reason,
        comment: data.cancellation_reason_other_comment,
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
