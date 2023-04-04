import { parseISO } from 'date-fns'

import { findById } from '../../../../../common/services/location'
import i18n from '../../../../../config/i18n'
import {
  formatDate,
  formatDateWithDay,
} from '../../../../../config/nunjucks/filters'

export async function SavedController(req: any, res: any) {
  const event = await req.services.event.getEvent(req, req.params.eventId)
  const lodgeLocationId = event.relationships.location.data.id
  const lodgeLocation = await findById(req, lodgeLocationId, true)
  const startDate = parseISO(event.attributes.details.start_date)
  const endDate = parseISO(event.attributes.details.end_date)
  const startDatePlusOne = parseISO(event.attributes.details.start_date)
  startDatePlusOne.setDate(startDatePlusOne.getDate() + 1)

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

  res.render('move/app/add-lodge/views/saved', {
    moveReference: req.move.reference,
    location: lodgeLocation?.title,
    dateText: i18n.t('moves::steps.lodge.saved.date', details),
    move: req.move,
    name: req.move.profile?.person?._fullname,
  })
}
