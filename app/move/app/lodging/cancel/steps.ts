import {
  BaseController,
  CancelController,
  SetReasonController,
} from './controllers'

export default {
  '/': {
    controller: BaseController,
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'reason',
  },
  '/reason': {
    controller: SetReasonController,
    pageTitle: 'moves::steps.lodging.cancel.reason.heading',
    template: 'reason',
    fields: ['lodge_cancel_reason'],
    next: 'cancel',
  },
  '/cancel': {
    skip: true,
    controller: CancelController,
  },
}
