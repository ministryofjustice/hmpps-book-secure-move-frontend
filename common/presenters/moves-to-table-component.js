const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const tablePresenters = require('./table')

function movesToTableComponent({ query } = {}) {
  const tableConfig = [
    {
      head: {
        isSortable: true,
        sortKey: 'reference',
        html: 'collections::labels.reference',
        attributes: {
          width: '120',
        },
      },
      row: {
        attributes: {
          scope: 'row',
        },
        html: ({ id, reference }) => `<a href="/move/${id}">${reference}</a>`,
      },
    },
    {
      head: {
        sortKey: 'from_location',
        html: 'collections::labels.from_location',
        isSortable: true,
      },
      row: {
        text: 'from_location.title',
      },
    },
    {
      head: {
        sortKey: 'to_location',
        html: 'collections::labels.to_location',
        isSortable: true,
      },
      row: {
        text: 'to_location.title',
      },
    },
    {
      head: {
        isSortable: true,
        sortKey: 'date',
        html: 'collections::labels.move_date',
        attributes: {
          width: '145',
        },
      },
      row: {
        text: data => filters.formatDate(data.date),
      },
    },
    {
      head: {
        isSortable: true,
        sortKey: 'status',
        html: 'collections::labels.move_status',
        attributes: {
          width: '135',
        },
      },
      row: {
        html: data => {
          const opts = { context: data.status }
          return componentService.getComponent('mojBadge', {
            text: i18n.t('collections::labels.move_status', opts),
          })
        },
      },
    },
  ]

  return function buildTable(moves) {
    return {
      head: tableConfig.map(tablePresenters.objectToTableHead(query)),
      rows: moves.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = movesToTableComponent
