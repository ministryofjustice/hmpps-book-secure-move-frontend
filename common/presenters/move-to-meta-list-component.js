/* eslint-disable camelcase */
const {
  isToday,
  isTomorrow,
  isYesterday,
} = require('date-fns')

const filters = require('../../config/nunjucks/filters')

function _isRelativeDate (date) {
  if (isToday(date) || isTomorrow(date) || isYesterday(date)) {
    return true
  }

  return false
}

module.exports = function moveToMetaListComponent ({ date, time_due, from_location, to_location }) {
  const items = [
    {
      key: {
        text: 'From',
      },
      value: {
        text: from_location.title,
      },
    },
    {
      key: {
        text: 'To',
      },
      value: {
        text: to_location.title,
      },
    },
    {
      key: {
        text: 'Date',
      },
      value: {
        text: _isRelativeDate(date) ? `${filters.formatDateWithDay(date)} (${filters.formatDateAsRelativeDay(date)})` : filters.formatDateWithDay(date),
      },
    },
    {
      key: {
        text: 'Time due',
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
