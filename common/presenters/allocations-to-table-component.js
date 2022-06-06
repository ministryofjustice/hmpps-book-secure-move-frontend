const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const tablePresenters = require('./table')

function showProgress(data, showRemaining) {
  const { totalSlots, unfilledSlots, filledSlots } = data
  return showRemaining
    ? _byRemaining(totalSlots, unfilledSlots)
    : _byAdded(totalSlots, filledSlots)
}

function _byRemaining(totalSlots, unfilledSlots) {
  const isComplete = unfilledSlots === 0
  const inProgress = unfilledSlots !== totalSlots

  return {
    context: inProgress ? (isComplete ? 'complete' : 'by_remaining') : 'new',
    count: unfilledSlots,
  }
}

function _byAdded(totalSlots, filledSlots) {
  const isComplete = filledSlots === totalSlots
  const inProgress = filledSlots > 0

  return {
    context: inProgress ? (isComplete ? 'complete' : 'by_added') : '',
    count: filledSlots,
  }
}

function allocationsToTableComponent({
  showFromLocation = true,
  showRemaining = false,
  query,
  isSortable = true,
} = {}) {
  const tableConfig = [
    {
      head: {
        isSortable,
        sortKey: 'moves_count',
        html: 'collections::labels.move_size',
        attributes: {
          width: '120',
        },
      },
      row: {
        attributes: {
          scope: 'row',
        },
        html: data => {
          const { totalSlots: count } = data
          return `<a href="/allocation/${data.id}">${count} ${i18n.t('person', {
            count,
          })}</a>`
        },
      },
    },
    {
      head: {
        text: 'collections::labels.progress',
        attributes: {
          width: '150',
        },
      },
      row: {
        html: data => {
          const classes = {
            complete: 'govuk-tag--green',
            by_remaining: 'govuk-tag--yellow',
            by_added: 'govuk-tag--yellow',
            default: 'govuk-tag--red',
          }
          const opts =
            data.status !== 'cancelled'
              ? showProgress(data, showRemaining)
              : { context: 'cancelled' }

          return componentService.getComponent('govukTag', {
            text: i18n.t('collections::labels.progress_status', opts),
            classes: classes[opts.context] || classes.default,
          })
        },
      },
    },
    {
      /* eslint-disable indent */
      head: showFromLocation
        ? {
            sortKey: 'from_location',
            html: 'collections::labels.from_location',
            isSortable,
          }
        : undefined,
      /* eslint-enable indent */
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
        isSortable,
        sortKey: 'date',
        html: 'fields::date_custom.label',
        attributes: {
          width: '135',
        },
      },
      row: {
        text: data => filters.formatDate(data.date),
      },
    },
  ]

  return function buildTable(allocations) {
    return {
      head: tableConfig
        .map(tablePresenters.objectToTableHead(query))
        .filter(column => column),
      rows: allocations.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = allocationsToTableComponent
