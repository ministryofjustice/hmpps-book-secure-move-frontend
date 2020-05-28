const FormWizardController = require('../../../common/controllers/form-wizard')
const allocationService = require('../../../common/services/allocation')
const moveService = require('../../../common/services/move')

class UnassignController extends FormWizardController {
  middlewareChecks() {
    this.use(this.checkAllocation)
    super.middlewareChecks()
  }

  async checkAllocation(req, res, next) {
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

  async setMoveRelationships(req, res, next) {
    const { move } = res.locals

    const allocation = await allocationService.getById(move.allocation.id)
    res.locals.allocation = allocation

    res.locals.person = move.person

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

  async successHandler(req, res, next) {
    const { id: allocationId } = res.locals.allocation

    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/allocation/${allocationId}`)
  }
}

module.exports = UnassignController
