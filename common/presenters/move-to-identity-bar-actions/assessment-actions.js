const { isEmpty, kebabCase } = require('lodash')

const i18n = require('../../../config/i18n')
const componentService = require('../../services/component')

function assessmentActions(move = {}, { canAccess } = {}) {
  const actions = []

  if (!move.profile) {
    return actions
  }

  const assessmentType =
    move.profile.requires_youth_risk_assessment &&
    move.profile.youth_risk_assessment?.status !== 'confirmed'
      ? 'youth_risk_assessment'
      : 'person_escort_record'
  const assessment = move.profile[assessmentType] || {}
  const baseUrl = `/move/${move.id}/${kebabCase(assessmentType)}`
  const context = assessmentType

  if (
    ['requested', 'booked'].includes(move.status) &&
    canAccess(`${context}:create`)
  ) {
    if (isEmpty(assessment)) {
      actions.push({
        html: componentService.getComponent('govukButton', {
          text: i18n.t('actions::start_assessment', { context }),
          preventDoubleClick: true,
          href: `${baseUrl}/new?returnUrl=${encodeURIComponent(baseUrl)}`,
        }),
      })

      return actions
    }

    if (
      assessment.status !== 'completed' &&
      assessment.status !== 'confirmed' &&
      !assessment.handover_occurred_at
    ) {
      actions.push({
        html: componentService.getComponent('govukButton', {
          text: i18n.t('actions::continue_assessment', { context }),
          preventDoubleClick: true,
          href: baseUrl,
        }),
      })

      return actions
    }
  }

  if (
    assessment.status === 'completed' &&
    move.status !== 'cancelled' &&
    canAccess(`${context}:confirm`)
  ) {
    actions.push({
      html: componentService.getComponent('govukButton', {
        text: i18n.t('actions::provide_confirmation', { context }),
        preventDoubleClick: true,
        href: `${baseUrl}/confirm`,
      }),
    })
  }

  if (assessmentType === 'person_escort_record') {
    if (
      assessment.status === 'completed' ||
      assessment.status === 'confirmed' ||
      assessment.handover_occurred_at
    ) {
      if (canAccess(`${context}:view`)) {
        actions.push({
          html: componentService.getComponent('govukButton', {
            text: i18n.t('actions::view_assessment', { context }),
            classes: 'govuk-button--secondary',
            preventDoubleClick: true,
            href: baseUrl,
          }),
        })
      }
    }
  }

  return actions
}

module.exports = assessmentActions
