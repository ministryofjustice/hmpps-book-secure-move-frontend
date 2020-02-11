const { get, set } = require('lodash')
const FormWizardController = require('../../../../common/controllers/form-wizard')
const presenters = require('../../../../common/presenters')

class CreateBaseController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkCurrentLocation)
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setButtonText)
    this.use(this.setCancelUrl)
    this.use(this.setMoveSummary)
    this.use(this.setJourneyTimer)
  }

  setButtonText(req, res, next) {
    const nextStep = this.getNextStep(req, res)
    const steps = Object.keys(req.form.options.steps)
    const lastStep = steps[steps.length - 1]
    const buttonText = nextStep.includes(lastStep)
      ? 'actions::schedule_move'
      : 'actions::continue'

    req.form.options.buttonText = req.form.options.buttonText || buttonText

    next()
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = res.locals.MOVES_URL
    next()
  }

  setJourneyTimer(req, res, next) {
    if (!get(req, 'session.createMoveJourneyTimestamp')) {
      set(req, 'session.createMoveJourneyTimestamp', new Date().getTime())
    }

    next()
  }

  checkCurrentLocation(req, res, next) {
    if (!req.session.currentLocation) {
      const error = new Error('Current location is not set in session')
      error.code = 'MISSING_LOCATION'
      return next(error)
    }

    next()
  }

  setMoveSummary(req, res, next) {
    const currentLocation = req.session.currentLocation
    const sessionModel = req.sessionModel.toJSON()
    const moveSummary = presenters.moveToMetaListComponent({
      ...sessionModel,
      from_location: currentLocation,
    })

    res.locals.person = sessionModel.person
    res.locals.moveSummary = sessionModel.move_type ? moveSummary : {}

    next()
  }
}

module.exports = CreateBaseController
