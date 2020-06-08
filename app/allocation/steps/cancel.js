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
    pageTitle: 'allocations::allocation_cancellation_reason.page_title',
    fields: ['cancellation_reason', 'cancellation_reason_comment'],
    buttonText: 'actions::cancel_move_confirmation',
    buttonClasses: 'govuk-button--warning',
  },
}
