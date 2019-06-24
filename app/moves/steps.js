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
    heading: 'Personal details',
    next: 'move-details',
    fields: [
      'reference',
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
    heading: 'Where is this person moving?',
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
      'date_type',
      'date',
    ],
  },
  '/court-information': {
    controller: Assessment,
    heading: 'Is there information for the court?',
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
    heading: 'Are there risks with moving this person?',
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
    heading: 'Does this person’s health affect transport?',
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
