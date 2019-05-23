const filters = require('../../config/nunjucks/filters')

function _removeEmpty (items, keys) {
  return items.filter((item) => {
    let include = false

    keys.forEach((k) => {
      include = item[k]
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
      text: person.gender,
    },
    {
      label: 'Ethnicity',
      hideLabel: true,
      text: person.ethnicity,
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
