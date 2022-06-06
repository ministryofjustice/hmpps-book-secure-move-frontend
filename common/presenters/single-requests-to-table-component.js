const { isNil } = require('lodash')

const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const moveToCardComponent = require('./move-to-card-component')
const tablePresenters = require('./table')

function singleRequestsToTable({ isSortable = true, query } = {}) {
  return function (moves = []) {
    const tableConfig = [
      {
        head: {
          isSortable,
          sortKey: 'name',
          html: 'name',
          attributes: {
            width: '220',
          },
        },
        row: {
          html: data => {
            const card = moveToCardComponent({
              isCompact: true,
              hrefSuffix: '/review',
            })(data)
            return componentService.getComponent('appCard', card)
          },
          attributes: {
            scope: 'row',
          },
        },
      },
      {
        head: {
          isSortable,
          sortKey: 'created_at',
          html: 'collections::labels.created_at',
          attributes: {
            width: '120',
          },
        },
        row: {
          text: data => filters.formatDate(data.created_at),
        },
      },
      {
        head: {
          isSortable,
          sortKey: 'from_location',
          html: 'collections::labels.from_location',
        },
        row: {
          text: 'from_location.title',
        },
      },
      {
        head: {
          isSortable,
          sortKey: 'to_location',
          html: 'collections::labels.to_location',
        },
        row: {
          text: 'to_location.title',
        },
      },
      {
        head: {
          text: i18n.t(
            moves.some(it => !isNil(it.date))
              ? 'collections::labels.move_date'
              : 'collections::labels.earliest_move_date'
          ),
          attributes: {
            width: '120',
          },
        },
        row: {
          text: data => filters.formatDate(data.date || data.date_from),
        },
      },
      {
        head: {
          isSortable,
          sortKey: 'prison_transfer_reason',
          html: 'collections::labels.move_type',
        },
        row: {
          text: 'prison_transfer_reason.title',
        },
      },
    ]

    return {
      head: tableConfig.map(tablePresenters.objectToTableHead(query)),
      rows: moves.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = singleRequestsToTable
