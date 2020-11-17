const wizard = require('hmpo-form-wizard')

const FrameworkSectionController = require('../../common/controllers/framework/framework-section')
const FrameworkStepController = require('../../common/controllers/framework/framework-step')

function defineFormWizard(req, res, next) {
  const { key, steps } = req.frameworkSection
  const { id: personEscortRecordId } = req.personEscortRecord
  const firstStep = Object.values(steps)[0]
  const wizardFields = req.framework.questions
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
    // Unique for each Person Escort Record and section
    journeyName: `person-escort-record-${personEscortRecordId}-${key}`,
    journeyPageTitle: 'Person escort record',
    // Unique for each Person Escort Record
    name: `person-escort-record-${personEscortRecordId}-${key}`,
    template: 'framework-step',
    defaultFormatters: ['trim', 'singlespaces', 'apostrophes', 'quotes'],
  }

  return wizard(wizardSteps, wizardFields, wizardConfig)(req, res, next)
}

module.exports = {
  defineFormWizard,
}
