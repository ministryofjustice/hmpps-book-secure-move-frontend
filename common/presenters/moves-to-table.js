const componentService = require('../../common/services/component')
const filters = require('../../config/nunjucks/filters')

const moveToCardComponent = require('./move-to-card-component')
const tablePresenters = require('./table')

const tableConfig = [
  {
    head: 'name',
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
    head: 'moves::dashboard.created_at',
    row: data => filters.formatDate(data.created_at),
  },
  {
    head: 'moves::dashboard.move_to',
    row: 'to_location.title',
  },
  {
    head: 'moves::dashboard.earliest_move_date',
    row: data => filters.formatDate(data.date_from),
  },
  {
    head: 'moves::dashboard.move_type',
    row: 'prison_transfer_reason',
  },
]

function movesToTable(movesByRangeAndStatus) {
  return {
    movesHeads: tableConfig.map(tablePresenters.objectToTableHead),
    moves: movesByRangeAndStatus.map(
      tablePresenters.objectToTableRow(tableConfig)
    ),
  }
}

module.exports = movesToTable
