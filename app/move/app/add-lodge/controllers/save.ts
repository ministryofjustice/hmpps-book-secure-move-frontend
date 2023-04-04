import { parseISO } from 'date-fns'

import { formatDate } from '../../../../../config/nunjucks/filters'

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
    const endDate = new Date(startDate.getTime())
    endDate.setDate(endDate.getDate() + lodgeLength)

    try {
      const result = await req.services.event.postEvent(req, {
        type: 'MoveOvernightLodge',
        details: {
          start_date: formatDate(startDate, dateFormat),
          end_date: formatDate(endDate, dateFormat),
        },
        eventableType: 'moves',
        eventableId: req.move.id,
        relationships: {
          location: {
            data: {
              id: lodgeLocation.id,
              type: 'locations',
            },
          },
        },
      })

      res.redirect(`/move/${req.move.id}/lodge/${result.data.id}/saved`)
    } catch (err) {
      next(err)
    }
  }
}
