const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function mapIdentifier({ key, value }) {
  return {
    key: {
      html: i18n.t(`fields::${key}.label`),
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

  const identifiers = [
    'police_national_computer',
    'prison_number',
    'criminal_records_office',
  ]
    .filter(identifier => props[identifier])
    .map(identifier => ({
      key: identifier,
      value: props[identifier],
    }))
    .map(mapIdentifier)

  const rows = [
    ...identifiers,
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

  if (props.prison_number) {
    rows.push({
      key: {
        text: i18n.t('fields::category.label'),
      },
      value: {
        classes: !props.category?.title ? 'app-secondary-text-colour' : '',
        text: props.category?.title ?? i18n.t('fields::category.uncategorised'),
      },
    })
  }

  return {
    classes: 'govuk-!-font-size-16',
    rows,
  }
}
