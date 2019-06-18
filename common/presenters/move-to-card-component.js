const assessmentToTagList = require('./assessment-to-tag-list')
const filters = require('../../config/nunjucks/filters')

function _removeEmpty (items, keys) {
  return items.filter((item) => {
    let include = false

    keys.forEach((k) => {
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
      label: 'Date of birth',
      hideLabel: true,
      html: person.date_of_birth ? `${filters.formatDate(person.date_of_birth)} (Age ${filters.calculateAge(person.date_of_birth)})` : '',
    },
    {
      label: 'Gender',
      hideLabel: true,
      text: person.gender ? person.gender.title : '',
    },
    {
      label: 'Ethnicity',
      hideLabel: true,
      text: person.ethnicity ? person.ethnicity.title : '',
    },
  ]

  return {
    href: `/moves/${id}`,
    title: {
      text: `${person.last_name.toUpperCase()}, ${person.first_names.toUpperCase()}`,
    },
    caption: {
      text: reference,
    },
    meta: {
      items: _removeEmpty(meta, ['text', 'html']),
    },
    tags: {
      items: assessmentToTagList(person.assessment_answers, `/moves/${id}`),
    },
  }
}
