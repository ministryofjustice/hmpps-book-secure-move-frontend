const { cancelControllers } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    next: 'reason',
    reset: true,
    resetJourney: true,
    skip: true,
  },
  '/reason': {
    buttonClasses: 'govuk-button--warning',
    buttonText: 'actions::cancel_move_confirmation',
    controller: cancelControllers.CancelController,
    pageTitle: 'allocations::allocation_cancel_reasons.page_title',
    template: 'cancel-reason',
  },
}
