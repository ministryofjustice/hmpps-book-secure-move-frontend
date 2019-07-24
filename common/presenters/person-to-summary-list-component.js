const { find } = require('lodash')

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
        text: 'PNC Number',
      },
      value: {
        text: pncNumber ? pncNumber.value : '',
      },
    },
    {
      key: {
        text: 'Date of birth',
      },
      value: {
        text: dateOfBirth
          ? `${filters.formatDate(dateOfBirth)} (Age ${filters.calculateAge(
            dateOfBirth
          )})`
          : '',
      },
    },
    {
      key: {
        text: 'Gender',
      },
      value: {
        text: gender ? gender.title : '',
      },
    },
    {
      key: {
        text: 'Ethnicity',
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
