const { isEmpty, fromPairs, snakeCase } = require('lodash')

const fieldHelpers = require('../../helpers/field')
const frameworksHelpers = require('../../helpers/frameworks')
const setMoveSummary = require('../../middleware/set-move-summary')
const FormWizardController = require('../form-wizard')

class FrameworkStepController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkEditable)
  }

  checkEditable(req, res, next) {
    const { editable, framework } = req.assessment

    if (!editable || !req.canAccess(`${snakeCase(framework.name)}:update`)) {
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
    this.use(this.setHasNextSteps)
    this.use(this.setButtonText)
  }

  setValidationRules(req, res, next) {
    const { responses } = req.assessment || {}
    const fields = Object.entries(req.form.options.fields).map(
      frameworksHelpers.setValidationRules(responses)
    )

    req.form.options.fields = fromPairs(fields)

    next()
  }

  setInitialValues(req, res, next) {
    const fields = req.form.options.fields
    const responses = req.assessment.responses
    const savedValues = responses
      .filter(response => fields[response.question?.key])
      .filter(response => !isEmpty(response.value))
      .reduce(frameworksHelpers.reduceResponsesToFormValues, {})

    if (req.form.options.fullPath !== req.journeyModel.get('lastVisited')) {
      req.sessionModel.set(savedValues)
    }

    next()
  }

  setHasNextSteps(req, res, next) {
    const { next: nextSteps = [] } = req?.form?.options || {}
    req.hasNextSteps = !!nextSteps.length
    next()
  }

  setButtonText(req, res, next) {
    const { stepType } = req.form.options
    const { hasNextSteps } = req
    const isInterruptionCard = stepType === 'interruption-card'

    if (isInterruptionCard) {
      req.form.options.buttonText = 'actions::continue'
    } else if (!hasNextSteps) {
      req.form.options.buttonText = 'actions::save_and_return_to_overview'
    } else {
      req.form.options.buttonText = 'actions::save_and_continue'
    }

    next()
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setPageTitleLocals)
    this.use(this.setSyncStatusBanner)
    this.use(this.setPrefillBanner)
    this.use(this.seti18nContext)
    this.use(this.setBreadcrumb)
    this.use(this.setShowReturnToOverviewButton)
    this.use(setMoveSummary)
  }

  seti18nContext(req, res, next) {
    res.locals.i18nContext = snakeCase(req.assessment?.framework?.name || '')
    next()
  }

  setPageTitleLocals(req, res, next) {
    res.locals.frameworkSection = req.frameworkSection.name
    next()
  }

  setBreadcrumb(req, res, next) {
    res.breadcrumb({
      text: req.form.options.pageTitle,
    })

    next()
  }

  setSyncStatusBanner(req, res, next) {
    const { nomis_sync_status: syncStatus } = req.assessment

    if (syncStatus) {
      res.locals.syncFailures = syncStatus
        .filter(type => type.status === 'failed')
        .map(type => type.resource_type)
    }

    next()
  }

  setPrefillBanner(req, res, next) {
    const { prefill_source: source, responses } = req.assessment || {}
    const fields = req.form.options.fields
    const prefilledResponses = responses
      .filter(response => fields[response.question?.key])
      .filter(response => !isEmpty(response.value))
      .filter(
        response => response.prefilled === true && response.responded === false
      )

    res.locals.prefilledSourceDate = source?.confirmed_at
    res.locals.hasPrefilledResponses = prefilledResponses.length > 0

    next()
  }

  setShowReturnToOverviewButton(req, res, next) {
    res.locals.showReturnToOverviewButton = req.hasNextSteps
    next()
  }

  async saveValues(req, res, next) {
    const { form, assessment } = req
    const responses = assessment.responses
      .filter(response =>
        fieldHelpers.isAllowedDependent(
          form.options.fields,
          response?.question?.key,
          form.values
        )
      )
      .reduce(frameworksHelpers.responsesToSaveReducer(form.values), [])

    const services = {
      'person-escort-record': req.services.personEscortRecord,
      'youth-risk-assessment': req.services.youthRiskAssessment,
    }

    try {
      // wait for all responses to resolve first
      if (responses.length) {
        await services[assessment.framework.name].respond(
          assessment.id,
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
    const {
      frameworkSection: { key: currentSection },
      body: { save_and_return_to_overview: goToOverview },
      form: {
        options: { route: currentStep },
      },
    } = req

    const nextStep = this.getNextStep(req, res)
    const isLastStep = nextStep.endsWith(currentStep)

    if (goToOverview || isLastStep) {
      const overviewUrl = req.baseUrl.replace(`/${currentSection}`, '')
      return res.redirect(overviewUrl)
    }

    super.successHandler(req, res, next)
  }

  render(req, res, next) {
    const { responses } = req.assessment || {}
    const fields = Object.entries(req.form.options.fields)
      .map(frameworksHelpers.renderNomisMappingsToField(responses))
      .map(
        frameworksHelpers.renderPreviousAnswerToField({
          responses,
        })
      )

    req.form.options.fields = fromPairs(fields)

    super.render(req, res, next)
  }
}

module.exports = FrameworkStepController
