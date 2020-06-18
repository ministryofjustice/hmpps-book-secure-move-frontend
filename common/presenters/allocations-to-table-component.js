const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const tablePresenters = require('./table')

function _byRemaining(totalSlots, unfilledSlots) {
  const isComplete = unfilledSlots === 0
  const inProgress = unfilledSlots !== totalSlots

  return {
    context: inProgress ? (isComplete ? 'complete' : 'by_remaining') : 'new',
    count: unfilledSlots,
  }
}

function _byAdded(totalSlots, unfilledSlots) {
  const isComplete = unfilledSlots === 0
  const inProgress = unfilledSlots !== totalSlots

  return {
    context: inProgress ? (isComplete ? 'complete' : 'by_added') : '',
    count: totalSlots - unfilledSlots,
  }
}

function allocationsToTableComponent({
  showFromLocation = false,
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
          const count = data.moves.length
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
          const totalSlots = data.moves.length
          const unfilledSlots = data.moves.filter(move => !move.profile).length
          const classes = {
            complete: 'govuk-tag--green',
            by_remaining: 'govuk-tag--yellow',
            by_added: 'govuk-tag--yellow',
            default: 'govuk-tag--red',
          }
          const opts = showRemaining
            ? _byRemaining(totalSlots, unfilledSlots)
            : _byAdded(totalSlots, unfilledSlots)

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
