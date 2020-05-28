const { Unassign } = require('../controllers')

const unassignSteps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'remove',
  },
  '/remove': {
    template: 'unassign',
    controller: Unassign,
    pageTitle: 'allocation::unassign.page_title',
    buttonText: 'actions::person_unassign_confirmation',
    buttonClasses: 'govuk-button--warning',
  },
}

module.exports = unassignSteps
