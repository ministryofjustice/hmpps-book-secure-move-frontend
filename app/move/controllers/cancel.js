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

      let cancellationReasonComment

      switch (data.cancellation_reason) {
        case 'cancelled_by_pmu':
          cancellationReasonComment =
            data.cancellation_reason_cancelled_by_pmu_comment
          break
        case 'other':
          cancellationReasonComment = data.cancellation_reason_other_comment
          break
      }

      await moveService.cancel(moveId, {
        reason: data.cancellation_reason,
        ...(cancellationReasonComment && {
          comment: cancellationReasonComment,
        }),
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
