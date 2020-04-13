const { Cancel } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    next: 'reason',
    resetJourney: true,
    skip: true,
  },
  '/reason': {
    backLink: null,
    buttonClasses: 'govuk-button--warning',
    buttonText: 'actions::cancel_move_confirmation',
    controller: Cancel,
    fields: ['cancellation_reason', 'cancellation_reason_comment'],
    pageTitle: 'moves::cancel.steps.reason.heading',
    template: 'move/views/cancel',
  },
}
