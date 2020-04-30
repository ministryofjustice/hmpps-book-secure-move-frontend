const filters = require('../../config/nunjucks/filters')

const tablePresenters = require('./table')

const tableConfig = [
  {
    head: 'allocations::move_size',
    attributes: {
      attributes: {
        scope: 'row',
      },
    },
    row: 'moves_count',
  },
  {
    head: 'allocations::requested',
    row: data => filters.formatDate(data.created_at),
  },
  {
    head: 'allocations::move_from',
    row: 'from_location.title',
  },
  {
    head: 'allocations::move_to',
    row: 'to_location.title',
  },
  {
    head: 'date',
    row: data => filters.formatDate(data.date),
  },
  {
    head: 'allocations::progress',
    // todo: this field does not exist yet and it might end up having a different name or format
    row: 'progress',
  },
]

function allocationsToTable(allocations) {
  return {
    headerForAllocationTable: tableConfig.map(
      tablePresenters.objectToTableHead
    ),
    rowsForAllocationTable: allocations.map(
      tablePresenters.objectToTableRow(tableConfig)
    ),
  }
}

module.exports = allocationsToTable
