const { NewPersonEscortRecordController } = require('./controllers')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'before-you-start',
  },
  '/before-you-start': {
    backLink: null,
    controller: NewPersonEscortRecordController,
    pageCaption: 'person-escort-record::heading',
    pageTitle: 'person-escort-record::create.steps.before_you_start.heading',
    template: 'start-page',
  },
}
