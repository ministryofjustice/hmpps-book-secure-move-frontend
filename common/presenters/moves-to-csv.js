const json2csv = require('json2csv')
const { find, flatten, some } = require('lodash')

const referenceDataServce = require('../services/reference-data')

function _getIdentifier (identifier) {
  return function (row) {
    const item = find(row.person.identifiers, {
      identifier_type: identifier,
    })
    return item ? item.value : null
  }
}

function _mapAnswer (question) {
  const label = question.title
  const key = question.key
  return [
    {
      label,
      value: (row) => some(row.person.assessment_answers, { key }),
    },
    {
      label: `${label} details`,
      value: (row) => {
        const answer = find(row.person.assessment_answers, { key })
        return answer ? answer.comments : null
      },
    },
  ]
}

const move = [
  {
    label: 'Request reference',
    value: 'reference',
  },
  {
    label: 'From location name',
    value: 'from_location.title',
  },
  {
    label: 'From location code',
    value: 'from_location.location_code',
  },
  {
    label: 'To location name',
    value: 'to_location.title',
  },
  {
    label: 'To location code',
    value: 'to_location.location_code',
  },
  {
    label: 'Move date',
    value: 'date',
  },
  {
    label: 'Time due',
    value: 'time_due',
  },
]
const person = [
  {
    label: 'Athena custody number',
    value: _getIdentifier('athena_reference'),
  },
  {
    label: 'Prison number',
    value: _getIdentifier('prison_number'),
  },
  {
    label: 'Last name',
    value: 'person.last_name',
  },
  {
    label: 'First name(s)',
    value: 'person.first_names',
  },
  {
    label: 'Date of birth',
    value: 'person.date_of_birth',
  },
  {
    label: 'Gender',
    value: 'person.gender.title',
  },
  {
    label: 'Ethnicity',
    value: 'person.ethnicity.title',
  },
  {
    label: 'Ethnicity code',
    value: 'person.ethnicity.key',
  },
]

module.exports = function movesToCSV (moves) {
  return referenceDataServce.getAssessmentQuestions()
    .then((questions) => {
      const assessmentAnswers = questions.map(_mapAnswer)
      const fields = flatten([
        ...move,
        ...person,
        ...assessmentAnswers,
      ])

      return json2csv.parse(moves, {
        fields,
      })
    })
}
