const { mapValues } = require('lodash')

const { FEATURE_FLAGS } = require('../../../config')
const presenters = require('../../presenters')

const getAssessments = require('./get-assessments')
const getCourtHearings = require('./get-court-hearings')
const getMessage = require('./get-message')
const getMessageBanner = require('./get-message-banner')
const getPerDetails = require('./get-per-details')
const getTabsUrls = require('./get-tabs-urls')
const getTagLists = require('./get-tag-lists')
const getUpdateUrls = require('./get-update-urls')
const mapUpdateLink = require('./map-update-link')

function getLocals(req) {
  const { move, canAccess, hidePreviewOptInBanner } = req
  const profile = move.profile || {}
  const { person } = profile

  // person
  // NB. category for move is actually on the move's profile
  // since it's a snapshot rather than the current live value
  // Merging the category into the person for now but could mix in
  // during transformations or pass profile as extra param to presenter
  const personWithProfileCategory = person
    ? {
        ...person,
        category: profile.category,
      }
    : undefined
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    personWithProfileCategory
  )
  // move
  const additionalInfoSummary =
    presenters.moveToAdditionalInfoListComponent(move)
  const courtHearings = getCourtHearings(move)
  const message = getMessage(move)
  const tagLists = getTagLists(move)
  const assessments = getAssessments(move)
  const tabsUrls = getTabsUrls(move)
  const perDetails = getPerDetails(move)
  // move, canAccess
  const messageBanner = getMessageBanner(move, canAccess)
  const updateUrls = getUpdateUrls(move, canAccess)

  const updateLinks = mapValues(updateUrls, mapUpdateLink)
  const moveSummary = presenters.moveToMetaListComponent(move, {
    showPerson: false,
    updateUrls,
  })

  const urls = {
    tabs: tabsUrls,
    update: updateUrls,
  }

  const locals = {
    move,
    hidePreviewOptInBanner:
      !FEATURE_FLAGS.MOVE_PREVIEW || hidePreviewOptInBanner,
    additionalInfoSummary,
    ...assessments,
    courtHearings,
    ...message,
    messageBanner,
    moveSummary,
    ...perDetails,
    personalDetailsSummary,
    ...tagLists,
    updateLinks,
    urls,
  }

  return locals
}

module.exports = getLocals
