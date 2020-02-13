const FormWizardController = require('../../../common/controllers/form-wizard')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    checkJourney: false,
    next: 'prison-number',
  },
  '/prison-number': {
    checkJourney: false,
    backLink: false,
    controller: FormWizardController,
    method: 'get',
    action: '/move_requests/prison-number-search-results',
    pageTitle: 'move_requests::prison_number.heading',
    next: 'prison-number-search-results',
    fields: ['prison_number'],
  },
}
