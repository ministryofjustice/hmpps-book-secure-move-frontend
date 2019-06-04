const { get } = require('lodash')

const { removeEmptyItems } = require('./_utilities')
const filters = require('../../config/nunjucks/filters')

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
      text: get(person, 'gender.title'),
    },
    {
      label: 'Ethnicity',
      hideLabel: true,
      text: get(person, 'ethnicity.title'),
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
      items: removeEmptyItems(meta, ['text', 'html']),
    },
  }
}
