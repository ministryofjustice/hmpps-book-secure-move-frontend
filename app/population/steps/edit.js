const { isNil } = require('lodash')

const DetailsController = require('../controllers/edit/details')
const LoadPopulationController = require('../controllers/edit/load-population')
const PopulateController = require('../controllers/edit/populate')

module.exports = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    forwardQuery: true,
    next: [
      {
        fn: req => {
          return isNil(req.population)
        },
        next: 'populate',
      },
      'load-population',
    ],
  },
  '/load-population': {
    controller: LoadPopulationController,
    skip: true,
    next: 'details',
  },
  '/populate': {
    controller: PopulateController,
    skip: true,
    forwardQuery: true,
    next: 'details',
  },
  '/details': {
    controller: DetailsController,
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
    template: 'details',
  },
}
