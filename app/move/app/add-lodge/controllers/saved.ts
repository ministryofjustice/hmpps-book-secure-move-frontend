import { parseISO } from 'date-fns'

import i18n from '../../../../../config/i18n'
// @ts-ignore // TODO: convert to TS
import { formatDate } from '../../../../../config/nunjucks/filters'

export async function SavedController(req: any, res: any) {
  const event = await req.services.event.getEvent(req, req.params.eventId)
  const lodgeLocation = event.relationships.location
  const startDate = parseISO(event.attributes.details.start_date)
  const endDate = parseISO(event.attributes.details.end_date)
  const startDatePlusOne = parseISO(event.attributes.details.start_date)
  startDatePlusOne.setDate(startDatePlusOne.getDate() + 1)

  const dateFormat = 'yyyy-MM-dd'

  const details: any = { startDate, endDate }

  if (
    formatDate(startDatePlusOne, dateFormat) !== formatDate(endDate, dateFormat)
  ) {
    details.context = 'long'
  }

  res.render('move/app/add-lodge/views/saved', {
    moveReference: req.move.reference,
    location: lodgeLocation.data.id,
    dateText: i18n.t('moves::steps.lodge.saved.date', details),
  })
}
