const { isEmpty, kebabCase } = require('lodash')

const { FEATURE_FLAGS } = require('../../../config')

const assessmentToConfirmedBanner = require('./assessment-to-confirmed-banner')
const assessmentToStartBanner = require('./assessment-to-start-banner')
const assessmentToUnconfirmedBanner = require('./assessment-to-unconfirmed-banner')

function moveToMessageBannerComponent({ move = {}, moveUrl, canAccess } = {}) {
  if (move.status === 'proposed' || !move.profile) {
    return undefined
  }

  const assessmentType =
    // TODO: Remove once enabled
    move.profile?.person_escort_record ||
    !move._is_youth_move ||
    move.profile?.youth_risk_assessment?.status === 'confirmed' ||
    !FEATURE_FLAGS.YOUTH_RISK_ASSESSMENT
      ? 'person_escort_record'
      : 'youth_risk_assessment'
  const assessment = move.profile[assessmentType]
  const baseUrl = `${moveUrl}/${kebabCase(assessmentType)}`
  const context = assessmentType

  if (['requested', 'booked'].includes(move.status) && isEmpty(assessment)) {
    return assessmentToStartBanner({ baseUrl, canAccess, context })
  }

  if (assessment?.status === 'confirmed') {
    return assessmentToConfirmedBanner({ assessment, baseUrl, context })
  }

  if (assessment?.status !== 'confirmed') {
    return assessmentToUnconfirmedBanner({
      assessment,
      baseUrl,
      canAccess,
      context,
    })
  }

  return undefined
}

module.exports = moveToMessageBannerComponent
