const { Cancel } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    resetJourney: true,
    skip: true,
    next: 'reason',
  },
  '/reason': {
    backLink: null,
    template: 'move/views/cancel',
    pageTitle: 'moves::cancel.steps.reason.heading',
    buttonText: 'actions::cancel_move_confirmation',
    buttonClasses: 'govuk-button--warning',
    fields: ['cancellation_reason', 'cancellation_reason_comment'],
    controller: Cancel,
  },
}
