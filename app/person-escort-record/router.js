const wizard = require('hmpo-form-wizard')

const { FrameworksController } = require('./controllers')
const middleware = require('./middleware')

function defineFormWizards(framework, router) {
  const { questions, sections } = framework

  router.use(middleware.setFramework(framework))

  for (const sectionKey in sections) {
    const section = sections[sectionKey]
    const wizardConfig = {
      controller: FrameworksController,
      entryPoint: true,
      journeyName: `person-escort-record-${sectionKey}`,
      journeyPageTitle: 'Person escort record',
      name: `person-escort-record-${sectionKey}`,
      template: 'form-step',
      templatePath: 'person-escort-record/views/',
    }
    const steps = {
      '/': {
        reset: true,
        resetJourney: true,
      },
      ...section.steps,
    }

    router.use(`/${sectionKey}`, wizard(steps, questions, wizardConfig))
  }
}

module.exports = {
  defineFormWizards,
}
