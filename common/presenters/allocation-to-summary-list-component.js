const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function allocationToSummaryListComponent(allocation) {
  const {
    moves,
    from_location: fromLocation,
    to_location: toLocation,
    date,
  } = allocation
  return {
    items: [
      {
        key: {
          text: i18n.t('allocations::view.sidebar.number_of_prisoners'),
        },
        value: { text: moves.length },
      },
      {
        key: {
          text: i18n.t('allocations::view.sidebar.move_from'),
        },
        value: { text: fromLocation.title },
      },
      {
        key: {
          text: i18n.t('allocations::view.sidebar.move_to'),
        },
        value: { text: toLocation.title },
      },
      {
        key: {
          text: i18n.t('fields::date_custom.label'),
        },
        value: { text: filters.formatDateAsRelativeDay(date) },
      },
    ],
  }
}

module.exports = allocationToSummaryListComponent
