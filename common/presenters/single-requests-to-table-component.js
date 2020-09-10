const { isNil } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const moveToCardComponent = require('./move-to-card-component')
const tablePresenters = require('./table')

function singleRequestsToTable(moves) {
  const tableConfig = [
    {
      head: {
        text: i18n.t('name'),
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
        text: i18n.t('collections::labels.created_at'),
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
        text: i18n.t('collections::labels.from_location'),
      },
      row: {
        text: 'from_location.title',
      },
    },
    {
      head: {
        text: i18n.t('collections::labels.to_location'),
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
        text: i18n.t('collections::labels.move_type'),
      },
      row: {
        text: 'prison_transfer_reason.title',
      },
    },
  ]

  return {
    head: tableConfig.map(row => row.head),
    rows: moves.map(tablePresenters.objectToTableRow(tableConfig)),
  }
}

module.exports = singleRequestsToTable
