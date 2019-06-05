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

module.exports = function moveToCardComponent ({ id, person }) {
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
      text: id,
    },
    meta: {
      items: _removeEmpty(meta, ['text', 'html']),
    },
  }
}
