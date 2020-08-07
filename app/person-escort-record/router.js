const wizard = require('hmpo-form-wizard')

const FrameworkSectionController = require('./controllers/framework-section')
const FrameworkStepController = require('./controllers/framework-step')

function defineFormWizard(req, res, next) {
  const { key, steps } = req.frameworkSection
  const firstStep = Object.values(steps)[0]
  const wizardFields = req.framework.questions
  const wizardSteps = {
    '/': {
      next: firstStep.slug,
      reset: true,
      resetJourney: true,
      skip: true,
    },
    ...steps,
    '/overview': {
      controller: FrameworkSectionController,
      reset: true,
      resetJourney: true,
      template: 'framework-section',
    },
  }
  const wizardConfig = {
    controller: FrameworkStepController,
    entryPoint: true,
    journeyName: `person-escort-record-${key}`,
    journeyPageTitle: 'Person escort record',
    name: `person-escort-record-${key}`,
    template: 'framework-step',
    templatePath: 'person-escort-record/views/',
  }

  return wizard(wizardSteps, wizardFields, wizardConfig)(req, res, next)
}

module.exports = {
  defineFormWizard,
}
