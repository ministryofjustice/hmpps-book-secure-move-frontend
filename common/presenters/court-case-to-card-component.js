const { filter } = require('lodash')

const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

function courtCaseToCardComponent({
  location,
  case_start_date: startDate,
  case_type: caseType,
  case_number: caseNumber,
}) {
  const metaItems = [
    {
      label: {
        text: i18n.t('moves::court_case.items.start_date.label'),
      },
      text: filters.formatDate(startDate),
    },
    {
      label: {
        text: i18n.t('moves::court_case.items.case_type.label'),
      },
      text: caseType,
    },
  ]
  const title =
    caseNumber + (location && location.title ? ` at ${location.title}` : '')

  return {
    meta: {
      items: filter(metaItems, 'text'),
    },
    title: {
      text: title,
    },
  }
}

module.exports = courtCaseToCardComponent
