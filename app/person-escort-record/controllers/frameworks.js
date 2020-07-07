const { filter } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')

class FrameworksController extends FormWizardController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setButtonText)
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

  successHandler(req, res, next) {
    if (req.body.save_and_return_to_overview) {
      return res.redirect(req.baseUrl)
    }

    super.successHandler(req, res, next)
  }
}

class FrameworkSectionController extends FrameworksController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setSectionSummary)
  }

  setSectionSummary(req, res, next) {
    const { name, steps } = req.frameworkSection
    const stepSummaries = Object.entries(steps).map(
      presenters.frameworkStepToSummary(
        req.form.options.allFields,
        req.originalUrl
      )
    )

    res.locals.sectionTitle = name
    res.locals.summarySteps = filter(stepSummaries)

    next()
  }
}

module.exports = {
  FrameworksController,
  FrameworkSectionController,
}
