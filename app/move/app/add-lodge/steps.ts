import {
  BaseController,
  SaveController,
  SetLengthController,
  SetLocationController,
} from './controllers'

export default {
  '/': {
    controller: BaseController,
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'location',
  },
  '/location': {
    controller: SetLocationController,
    pageTitle: 'moves::steps.lodge.location.heading',
    fields: ['to_location_lodge'],
    next: 'length',
  },
  '/length': {
    controller: SetLengthController,
    pageTitle: 'moves::steps.lodge.length.heading',
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
