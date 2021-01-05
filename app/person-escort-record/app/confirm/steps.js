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
    fields: ['confirm_person_escort_record'],
    buttonText: 'actions::confirm_and_complete_record',
    pageTitle: 'person-escort-record::journeys.confirm.heading',
    beforeFieldsContent: 'person-escort-record::journeys.confirm.content',
    template: 'form-wizard',
  },
}
