const EditController = require('../controllers/edit')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    forwardQuery: true,
    next: 'details',
  },
  '/details': {
    controller: EditController,
    fields: [
      'operational_capacity',
      'usable_capacity',
      'unlock',
      'bedwatch',
      'overnights_in',
      'overnights_out',
      'out_of_area_courts',
      'discharges',
    ],
    fieldGroups: {
      total_space: ['operational_capacity', 'usable_capacity'],
      unavailable_space: ['unlock', 'bedwatch', 'overnights_in'],
      available_space: ['overnights_out', 'out_of_area_courts', 'discharges'],
    },
    buttonText: 'actions::save_and_calculate',
    template: 'edit',
  },
}
