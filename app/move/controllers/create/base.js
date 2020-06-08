const FormWizardController = require('../../../../common/controllers/form-wizard')
const presenters = require('../../../../common/presenters')

class CreateBaseController extends FormWizardController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setModels)
  }

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

  _addModelMethods(req) {
    req.getMove = () => req.models.move || {}
    req.getMoveId = () => req.getMove().id
    req.getPerson = () => req.models.person || {}
    req.getPersonId = () => req.getPerson().id
  }

  _setModels(req) {
    req.models.move = req.sessionModel.toJSON()
    req.models.person = req.sessionModel.get('person')
  }

  setModels(req, res, next) {
    req.models = req.models || {}
    this._setModels(req)
    this._addModelMethods(req)
    next()
  }

  setButtonText(req, res, next) {
    const toLocationType = req.sessionModel.get('to_location_type')
    const fromLocationType = req.sessionModel.get('from_location_type')
    const { allocation: isAllocationMove } = req.getMove()
    const nextStep = this.getNextStep(req, res)
    const steps = Object.keys(req.form.options.steps)
    const lastStep = steps[steps.length - 1]
    const isPrisonTransfer =
      toLocationType === 'prison' && fromLocationType === 'prison'
    /* eslint-disable */
    const saveButtonText = isAllocationMove
      ? 'actions::add_person'
      : isPrisonTransfer
        ? 'actions::send_for_review'
        : 'actions::request_move'
    /* eslint-enable */
    const buttonText = nextStep.includes(lastStep)
      ? saveButtonText
      : 'actions::continue'

    req.form.options.buttonText = req.form.options.buttonText || buttonText

    next()
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = res.locals.MOVES_URL
    next()
  }

  setJourneyTimer(req, res, next) {
    if (!req.sessionModel.get('journeyTimestamp')) {
      req.sessionModel.set('journeyTimestamp', new Date().getTime())
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
    const move = req.getMove()
    const moveSummary = presenters.moveToMetaListComponent({
      ...move,
      from_location: currentLocation,
    })

    res.locals.person = req.getPerson()
    res.locals.moveSummary = move.move_type ? moveSummary : {}

    next()
  }

  saveValues(req, res, next) {
    const {
      id: currentLocationId,
      location_type: locationType,
      can_upload_documents: canUploadDocuments,
    } = req.session.currentLocation

    req.form.values.from_location = currentLocationId
    req.form.values.from_location_type = locationType
    req.form.values.can_upload_documents = canUploadDocuments

    super.saveValues(req, res, next)
  }
}

module.exports = CreateBaseController
