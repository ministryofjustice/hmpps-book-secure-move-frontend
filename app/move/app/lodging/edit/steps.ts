import { SaveController, SetLengthController } from './controllers'

export default {
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
