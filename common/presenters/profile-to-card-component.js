const { filter, isEmpty } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const frameworkFlagsToTagList = require('./framework-flags-to-tag-list')

function profileToCardComponent({
  meta = [],
  showImage = true,
  showMeta = true,
  showTags = true,
} = {}) {
  return function item(profile) {
    const {
      href,
      person = {},
      person_escort_record: personEscortRecord,
    } = profile || {}
    const {
      id,
      gender,
      _fullname: fullname,
      _image_url: imageUrl,
      date_of_birth: dateOfBirth,
    } = person
    const card = {
      href,
      title: {
        text: fullname || i18n.t('awaiting_person'),
      },
    }

    if (!id) {
      card.classes = 'app-card--placeholder'
    }

    if (showMeta) {
      const dateOfBirthLabel = i18n.t('age', {
        context: 'with_date_of_birth',
        age: filters.calculateAge(dateOfBirth),
        date_of_birth: filters.formatDate(dateOfBirth),
      })
      const metaItems = [
        ...meta,
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
      const { flags, status } = personEscortRecord || {}
      const isComplete =
        personEscortRecord && !['not_started', 'in_progress'].includes(status)

      if (isComplete) {
        card.tags = [
          {
            items: frameworkFlagsToTagList({
              flags,
              hrefPrefix: href,
              includeLink: true,
            }),
          },
        ]
      } else if (!isEmpty(person)) {
        card.insetText = {
          classes: 'govuk-inset-text--compact',
          text: i18n.t('assessment::incomplete'),
        }
      }
    }

    if (showImage) {
      card.image_path = imageUrl
      card.image_alt = fullname || i18n.t('awaiting_person')
    }

    return card
  }
}

module.exports = profileToCardComponent
