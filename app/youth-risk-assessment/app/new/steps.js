const { NewYouthRiskAssessmentController } = require('./controllers')

module.exports = {
  '/': {
    controller: NewYouthRiskAssessmentController,
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
  },
}
