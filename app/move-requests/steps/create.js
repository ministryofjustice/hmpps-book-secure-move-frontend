const FormWizardController = require('../../../common/controllers/form-wizard')

const SearchResultsController = require('../controllers/search-results')

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
    action: '/move-requests/new/prison-number-search-results',
    pageTitle: 'move_requests::prison_number.heading',
    next: 'prison-number-search-results',
    fields: ['prison_number'],
    template: 'move-requests/views/move-requests-base.njk',
  },
  '/prison-number-search-results': {
    checkJourney: false,
    backLink: 'prison-number',
    controller: SearchResultsController,
    method: 'get',
    action: '/move-requests/new/move-request-details',
    pageTitle: 'move_requests::prison_number_search_results.heading',
    fields: ['prison_number_search_results'],
    template: 'move-requests/views/move-requests-base.njk',
    next: 'move-request-details',
  },
  '/move-request-details': {
    checkJourney: false,
    backLink: 'prison-number-search-results',
    controller: FormWizardController,
    method: 'get',
    action: '/move-requests/new/move-request-reason',
    pageTitle: 'move_requests::details.heading',
    fields: [
      'move_to_prison_name',
      'move_request_agreed',
      'move_request_who_agreed',
      'move_request_date',
      'move_request_date_deadline',
      'move_request_date_range',
      'move_request_date_specific_date',
    ],
    next: 'move-request-reason',
  },
  '/move-request-reason': {
    checkJourney: false,
    backLink: 'move-request-details',
    controller: FormWizardController,
    method: 'get',
    action: '/move-requests/new/save',
    pageTitle: 'move_requests::reason.heading',
    fields: ['move_request_reason', 'move_request_reason_other_reason'],
    next: 'save',
  },
  '/save': {
    skip: true,
  },
}
