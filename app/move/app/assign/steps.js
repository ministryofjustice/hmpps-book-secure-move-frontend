const createSteps = require('../new/steps')

const controllers = require('./controllers')

const assignSteps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'person-lookup-prison-number',
  },
  '/person-lookup-prison-number': {
    ...createSteps['/person-lookup-prison-number'],
    pageTitle: 'moves::steps.person_search.heading_assign',
    controller: controllers.PersonSearch,
    next: 'person-lookup-results',
  },
  '/person-lookup-results': {
    ...createSteps['/person-lookup-results'],
    controller: controllers.PersonSearchResults,
    next: 'agreement-status',
  },
  '/agreement-status': {
    ...createSteps['/agreement-status'],
    controller: controllers.AgreementStatus,
    fields: ['move_agreed', 'move_agreed_by', 'move_not_agreed_instruction'],
    next: 'release-status',
  },
  '/release-status': {
    ...createSteps['/release-status'],
    fields: [],
    controller: controllers.Assessment,
    next: 'special-vehicle',
  },
  '/special-vehicle': {
    ...createSteps['/special-vehicle'],
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
    templatePath: 'move/app/assign',
    template: 'no-special-vehicle',
    pageTitle: 'moves::steps.person_search.heading',
  },
  '/save': {
    skip: true,
    controller: controllers.Save,
  },
}

module.exports = assignSteps
