const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const moveToCardComponent = require('./move-to-card-component')
const tablePresenters = require('./table')

function singleRequestsToTable(moves) {
  const tableConfig = [
    {
      head: {
        attributes: {
          width: '220',
        },
        text: i18n.t('name'),
      },
      row: {
        attributes: {
          scope: 'row',
        },
        html: data => {
          const card = moveToCardComponent({
            hrefSuffix: '/review',
            isCompact: true,
          })(data)
          return componentService.getComponent('appCard', card)
        },
      },
    },
    {
      head: {
        attributes: {
          width: '120',
        },
        text: i18n.t('collections::labels.created_at'),
      },
      row: {
        text: data => filters.formatDate(data.created_at),
      },
    },
    {
      head: {
        text: i18n.t('collections::labels.move_from'),
      },
      row: {
        text: 'from_location.title',
      },
    },
    {
      head: {
        text: i18n.t('collections::labels.move_to'),
      },
      row: {
        text: 'to_location.title',
      },
    },
    {
      head: {
        attributes: {
          width: '120',
        },
        text: i18n.t('collections::labels.earliest_move_date'),
      },
      row: {
        text: data => filters.formatDate(data.date_from),
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
