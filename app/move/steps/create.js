const {
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
    next: [
      {
        fn: req => {
          return req.session.currentLocation.location_type === 'prison'
        },
        next: 'nomis-search',
      },
      'pnc-search',
    ],
  },
  '/nomis-search': {
    entryPoint: true,
    template: 'move/views/create/nomis-search',
    pageTitle: 'moves::steps.nomis_offender_no_search_term.heading',
    buttonText: 'actions::continue',
    next: 'person-search-results',
    fields: ['nomis_offender_no_search_term'],
  },
  '/pnc-search': {
    entryPoint: true,
    template: 'move/views/create/pnc-search',
    pageTitle: 'moves::steps.police_national_computer_search_term.heading',
    next: 'person-search-results',
    fields: ['police_national_computer_search_term'],
  },
  '/person-search-results': {
    controller: PncSearchResults,
    template: 'move/views/create/search-results',
    pageTitle: 'moves::steps.person_search_term_result.heading',
    next: [
      {
        fn: req => {
          return req.session.currentLocation.location_type === 'prison'
        },
        next: 'move-details',
      },
      'personal-details',
    ],
    fields: ['person_search_term_result'],
  },
  '/personal-details': {
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
        fn: req => {
          return req.session.currentLocation.location_type === 'prison'
        },
        next: 'court-hearing',
      },
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
  '/court-hearing': {
    controller: Assessment,
    pageTitle: 'Time of hearing',
    next: 'release-status',
    fields: ['court__hearing_time'],
  },
  '/release-status': {
    controller: Assessment,
    pageTitle: 'Release status',
    next: 'save',
    fields: ['risk', 'risk__hold_in_custody'],
  },
  '/court-information': {
    controller: Assessment,
    pageTitle: 'moves::steps.court_information.heading',
    assessmentCategory: 'court',
    next: 'risk-information',
    fields: ['solicitor', 'interpreter', 'other_court'],
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
    next: [
      {
        field: 'can_upload_documents',
        value: true,
        next: 'document',
      },
      'save',
    ],
    pageTitle: 'moves::steps.health_information.heading',
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
    fields: ['documents'],
  },
  '/save': {
    skip: true,
    controller: Save,
  },
}
