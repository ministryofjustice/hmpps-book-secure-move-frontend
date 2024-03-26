import { parseISO } from 'date-fns'

// @ts-ignore // TODO: convert to ts
import commonMiddleware from '../../../../../../common/middleware'

import { BaseController } from './base'

export class SetLocationController extends BaseController {
  constructor(options = {}) {
    super(options)
  }

  middlewareSetup() {
    super.middlewareSetup()
    // @ts-ignore // #use does exist
    this.use(
      commonMiddleware.setLocationItems(
        ['prison', 'police'],
        'to_location_lodge'
      )
    )
    // @ts-ignore // #use does exist
    this.use(this.setAdditionalLocals)
  }

  setAdditionalLocals(req: any, res: any, next: any) {
    const { lodging } = req
    res.locals.lodgeLocation = lodging.location
    res.locals.lodgeStartDate = parseISO(lodging.start_date)

    next()
  }

  async successHandler(req: any, res: any, next: any) {
    try {
      const { to_location_lodge: toLocationId } = req.sessionModel.toJSON()

      if (toLocationId) {
        const locationDetail =
          await req.services.referenceData.getLocationById(toLocationId)

        req.sessionModel.set('to_location_lodge', locationDetail)
      }

      // @ts-ignore // this exists
      super.successHandler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
