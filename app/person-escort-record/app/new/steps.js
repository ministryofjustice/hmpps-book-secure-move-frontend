const { NewPersonEscortRecordController } = require('./controllers')

module.exports = {
  '/': {
    controller: NewPersonEscortRecordController,
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
  },
}
