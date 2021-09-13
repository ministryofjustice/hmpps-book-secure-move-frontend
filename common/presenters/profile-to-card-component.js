const { filter, isEmpty } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const frameworkFlagsToTagList = require('./framework-flags-to-tag-list')

function profileToCardComponent({
  locationType,
  meta = [],
  showImage = true,
  showMeta = true,
  showTags = true,
} = {}) {
  return function item({ profile, href, reference } = {}) {
    const { person = {}, person_escort_record: personEscortRecord } =
      profile || {}

    const {
      id,
      gender,
      _fullname: fullname,
      _image_url: imageUrl,
      date_of_birth: dateOfBirth,
    } = person

    const title =
      reference && fullname
        ? `${fullname} (${reference})`
        : fullname || i18n.t('awaiting_person')

    const card = {
      href,
      title: { text: title },
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

      if (profile?.person && locationType) {
        if (locationType === 'prison') {
          meta.push({
            label: { text: i18n.t('fields::prison_number.label') },
            text:
              profile?.person?.prison_number ||
              i18n.t('fields::prison_number.empty'),
          })
        } else {
          meta.push({
            label: {
              html: i18n.t('fields::police_national_computer.label'),
            },
            text:
              profile?.person?.police_national_computer ||
              i18n.t('fields::police_national_computer.empty'),
          })
        }
      }

      const metaItems = [
        ...meta,
        {
          label: { text: i18n.t('fields::date_of_birth.label') },
          html: dateOfBirth ? dateOfBirthLabel : undefined,
        },
        {
          label: { text: i18n.t('fields::gender.label') },
          text: gender ? gender.title : undefined,
        },
      ]

      card.meta = {
        items: filter(metaItems, item => item.text || item.html),
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
