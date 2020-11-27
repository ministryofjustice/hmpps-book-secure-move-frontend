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
    pageTitle: 'population::free_space_details.page_title',
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
    buttonText: 'actions::confirm_and_save',
  },
}
