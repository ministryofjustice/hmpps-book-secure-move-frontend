/* eslint-disable camelcase */
const { isToday, isTomorrow, isYesterday } = require('date-fns')
const { get } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function _isRelativeDate(date) {
  if (isToday(date) || isTomorrow(date) || isYesterday(date)) {
    return true
  }

  return false
}

module.exports = function moveToMetaListComponent({
  date,
  time_due,
  move_type,
  from_location,
  to_location,
  additional_information,
} = {}) {
  const dateWithDay = filters.formatDateWithDay(date)
  const destination = get(to_location, 'title', 'Unknown')
  const destinationLabel =
    move_type === 'prison_recall'
      ? i18n.t('fields::move_type.items.prison_recall.label')
      : destination
  const additionalInformation = additional_information
    ? ` — ${additional_information}`
    : ''
  const items = [
    {
      key: {
        text: i18n.t('fields::from_location.short_label'),
      },
      value: {
        text: get(from_location, 'title'),
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
        text: _isRelativeDate(date)
          ? `${dateWithDay} (${filters.formatDateAsRelativeDay(date)})`
          : dateWithDay,
      },
    },
    {
      key: {
        text: i18n.t('fields::time_due.label'),
      },
      value: {
        text: filters.formatTime(time_due),
      },
    },
  ]

  return {
    items,
  }
}
