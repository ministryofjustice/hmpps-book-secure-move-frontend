const wizard = require('hmpo-form-wizard')

const FormWizardController = require('../../common/controllers/form-wizard')

const middleware = require('./middleware')

function defineFormWizards(framework, router) {
  const { questions, sections } = framework

  router.use(middleware.setFramework(framework))

  for (const sectionKey in sections) {
    const section = sections[sectionKey]
    const wizardConfig = {
      buttonText: 'actions::save_and_continue',
      controller: FormWizardController,
      entryPoint: true,
      journeyName: `person-escort-record-${sectionKey}`,
      journeyPageTitle: 'Person escort record',
      name: `person-escort-record-${sectionKey}`,
      template: 'form-wizard',
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
