const i18n = require('../../config/i18n')
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
        const count = data.moves.length
        return `<a href="/allocation/${data.id}">${count} ${i18n.t('person', {
          count,
        })}</a>`
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
  {
    head: 'allocations::progress',
    // todo: this field does not exist yet and it might end up having a different name or format
    row: {
      html: data => {
        const total = data.moves.length
        const unfilled = data.moves.filter(move => !move.person).length
        return `${unfilled} of ${total}`
      },
      // text: 'progress',
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
