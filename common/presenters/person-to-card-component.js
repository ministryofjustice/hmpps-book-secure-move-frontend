const { filter } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const assessmentToTagList = require('./assessment-to-tag-list')

function personToCardComponent({
  showImage = true,
  showMeta = true,
  showTags = true,
} = {}) {
  return function item({
    href,
    gender,
    fullname = i18n.t('awaiting_person'),
    image_url: imageUrl,
    date_of_birth: dateOfBirth,
    assessment_answers: assessmentAnswers,
  } = {}) {
    const card = {
      href,
      title: {
        text: fullname.toUpperCase(),
      },
    }

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

      card.meta = {
        items: filter(metaItems, 'text'),
      }
    }

    if (showTags) {
      card.tags = {
        items: assessmentToTagList(assessmentAnswers, href),
      }
    }

    if (showImage) {
      card.image_path = imageUrl
      card.image_alt = fullname.toUpperCase()
    }

    return card
  }
}

module.exports = personToCardComponent
