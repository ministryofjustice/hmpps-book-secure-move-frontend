const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

class RemoveMoveController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setAdditionalLocals)
  }

  setAdditionalLocals(req, res, next) {
    const movesCount = req.allocation.moves.length

    res.locals.moveSummary = presenters.moveToMetaListComponent(req.allocation)
    res.locals.sidebarHeading = req.t('allocation::view.summary.heading')
    res.locals.pageText = req.t('moves::remove_from_allocation.message', {
      movesCount,
      newMovesCount: movesCount - 1,
    })

    next()
  }

  async successHandler(req, res, next) {
    const { id: moveId } = req.move
    const { id: allocationId } = req.allocation

    try {
      // TODO remove reason and comment once the backend supplies them as default
      await moveService.cancel(moveId, {
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
