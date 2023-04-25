const { isEmpty, kebabCase } = require('lodash')

const i18n = require('../../../config/i18n').default
const componentService = require('../../services/component')

function assessmentActions(move = {}, { canAccess } = {}, featureFlags) {
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
  // There's a typescript function elsewhere that does this - has-overnight-lodge.ts
  const hasLodges =
    move.important_events?.filter(
      event =>
        event.event_type === 'MoveLodgingStart' &&
        event.details.reason === 'overnight_lodging'
    ).length > 0 ||
    move.timeline_events?.filter(
      event => event.event_type === 'MoveOvernightLodge'
    ).length > 0

  if (
    featureFlags.ADD_LODGE_BUTTON &&
    move.status !== 'completed' &&
    move.status !== 'cancelled' &&
    canAccess('move:lodging:create')
  ) {
    actions.push({
      html: componentService.getComponent('govukButton', {
        text: i18n.t('actions::add_item', {
          context: hasLodges ? 'with_items' : '',
          name: 'overnight lodge',
        }),
        href: `/move/${move.id}/lodge`,
        classes: 'govuk-button--primary',
        preventDoubleClick: true,
      }),
    })
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
    move.status !== 'cancelled' &&
    (assessment.status === 'completed' ||
      (assessment.status === 'confirmed' &&
        !assessment.handover_occurred_at)) &&
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
