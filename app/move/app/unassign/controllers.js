const FormWizardController = require('../../../../common/controllers/form-wizard')
const presenters = require('../../../../common/presenters')

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

    res.render('action-prevented', {
      backLink: `/allocation/${allocation.id}`,
      pageTitle: req.t('validation::unassign_ineligible.heading'),
      message: req.t('validation::unassign_ineligible.message'),
      instruction: req.t('validation::unassign_ineligible.instructions', {
        move_href: `/move/${id}`,
        name: profile?.person?._fullname,
      }),
    })
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setMoveRelationships)
    this.use(this.setMoveSummary)
  }

  setMoveRelationships(req, res, next) {
    const { allocation, profile } = req.move
    res.locals.move = req.move
    res.locals.person = profile.person
    res.locals.allocation = allocation

    next()
  }

  setMoveSummary(req, res, next) {
    const sessionData = req.sessionModel.toJSON()
    res.locals.moveSummary = presenters.moveToMetaListComponent({
      ...req.move,
      ...sessionData,
    })
    next()
  }

  async saveValues(req, res, next) {
    try {
      const { id: moveId } = req.move

      await req.services.move.unassign(moveId)

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

module.exports = {
  UnassignController,
}
