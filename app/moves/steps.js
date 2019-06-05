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
  },
  '/move-details': {
    heading: 'Where is this person moving?',
    next: 'risk-information',
  },
  '/risk-information': {
    heading: 'Are there risks with moving this person?',
    next: 'health-information',
  },
  '/health-information': {
    heading: 'Does this person’s health affect transport?',
    next: 'court-information',
  },
  '/court-information': {
    heading: 'Is there information for the court?',
  },
}
