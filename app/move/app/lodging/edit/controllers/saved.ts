import { differenceInDays, parseISO } from 'date-fns'

import { BasmError } from '../../../../../../common/types/basm_error'
import { BasmRequest } from '../../../../../../common/types/basm_request'
import i18n from '../../../../../../config/i18n'
import { formatDateWithDay } from '../../../../../../config/nunjucks/filters'

export function SavedController(req: BasmRequest, res: any, next: any) {
  const lodging = req.move.lodgings!.find(l => l.id === req.params.lodgingId)

  if (!lodging) {
    const error = new Error('Lodging not found') as BasmError
    error.statusCode = 404

    return next(error)
  }

  const lodgeLocation = lodging.location
  const startDate = parseISO(lodging.start_date)
  const endDate = parseISO(lodging.end_date)

  const details: any = {
    startDate: formatDateWithDay(startDate),
    endDate: formatDateWithDay(endDate),
  }

  if (differenceInDays(endDate, startDate) !== 1) {
    details.context = 'long'
  }

  res.render('move/app/lodging/edit/views/saved', {
    moveReference: req.move.reference,
    location: lodgeLocation?.title,
    dateText: i18n.t('moves::steps.lodging.edit.saved.date', details),
    move: req.move,
    name: req.move.profile?.person?._fullname,
  })
}
