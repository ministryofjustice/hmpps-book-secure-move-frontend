const filters = require('../../config/nunjucks/filters')

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
      return `<a href="/move/${data.id}">${data.person.fullname}</a> (${data.person.identifiers[0].value})`
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
