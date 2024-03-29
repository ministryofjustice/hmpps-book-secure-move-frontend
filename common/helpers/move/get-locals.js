const { mapValues } = require('lodash')

const presenters = require('../../presenters')

const getAssessments = require('./get-assessments')
const getCourtHearings = require('./get-court-hearings')
const getMessage = require('./get-message')
const getMessageBanner = require('./get-message-banner')
const getMoveSummary = require('./get-move-summary')
const getPerDetails = require('./get-per-details')
const getTabsUrls = require('./get-tabs-urls')
const getTagLists = require('./get-tag-lists')
const getUpdateUrls = require('./get-update-urls')
const hasOvernightLodge = require('./has-overnight-lodge')
const mapUpdateLink = require('./map-update-link')

function getLocals(req) {
  const { move, canAccess } = req
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
  // move, canAccess
  const messageBanner = getMessageBanner(move, canAccess)
  const updateUrls = getUpdateUrls(move, canAccess)
  // move
  const additionalInfoSummary =
    presenters.moveToAdditionalInfoListComponent(move)
  const courtHearings = getCourtHearings(move)
  const message = getMessage(move)
  const tagLists = getTagLists(move)
  const assessments = getAssessments(move)
  const tabsUrls = getTabsUrls(move)
  const perDetails = getPerDetails(move)
  const moveSummary = getMoveSummary(move, {
    updateUrls,
  })
  const isLodging = hasOvernightLodge(move)

  const updateLinks = mapValues(updateUrls, mapUpdateLink)

  const urls = {
    tabs: tabsUrls,
    update: updateUrls,
  }

  const locals = {
    move,
    additionalInfoSummary,
    ...assessments,
    courtHearings,
    ...message,
    messageBanner,
    ...moveSummary,
    ...perDetails,
    personalDetailsSummary,
    ...tagLists,
    updateLinks,
    urls,
    isLodging,
  }

  return locals
}

module.exports = getLocals
