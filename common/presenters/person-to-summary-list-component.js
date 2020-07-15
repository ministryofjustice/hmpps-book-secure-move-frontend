const { API } = require('../../config')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

// TODO: when V2, props will be splatted and no need for identifier_type prop
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

module.exports = function personToSummaryListComponent(props) {
  if (!props) {
    return undefined
  }

  const {
    gender,
    ethnicity,
    date_of_birth: dateOfBirth,
    gender_additional_information: genderAdditionalInformation,
  } = props
  const age = `(${i18n.t('age')} ${filters.calculateAge(dateOfBirth)})`
  const genderExtra = genderAdditionalInformation
    ? ` — ${genderAdditionalInformation}`
    : ''

  let { identifiers = [] } = props

  if (API.VERSION !== 1) {
    identifiers = [
      'police_national_computer',
      'prison_number',
      'criminal_records_office',
    ]
      .filter(identifier => props[identifier])
      .map(identifier => ({
        value: props[identifier],
        identifier_type: identifier,
      }))
  }

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
