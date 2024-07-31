// @ts-ignore // TODO: convert to ts
import commonMiddleware from '../../../../../../common/middleware'

import { BaseController } from './base'

export class SetLocationController extends BaseController {
  middlewareSetup() {
    super.middlewareSetup()
    // @ts-ignore // #use does exist
    this.use(
      commonMiddleware.setLocationItems(
        ['prison', 'police'],
        'to_location_lodge',
        //this.req.models.move.from_location,
      )
    )
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
