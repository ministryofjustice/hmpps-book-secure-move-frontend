const assessmentToTagList = require('./assessment-to-tag-list')
const personService = require('../services/person')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function _removeEmpty (items, keys) {
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

module.exports = function moveToCardComponent ({ id, reference, person }) {
  const meta = [
    {
      label: i18n.t('fields::date_of_birth.label'),
      hideLabel: true,
      html: person.date_of_birth
        ? `${filters.formatDate(person.date_of_birth)} (${i18n.t(
          'age'
        )} ${filters.calculateAge(person.date_of_birth)})`
        : '',
    },
    {
      label: i18n.t('fields::gender.label'),
      hideLabel: true,
      text: person.gender ? person.gender.title : '',
    },
    {
      label: i18n.t('fields::ethnicity.label'),
      hideLabel: true,
      text: person.ethnicity ? person.ethnicity.title : '',
    },
  ]

  return {
    href: `/move/${id}`,
    title: {
      text: personService.getFullname(person).toUpperCase(),
    },
    caption: {
      text: reference,
    },
    meta: {
      items: _removeEmpty(meta, ['text', 'html']),
    },
    tags: {
      items: assessmentToTagList(person.assessment_answers, `/move/${id}`),
    },
  }
}
