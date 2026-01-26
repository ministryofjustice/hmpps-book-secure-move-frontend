const { pick } = require('lodash')

const FormWizardController = require('../../../../common/controllers/form-wizard')
const middleware = require('../../../../common/middleware')

class CancelController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(middleware.setMoveSummary)
    this.use(this.setMoveLocal)
  }

  middlewareChecks() {
    this.use(this.checkStatus)
    this.use(this.checkAllocation)
    super.middlewareChecks()
  }

  checkStatus(req, res, next) {
    const { id, status } = req.move

    if (!['proposed', 'requested', 'booked'].includes(status)) {
      return res.redirect(`/move/${id}`)
    }

    next()
  }

  checkAllocation(req, res, next) {
    const { allocation, id: moveId } = req.move

    if (allocation) {
      return res.redirect(`/move/${moveId}`)
    }

    next()
  }

  setMoveLocal(req, res, next) {
    res.locals.move = req.move
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

      await req.services.move.cancel(moveId, {
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

module.exports = {
  CancelController,
}
