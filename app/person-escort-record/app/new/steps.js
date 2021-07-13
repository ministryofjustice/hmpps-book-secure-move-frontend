const { NewPersonEscortRecordController } = require('./controllers')

module.exports = {
  '/': {
    controller: NewPersonEscortRecordController,
    entryPoint: true,
    forwardQuery: true,
    reset: true,
    resetJourney: true,
    skip: true,
  },
}
