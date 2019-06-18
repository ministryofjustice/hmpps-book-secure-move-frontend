const { sortBy } = require('lodash')

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

function _getTagClass (category) {
  switch (category) {
    case 'risk':
      return 'app-tag--destructive'
    case 'court':
      return 'app-tag--inactive'
    default:
      return ''
  }
}

function _getTagSortOrder (category) {
  switch (category) {
    case 'risk':
      return 1
    case 'health':
      return 2
    case 'court':
      return 3
    default:
      return 4
  }
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
  const tags = person.assessment_answers.map((answer) => {
    return {
      href: `/moves/${id}#${answer.key}`,
      text: answer.title,
      classes: _getTagClass(answer.category),
      sortOrder: _getTagSortOrder(answer.category),
    }
  })

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
      items: sortBy(tags, 'sortOrder'),
    },
  }
}
