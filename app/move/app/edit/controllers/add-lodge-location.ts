// @ts-ignore // TODO: convert to ts
import commonMiddleware from '../../../../../common/middleware'
import { BasmRequest } from '../../../../../common/types/basm_request'

import { BaseController } from './base'

export class SetLocationController extends BaseController {
  middlewareSetup() {
    super.middlewareSetup()
    // @ts-ignore // #use does exist
<<<<<<<< HEAD:app/move/app/edit/controllers/add-lodge-location.ts
    this.use(commonMiddleware.setLocationItems('prison', 'to_location_lodge'))
========
    this.use(
      commonMiddleware.setLocationItems(
        ['prison', 'police'],
        'to_location_lodge'
      )
    )
>>>>>>>> f5133e5c (chore: WIP add lodge form):app/move/app/add-lodge/controllers/set-location.ts
  }

  async successHandler(req: any, res: any, next: any) {
    try {
      const { to_location_lodge: toLocationId } = req.sessionModel.toJSON()

      if (toLocationId) {
        const locationDetail = await req.services.referenceData.getLocationById(
          toLocationId
        )

        req.sessionModel.set('to_location_lodge', locationDetail)
      }

      // @ts-ignore // this exists
      super.successHandler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
