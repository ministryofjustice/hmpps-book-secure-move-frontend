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
  const { move } = req
  const { profile } = move
  const { person } = profile || {}

  const urls = {
    update: getUpdateUrls(updateSteps, req),
    tabs: getTabsUrls(move),
  }
  const updateLinks = getUpdateLinks(updateSteps, req)
  const personalDetailsSummary = presenters.personToSummaryListComponent(person)
  const additionalInfoSummary = presenters.moveToAdditionalInfoListComponent(
    move
  )
  const moveSummary = presenters.moveToMetaListComponent(move, updateLinks)
  // TODO: pass move instead of req (where possible)
  const message = getMessage(req)
  const messageBanner = getMessageBanner(req)
  const canCancelMove = getCanCancelMove(req)
  const courtHearings = getCourtHearings(req)
  const perDetails = getPerDetails(req)
  const tagLists = getTagLists(req)
  const assessments = getAssessments(req)

  const locals = {
    move,
    ...assessments,
    ...tagLists,
    ...perDetails,
    personalDetailsSummary,
    additionalInfoSummary,
    moveSummary,
    canCancelMove,
    courtHearings,
    ...message,
    messageBanner,
    updateLinks,
    urls,
  }

  return locals
}

module.exports = getLocals
