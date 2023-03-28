import {
  BaseController,
  SaveController,
  SetLengthController,
  SetLocationController,
} from './controllers'

export default {
<<<<<<< HEAD
  '/': {
=======
  '/new': {
>>>>>>> f5133e5c (chore: WIP add lodge form)
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
<<<<<<< HEAD
    fields: ['lodge_length_type'],
=======
    fields: ['lodge_length'],
>>>>>>> f5133e5c (chore: WIP add lodge form)
    template: 'length',
    next: 'save',
  },
  '/save': {
    skip: true,
    controller: SaveController,
<<<<<<< HEAD
    next: 'saved',
=======
>>>>>>> f5133e5c (chore: WIP add lodge form)
  },
}
