/* eslint-disable camelcase */
const { get } = require('lodash')

const { getIdentifier, removeEmptyItems } = require('./_utilities')
const filters = require('../../config/nunjucks/filters')

module.exports = function personToSummaryListComponent ({ date_of_birth, gender, ethnicity, identifiers }) {
  const rows = [
    {
      key: {
        text: 'Date of birth',
      },
      value: {
        text: date_of_birth ? `${filters.formatDate(date_of_birth)} (Age ${filters.calculateAge(date_of_birth)})` : '',
      },
    },
    {
      key: {
        text: 'Gender',
      },
      value: {
        text: get(gender, 'title'),
      },
    },
    {
      key: {
        text: 'Ethnicity',
      },
      value: {
        text: get(ethnicity, 'title'),
      },
    },
    {
      key: {
        html: '<abbr title="Criminal Records Office">CRO</abbr> number',
      },
      value: {
        text: getIdentifier(identifiers, 'cro_number'),
      },
    },
    {
      key: {
        text: 'Custody number',
      },
      value: {
        text: getIdentifier(identifiers, 'athena_reference'),
      },
    },
    {
      key: {
        html: '<abbr title="Police National Computer">PNC</abbr> number',
      },
      value: {
        text: getIdentifier(identifiers, 'pnc_number'),
      },
    },
    {
      key: {
        text: 'Prisoner number',
      },
      value: {
        text: getIdentifier(identifiers, 'prison_number'),
      },
    },
  ]

  return {
    rows: removeEmptyItems(rows, ['value.text', 'value.html']),
  }
}
