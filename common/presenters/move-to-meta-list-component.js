const { isToday, isTomorrow, isYesterday, parseISO } = require('date-fns')
const { get } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function isRelativeDate(date) {
  const parsedDate = parseISO(date)

  return (
    isToday(parsedDate) || isTomorrow(parsedDate) || isYesterday(parsedDate)
  )
}

function formatDateRange(dateFrom, dateTo) {
  if (dateTo) {
    return filters.formatDateRange([dateFrom, dateTo])
  }
  return `${i18n.t('from')} ${filters.formatDateAsRelativeDay(dateFrom)}`
}

function setDateToDisplay({ date, dateFrom, dateTo }) {
  if (date) {
    const dateWithDay = filters.formatDateWithDay(date)
    return isRelativeDate(date)
      ? `${dateWithDay} (${filters.formatDateAsRelativeDay(date)})`
      : dateWithDay
  }
  if (dateFrom) {
    return formatDateRange(dateFrom, dateTo)
  }
  return null
}

function moveToMetaListComponent({
  date,
  date_from: dateFrom,
  date_to: dateTo,
  time_due: timeDue,
  move_type: moveType,
  from_location: fromLocation,
  to_location: toLocation,
  additional_information: additionalInfo,
} = {}) {
  const destination = get(toLocation, 'title', 'Unknown')
  const destinationLabel =
    moveType === 'prison_recall'
      ? i18n.t('fields::move_type.items.prison_recall.label')
      : destination
  const additionalInformation = additionalInfo ? ` — ${additionalInfo}` : ''
  const items = [
    {
      key: {
        text: i18n.t('fields::from_location.short_label'),
      },
      value: {
        text: get(fromLocation, 'title'),
      },
    },
    {
      key: {
        text: i18n.t('fields::move_type.short_label'),
      },
      value: {
        text: destinationLabel + additionalInformation,
      },
    },
    {
      key: {
        text: i18n.t('fields::date_type.label'),
      },
      value: {
        text: setDateToDisplay({ date, dateFrom, dateTo }),
      },
    },
    {
      key: {
        text: i18n.t('fields::time_due.label'),
      },
      value: {
        text: filters.formatTime(timeDue),
      },
    },
  ]

  return {
    items,
  }
}

module.exports = moveToMetaListComponent
