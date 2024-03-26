import { addDays, parseISO } from 'date-fns'

import { LodgingService } from '../../../../../../common/services/lodging'
import { formatDate } from '../../../../../../config/nunjucks/filters'

import { BaseController } from './base'

export class SaveController extends BaseController {
  middlewareSetup() {
    super.middlewareSetup()
  }

  async successHandler(req: any, res: any, next: any) {
    const dateFormat = 'yyyy-MM-dd'

    const lodgeLocation = req.sessionModel.attributes.to_location_lodge
    const startDate = parseISO(req.sessionModel.attributes.lodge_start_date)
    const lodgeLength = Number(req.form.values.lodge_length)
    const endDate = addDays(startDate, lodgeLength)

    try {
      const result = await (req.services.lodging as LodgingService).create({
        moveId: req.move.id,
        locationId: lodgeLocation.id,
        startDate: formatDate(startDate, dateFormat).toString(),
        endDate: formatDate(endDate, dateFormat).toString(),
      })

      res.redirect(`/move/${req.move.id}/lodging/new/${result.id}/saved`)
    } catch (err) {
      next(err)
    }
  }
}
