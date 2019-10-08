const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function mapIdentifier({ value, identifier_type: type }) {
  return {
    key: {
      html: i18n.t(`fields::${type}.label`),
    },
    value: {
      text: value,
    },
  }
}

module.exports = function personToSummaryListComponent({
  gender,
  ethnicity,
  identifiers = [],
  date_of_birth: dateOfBirth,
  gender_additional_information: genderAdditionalInformation,
}) {
  const age = `(${i18n.t('age')} ${filters.calculateAge(dateOfBirth)})`
  const genderExtra = genderAdditionalInformation
    ? ` — ${genderAdditionalInformation}`
    : ''

  const rows = [
    ...identifiers.map(mapIdentifier),
    {
      key: {
        text: i18n.t('fields::date_of_birth.label'),
      },
      value: {
        text: dateOfBirth ? `${filters.formatDate(dateOfBirth)} ${age}` : '',
      },
    },
    {
      key: {
        text: i18n.t('fields::gender.label'),
      },
      value: {
        text: gender ? `${gender.title}${genderExtra}` : '',
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
