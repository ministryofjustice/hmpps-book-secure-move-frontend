// @ts-ignore // TODO: convert to TS
import { CancelController } from './controllers'

export default {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'reason'
  },
  '/reason': {
    backLink: null,
    checkJourney: false,
    template: 'move/app/cancel/cancel',
    pageTitle: 'moves::cancel.steps.reason.heading',
    buttonText: 'actions::confirm_cancellation',
    buttonClasses: 'govuk-button--warning',
    fields: ['cancellation_reason', 'cancellation_reason_other_comment'],
    controller: CancelController
  }
}
