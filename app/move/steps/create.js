const {
  Assessment,
  CourtHearings,
  Document,
  MoveDate,
  MoveDetails,
  PersonSearch,
  PersonSearchResults,
  PersonalDetails,
  PrisonTransferReason,
  Save,
  Timetable,
} = require('../controllers/create')

const personSearchStep = {
  buttonText: 'actions::search',
  controller: PersonSearch,
  next: [
    {
      field: 'is_manual_person_creation',
      next: 'personal-details',
      value: true,
    },
    'person-lookup-results',
  ],
  pageTitle: 'moves::steps.person_search.heading',
  template: '../person-search',
}

const riskStep = {
  assessmentCategory: 'risk',
  controller: Assessment,
  next: [
    {
      field: 'from_location_type',
      next: 'special-vehicle',
      value: 'prison',
    },
    'health-information',
  ],
  pageTitle: 'moves::steps.risk_information.heading',
  template: 'assessment',
}

const healthStep = {
  assessmentCategory: 'health',
  controller: Assessment,
  next: [
    {
      field: 'can_upload_documents',
      next: 'document',
      value: true,
    },
    'save',
  ],
  pageTitle: 'moves::steps.health_information.heading',
  template: 'assessment',
}

/* eslint-disable sort-keys-fix/sort-keys-fix */
module.exports = {
  '/': {
    entryPoint: true,
    next: [
      {
        field: 'from_location_type',
        next: 'person-lookup-prison-number',
        value: 'prison',
      },
      'person-lookup-pnc',
    ],
    reset: true,
    resetJourney: true,
    skip: true,
  },
  '/person-lookup-prison-number': {
    ...personSearchStep,
    fields: ['filter.prison_number'],
  },
  '/person-lookup-pnc': {
    ...personSearchStep,
    fields: ['filter.police_national_computer'],
  },
  '/person-lookup-results': {
    controller: PersonSearchResults,
    fields: ['people'],
    hideBackLink: true,
    next: [
      {
        field: 'is_manual_person_creation',
        next: 'personal-details',
        value: true,
      },
      'move-details',
    ],
    pageTitle: 'moves::steps.person_search_results.heading',
    template: '../person-search-results',
  },
  '/personal-details': {
    controller: PersonalDetails,
    fields: [
      'police_national_computer',
      'last_name',
      'first_names',
      'date_of_birth',
      'ethnicity',
      'gender',
      'gender_additional_information',
    ],
    next: 'move-details',
    pageTitle: 'moves::steps.personal_details.heading',
  },
  // OCA journey
  '/move-date-range': {
    fields: ['date_from', 'has_date_to', 'date_to'],
    next: 'prison-transfer-reason',
    pageTitle: 'moves::steps.move_date.heading',
  },
  '/move-date': {
    controller: MoveDate,
    editable: true,
    fields: ['date', 'date_type', 'date_custom'],
    next: [
      {
        field: 'move_type',
        next: [
          {
            field: 'from_location_type',
            next: 'court-hearings',
            value: 'prison',
          },
          'court-information',
        ],
        value: 'court_appearance',
      },
      {
        field: 'from_location_type',
        next: [
          {
            field: 'to_location_type',
            next: 'prison-transfer-reason',
            value: 'prison',
          },
          'release-status',
        ],
        value: 'prison',
      },
      'risk-information',
    ],
    pageTitle: 'moves::steps.move_date.heading',
  },
  '/prison-transfer-reason': {
    controller: PrisonTransferReason,
    fields: ['prison_transfer_type', 'prison_transfer_comments'],
    next: 'agreement-status',
    pageTitle: 'moves::steps.prison_transfer_reason.heading',
  },
  '/move-details': {
    controller: MoveDetails,
    editable: true,
    fields: [
      'move_type',
      'to_location',
      'to_location_court_appearance',
      'to_location_prison_transfer',
      'prison_recall_comments',
    ],
    next: [
      {
        field: 'from_location_type',
        next: [
          {
            field: 'to_location_type',
            next: 'move-date-range',
            value: 'prison',
          },
          'move-date',
        ],
        value: 'prison',
      },
      'move-date',
    ],
    pageTitle: 'moves::steps.move_details.heading',
    template: 'move-details',
  },
  '/agreement-status': {
    fields: ['move_agreed', 'move_agreed_by'],
    next: 'special-vehicle',
    pageTitle: 'moves::agreement_status.heading',
  },
  '/court-information': {
    assessmentCategory: 'court',
    controller: Assessment,
    fields: ['solicitor', 'interpreter', 'other_court'],
    next: [
      {
        field: 'from_location_type',
        next: 'release-status',
        value: 'prison',
      },
      'risk-information',
    ],
    pageTitle: 'moves::steps.court_information.heading',
    template: 'assessment',
  },
  '/court-hearings': {
    controller: CourtHearings,
    fields: [
      'has_court_case',
      'court_hearing__start_time',
      'court_hearing__court_case',
      'court_hearing__comments',
    ],
    next: [
      {
        field: 'has_court_case',
        next: 'timetable',
        value: 'true',
      },
      'release-status',
    ],
    pageTitle: 'moves::steps.hearing_details.heading',
  },
  '/timetable': {
    controller: Timetable,
    fields: ['should_save_court_hearings'],
    next: 'release-status',
    pageTitle: 'moves::steps.timetable.heading',
    template: 'timetable',
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
    customAssessmentGroupings: [
      {
        i18nContext: 'release_status',
        keys: ['not_to_be_released'],
      },
    ],
    fields: ['not_to_be_released'],
    pageTitle: 'moves::steps.release_status.heading',
    showPreviousAssessment: true,
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
    fields: ['special_vehicle'],
    pageTitle: 'moves::steps.special_vehicle.heading',
    showPreviousAssessment: true,
  },
  '/document': {
    controller: Document,
    enctype: 'multipart/form-data',
    fields: ['documents'],
    next: 'save',
    pageTitle: 'moves::steps.document.heading',
  },
  '/save': {
    controller: Save,
    skip: true,
  },
}
/* eslint-enable sort-keys-fix/sort-keys-fix */
