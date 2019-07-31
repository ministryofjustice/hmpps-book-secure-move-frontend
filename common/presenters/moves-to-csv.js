const json2csv = require('json2csv')
const { find, flatten, some } = require('lodash')

const referenceDataServce = require('../services/reference-data')
const i18n = require('../../config/i18n')

function _getIdentifier(identifier) {
  return function(row) {
    const item = find(row.person.identifiers, {
      identifier_type: identifier,
    })
    return item ? item.value : null
  }
}

function _mapAnswer(question) {
  const label = question.title
  const key = question.key
  return [
    {
      label,
      value: row => some(row.person.assessment_answers, { key }),
    },
    {
      label: [
        'moves::download.assessment_answer.label',
        {
          question: label,
        },
      ],
      value: row => {
        const answer = find(row.person.assessment_answers, { key })
        return answer ? answer.comments : null
      },
    },
  ]
}

function _translateField(field) {
  const label = Array.isArray(field.label)
    ? i18n.t(...field.label)
    : i18n.t(field.label)

  return {
    ...field,
    label,
  }
}

const move = [
  {
    label: 'moves::download.reference.label',
    value: 'reference',
  },
  // TODO: update to `created_at` when we have this in the API
  {
    label: 'moves::download.created_at.label',
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
    label: 'fields::date_custom.label',
    value: 'date',
  },
]

const person = [
  {
    label: 'fields::police_national_computer.label',
    value: _getIdentifier('police_national_computer'),
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

module.exports = function movesToCSV(moves) {
  return referenceDataServce.getAssessmentQuestions().then(questions => {
    const assessmentAnswers = questions.map(_mapAnswer)
    const fields = flatten([...move, ...person, ...assessmentAnswers]).map(
      _translateField
    )

    return json2csv.parse(moves, {
      fields,
    })
  })
}
