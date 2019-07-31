const assessmentToTagList = require('./assessment-to-tag-list')
const personService = require('../services/person')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function _removeEmpty(items, keys) {
  return items.filter(item => {
    let include = false

    keys.forEach(k => {
      if (item[k]) {
        include = true
      }
    })

    return include
  })
}

module.exports = function moveToCardComponent({ id, reference, person }) {
  const age = `(${i18n.t('age')} ${filters.calculateAge(person.date_of_birth)})`
  const meta = [
    {
      label: i18n.t('fields::date_of_birth.label'),
      html: person.date_of_birth
        ? `${filters.formatDate(person.date_of_birth)} ${age}`
        : '',
    },
    {
      label: i18n.t('fields::gender.label'),
      text: person.gender ? person.gender.title : '',
    },
  ]

  return {
    href: `/move/${id}`,
    title: {
      text: personService.getFullname(person).toUpperCase(),
    },
    caption: {
      text: i18n.t('moves::move_reference', {
        reference,
      }),
    },
    meta: {
      items: _removeEmpty(meta, ['text', 'html']),
    },
    tags: {
      items: assessmentToTagList(person.assessment_answers, `/move/${id}`),
    },
  }
}
