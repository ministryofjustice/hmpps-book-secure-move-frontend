const { FEATURE_FLAGS } = require('../../../config')
const {
  Base,
  PersonalDetails,
  Assessment,
  MoveDetails,
  Save,
  PncSearchResults,
  Document,
} = require('../controllers/create')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    checkJourney: false,
    next: 'pnc-search',
  },
  '/pnc-search': {
    checkJourney: false,
    backLink: false,
    controller: Base,
    method: 'get',
    action: '/move/new/pnc-search-results',
    template: 'move/views/create/pnc-search',
    pageTitle: 'moves::steps.police_national_computer_search_term.heading',
    buttonText: 'actions::continue',
    next: 'pnc-search-results',
    fields: ['police_national_computer_search_term'],
  },
  '/pnc-search-results': {
    checkJourney: false,
    backLink: 'pnc-search',
    controller: PncSearchResults,
    template: 'move/views/create/pnc-search-results',
    pageTitle:
      'moves::steps.police_national_computer_search_term_result.heading',
    next: 'personal-details',
    fields: ['police_national_computer_search_term_result'],
  },
  '/personal-details': {
    entryPoint: true,
    controller: PersonalDetails,
    backLink: 'pnc-search',
    pageTitle: 'moves::steps.personal_details.heading',
    next: 'move-details',
    fields: [
      'police_national_computer',
      'last_name',
      'first_names',
      'date_of_birth',
      'ethnicity',
      'gender',
      'gender_additional_information',
    ],
  },
  '/move-details': {
    controller: MoveDetails,
    template: 'move/views/create/move-details',
    pageTitle: 'moves::steps.move_details.heading',
    next: [
      {
        field: 'move_type',
        value: 'court_appearance',
        next: 'court-information',
      },
      'risk-information',
    ],
    fields: [
      'from_location',
      'to_location',
      'move_type',
      'to_location_court_appearance',
      'additional_information',
      'date',
      'date_type',
      'date_custom',
    ],
  },
  '/court-information': {
    controller: Assessment,
    pageTitle: 'moves::steps.court_information.heading',
    assessmentCategory: 'court',
    next: 'risk-information',
    fields: [
      'solicitor',
      'interpreter',
      'other_court',
    ],
  },
  '/risk-information': {
    controller: Assessment,
    assessmentCategory: 'risk',
    pageTitle: 'moves::steps.risk_information.heading',
    next: 'health-information',
    fields: [
      'violent',
      'escape',
      'hold_separately',
      'self_harm',
      'concealed_items',
      'other_risks',
    ],
  },
  '/health-information': {
    controller: Assessment,
    assessmentCategory: 'health',
    next: 'save',
    pageTitle: 'moves::steps.health_information.heading',
    buttonText: FEATURE_FLAGS.DOCUMENTS
      ? 'actions::continue'
      : 'actions::schedule_move', // TODO: move this logic to a more sensible place, like a controller
    fields: [
      'special_diet_or_allergy',
      'health_issue',
      'medication',
      'wheelchair',
      'pregnant',
      'other_health',
      'special_vehicle',
    ],
  },
  '/document': {
    enctype: 'multipart/form-data',
    controller: Document,
    next: 'save',
    pageTitle: 'moves::steps.document.heading',
    buttonText: 'actions::schedule_move',
    fields: ['documents'],
  },
  '/save': {
    skip: true,
    controller: Save,
    next: 'document',
  },
}
