const json2csv = require('json2csv')
const { find, flatten, some } = require('lodash')

const referenceDataServce = require('../services/reference-data')
const i18n = require('../../config/i18n')

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
      value: row => some(row.person.assessment_answers, { key }),
    },
    {
      label: i18n.t('moves::download.assessment_answer.label', {
        question: label,
      }),
      value: row => {
        const answer = find(row.person.assessment_answers, { key })
        return answer ? answer.comments : null
      },
    },
  ]
}

function getMoveFields () {
  return [
    {
      label: i18n.t('moves::download.reference.label'),
      value: 'reference',
    },
    // TODO: update to `created_at` when we have this in the API
    {
      label: i18n.t('moves::download.created_at.label'),
      value: 'updated_at',
    },
    {
      label: i18n.t('moves::download.from_location.label'),
      value: 'from_location.title',
    },
    {
      label: i18n.t('moves::download.from_location_code.label'),
      value: 'from_location.nomis_agency_id',
    },
    {
      label: i18n.t('moves::download.to_location.label'),
      value: 'to_location.title',
    },
    {
      label: i18n.t('moves::download.to_location_code.label'),
      value: 'to_location.nomis_agency_id',
    },
    {
      label: i18n.t('fields::date_custom.label'),
      value: 'date',
    },
  ]
}

function getPersonFields () {
  return [
    {
      label: i18n.t('fields::police_national_computer.label'),
      value: _getIdentifier('police_national_computer'),
    },
    {
      label: i18n.t('fields::last_name.label'),
      value: 'person.last_name',
    },
    {
      label: i18n.t('fields::first_names.label'),
      value: 'person.first_names',
    },
    {
      label: i18n.t('fields::date_of_birth.label'),
      value: 'person.date_of_birth',
    },
    {
      label: i18n.t('fields::gender.label'),
      value: 'person.gender.title',
    },
    {
      label: i18n.t('fields::ethnicity.label'),
      value: 'person.ethnicity.title',
    },
    {
      label: i18n.t('moves::download.ethnicity_code.label'),
      value: 'person.ethnicity.key',
    },
  ]
}

module.exports = function movesToCSV (moves) {
  const move = getMoveFields()
  const person = getPersonFields()

  return referenceDataServce.getAssessmentQuestions().then(questions => {
    const assessmentAnswers = questions.map(_mapAnswer)
    const fields = flatten([...move, ...person, ...assessmentAnswers])

    return json2csv.parse(moves, {
      fields,
    })
  })
}
