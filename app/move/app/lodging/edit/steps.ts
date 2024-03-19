import {
  SaveController,
  SetLengthController,
  SetLocationController,
} from './controllers'

export default {
  '/location': {
    controller: SetLocationController,
    entryPoint: true,
    reset: true,
    resetJourney: true,
    pageTitle: 'moves::steps.lodging.edit.location.heading',
    fields: ['to_location_lodge'],
    next: 'save',
  },
  '/length': {
    controller: SetLengthController,
    entryPoint: true,
    reset: true,
    resetJourney: true,
    pageTitle: 'moves::steps.lodging.edit.length.heading',
    fields: ['lodge_length_type'],
    template: 'length',
    next: 'save',
  },
  '/save': {
    skip: true,
    controller: SaveController,
    next: 'saved',
  },
}
