const controllers = require('../controllers/assign')

const create = require('./create')

const assignSteps = {
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
    controller: controllers.AgreementStatus,
    next: 'release-status',
  },
  '/release-status': {
    ...create['/release-status'],
    fields: [],
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
    templatePath: 'move/views/assign/',
    template: 'no-special-vehicle',
    pageTitle: 'moves::steps.person_search.heading',
  },
  '/save': {
    skip: true,
    controller: controllers.Save,
    next: 'confirmation',
  },
  '/confirmation': {
    checkJourney: false,
    checkSession: false,
    controller: controllers.Confirmation,
    templatePath: 'move/views/assign/',
    template: 'confirmation',
  },
}

module.exports = assignSteps
