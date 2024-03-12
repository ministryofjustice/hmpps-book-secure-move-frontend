import { parseISO } from 'date-fns'

import { findById } from '../../../../../../common/services/location'
import { BasmRequest } from '../../../../../../common/types/basm_request'
import i18n from '../../../../../../config/i18n'
import {
  formatDate,
  formatDateWithDay,
} from '../../../../../../config/nunjucks/filters'
import { BasmError } from '../../../../../../common/types/basm_error'

export async function SavedController(req: BasmRequest, res: any, next: any) {
  const lodging = req.move.lodgings!.find(l => l.id === req.params.lodgingId)

  if (!lodging) {
    const error = new Error('Lodging not found') as BasmError
    error.statusCode = 404

    return next(error)
  }

  const lodgeLocation = await findById(req, lodging.location.id, true)
  const startDate = parseISO(lodging.start_date)
  const startDatePlusOne = parseISO(lodging.start_date)
  startDatePlusOne.setDate(startDatePlusOne.getDate() + 1)
  const endDate = parseISO(lodging.end_date)

  const dateFormat = 'yyyy-MM-dd'

  const details: any = {
    startDate: formatDateWithDay(startDate),
    endDate: formatDateWithDay(endDate),
  }

  if (
    formatDate(startDatePlusOne, dateFormat) !== formatDate(endDate, dateFormat)
  ) {
    details.context = 'long'
  }

  res.render('move/app/lodging/new/views/saved', {
    moveReference: req.move.reference,
    location: lodgeLocation?.title,
    dateText: i18n.t('moves::steps.lodging.new.saved.date', details),
    move: req.move,
    name: req.move.profile?.person?._fullname,
  })
}
