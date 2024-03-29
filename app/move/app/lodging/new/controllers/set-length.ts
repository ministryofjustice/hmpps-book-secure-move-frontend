import { isDate, parseISO } from 'date-fns'

// @ts-ignore // TODO: convert to TS
import { Move } from '../../../../../../common/types/move'

import { BaseController } from './base'

export class SetLengthController extends BaseController {
  middlewareSetup() {
    super.middlewareSetup()
    // @ts-ignore // .use() does exist
    this.use(this.setAdditionalLocals)
  }

  setAdditionalLocals(req: any, res: any, next: any) {
    res.locals.lodgeLocation = req.sessionModel.attributes.to_location_lodge
    const { date, lodgings } = req.move as Move
    let startDate: Date = isDate(date)
      ? (date as unknown as Date)
      : parseISO(date as string)
    const overnightLodges = (lodgings || []).sort((a, b) =>
      (a.end_date || '') > (b.end_date || '') ? -1 : 1
    )

    if (overnightLodges && overnightLodges?.length > 0) {
      const lastOvernightLodge = overnightLodges[0]
      startDate = parseISO(lastOvernightLodge.end_date || '')
    }

    if (startDate.getTime() < Date.now()) {
      startDate = new Date()
    }

    res.locals.lodgeStartDate = startDate
    req.sessionModel.set('lodge_start_date', startDate)

    next()
  }

  process(req: any, res: any, next: () => void) {
    const { lodge_length_type: lodgeLengthType } = req.form.values

    let lodgeLength: number

    if (lodgeLengthType === 'custom') {
      lodgeLength = Number(req.form.values.lodge_length_custom)
    } else {
      req.form.values.lodge_length_custom = ''
      lodgeLength = Number(lodgeLengthType)
    }

    req.form.values.lodge_length = lodgeLength

    next()
  }
}
