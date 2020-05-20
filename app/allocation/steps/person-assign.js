const { create } = require('../../move/steps')
const controllers = require('../controllers/person-assign')

const personAssignSteps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'person-lookup-prison-number',
  },
  '/person-lookup-prison-number': {
    ...create['/person-lookup-prison-number'],
    controller: controllers.PersonSearch,
    next: 'person-lookup-results',
  },
  '/person-lookup-results': {
    ...create['/person-lookup-results'],
    controller: controllers.PersonSearchResults,
    next: 'agreement-status',
  },
  '/agreement-status': {
    ...create['/agreement-status'],
    next: 'release-status',
  },
  '/release-status': {
    ...create['/release-status'],
    controller: controllers.Assessment,
    next: 'special-vehicle',
  },
  '/special-vehicle': {
    ...create['/special-vehicle'],
    controller: controllers.Assessment,
    pageTitle: 'moves::steps.health_information.heading',
    fields: ['special_vehicle_check'],
    next: [
      {
        field: 'special_vehicle_check',
        value: 'true',
        next: 'no-special-vehicle',
      },
      'save',
    ],
  },
  '/no-special-vehicle': {
    templatePath: 'allocation/views/person-assign/',
    template: 'no-special-vehicle',
    pageTitle: 'moves::steps.person_search.heading',
  },
  '/save': {
    ...create['/save'],
    controller: controllers.Save,
    next: 'confirmation',
  },
  '/confirmation': {
    checkJourney: false,
    checkSession: false,
    controller: controllers.Confirmation,
    templatePath: 'allocation/views/person-assign/',
    template: 'confirmation',
  },
  '/has-move-already': {
    checkJourney: false,
    checkSession: false,
    controller: controllers.Confirmation,
    templatePath: 'allocation/views/person-assign/',
    template: 'assign-conflict',
  },
}

module.exports = personAssignSteps
