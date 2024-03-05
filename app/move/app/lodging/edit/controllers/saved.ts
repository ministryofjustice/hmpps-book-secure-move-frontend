import { differenceInDays, parseISO } from 'date-fns'

import { BasmRequest } from '../../../../../../common/types/basm_request'
import i18n from '../../../../../../config/i18n'
import { formatDateWithDay } from '../../../../../../config/nunjucks/filters'

export function SavedController(req: BasmRequest, res: any) {
  const { lodging } = req

  if (!lodging) {
    return res.status(404).send('lodging not found')
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
