const { Review } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    resetJourney: true,
    skip: true,
    next: 'decision',
  },
  '/decision': {
    backLink: null,
    template: 'move/views/review',
    pageTitle: 'moves::review.steps.decision.heading',
    buttonText: 'actions::confirm_and_save',
    fields: ['move_date', 'rejection_reason_comment', 'review_decision'],
    controller: Review,
  },
}
