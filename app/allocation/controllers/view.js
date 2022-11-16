const { sortBy } = require('lodash')

const {
  canEditAssessment,
} = require('../../../common/helpers/move/can-edit-assessment')
const canEditMove = require('../../../common/helpers/move/can-edit-move')
const { isPerLocked } = require('../../../common/helpers/move/is-per-locked')
const presenters = require('../../../common/presenters')

function viewAllocation(req, res) {
  const { allocation, canAccess } = req
  const { moves, status, totalSlots, from_location: fromLocation } = allocation
  const bannerStatuses = ['cancelled']
  const movesWithoutProfile = moves.filter(move => !move.profile)
  const movesWithProfile = moves.filter(move => move.profile)
  const moveToCardComponent = presenters.moveToCardComponent({
    showStatus: false,
    locationType: fromLocation.location_type,
  })

  const removeUnassignedMoves = move => {
    return !(canAccess('allocation:person:assign') && !move.profile)
  }

  const removeMoveLink = move => {
    if (move.profile || !canAccess('allocation:cancel') || moves.length === 1) {
      return
    }

    return `/allocation/${allocation.id}/${move.id}/remove`
  }

  const locals = {
    allocation,
    // TODO: Find way to store the actual URL they came from: See similar solution within moves app
    dashboardUrl: '/allocations',
    criteria: presenters.allocationToSummaryListComponent(allocation),
    summary: presenters.allocationToMetaListComponent(allocation),
    messageTitle: bannerStatuses.includes(status)
      ? req.t(`statuses::${status}`, { context: 'allocation' })
      : undefined,
    messageContent: req.t('statuses::description_allocation', {
      context: allocation.cancellation_reason,
      comment: allocation.cancellation_reason_comment,
    }),
    totalCount: totalSlots,
    remainingCount: movesWithoutProfile.length,
    addedCount: movesWithProfile.length,
    moves: sortBy(
      moves.filter(removeUnassignedMoves),
      'profile.person._fullname'
    )
      .reverse()
      .map(move => {
        move._canEdit = canEditMove(move, canAccess)
        move._isPerLocked = isPerLocked(move)
        move._canEditPer = canEditAssessment(move, canAccess)
        return move
      })
      .map(move => ({
        id: move.id,
        profile: move.profile,
        removeMoveHref: removeMoveLink(move),
        card: moveToCardComponent(move),
      })),
  }

  res.render('allocation/views/view', locals)
}

module.exports = viewAllocation
