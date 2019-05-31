/* eslint-disable camelcase */
const filters = require('../../config/nunjucks/filters')

module.exports = function personToSummaryListComponent ({ date_of_birth, gender, ethnicity }) {
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
