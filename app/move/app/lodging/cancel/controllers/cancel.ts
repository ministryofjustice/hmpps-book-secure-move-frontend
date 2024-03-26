import { omit } from 'lodash'

import { BasmRequest } from '../../../../../../common/types/basm_request'

import { BaseController } from './base'

export class CancelController extends BaseController {
  middlewareSetup() {
    super.middlewareSetup()
  }

  async successHandler(req: BasmRequest, res: any, next: any) {
    const data = omit(req.sessionModel?.toJSON(), [
      'csrf-secret',
      'errors',
      'errorValues',
    ])

    try {
      await req.services.lodging.cancelAll({
        moveId: req.move.id,
        reason: data.lodge_cancel_reason,
        comment: data.lodge_cancel_reason_custom,
      })

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/move/${req.move.id}`)
    } catch (error) {
      next(error)
    }
  }
}
