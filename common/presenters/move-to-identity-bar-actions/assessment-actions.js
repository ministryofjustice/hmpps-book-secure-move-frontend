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

  if (assessment.status === 'confirmed' || assessment.handover_occurred_at) {
    if (canAccess(`${context}:print`)) {
      actions.push({
        html: `<a href="${baseUrl}/print" class="app-icon app-icon--print">
          ${i18n.t('actions::print_assessment', { context })}
        </a>`,
      })
    }

    return actions
  }

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

    if (assessment.status !== 'completed') {
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

  if (assessment.status === 'completed' && canAccess(`${context}:confirm`)) {
    if (canAccess(`${context}:confirm`)) {
      actions.push({
        html: componentService.getComponent('govukButton', {
          text: i18n.t('actions::provide_confirmation', { context }),
          preventDoubleClick: true,
          href: `${baseUrl}/confirm`,
        }),
      })
    }

    if (canAccess(`${context}:print`)) {
      actions.push({
        html: `<a href="${baseUrl}/print" class="app-icon app-icon--print">
          ${i18n.t('actions::print_assessment', { context })}
        </a>`,
      })
    }
  }

  return actions
}

module.exports = assessmentActions
