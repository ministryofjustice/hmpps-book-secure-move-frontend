const updateSteps = require('../../../app/move/app/edit/steps')
const presenters = require('../../presenters')

const getAssessments = require('./get-assessments')
const getCanCancelMove = require('./get-can-cancel-move')
const getCourtHearings = require('./get-court-hearings')
const getMessage = require('./get-message')
const getMessageBanner = require('./get-message-banner')
const getPerDetails = require('./get-per-details')
const getTabsUrls = require('./get-tabs-urls')
const getTagLists = require('./get-tag-lists')
const getUpdateLinks = require('./get-update-links')
const getUpdateUrls = require('./get-update-urls')

// TODO: pass updateSteps in so {updateSteps} = {}
// or maybe not, if view controller does this instead
function getLocals(req) {
  const { move, canAccess } = req
  const userPermissions = req.session?.user?.permissions
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
  // move, canAccess, updateSteps
  const updateUrls = getUpdateUrls(move, canAccess, updateSteps)
  const updateLinks = getUpdateLinks(move, canAccess, updateSteps)
  const moveSummary = presenters.moveToMetaListComponent(
    move,
    canAccess,
    updateSteps,
    false
  )
  // move, userPermissions
  const canCancelMove = getCanCancelMove(move, userPermissions)

  const urls = {
    tabs: tabsUrls,
    update: updateUrls,
  }

  const locals = {
    move,
    additionalInfoSummary,
    ...assessments,
    canCancelMove,
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
