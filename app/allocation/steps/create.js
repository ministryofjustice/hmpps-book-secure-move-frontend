const {
  AllocationDetailsController,
  AllocationCriteriaController,
  SaveController,
} = require('../controllers/create')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'allocation-details',
  },
  '/allocation-details': {
    controller: AllocationDetailsController,
    pageTitle: 'allocations::allocation_details.page_title',
    fields: ['moves_count', 'from_location', 'to_location', 'date'],
    next: 'allocation-criteria',
  },
  '/allocation-criteria': {
    controller: AllocationCriteriaController,
    pageTitle: 'allocations::allocation_criteria.page_title',
    fields: [
      'estate',
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
    controller: SaveController,
  },
}
