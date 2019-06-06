module.exports = {
  '/': {
    entryPoint: true,
    resetJourney: true,
    skip: true,
    next: 'personal-details',
  },
  '/personal-details': {
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
    next: 'risk-information',
    fields: [
      'from_location',
      'to_location',
      'date',
    ],
  },
  '/risk-information': {
    heading: 'Are there risks with moving this person?',
    next: 'health-information',
    fields: [
      'risk',
    ],
  },
  '/health-information': {
    heading: 'Does this person’s health affect transport?',
    next: 'court-information',
    fields: [
      'health',
    ],
  },
  '/court-information': {
    heading: 'Is there information for the court?',
    fields: [
      'court',
    ],
  },
}
