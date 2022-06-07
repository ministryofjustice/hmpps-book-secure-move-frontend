const { omit, pickBy } = require('lodash')
const queryString = require('qs')

const i18n = require('../../../config/i18n').default

function buildUrl({ sortKey }, query) {
  return queryString.stringify({
    ...omit(query, 'page'),
    sortBy: sortKey,
    sortDirection: query.sortDirection === 'asc' ? 'desc' : 'asc',
  })
}

function buildAriaLabel(head, { sortDirection }) {
  // the label indicates the result of the sorting action triggered by the link,
  // which is the opposite of the current state
  return i18n.t('sort', {
    context: sortDirection === 'asc' ? 'descending' : 'ascending',
    label: i18n.t(head.html).toLowerCase(),
  })
}

function buildWrapper(head, query) {
  const label = i18n.t(head.html)

  if (!head.isSortable) {
    return label
  }

  const url = buildUrl(head, query)
  const ariaLabel = buildAriaLabel(head, query)
  return `<a aria-label="${ariaLabel}" class="sortable-table__button" role="button" href="?${url}">${label}</a>`
}

function assignSortAttributes(
  { attributes, isSortable, sortKey },
  { sortBy, sortDirection }
) {
  if (!isSortable) {
    return attributes
  }

  const isCurrentSortColumn = sortKey === sortBy
  const ariaSortDirection = sortDirection === 'asc' ? 'ascending' : 'descending'

  return {
    ...attributes,
    'aria-sort': isCurrentSortColumn ? ariaSortDirection : 'none',
  }
}

function objectToTableHead(query = {}) {
  return function objectToTableHead({ head } = {}) {
    if (!head) {
      return undefined
    }

    return pickBy({
      ...head,
      attributes: assignSortAttributes(head, query),
      html: head.html ? buildWrapper(head, query) : undefined,
      text: head.text ? i18n.t(head.text) : undefined,
    })
  }
}

module.exports = objectToTableHead
