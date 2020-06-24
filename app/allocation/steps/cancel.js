const { cancelControllers } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'reason',
  },
  '/reason': {
    controller: cancelControllers.CancelController,
    template: 'cancel',
    pageTitle: 'allocations::allocation_cancellation_reason.page_title',
    fields: ['cancellation_reason', 'cancellation_reason_comment'],
    buttonText: 'actions::confirm_cancellation',
    buttonClasses: 'govuk-button--warning',
  },
}
