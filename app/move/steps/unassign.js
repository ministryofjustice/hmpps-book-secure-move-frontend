const { Unassign } = require('../controllers')

const unassignSteps = {
  '/': {
    entryPoint: true,
    next: 'remove',
    reset: true,
    resetJourney: true,
    skip: true,
  },
  '/remove': {
    buttonClasses: 'govuk-button--warning',
    buttonText: 'actions::person_unassign_confirmation',
    controller: Unassign,
    pageTitle: 'allocation::unassign.page_title',
    template: 'unassign',
  },
}

module.exports = unassignSteps
