const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const moveToCardComponent = require('./move-to-card-component')
const tablePresenters = require('./table')

function movesToSearchResultsTable() {
  return function (moves = []) {
    const tableConfig = [
      {
        head: {
          html: 'name',
          attributes: {
            width: '220',
          },
        },
        row: {
          html: data => {
            const card = moveToCardComponent({ isCompact: true })(data)
            return componentService.getComponent('appCard', card)
          },
          attributes: {
            scope: 'row',
          },
        },
      },
      {
        head: {
          html: 'collections::labels.from_location',
        },
        row: {
          text: 'from_location.title',
        },
      },
      {
        head: {
          html: 'collections::labels.to_location',
        },
        row: {
          text: 'to_location.title',
        },
      },
      {
        head: {
          text: 'collections::labels.move_date',
          attributes: {
            width: '135',
          },
        },
        row: {
          text: data => filters.formatDate(data.date),
        },
      },
    ]

    return {
      head: tableConfig.map(tablePresenters.objectToTableHead()),
      rows: moves.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = movesToSearchResultsTable
