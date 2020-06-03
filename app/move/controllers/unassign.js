const FormWizardController = require('../../../common/controllers/form-wizard')
const moveService = require('../../../common/services/move')

class UnassignController extends FormWizardController {
  middlewareChecks() {
    this.use(this.checkAllocation)
    super.middlewareChecks()
  }

  checkAllocation(req, res, next) {
    const { move } = res.locals

    if (!move.allocation) {
      return res.redirect(`/move/${move.id}`)
    }

    if (!move.person) {
      return res.redirect(`/allocation/${move.allocation.id}`)
    }

    next()
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setMoveRelationships)
  }

  setMoveRelationships(req, res, next) {
    const { move } = res.locals
    res.locals.person = move.person
    res.locals.allocation = move.allocation

    next()
  }

  async saveValues(req, res, next) {
    try {
      const { id } = res.locals.move
      await moveService.unassign(id)
      super.saveValues(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  successHandler(req, res) {
    const { id: allocationId } = res.locals.move.allocation

    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/allocation/${allocationId}`)
  }
}

module.exports = UnassignController
