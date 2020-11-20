const { startCase } = require('lodash')

const FrameworkSectionController = require('../controllers/framework/framework-section')
const FrameworkStepController = require('../controllers/framework/framework-step')
const wizard = require('../middleware/unique-form-wizard')

function defineFormWizard(req, res, next) {
  const { key, steps } = req.frameworkSection
  const { id: assessmentId, _framework, framework } = req.assessment
  const firstStep = Object.values(steps)[0]
  const wizardFields = _framework.questions
  const wizardSteps = {
    '/': {
      controller: FrameworkSectionController,
      reset: true,
      resetJourney: true,
      template: 'framework-section',
    },
    '/start': {
      next: firstStep.slug,
      reset: true,
      resetJourney: true,
      skip: true,
      noPost: true,
    },
    ...steps,
  }
  const wizardConfig = {
    controller: FrameworkStepController,
    entryPoint: true,
    journeyName: `${framework.name}-${assessmentId}-${key}`,
    journeyPageTitle: startCase(framework.name),
    name: `${framework.name}-${assessmentId}-${key}`,
    template: 'framework-step',
    defaultFormatters: ['trim', 'singlespaces', 'apostrophes', 'quotes'],
  }

  return wizard(wizardSteps, wizardFields, wizardConfig)(req, res, next)
}

module.exports = {
  defineFormWizard,
}
