const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const objectToTableHead = require('./object-to-table-head')
const objectToTableRow = require('./object-to-table-row')

const tableConfig = [
  {
    head: i18n.t('allocations::move_size'),
    attributes: {
      attributes: {
        scope: 'row',
      },
    },
    row: 'moves_count',
  },
  {
    head: i18n.t('allocations::requested'),
    row: data => filters.formatDate(data.created_at),
  },
  {
    head: i18n.t('allocations::move_from'),
    row: 'from_location.title',
  },
  {
    head: i18n.t('allocations::move_to'),
    row: 'to_location.title',
  },
  {
    head: i18n.t('date'),
    row: data => filters.formatDate(data.date),
  },
  {
    head: i18n.t('allocations::progress'),
    // todo: this field does not exist yet and it might end up having a different name or format
    row: 'progress',
  },
]

function allocationsToTable(allocations) {
  return {
    headerForAllocationTable: tableConfig.map(objectToTableHead),
    rowsForAllocationTable: allocations.map(objectToTableRow(tableConfig)),
  }
}

module.exports = allocationsToTable
