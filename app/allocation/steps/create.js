const { createControllers } = require('../controllers')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'allocation-details',
  },
  '/allocation-details': {
    controller: createControllers.AllocationDetailsController,
    pageTitle: 'allocations::allocation_details.page_title',
    fields: ['moves_count', 'from_location', 'to_location', 'date'],
    next: 'allocation-criteria',
  },
  '/allocation-criteria': {
    controller: createControllers.AllocationCriteriaController,
    pageTitle: 'allocations::allocation_criteria.page_title',
    fields: [
      'prisoner_category',
      'sentence_length',
      'complex_cases',
      'complete_in_full',
      'has_other_criteria',
      'other_criteria',
    ],
    next: 'save',
  },
  '/save': {
    checkJourney: false,
    skip: true,
    controller: createControllers.Save,
  },
}
