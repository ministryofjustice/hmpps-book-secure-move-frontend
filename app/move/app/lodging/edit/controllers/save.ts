import { addDays, parseISO } from 'date-fns'

import { LodgingService } from '../../../../../../common/services/lodging'
import { formatDate } from '../../../../../../config/nunjucks/filters'

import { BaseController } from './base'

export class SaveController extends BaseController {
  constructor(options = {}) {
    super(options)
  }

  middlewareSetup() {
    super.middlewareSetup()
  }

  async successHandler(req: any, res: any, next: any) {
    const dateFormat = 'yyyy-MM-dd'
    const lodgeLocation = req.sessionModel.attributes.to_location_lodge
    const startDate = parseISO(req.lodging.start_date)
    const lodgeLength = Number(req.form.values.lodge_length)
    const endDate = addDays(startDate, lodgeLength)

    const updatedAttrs: any = {}

    if (Number.isFinite(lodgeLength)) {
      updatedAttrs.endDate = formatDate(endDate, dateFormat).toString()
    }

    if (lodgeLocation) {
      updatedAttrs.locationId = lodgeLocation.id
    }

    try {
      await (req.services.lodging as LodgingService).update({
        moveId: req.move.id,
        id: req.lodging.id,
        ...updatedAttrs,
      })

      res.redirect(`/move/${req.move.id}/lodging/${req.lodging.id}/edit/saved`)
    } catch (err) {
      next(err)
    }
  }
}
