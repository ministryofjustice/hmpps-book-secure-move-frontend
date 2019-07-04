const {
  PersonalDetails,
  Assessment,
  MoveDetails,
  Save,
} = require('./controllers')

module.exports = {
  '/': {
    entryPoint: true,
    resetJourney: true,
    skip: true,
    next: 'personal-details',
  },
  '/personal-details': {
    controller: PersonalDetails,
    backLink: null,
    heading: 'moves:steps.personal_details.heading',
    next: 'move-details',
    fields: [
      'athena_reference',
      'last_name',
      'first_names',
      'date_of_birth',
      'gender',
      'ethnicity',
    ],
  },
  '/move-details': {
    controller: MoveDetails,
    template: 'moves/views/create/move-details',
    heading: 'moves:steps.move_details.heading',
    next: [
      { field: 'to_location_type', value: 'court', next: 'court-information' },
      'risk-information',
    ],
    fields: [
      'from_location',
      'to_location',
      'to_location_type',
      'to_location_court',
      'to_location_prison',
      'date',
      'date_type',
      'date_custom',
    ],
  },
  '/court-information': {
    controller: Assessment,
    heading: 'moves:steps.court_information.heading',
    next: 'risk-information',
    fields: [
      'court',
      'court__solicitor',
      'court__interpreter',
      'court__other_information',
    ],
  },
  '/risk-information': {
    controller: Assessment,
    heading: 'moves:steps.risk_information.heading',
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
    controller: Assessment,
    next: 'save',
    heading: 'moves:steps.health_information.heading',
    fields: [
      'health',
      'health__special_diet_or_allergy',
      'health__health_issue',
      'health__medication',
      'health__wheelchair',
      'health__pregnant',
      'health__other_requirements',
    ],
  },
  '/save': {
    skip: true,
    controller: Save,
  },
}
