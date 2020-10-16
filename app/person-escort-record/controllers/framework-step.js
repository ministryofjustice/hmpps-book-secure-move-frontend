const { isEmpty, fromPairs } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const fieldHelpers = require('../../../common/helpers/field')
const frameworksHelpers = require('../../../common/helpers/frameworks')
const permissionsControllers = require('../../../common/middleware/permissions')
const personEscortRecordService = require('../../../common/services/person-escort-record')

class FrameworkStepController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkEditable)
  }

  checkEditable(req, res, next) {
    const isEditable = req.personEscortRecord?.isEditable
    const userPermissions = req.user?.permissions
    const canEdit = permissionsControllers.check(
      'person_escort_record:update',
      userPermissions
    )

    if (!isEditable || !canEdit) {
      return res.redirect(req.baseUrl)
    }

    next()
  }

  middlewareSetup() {
    // This also needs to be called before setInitialValues otherwise
    // the nested conditional fields don't exist and won't get populated
    // TODO: Find a more efficient way to solve this ordering issue
    this.use(this.setupConditionalFields)
    super.middlewareSetup()
    this.use(this.setValidationRules)
    this.use(this.setButtonText)
  }

  setValidationRules(req, res, next) {
    const { responses } = req.personEscortRecord || {}
    const fields = Object.entries(req.form.options.fields).map(
      frameworksHelpers.setValidationRules(responses)
    )

    req.form.options.fields = fromPairs(fields)

    next()
  }

  setInitialValues(req, res, next) {
    const fields = req.form.options.fields
    const responses = req.personEscortRecord.responses
    const savedValues = responses
      .filter(response => fields[response.question?.key])
      .filter(response => !isEmpty(response.value))
      .reduce(frameworksHelpers.reduceResponsesToFormValues, {})

    if (req.form.options.fullPath !== req.journeyModel.get('lastVisited')) {
      req.sessionModel.set(savedValues)
    }

    next()
  }

  setButtonText(req, res, next) {
    const { stepType } = req.form.options
    const isInterruptionCard = stepType === 'interruption-card'
    const buttonText = isInterruptionCard
      ? 'actions::continue'
      : 'actions::save_and_continue'

    req.form.options.buttonText = buttonText

    next()
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setPageTitleLocals)
    this.use(this.setSyncStatusBanner)
  }

  setPageTitleLocals(req, res, next) {
    res.locals.frameworkSection = req.frameworkSection.name
    next()
  }

  setSyncStatusBanner(req, res, next) {
    const { nomis_sync_status: syncStatus } = req.personEscortRecord

    res.locals.syncFailures = syncStatus
      .filter(type => type.status === 'failed')
      .map(type => type.resource_type)

    next()
  }

  async saveValues(req, res, next) {
    const { form, personEscortRecord } = req
    const responses = personEscortRecord.responses
      .filter(response =>
        fieldHelpers.isAllowedDependent(
          form.options.fields,
          response?.question?.key,
          form.values
        )
      )
      .reduce(frameworksHelpers.responsesToSaveReducer(form.values), [])

    try {
      // wait for all responses to resolve first
      if (responses.length) {
        await personEscortRecordService.respond(
          personEscortRecord.id,
          responses
        )
      }

      // call parent saveValues to handle storing new values in the session
      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  successHandler(req, res, next) {
    const { route } = req?.form?.options || {}
    const goToOverview = req.body.save_and_return_to_overview
    const nextStep = this.getNextStep(req, res)
    const currentStep = route
    const isLastStep = nextStep.endsWith(currentStep)

    if (isLastStep || goToOverview) {
      return res.redirect(req.baseUrl)
    }

    super.successHandler(req, res, next)
  }

  render(req, res, next) {
    const { responses } = req.personEscortRecord || {}
    const fields = Object.entries(req.form.options.fields).map(
      frameworksHelpers.renderNomisMappingsToField(responses)
    )

    req.form.options.fields = fromPairs(fields)

    super.render(req, res, next)
  }
}

module.exports = FrameworkStepController
