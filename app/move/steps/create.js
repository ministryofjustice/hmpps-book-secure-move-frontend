const HealthDetails = require('../controllers/create/health-details')

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
    next: 'risk-information',
    fields: [
      'court',
      'court__solicitor',
      'court__interpreter',
      'court__other_court',
    ],
  },
  '/risk-information': {
    controller: Assessment,
    pageTitle: 'moves::steps.risk_information.heading',
    next: 'health-information',
    fields: [
      'risk',
      'risk__violent',
      'risk__escape',
      'risk__hold_separately',
      'risk__self_harm',
      'risk__concealed_items',
      'risk__other_risks',
    ],
  },
  '/health-information': {
    controller: HealthDetails,
    next: 'save',
    pageTitle: 'moves::steps.health_information.heading',
    buttonText: FEATURE_FLAGS.DOCUMENTS
      ? 'actions::continue'
      : 'actions::schedule_move', // TODO: move this logic to a more sensible place, like a controller
    fields: [
      'health',
      'health__special_diet_or_allergy',
      'health__health_issue',
      'health__medication',
      'health__wheelchair',
      'health__pregnant',
      'health__other_health',
      'health__special_vehicle',
      'type_health__special_vehicle',
    ],
  },
  '/document': {
    enctype: 'multipart/form-data',
    controller: Document,
    next: 'save',
    pageTitle: 'moves::steps.document.heading',
    buttonText: 'actions::schedule_move',
    fields: ['document_upload'],
  },
  '/save': {
    skip: true,
    controller: Save,
    next: 'document',
  },
}
