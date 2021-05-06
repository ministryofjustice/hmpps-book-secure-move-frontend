const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')

class RemoveMoveController extends FormWizardController {
  middlewareChecks() {
    this.use(this.checkStatus)
    super.middlewareChecks()
  }

  checkStatus(req, res, next) {
    const { status: moveStatus } = req.move
    const { id: allocationId, status: allocationStatus } = req.allocation

    if (
      !['proposed', 'requested', 'booked'].includes(moveStatus) ||
      ['cancelled'].includes(allocationStatus)
    ) {
      return res.redirect(`/allocation/${allocationId}`)
    }

    next()
  }

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

  async successHandler(req, res, next) {
    const { id: moveId } = req.move
    const { id: allocationId } = req.allocation

    try {
      // TODO remove reason and comment once the backend supplies them as default
      await req.services.move.cancel(moveId, {
        reason: 'other',
        comment: 'Cancelled by PMU',
      })

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/allocation/${allocationId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RemoveMoveController
