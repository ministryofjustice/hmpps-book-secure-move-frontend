const ConfirmAssessmentController = require('../../../../common/controllers/framework/confirm-assessment')

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
    controller: ConfirmAssessmentController,
    fields: ['confirm_assessment'],
    buttonText: 'actions::confirm_youth_risk_assessment',
    pageTitle: 'youth-risk-assessment::journeys.confirm.heading',
    beforeFieldsContent: 'youth-risk-assessment::journeys.confirm.content',
    template: 'form-wizard',
  },
}
