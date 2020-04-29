const componentService = require('../../common/services/component')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const moveToCardComponent = require('./move-to-card-component')
const objectToTableHead = require('./object-to-table-head')
const objectToTableRow = require('./object-to-table-row')

const tableConfig = [
  {
    head: i18n.t('name'),
    attributes: {
      attributes: {
        scope: 'row',
      },
    },
    row: data => {
      const card = moveToCardComponent({ isCompact: true })(data)
      return componentService.getComponent('appCard', card)
    },
  },
  {
    head: i18n.t('moves::dashboard.created_at'),
    row: data => filters.formatDate(data.created_at),
  },
  {
    head: i18n.t('moves::dashboard.move_to'),
    row: 'to_location.title',
  },
  {
    head: i18n.t('moves::dashboard.move_date'),
    row: data => filters.formatDateRange([data.date_from, data.date_to]),
  },
  {
    head: i18n.t('moves::dashboard.move_type'),
    row: 'prison_transfer_reason',
  },
]

function movesToTable(movesByRangeAndStatus) {
  return {
    movesHeads: tableConfig.map(objectToTableHead),
    moves: movesByRangeAndStatus.map(objectToTableRow(tableConfig)),
  }
}

module.exports = movesToTable
