/* eslint-disable sort-keys-fix/sort-keys-fix */
const { createControllers } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    next: 'allocation-details',
    reset: true,
    resetJourney: true,
    skip: true,
  },
  '/allocation-details': {
    controller: createControllers.AllocationDetailsController,
    fields: ['moves_count', 'from_location', 'to_location', 'date'],
    next: 'allocation-criteria',
    pageTitle: 'allocations::allocation_details.page_title',
  },
  '/allocation-criteria': {
    controller: createControllers.AllocationCriteriaController,
    fields: [
      'prisoner_category',
      'sentence_length',
      'complex_cases',
      'complete_in_full',
      'has_other_criteria',
      'other_criteria',
    ],
    next: 'save',
    pageTitle: 'allocations::allocation_criteria.page_title',
  },
  '/save': {
    checkJourney: false,
    controller: createControllers.Save,
    skip: true,
  },
}
