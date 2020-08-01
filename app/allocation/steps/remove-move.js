const { RemoveMoveController } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'confirm',
  },
  '/confirm': {
    template: 'cancel-reason',
    controller: RemoveMoveController,
    pageTitle: 'moves::remove_from_allocation.heading',
    buttonText: 'moves::remove_from_allocation.button',
    buttonClasses: 'govuk-button--warning',
  },
}
