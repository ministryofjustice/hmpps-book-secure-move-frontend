const json2csv = require('json2csv')
const { find, flatten, get, some } = require('lodash')

const i18n = require('../../config/i18n')
const referenceDataHelpers = require('../helpers/reference-data')
const referenceDataService = require('../services/reference-data')

function getIdentifier(identifier) {
  return function (row) {
    const item = find(get(row, 'person.identifiers'), {
      identifier_type: identifier,
    })
    return item ? item.value : null
  }
}

function mapAnswer({ title, key } = {}) {
  return [
    {
      label: title,
      value: row => {
        if (!row.person) {
          return null
        }

        return some(get(row, 'person.assessment_answers'), { key })
      },
    },
    {
      label: [
        'moves::download.assessment_answer.label',
        {
          question: title,
        },
      ],
      value: row => {
        const personAnswers = get(row, 'person.assessment_answers', [])
          .filter(referenceDataHelpers.filterExpired)
          .filter(item => item.key === key)
          .map(item => {
            if (item.nomis_alert_description) {
              return `${item.nomis_alert_description}: ${item.comments}`
            }

            return item.comments
          })

        return personAnswers.length ? personAnswers.join('\n\n') : null
      },
    },
  ]
}

function translateField(field) {
  const label = Array.isArray(field.label)
    ? i18n.t(...field.label)
    : i18n.t(field.label)

  return {
    ...field,
    label,
  }
}

function stripTags(field) {
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi
  const label = field.label.replace(tags, '').replace(/\s+/gi, ' ')

  return {
    ...field,
    label,
  }
}

const move = [
  {
    label: 'moves::download.status.label',
    value: 'status',
  },
  {
    label: 'moves::download.reference.label',
    value: 'reference',
  },
  {
    label: 'moves::download.move_type.label',
    value: 'move_type',
  },
  {
    label: 'moves::download.created_at.label',
    value: 'created_at',
  },
  {
    label: 'moves::download.updated_at.label',
    value: 'updated_at',
  },
  {
    label: 'moves::download.from_location.label',
    value: 'from_location.title',
  },
  {
    label: 'moves::download.from_location_code.label',
    value: 'from_location.nomis_agency_id',
  },
  {
    label: 'moves::download.to_location.label',
    value: 'to_location.title',
  },
  {
    label: 'moves::download.to_location_code.label',
    value: 'to_location.nomis_agency_id',
  },
  {
    label: 'moves::download.additional_information.label',
    value: 'additional_information',
  },
  {
    label: 'fields::date_custom.label',
    value: 'date',
  },
]

const person = [
  {
    label: 'fields::police_national_computer.label',
    value: getIdentifier('police_national_computer'),
  },
  {
    label: 'fields::prison_number.label',
    value: getIdentifier('prison_number'),
  },
  {
    label: 'fields::last_name.label',
    value: 'person.last_name',
  },
  {
    label: 'fields::first_names.label',
    value: 'person.first_names',
  },
  {
    label: 'fields::date_of_birth.label',
    value: 'person.date_of_birth',
  },
  {
    label: 'fields::gender.label',
    value: 'person.gender.title',
  },
  {
    label: 'fields::ethnicity.label',
    value: 'person.ethnicity.title',
  },
  {
    label: 'moves::download.ethnicity_code.label',
    value: 'person.ethnicity.key',
  },
]

const documents = [
  {
    label: 'moves::download.documents.label',
    value: row => {
      const documents = row.documents || []
      return documents.length
    },
  },
]

module.exports = function movesToCSV(moves) {
  return referenceDataService.getAssessmentQuestions().then(questions => {
    const assessmentAnswers = questions.map(mapAnswer)
    const fields = flatten([
      ...move,
      ...person,
      ...assessmentAnswers,
      ...documents,
    ])
      .map(translateField)
      .map(stripTags)

    return json2csv.parse(moves, {
      fields,
    })
  })
}
