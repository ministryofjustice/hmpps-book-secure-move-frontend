const {
  PersonalDetails,
  Assessment,
  MoveDate,
  MoveDetails,
  Save,
  PersonSearch,
  PersonSearchResults,
  Document,
  PrisonTransferReason,
} = require('../controllers/create')

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

const moveDetailsStep = {
  controller: MoveDetails,
  template: 'move-details',
  pageTitle: 'moves::steps.move_details.heading',
  next: [
    {
      field: 'from_location_type',
      value: 'prison',
      next: [
        {
          field: 'to_location_type',
          value: 'prison',
          next: 'move-date-range',
        },
        'move-date',
      ],
    },
    'move-date',
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

const healthStep = {
  controller: Assessment,
  assessmentCategory: 'health',
  template: 'assessment',
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
        field: 'from_location_type',
        value: 'police',
        next: 'move-details-police',
      },
      {
        fn: req => {
          return req.session.user.permissions.includes(
            'move:create:prison_to_prison'
          )
        },
        next: 'move-details-prison-to-prison',
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
        field: 'from_location_type',
        value: 'police',
        next: 'move-details-police',
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
  // OCA journey
  '/move-date-range': {
    pageTitle: 'moves::steps.move_date.heading',
    fields: ['date_from', 'has_date_to', 'date_to'],
    next: 'prison-transfer-reason',
  },
  '/move-date': {
    pageTitle: 'moves::steps.move_date.heading',
    next: [
      {
        field: 'move_type',
        value: 'court_appearance',
        next: 'court-information',
      },
      {
        field: 'from_location_type',
        value: 'prison',
        next: [
          {
            field: 'to_location_type',
            value: 'prison',
            next: 'prison-transfer-reason',
          },
          'release-status',
        ],
      },
      'risk-information',
    ],
    controller: MoveDate,
    fields: ['date', 'date_type', 'date_custom'],
  },
  '/prison-transfer-reason': {
    controller: PrisonTransferReason,
    pageTitle: 'moves::steps.prison_transfer_reason.heading',
    fields: ['prison_transfer_reason', 'prison_transfer_reason_comments'],
    next: 'agreement-status',
  },
  '/move-details': {
    ...moveDetailsStep,
    fields: [
      'to_location',
      'move_type',
      'to_location_prison',
      'to_location_court_appearance',
    ],
  },
  '/move-details-prison-to-prison': {
    ...moveDetailsStep,
    fields: [
      'to_location',
      'move_type__prison_to_prison',
      'to_location_prison',
      'to_location_court_appearance',
    ],
  },
  '/move-details-police': {
    ...moveDetailsStep,
    fields: [
      'to_location',
      'move_type__police',
      'to_location_prison_recall',
      'to_location_court_appearance',
      'additional_information',
    ],
  },
  '/agreement-status': {
    pageTitle: 'moves::agreement_status.heading',
    fields: ['move_agreed', 'move_agreed_by'],
    next: 'special-vehicle',
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
    previousAssessmentKeys: ['not_to_be_released'],
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
    previousAssessmentKeys: ['special_vehicle', 'pregnant'],
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
