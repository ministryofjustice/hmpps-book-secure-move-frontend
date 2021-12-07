const { isEmpty, kebabCase } = require('lodash')

const assessmentToHandedOverBanner = require('./assessment-to-handed-over-banner')
const assessmentToStartBanner = require('./assessment-to-start-banner')
const assessmentToUnconfirmedBanner = require('./assessment-to-unconfirmed-banner')

function moveToMessageBannerComponent({ move = {}, moveUrl, canAccess } = {}) {
  if (move.status === 'proposed' || !move.profile) {
    return undefined
  }

  const assessmentType =
    move.profile?.person_escort_record ||
    !move.profile?.requires_youth_risk_assessment ||
    move.profile?.youth_risk_assessment?.status === 'confirmed'
      ? 'person_escort_record'
      : 'youth_risk_assessment'
  const assessment = move.profile[assessmentType]
  const baseUrl = `${moveUrl}/${kebabCase(assessmentType)}`
  const context = assessmentType

  if (['requested', 'booked'].includes(move.status) && isEmpty(assessment)) {
    return assessmentToStartBanner({ baseUrl, canAccess, context })
  }

  if (assessment?.status === 'confirmed' && assessment.handover_occurred_at) {
    return assessmentToHandedOverBanner({
      assessment,
      baseUrl,
      canAccess,
      context,
    })
  }

  return assessmentToUnconfirmedBanner({
    assessment,
    baseUrl,
    canAccess,
    context,
  })
}

module.exports = moveToMessageBannerComponent
