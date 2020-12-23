const { ReviewController } = require('./controllers')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'decision',
  },
  '/decision': {
    backLink: null,
    checkJourney: false,
    template: 'move/app/review/review',
    pageTitle: 'moves::review.steps.decision.heading',
    buttonText: 'actions::confirm_and_save',
    fields: [
      'move_date',
      'rejection_reason',
      'cancellation_reason_other_comment',
      'rebook',
      'review_decision',
    ],
    controller: ReviewController,
  },
}
