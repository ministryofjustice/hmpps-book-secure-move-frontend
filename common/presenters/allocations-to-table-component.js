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
} = {}) {
  const tableConfig = [
    {
      head: {
        attributes: {
          width: '120',
        },
        text: 'collections::labels.move_size',
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
        attributes: {
          width: '150',
        },
        text: 'collections::labels.progress',
      },
      row: {
        html: data => {
          const totalSlots = data.moves.length
          const unfilledSlots = data.moves.filter(move => !move.person).length
          const classes = {
            by_added: 'govuk-tag--yellow',
            by_remaining: 'govuk-tag--yellow',
            complete: 'govuk-tag--green',
            default: 'govuk-tag--red',
          }
          const opts = showRemaining
            ? _byRemaining(totalSlots, unfilledSlots)
            : _byAdded(totalSlots, unfilledSlots)

          return componentService.getComponent('govukTag', {
            classes: classes[opts.context] || classes.default,
            text: i18n.t('collections::labels.progress_status', opts),
          })
        },
      },
    },
    {
      /* eslint-disable indent */
      head: showFromLocation
        ? { text: 'collections::labels.move_from' }
        : undefined,
      /* eslint-enable indent */
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
        attributes: {
          width: '135',
        },
        text: 'fields::date_custom.label',
      },
      row: {
        text: data => filters.formatDate(data.date),
      },
    },
  ]

  return function buildTable(allocations) {
    return {
      head: tableConfig
        .map(tablePresenters.objectToTableHead)
        .filter(column => column),
      rows: allocations.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = allocationsToTableComponent
