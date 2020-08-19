const { isEmpty } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const fieldHelpers = require('../../../common/helpers/field')
const frameworksHelpers = require('../../../common/helpers/frameworks')
const permissionsControllers = require('../../../common/middleware/permissions')
const responseService = require('../../../common/services/framework-response')

class FrameworkStepController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    // TODO: Exist this logic to redirect to the overview path if
    // user does not have permission to update
    this.use(permissionsControllers.protectRoute('person_escort_record:update'))
    this.use(this.checkEditable)
  }

  checkEditable(req, res, next) {
    const { steps: wizardSteps = {} } = req?.form?.options || {}
    const steps = Object.keys(wizardSteps)
    const overviewStepPath = steps[steps.length - 1]
    const personEscortRecordIsConfirmed = ['confirmed'].includes(
      req.personEscortRecord?.status
    )

    if (personEscortRecordIsConfirmed) {
      return res.redirect(req.baseUrl + overviewStepPath)
    }

    next()
  }

  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setButtonText)
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
  }

  setPageTitleLocals(req, res, next) {
    res.locals.frameworkSection = req.frameworkSection.name
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
      await Promise.all(
        responses.map(response => responseService.update(response))
      )
      // call parent saveValues to handle storing new values in the session
      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  successHandler(req, res, next) {
    const { steps: wizardSteps = {}, route } = req?.form?.options || {}
    const goToOverview = req.body.save_and_return_to_overview
    const steps = Object.keys(wizardSteps)
    const overviewStepPath = steps[steps.length - 1]
    const nextStep = this.getNextStep(req, res)
    const lastStep = steps[steps.length - 2]
    const currentStep = route
    const isLastStep =
      nextStep.endsWith(lastStep) && nextStep.endsWith(currentStep)

    if (isLastStep || goToOverview) {
      return res.redirect(req.baseUrl + overviewStepPath)
    }

    super.successHandler(req, res, next)
  }
}

module.exports = FrameworkStepController
