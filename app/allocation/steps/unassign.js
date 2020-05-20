const { unassignControllers } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'remove',
  },
  '/remove': {
    template: 'unassign',
    controller: unassignControllers.Unassign,
    pageTitle: 'allocation::person_unassign.page_title',
    buttonText: 'actions::person_unassign_confirmation',
    buttonClasses: 'govuk-button--warning',
  },
}
