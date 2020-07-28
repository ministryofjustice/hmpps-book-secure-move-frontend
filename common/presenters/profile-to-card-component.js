const { filter } = require('lodash')

const { FEATURE_FLAGS } = require('../../config')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const assessmentToTagList = require('./assessment-to-tag-list')
const frameworkFlagsToTagList = require('./framework-flags-to-tag-list')

function profileToCardComponent({
  showImage = true,
  showMeta = true,
  showTags = true,
} = {}) {
  return function item(profile) {
    const {
      assessment_answers: assessmentAnswers,
      href,
      person = {},
      person_escort_record: personEscortRecord,
    } = profile || {}
    const {
      id,
      gender,
      fullname,
      image_url: imageUrl,
      date_of_birth: dateOfBirth,
    } = person
    const card = {
      href,
      title: {
        text: fullname ? fullname.toUpperCase() : i18n.t('awaiting_person'),
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
      // TODO: Remove feature flag condition once PER is enabled everywhere
      if (FEATURE_FLAGS.PERSON_ESCORT_RECORD) {
        const { flags, status } = personEscortRecord || {}
        const isComplete =
          personEscortRecord && !['not_started', 'in_progress'].includes(status)

        if (isComplete) {
          card.tags = {
            items: frameworkFlagsToTagList(flags, href),
          }
        } else {
          card.insetText = {
            classes: 'govuk-inset-text--compact',
            text: i18n.t('person-escort-record::flags.incomplete'),
          }
        }
      } else {
        card.tags = {
          items: assessmentToTagList(assessmentAnswers, href),
        }
      }
    }

    if (showImage) {
      card.image_path = imageUrl
      card.image_alt = fullname
        ? fullname.toUpperCase()
        : i18n.t('awaiting_person')
    }

    return card
  }
}

module.exports = profileToCardComponent
