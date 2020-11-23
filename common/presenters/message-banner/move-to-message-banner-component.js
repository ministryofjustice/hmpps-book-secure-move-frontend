const { isEmpty, kebabCase } = require('lodash')

const assessmentToConfirmedBanner = require('./assessment-to-confirmed-banner')
const assessmentToStartBanner = require('./assessment-to-start-banner')
const assessmentToUnconfirmedBanner = require('./assessment-to-unconfirmed-banner')

function moveToMessageBannerComponent({ move = {}, moveUrl, canAccess } = {}) {
  if (move.status === 'proposed' || !move.profile) {
    return undefined
  }

  const assessmentType = 'person_escort_record'
  const assessment = move.profile[assessmentType]
  const baseUrl = `${moveUrl}/${kebabCase(assessmentType)}`
  const context = assessmentType

  if (['requested', 'booked'].includes(move.status) && isEmpty(assessment)) {
    return assessmentToStartBanner({ baseUrl, canAccess, context })
  }

  if (assessment.status === 'confirmed') {
    return assessmentToConfirmedBanner({ assessment, baseUrl, context })
  }

  if (assessment.status !== 'confirmed') {
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
