const filters = require('../../config/nunjucks/filters')

const tablePresenters = require('./table')

const tableConfig = [
  {
    head: {
      text: 'collections::labels.move_size',
      attributes: {
        width: '120',
      },
    },
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
    head: {
      text: 'collections::labels.requested',
      attributes: {
        width: '160',
      },
    },
    row: {
      text: data => filters.formatDate(data.created_at),
    },
  },
  {
    head: {
      text: 'collections::labels.move_from',
    },
    row: {
      text: 'from_location.title',
    },
  },
  {
    head: {
      text: 'collections::labels.move_to',
    },
    row: {
      text: 'to_location.title',
    },
  },
  {
    head: {
      text: 'date',
      attributes: {
        width: '120',
      },
    },
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
