const filters = require('../../config/nunjucks/filters')

const tablePresenters = require('./table')

const tableConfig = [
  {
    head: 'allocations::move_size',
    row: {
      attributes: {
        scope: 'row',
      },
      html: data => {
        const content = `${data.moves_count} ${filters.pluralize(
          'person',
          data.moves_count
        )}`
        return `<a href="/allocation/${data.id}">${content}</a>`
      },
    },
  },
  {
    head: 'allocations::requested',
    row: {
      text: data => filters.formatDate(data.created_at),
    },
  },
  {
    head: 'allocations::move_from',
    row: {
      text: 'from_location.title',
    },
  },
  {
    head: 'allocations::move_to',
    row: {
      text: 'to_location.title',
    },
  },
  {
    head: 'date',
    row: {
      text: data => filters.formatDate(data.date),
    },
  },
]

function allocationsToTable(allocations) {
  return {
    head: tableConfig.map(tablePresenters.objectToTableHead),
    rows: allocations.map(tablePresenters.objectToTableRow(tableConfig)),
  }
}

module.exports = allocationsToTable
