const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const {
  FrameworkSectionController,
  FrameworkStepController,
} = require('./controllers')
const middleware = require('./middleware')

function defineFormWizards(framework) {
  const { questions, sections } = framework

  for (const sectionKey in sections) {
    const section = sections[sectionKey]
    const firstStep = Object.values(section.steps)[0]
    const wizardConfig = {
      controller: FrameworkStepController,
      entryPoint: true,
      journeyName: `person-escort-record-${sectionKey}`,
      journeyPageTitle: 'Person escort record',
      name: `person-escort-record-${sectionKey}`,
      template: 'framework-step',
      templatePath: 'person-escort-record/views/',
    }
    const steps = {
      '/': {
        next: firstStep.slug,
        reset: true,
        resetJourney: true,
        skip: true,
      },
      ...section.steps,
      '/overview': {
        controller: FrameworkSectionController,
        reset: true,
        resetJourney: true,
        template: 'framework-section',
      },
    }

    router.use(
      `/${sectionKey}`,
      middleware.setFrameworkSection(section),
      wizard(steps, questions, wizardConfig)
    )
  }

  return router
}

module.exports = {
  defineFormWizards,
}
