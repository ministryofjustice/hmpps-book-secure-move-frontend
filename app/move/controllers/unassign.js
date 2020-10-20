const FormWizardController = require('../../../common/controllers/form-wizard')
const moveService = require('../../../common/services/move')

class UnassignController extends FormWizardController {
  middlewareChecks() {
    this.use(this.checkAllocation)
    this.use(this.checkEligibility)
    super.middlewareChecks()
  }

  checkAllocation(req, res, next) {
    const { move } = req

    if (!move.allocation) {
      return res.redirect(`/move/${move.id}`)
    }

    if (!move.profile) {
      return res.redirect(`/allocation/${move.allocation.id}`)
    }

    next()
  }

  checkEligibility(req, res, next) {
    const { allocation, id, profile, status } = req.move

    if (['requested', 'booked'].includes(status)) {
      return next()
    }

    res.render('move/views/unassign-ineligible', {
      allocation,
      moveId: id,
      fullname: profile?.person?.fullname,
    })
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setMoveRelationships)
  }

  setMoveRelationships(req, res, next) {
    const { allocation, profile } = req.move
    res.locals.move = req.move
    res.locals.person = profile.person
    res.locals.allocation = allocation

    next()
  }

  async saveValues(req, res, next) {
    try {
      const { id: moveId } = req.move

      await moveService.unassign(moveId)

      super.saveValues(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  successHandler(req, res) {
    const { id: allocationId } = req.move.allocation

    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/allocation/${allocationId}`)
  }
}

module.exports = UnassignController
