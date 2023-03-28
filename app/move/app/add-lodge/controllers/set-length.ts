import { isDate, parseISO } from 'date-fns'

import { Event } from '../../../../../common/types/event'

// @ts-ignore // TODO: convert to TS
import { Move } from '../../../../../common/types/move'

import { BaseController } from './base'

export class SetLengthController extends BaseController {
  middlewareSetup() {
    super.middlewareSetup()
    // @ts-ignore // .use() does exist
    this.use(this.setAdditionalLocals)
  }

  setAdditionalLocals(req: any, res: any, next: any) {
    res.locals.lodgeLocation = req.sessionModel.attributes.to_location_lodge
    const { date, important_events: importantEvents } = req.move as Move
    let startDate: Date = isDate(date)
      ? (date as Date)
      : parseISO(date as string)
    const overnightLodges = importantEvents
      ?.filter((e: Event) => e.event_type === 'MoveOvernightLodge')
      .sort(({ occurred_at: occurredAtA }, { occurred_at: occurredAtB }) =>
        occurredAtA > occurredAtB ? -1 : 1
      )

    if (overnightLodges && overnightLodges?.length > 0) {
      const lastOvernightLodge = overnightLodges[overnightLodges.length - 1]
      startDate = parseISO(lastOvernightLodge.details.end_date || '')
    }

    if (startDate.getTime() < Date.now()) {
      startDate = new Date()
    }

    res.locals.lodgeStartDate = startDate

    next()
  }

  process(req: any, res: any, next: () => void) {
    let { lodge_length: lodgeLength } = req.form.values

    if (lodgeLength === 'custom') {
      lodgeLength = Number(req.form.values.lodge_length_custom);
      req.form.values.lodge_length_custom = lodgeLength
    }

    req.form.values.lodge_length = lodgeLength
    console.log(req.form.values.lodge_length)
    console.log(res.locals.lodgeStartDate)

    // throw "blah"

    //
    // // process move date
    // let moveDate
    //
    // if (dateType === 'custom') {
    //   moveDate = parseISO(req.form.values.date_custom_lodge)
    // } else {
    //   req.form.values.date_custom_lodge = ''
    //   moveDate =
    //     dateType === 'tomorrow'
    //       ? res.locals.TOMORROW
    //       : res.locals.DAY_AFTER_TOMORROW
    // }
    //
    // req.form.values.date = isValidDate(moveDate)
    //   ? format(moveDate, 'yyyy-MM-dd')
    //   : undefined

    // TODO: A MoveOvernightLodge needs to be created at this point using the following vars
    // date = req.form.values.date
    // location id = req.sessionModel.attributes.to_location_lodge.id

    next()
  }
}
