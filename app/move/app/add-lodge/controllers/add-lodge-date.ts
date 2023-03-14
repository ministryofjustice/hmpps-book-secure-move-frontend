import { format, isValid as isValidDate, parseISO } from 'date-fns'

import { BasmRequest } from '../../../../../common/types/basm_request'

import { AddLodgeController } from './add-lodge'

const filters = require('../../../../../config/nunjucks/filters')

export class AddLodgeDateController extends AddLodgeController {
  middlewareSetup() {
    super.middlewareSetup()
    // @ts-ignore // #use does exist
    this.use(this.setDateType)
  }

  setDateType(req: BasmRequest, res: any, next: () => void) {
    const { date_type_lodge: dateType } = req.form.options.fields
    const { items } = dateType

    items[0].text = req.t(items[0].text, {
      date: filters.formatDateWithDay(res.locals.TOMORROW),
    })
    items[1].text = req.t(items[1].text, {
      date: filters.formatDateWithDay(res.locals.DAY_AFTER_TOMORROW),
    })
    next()
  }

  process(req: any, res: any, next: () => void) {
    const { date_type_lodge: dateType } = req.form.values

    // process move date
    let moveDate

    if (dateType === 'custom') {
      moveDate = parseISO(req.form.values.date_custom_lodge)
    } else {
      req.form.values.date_custom_lodge = ''
      moveDate =
        dateType === 'tomorrow'
          ? res.locals.TOMORROW
          : res.locals.DAY_AFTER_TOMORROW
    }

    req.form.values.date = isValidDate(moveDate)
      ? format(moveDate, 'yyyy-MM-dd')
      : undefined

    // TODO: A MoveOvernightLodge needs to be created at this point using the following vars
    // date = req.form.values.date
    // location id = req.sessionModel.attributes.to_location_lodge.id

    next()
  }
}
