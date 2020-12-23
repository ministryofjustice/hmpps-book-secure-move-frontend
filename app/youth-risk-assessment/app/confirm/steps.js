const { ConfirmYouthRiskAssessmentController } = require('./controllers')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'provide-confirmation',
  },
  '/provide-confirmation': {
    checkJourney: false,
    controller: ConfirmYouthRiskAssessmentController,
    fields: ['confirm_assessment'],
    buttonText: 'actions::confirm_and_complete_record',
    pageTitle: 'youth-risk-assessment::journeys.confirm.heading',
    beforeFieldsContent: 'youth-risk-assessment::journeys.confirm.content',
    template: 'form-wizard',
  },
}
