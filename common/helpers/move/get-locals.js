const updateSteps = require('../../../app/move/steps/update')
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
  const { profile } = move
  const { person } = profile || {}

  const urls = {}
  // person
  const personalDetailsSummary = presenters.personToSummaryListComponent(person)
  // updateSteps, req
  urls.update = getUpdateUrls(updateSteps, req)
  const updateLinks = getUpdateLinks(updateSteps, req)
  // move, updateLinks
  const moveSummary = presenters.moveToMetaListComponent(move, updateLinks)
  // move
  const additionalInfoSummary = presenters.moveToAdditionalInfoListComponent(
    move
  )
  const courtHearings = getCourtHearings(move)
  const message = getMessage(move)
  const tagLists = getTagLists(move)
  const assessments = getAssessments(move)
  urls.tabs = getTabsUrls(move)
  // move, canAccess
  const messageBanner = getMessageBanner(move, canAccess)
  const perDetails = getPerDetails(move, canAccess)
  // move, userPermissions
  const canCancelMove = getCanCancelMove(move, userPermissions)

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
