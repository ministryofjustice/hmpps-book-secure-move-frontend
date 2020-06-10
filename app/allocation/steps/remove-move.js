const { removeMoveControllers } = require('../controllers')

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
    controller: removeMoveControllers.RemoveMoveController,
    pageTitle: 'moves::remove_from_allocation.heading',
    buttonText: 'moves::remove_from_allocation.button',
    buttonClasses: 'govuk-button--warning',
  },
}
