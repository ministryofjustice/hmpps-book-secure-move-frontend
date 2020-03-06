const { filter } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function personToCardComponent({
  gender = {},
  fullname = '',
  image_url: imageUrl,
  date_of_birth: dateOfBirth,
}) {
  const meta = {}

  const dateOfBirthLabel = i18n.t('age', {
    context: 'with_date_of_birth',
    age: filters.calculateAge(dateOfBirth),
    date_of_birth: filters.formatDate(dateOfBirth),
  })
  const metaItems = [
    {
      label: i18n.t('fields::date_of_birth.label'),
      text: dateOfBirth ? dateOfBirthLabel : '',
    },
    {
      label: i18n.t('fields::gender.label'),
      text: gender.title,
    },
  ]

  meta.items = filter(metaItems, 'text')

  return {
    meta,
    image_path: imageUrl,
    title: {
      text: fullname.toUpperCase(),
    },
  }
}

module.exports = personToCardComponent
