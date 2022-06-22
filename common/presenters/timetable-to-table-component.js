const { sortBy } = require('lodash')

const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

module.exports = function timetableToTableComponent(timetable) {
  const head = [
    { text: i18n.t('time') },
    { text: i18n.t('type') },
    { text: i18n.t('reason') },
    { text: i18n.t('location') },
  ]
  const rows = sortBy(timetable, 'start_time').map(
    ({ start_time: time, nomis_type: type, reason, location }) => {
      return [
        { text: time ? filters.formatTime(time) : '' },
        { text: type || '' },
        { text: reason || '' },
        { text: location ? location.title : '' },
      ]
    }
  )

  return {
    head,
    rows,
    classes: 'govuk-!-margin-bottom-2',
  }
}
