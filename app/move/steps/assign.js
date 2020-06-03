/* eslint-disable sort-keys-fix/sort-keys-fix */
const controllers = require('../controllers/assign')

const create = require('./create')

const assignSteps = {
  '/': {
    entryPoint: true,
    next: 'person-lookup-prison-number',
    reset: true,
    resetJourney: true,
    skip: true,
  },
  '/person-lookup-prison-number': {
    ...create['/person-lookup-prison-number'],
    controller: controllers.PersonSearch,
    next: 'person-lookup-results',
    pageTitle: 'moves::steps.person_search.heading_assign',
  },
  '/person-lookup-results': {
    ...create['/person-lookup-results'],
    controller: controllers.PersonSearchResults,
    next: 'agreement-status',
  },
  '/agreement-status': {
    ...create['/agreement-status'],
    controller: controllers.AgreementStatus,
    fields: ['move_agreed', 'move_agreed_by', 'move_not_agreed_instruction'],
    next: 'release-status',
  },
  '/release-status': {
    ...create['/release-status'],
    controller: controllers.Assessment,
    fields: [],
    next: 'special-vehicle',
  },
  '/special-vehicle': {
    ...create['/special-vehicle'],
    controller: controllers.Assessment,
    fields: ['special_vehicle_check'],
    next: [
      {
        field: 'special_vehicle_check',
        next: 'no-special-vehicle',
        value: 'true',
      },
      'save',
    ],
    pageTitle: 'moves::steps.health_information.heading',
  },
  '/no-special-vehicle': {
    pageTitle: 'moves::steps.person_search.heading',
    template: 'no-special-vehicle',
    templatePath: 'move/views/assign/',
  },
  '/save': {
    controller: controllers.Save,
    next: 'confirmation',
    skip: true,
  },
  '/confirmation': {
    checkJourney: false,
    checkSession: false,
    controller: controllers.Confirmation,
    template: 'confirmation',
    templatePath: 'move/views/assign/',
  },
}

module.exports = assignSteps
