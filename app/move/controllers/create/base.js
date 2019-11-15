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
    this.use(this.setCancelUrl)
    this.use(this.setMoveSummary)
    this.use(this.setJourneyTimer)
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = res.locals.MOVES_URL
    next()
  }

  setJourneyTimer(req, res, next) {
    if (!get(req, 'session.createMoveJourneyTime')) {
      set(req, 'session.createMoveJourneyTime', process.hrtime())
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
