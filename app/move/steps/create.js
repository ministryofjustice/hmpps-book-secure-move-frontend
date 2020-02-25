const {
  PersonalDetails,
  Assessment,
  MoveDetails,
  Save,
  PersonSearch,
  PersonSearchResults,
  Document,
} = require('../controllers/create')

const personSearchStep = {
  controller: PersonSearch,
  buttonText: 'actions::search',
  template: 'move/views/create/person-search',
  pageTitle: 'moves::steps.person_search.heading',
  next: [
    {
      field: 'is_manual_person_creation',
      value: true,
      next: 'personal-details',
    },
    'person-lookup-results',
  ],
}

const riskStep = {
  controller: Assessment,
  pageTitle: 'moves::steps.risk_information.heading',
  assessmentCategory: 'risk',
  next: [
    {
      field: 'from_location_type',
      value: 'prison',
      next: 'special-vehicle',
    },
    'health-information',
  ],
}

const healthStep = {
  controller: Assessment,
  assessmentCategory: 'health',
  pageTitle: 'moves::steps.health_information.heading',
  next: [
    {
      field: 'can_upload_documents',
      value: true,
      next: 'document',
    },
    'save',
  ],
}

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: [
      {
        field: 'from_location_type',
        value: 'prison',
        next: 'person-lookup-prison-number',
      },
      'person-lookup-pnc',
    ],
  },
  '/person-lookup-prison-number': {
    ...personSearchStep,
    fields: ['filter.nomis_offender_no'],
  },
  '/person-lookup-pnc': {
    ...personSearchStep,
    fields: ['filter.police_national_computer'],
  },
  '/person-lookup-results': {
    controller: PersonSearchResults,
    template: 'move/views/create/person-search-results',
    pageTitle: 'moves::steps.person_search_results.heading',
    next: [
      {
        field: 'is_manual_person_creation',
        value: true,
        next: 'personal-details',
      },
      'move-details',
    ],
    fields: ['people'],
  },
  '/personal-details': {
    controller: PersonalDetails,
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
  '/move-date': {
    pageTitle: 'moves::steps.move_date.heading',
    fields: ['date_from', 'date_to'],
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
      'to_location_prison',
      'to_location_court_appearance',
      'additional_information',
      'date',
      'date_type',
      'date_custom',
    ],
  },
  '/agreement-status': {
    pageTitle: 'moves::agreement_status.heading',
    fields: ['move_agreed', 'move_agreed_by'],
  },
  '/court-information': {
    controller: Assessment,
    pageTitle: 'moves::steps.court_information.heading',
    assessmentCategory: 'court',
    next: [
      {
        field: 'from_location_type',
        value: 'prison',
        next: 'release-status',
      },
      'risk-information',
    ],
    fields: ['solicitor', 'interpreter', 'other_court'],
  },
  '/risk-information': {
    ...riskStep,
    fields: [
      'violent',
      'escape',
      'hold_separately',
      'self_harm',
      'concealed_items',
      'other_risks',
    ],
  },
  '/release-status': {
    ...riskStep,
    pageTitle: 'moves::steps.release_status.heading',
    fields: ['not_for_release'],
  },
  '/health-information': {
    ...healthStep,
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
  '/special-vehicle': {
    ...healthStep,
    pageTitle: 'moves::steps.special_vehicle.heading',
    fields: ['special_vehicle'],
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
