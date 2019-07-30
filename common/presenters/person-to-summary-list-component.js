const { find } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

module.exports = function personToSummaryListComponent ({
  date_of_birth: dateOfBirth,
  gender,
  ethnicity,
  identifiers,
}) {
  const pncNumber = find(identifiers, {
    identifier_type: 'police_national_computer',
  })
  const rows = [
    {
      key: {
        text: i18n.t('fields::police_national_computer.label'),
      },
      value: {
        text: pncNumber ? pncNumber.value : '',
      },
    },
    {
      key: {
        text: i18n.t('fields::date_of_birth.label'),
      },
      value: {
        text: dateOfBirth
          ? `${filters.formatDate(dateOfBirth)} (${i18n.t(
            'age'
          )} ${filters.calculateAge(dateOfBirth)})`
          : '',
      },
    },
    {
      key: {
        text: i18n.t('fields::gender.label'),
      },
      value: {
        text: gender ? gender.title : '',
      },
    },
    {
      key: {
        text: i18n.t('fields::ethnicity.label'),
      },
      value: {
        text: ethnicity ? ethnicity.title : '',
      },
    },
  ]

  return {
    rows,
  }
}
