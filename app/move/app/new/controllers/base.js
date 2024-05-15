const Sentry = require('@sentry/node')
const { forEach, omitBy, pickBy } = require('lodash')

const FormWizardController = require('../../../../../common/controllers/form-wizard')
const middleware = require('../../../../../common/middleware')
const { FEATURE_FLAGS } = require('../../../../../config')
const filters = require('../../../../../config/nunjucks/filters')

class CreateBaseController extends FormWizardController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setModels)
    this.use(this.setProfile)
  }

  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkCurrentLocation)
    this.use(this.checkMoveSupported)
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setButtonText)
    this.use(this.setCancelUrl)
    this.use(middleware.setMoveSummaryWithSessionData)
    this.use(this.setJourneyTimer)
  }

  _addModelMethods(req) {
    req.getMove = () => req.models.move || {}
    req.getMoveId = () => req.getMove().id
    req.getProfile = () => req.models.profile || {}
    req.getProfileId = () => req.getProfile().id
    req.getPerson = () => req.models.person || {}
    req.getPersonId = () => req.getPerson().id
  }

  _setModels(req) {
    req.models.move = req.sessionModel.toJSON()
    req.models.profile = req.sessionModel.get('profile')
    req.models.person = req.sessionModel.get('person')
  }

  setModels(req, res, next) {
    req.models = req.models || {}
    this._setModels(req)
    this._addModelMethods(req)
    next()
  }

  async setProfile(req, res, next) {
    const person = req.sessionModel.get('person') || {}

    if (!person.id) {
      return next()
    }

    const profile = req.sessionModel.get('profile') || {}

    if (profile.person?.id === person.id) {
      return next()
    }

    try {
      const result = await req.services.profile.create(person.id, {})
      req.sessionModel.set('profile', result)

      next()
    } catch (error) {
      next(error)
    }
  }

  async checkMoveSupported(req, res, next) {
    const person = req.getPerson()

    if (!person?.prison_number) {
      return next()
    }

    const category = await req.services.person.getCategory(person.id)

    if (!category || category.move_supported) {
      return next()
    }

    return res.render('action-prevented', {
      pageTitle: req.t('validation::move_not_supported.heading', {
        name: person._fullname,
      }),
      message: req.t('validation::move_not_supported.message', {
        category: category.key,
      }),
    })
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

    if (req.session.currentLocation.disabled_at) {
      const error = new Error('Current location is disabled')
      error.code = 'DISABLED_LOCATION'
      return next(error)
    }

    next()
  }

  saveValues(req, res, next) {
    const {
      id: currentLocationId,
      location_type: locationType,
      can_upload_documents: canUploadDocuments,
      young_offender_institution: isYoungOffenderInstitution,
    } = req.session.currentLocation || {}

    req.form.values.from_location = currentLocationId
    req.form.values.from_location_type = locationType
    req.form.values.can_upload_documents = canUploadDocuments
    req.form.values.is_young_offender_institution = isYoungOffenderInstitution

    super.saveValues(req, res, next)
  }

  shouldAskYouthSentenceStep(req) {
    const fromLocationType = req.sessionModel.get('from_location_type')
    const isYoungOffenderInstitution = req.sessionModel.get(
      'is_young_offender_institution'
    )
    const { date_of_birth: dateOfBirth } = req.sessionModel.get('person') || {}
    const age = filters.calculateAge(dateOfBirth)

    if (
      fromLocationType === 'prison' &&
      isYoungOffenderInstitution &&
      age >= 18 &&
      age <= 19
    ) {
      return true
    }

    return false
  }

  shouldAskRecallInfoStep(req) {
    return (
      FEATURE_FLAGS.DATE_OF_ARREST &&
      req.sessionModel.attributes.move_type === 'prison_recall' &&
      req.user.permissions?.includes('move:add:date_of_arrest')
    )
  }

  requiresYouthAssessment(req) {
    const {
      person = {},
      from_location_type: fromLocationType,
      is_young_offender_institution: isYoungOffenderInstitution,
      serving_youth_sentence: servingYouthSentence,
    } = req.sessionModel.toJSON()
    const age = filters.calculateAge(person.date_of_birth)

    if (
      ['secure_training_centre', 'secure_childrens_home'].includes(
        fromLocationType
      )
    ) {
      return true
    }

    if (
      fromLocationType === 'prison' &&
      isYoungOffenderInstitution &&
      age < 18
    ) {
      return true
    }

    if (servingYouthSentence === 'yes') {
      return true
    }

    return false
  }

  // TODO: Temporary data collection to understand impact of
  // adding PNC number validation
  validateFields(req, res, callback) {
    super.validateFields(req, res, errors => {
      const PNCPredicate = error =>
        error.type === 'policeNationalComputerNumber'

      const extraditionPredicate = error =>
        error.key === 'extradition_flight_date' && error.type === 'equal'

      const ignorePredicate = error =>
        extraditionPredicate(error) || PNCPredicate(error)

      forEach(pickBy(errors, PNCPredicate), (error, key) => {
        Sentry.captureException(new Error('PNC validation failed'), {
          level: 'warning',
          tags: {
            'validation_error.key': key,
            'validation_error.path': error.url,
            'validation_error.type': error.type,
          },
          contexts: {
            'Form wizard error': {
              ...error,
              // `type` is reserved in Sentry so we need to set an
              // alternative property
              validationType: error.type,
            },
          },
        })
      })
      callback(omitBy(errors, ignorePredicate))
    })
  }
}

module.exports = CreateBaseController
