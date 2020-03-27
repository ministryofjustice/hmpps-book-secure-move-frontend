const { filter } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const assessmentToTagList = require('./assessment-to-tag-list')

function personToCardComponent({ showMeta = true, showTags = true } = {}) {
  return function item({
    href,
    gender,
    fullname = '',
    image_url: imageUrl,
    date_of_birth: dateOfBirth,
    assessment_answers: assessmentAnswers,
  }) {
    const meta = {}
    const tags = {}

    if (showMeta) {
      const dateOfBirthLabel = i18n.t('age', {
        context: 'with_date_of_birth',
        age: filters.calculateAge(dateOfBirth),
        date_of_birth: filters.formatDate(dateOfBirth),
      })
      const metaItems = [
        {
          label: i18n.t('fields::date_of_birth.label'),
          text: dateOfBirth ? dateOfBirthLabel : undefined,
        },
        {
          label: i18n.t('fields::gender.label'),
          text: gender ? gender.title : undefined,
        },
      ]

      meta.items = filter(metaItems, 'text')
    }

    if (showTags) {
      tags.items = assessmentToTagList(assessmentAnswers, href)
    }

    return {
      href,
      meta,
      tags,
      image_path: imageUrl,
      image_alt: fullname.toUpperCase(),
      title: {
        text: fullname.toUpperCase(),
      },
    }
  }
}

module.exports = personToCardComponent
