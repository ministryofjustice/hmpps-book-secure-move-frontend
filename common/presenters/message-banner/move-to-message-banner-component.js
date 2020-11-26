const { isEmpty, kebabCase } = require('lodash')

const confirmedAssessmentBanner = require('./move-to-confirmed-assessment-banner')
const startAssessmentBanner = require('./move-to-start-assessment-banner')
const unconfirmedAssessmentBanner = require('./move-to-unconfirmed-assessment-banner')

function moveToMessageBannerComponent({ move, moveUrl, canAccess }) {
  if (['proposed'].includes(move.status) || !move.profile) {
    return undefined
  }

  const isYouthMove = [
    'secure_training_centre',
    'secure_childrens_home',
  ].includes(move.from_location.location_type)
  const assessmentType =
    isYouthMove && move.profile?.youth_risk_assessment?.status !== 'confirmed'
      ? 'youth_risk_assessment'
      : 'person_escort_record'
  const assessment = move.profile[assessmentType]
  const baseUrl = `${moveUrl}/${kebabCase(assessmentType)}`
  const context = assessmentType

  if (['requested', 'booked'].includes(move.status) && isEmpty(assessment)) {
    return startAssessmentBanner({ baseUrl, canAccess, context })
  }

  if (assessment.status === 'confirmed') {
    return confirmedAssessmentBanner({ move, baseUrl, context })
  }

  if (assessment.status !== 'confirmed') {
    return unconfirmedAssessmentBanner({ move, baseUrl, canAccess, context })
  }

  return undefined
}

module.exports = moveToMessageBannerComponent
