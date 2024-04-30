const {
  Assessment,
  Base,
  CourtHearings,
  Document,
  Hospital,
  MoveDate,
  MoveDetails,
  PersonSearch,
  PersonSearchResults,
  PersonalDetails,
  PrisonTransferReason,
  RecallInfo,
  Save,
  Timetable,
} = require('./controllers')

const personSearchStep = {
  controller: PersonSearch,
  buttonText: 'actions::search',
  template: 'person-search',
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
  assessmentCategory: 'risk',
  template: 'assessment',
  pageTitle: 'moves::steps.risk_information.heading',
  next: [
    {
      field: 'from_location_type',
      value: 'prison',
      next: 'special-vehicle',
    },
    'health-information',
  ],
}

function createDateRangeStepForLocations({
  from: fromLocationType,
  to: toLocationTypes,
}) {
  if (!Array.isArray(toLocationTypes)) {
    toLocationTypes = [toLocationTypes]
  }

  return {
    field: 'from_location_type',
    value: fromLocationType,
    next: [
      ...toLocationTypes.map(it => ({
        field: 'to_location_type',
        value: it,
        next: 'move-date-range',
      })),
      'move-date',
    ],
  }
}

const healthStep = {
  controller: Assessment,
  assessmentCategory: 'health',
  template: 'assessment',
  pageTitle: 'moves::steps.health_information.heading',
  next: 'save',
}

const moveDateSteps = [
  createDateRangeStepForLocations({
    from: 'prison',
    to: ['prison', 'secure_childrens_home', 'secure_training_centre'],
  }),
  createDateRangeStepForLocations({
    from: 'secure_childrens_home',
    to: ['prison', 'secure_childrens_home', 'secure_training_centre'],
  }),
  createDateRangeStepForLocations({
    from: 'secure_training_centre',
    to: ['prison', 'secure_childrens_home', 'secure_training_centre'],
  }),
  'move-date',
]

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
    fields: ['filter.prison_number'],
  },
  '/person-lookup-pnc': {
    ...personSearchStep,
    fields: ['filter.police_national_computer'],
  },
  '/person-lookup-results': {
    hideBackLink: true,
    controller: PersonSearchResults,
    template: 'person-search-results',
    pageTitle: 'moves::steps.person_search_results.heading',
    next: [
      {
        field: 'is_manual_person_creation',
        value: true,
        next: 'personal-details',
      },
      {
        fn: Base.prototype.shouldAskYouthSentenceStep,
        next: 'serving-youth-sentence',
      },
      'move-details',
    ],
    fields: ['people'],
  },
  '/personal-details': {
    controller: PersonalDetails,
    pageTitle: 'moves::steps.personal_details.heading',
    next: [
      {
        fn: Base.prototype.shouldAskYouthSentenceStep,
        next: 'serving-youth-sentence',
      },
      'move-details',
    ],
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
  '/serving-youth-sentence': {
    pageTitle: 'moves::steps.serving_youth_sentence.heading',
    fields: ['serving_youth_sentence'],
    next: 'move-details',
  },
  // OCA journey
  '/move-date-range': {
    pageTitle: 'moves::steps.move_date.heading',
    fields: ['date_from', 'has_date_to', 'date_to'],
    next: 'transfer-reason',
  },
  '/move-date': {
    editable: true,
    pageTitle: 'moves::steps.move_date.heading',
    next: [
      {
        field: 'move_type',
        value: 'hospital',
        next: 'hospital',
      },
      {
        field: 'move_type',
        value: 'court_appearance',
        next: [
          {
            field: 'from_location_type',
            value: 'prison',
            next: 'court-hearings',
          },
          'court-information',
        ],
      },
      {
        field: 'from_location_type',
        value: 'prison',
        next: [
          {
            field: 'to_location_type',
            value: 'prison',
            next: 'transfer-reason',
          },
          {
            field: 'to_location_type',
            value: 'approved_premises',
            next: 'transfer-reason',
          },
          {
            fn: Base.prototype.requiresYouthAssessment,
            next: 'save',
          },
          'release-status',
        ],
      },
      'risk-information',
    ],
    controller: MoveDate,
    fields: ['date', 'date_type', 'date_custom'],
  },
  '/transfer-reason': {
    controller: PrisonTransferReason,
    pageTitle: 'moves::steps.prison_transfer_reason.heading',
    fields: ['prison_transfer_type', 'prison_transfer_comments'],
    next: [
      {
        field: 'to_location_type',
        value: 'approved_premises',
        next: 'special-vehicle',
      },
      'agreement-status',
    ],
  },
  '/move-details': {
    editable: true,
    controller: MoveDetails,
    template: 'move-details',
    pageTitle: 'moves::steps.move_details.heading',
    next: [
      {
        fn: Base.prototype.shouldAskRecallInfoStep,
        next: 'recall-info',
      },
      ...moveDateSteps,
    ],
    fields: [
      'move_type',
      'to_location',
      'to_location_court_appearance',
      'to_location_hospital',
      'to_location_prison_transfer',
      'to_location_police_transfer',
      'to_location_secure_training_centre',
      'to_location_secure_childrens_home',
      'to_location_secure_approved_premises',
      'to_location_secure_extradition',
      'prison_recall_comments',
      'video_remand_comments',
    ],
  },
  '/recall-info': {
    editable: true,
    controller: RecallInfo,
    pageTitle: 'moves::steps.recall_information.heading',
    next: moveDateSteps,
    fields: ['recall_date'],
  },
  '/agreement-status': {
    pageTitle: 'moves::agreement_status.heading',
    fields: ['move_agreed', 'move_agreed_by'],
    next: [
      {
        fn: Base.prototype.requiresYouthAssessment,
        next: 'save',
      },
      'special-vehicle',
    ],
  },
  '/court-information': {
    controller: Assessment,
    assessmentCategory: 'court',
    template: 'assessment',
    pageTitle: 'moves::steps.court_information.heading',
    next: [
      {
        field: 'from_location_type',
        value: 'prison',
        next: [
          {
            fn: Base.prototype.requiresYouthAssessment,
            next: 'save',
          },
          'release-status',
        ],
      },
      {
        fn: Base.prototype.requiresYouthAssessment,
        next: 'save',
      },
      'risk-information',
    ],
    fields: ['solicitor', 'interpreter', 'other_court'],
  },
  '/court-hearings': {
    controller: CourtHearings,
    pageTitle: 'moves::steps.hearing_details.heading',
    next: [
      {
        field: 'has_court_case',
        value: 'true',
        next: 'timetable',
      },
      {
        fn: Base.prototype.requiresYouthAssessment,
        next: 'save',
      },
      'release-status',
    ],
    fields: [
      'has_court_case',
      'court_hearing__start_time',
      'court_hearing__court_case',
      'court_hearing__comments',
    ],
  },
  '/timetable': {
    controller: Timetable,
    pageTitle: 'moves::steps.timetable.heading',
    next: [
      {
        fn: Base.prototype.requiresYouthAssessment,
        next: 'save',
      },
      'release-status',
    ],
    template: 'timetable',
    fields: ['should_save_court_hearings'],
  },
  '/hospital': {
    key: 'hospital',
    controller: Hospital,
    pageTitle: 'moves::steps.hospital_appointment.heading',
    next: [
      {
        field: 'from_location_type',
        value: 'prison',
        next: [
          {
            fn: Base.prototype.requiresYouthAssessment,
            next: 'save',
          },
          'release-status',
        ],
      },
      {
        fn: Base.prototype.requiresYouthAssessment,
        next: 'save',
      },
      'risk-information',
    ],
    fields: ['time_due', 'additional_information'],
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
    showPreviousAssessment: true,
    customAssessmentGroupings: [
      {
        i18nContext: 'release_status',
        keys: ['not_to_be_released'],
      },
    ],
    pageTitle: 'moves::steps.release_status.heading',
    fields: ['not_to_be_released'],
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
    showPreviousAssessment: true,
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
