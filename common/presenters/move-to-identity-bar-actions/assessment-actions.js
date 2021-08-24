const { isEmpty, kebabCase } = require('lodash')

const i18n = require('../../../config/i18n')
const componentService = require('../../services/component')

function assessmentActions(move = {}, { canAccess } = {}) {
  if (!move.profile) {
    return []
  }

  const assessmentType =
    move.profile.requires_youth_risk_assessment &&
    move.profile.youth_risk_assessment?.status !== 'confirmed'
      ? 'youth_risk_assessment'
      : 'person_escort_record'
  const assessment = move.profile[assessmentType] || {}
  const baseUrl = `/move/${move.id}/${kebabCase(assessmentType)}`
  const context = assessmentType

  if (assessment.status === 'confirmed' || assessment.handover_occurred_at) {
    return []
  }

  if (
    ['requested', 'booked'].includes(move.status) &&
    canAccess(`${context}:create`)
  ) {
    if (isEmpty(assessment)) {
      return [
        {
          html: componentService.getComponent('govukButton', {
            text: i18n.t('actions::start_assessment', { context }),
            preventDoubleClick: true,
            href: `${baseUrl}/new?returnUrl=${encodeURIComponent(baseUrl)}`,
          }),
        },
      ]
    }

    if (assessment.status !== 'completed') {
      return [
        {
          html: componentService.getComponent('govukButton', {
            text: i18n.t('actions::continue_assessment', { context }),
            preventDoubleClick: true,
            href: baseUrl,
          }),
        },
      ]
    }
  }

  if (assessment.status === 'completed' && canAccess(`${context}:confirm`)) {
    return [
      {
        html: componentService.getComponent('govukButton', {
          text: i18n.t('actions::provide_confirmation', { context }),
          preventDoubleClick: true,
          href: `${baseUrl}/confirm`,
        }),
      },
    ]
  }

  return []
}

module.exports = assessmentActions
