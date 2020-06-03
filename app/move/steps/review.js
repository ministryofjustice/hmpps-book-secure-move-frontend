const { Review } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    next: 'decision',
    resetJourney: true,
    skip: true,
  },
  '/decision': {
    backLink: null,
    buttonText: 'actions::confirm_and_save',
    controller: Review,
    fields: ['move_date', 'rejection_reason_comment', 'review_decision'],
    pageTitle: 'moves::review.steps.decision.heading',
    template: 'move/views/review',
  },
}
