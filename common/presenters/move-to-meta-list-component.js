/* eslint-disable camelcase */
const { isToday, isTomorrow, isYesterday } = require('date-fns')

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
  from_location,
  to_location,
}) {
  const dateWithDay = filters.formatDateWithDay(date)
  const items = [
    {
      key: {
        text: i18n.t('fields::from_location.short_label'),
      },
      value: {
        text: from_location.title,
      },
    },
    {
      key: {
        text: i18n.t('fields::to_location_type.short_label'),
      },
      value: {
        text: to_location.title,
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
