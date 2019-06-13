const {
  PersonalDetails,
  Assessment,
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
    heading: 'Where is this person moving?',
    next: [
      { field: 'to_location', value: 'court', next: 'court-information' },
      'risk-information',
    ],
    fields: [
      'from_location',
      'to_location',
      'date',
    ],
  },
  '/court-information': {
    controller: Assessment,
    heading: 'Is there information for the court?',
    next: 'risk-information',
    fields: [
      'court_information',
    ],
  },
  '/risk-information': {
    controller: Assessment,
    heading: 'Are there risks with moving this person?',
    next: 'health-information',
    fields: [
      'risk',
    ],
  },
  '/health-information': {
    controller: Assessment,
    heading: 'Does this person’s health affect transport?',
    fields: [
      'health',
    ],
  },
}
