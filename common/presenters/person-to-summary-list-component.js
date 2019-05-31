/* eslint-disable camelcase */
const { find, get } = require('lodash')

const filters = require('../../config/nunjucks/filters')

function _removeEmpty (items, paths) {
  return items.filter((item) => {
    let include = false

    paths.forEach((path) => {
      if (get(item, path)) {
        include = true
      }
    })

    return include
  })
}

function _getIdentifier (identifiers, type) {
  const identifier = find(identifiers, { identifier_type: type })
  return get(identifier, 'value')
}

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
        text: _getIdentifier(identifiers, 'cro_number'),
      },
    },
    {
      key: {
        text: 'Custody number',
      },
      value: {
        text: _getIdentifier(identifiers, 'athena_reference'),
      },
    },
    {
      key: {
        html: '<abbr title="Police National Computer">PNC</abbr> number',
      },
      value: {
        text: _getIdentifier(identifiers, 'pnc_number'),
      },
    },
    {
      key: {
        text: 'Prisoner number',
      },
      value: {
        text: _getIdentifier(identifiers, 'prison_number'),
      },
    },
  ]

  return {
    rows: _removeEmpty(rows, ['value.text', 'value.html']),
  }
}
