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
    pageTitle: 'allocations::allocation_cancel_reasons.page_title',
    fields: ['cancel_reason', 'cancel_reason_comment'],
  },
}
