const { filter } = require('lodash')

const assessmentToTagList = require('./assessment-to-tag-list')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function moveToCardComponent({ showMeta = true, showTags = true } = {}) {
  return function item({ id, reference, person = {} }) {
    let meta = {}
    let tags = {}
    const href = `/move/${id}`
    const {
      gender = {},
      fullname = '',
      date_of_birth: dateOfBirth,
      assessment_answers: assessment,
    } = person

    if (showMeta) {
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
    }

    if (showTags) {
      tags.items = assessmentToTagList(assessment, href)
    }

    return {
      href,
      meta,
      tags,
      title: {
        text: fullname.toUpperCase(),
      },
      caption: {
        text: i18n.t('moves::move_reference', {
          reference,
        }),
      },
    }
  }
}

module.exports = moveToCardComponent
