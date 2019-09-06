const { isToday, isTomorrow, isYesterday } = require('date-fns')
const { get } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function isRelativeDate(date) {
  if (isToday(date) || isTomorrow(date) || isYesterday(date)) {
    return true
  }

  return false
}

function moveToMetaListComponent({
  date,
  time_due: timeDue,
  move_type: moveType,
  from_location: fromLocation,
  to_location: toLocation,
  additional_information: additionalInfo,
} = {}) {
  const dateWithDay = filters.formatDateWithDay(date)
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
        text: isRelativeDate(date)
          ? `${dateWithDay} (${filters.formatDateAsRelativeDay(date)})`
          : dateWithDay,
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
