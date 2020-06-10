const { get, sortBy } = require('lodash')

const permissions = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')

module.exports = function view(req, res) {
  const { allocation } = res.locals
  const { moves, status } = allocation
  const userPermissions = get(req.session, 'user.permissions')
  const bannerStatuses = ['cancelled']
  const movesWithoutPerson = moves.filter(move => !move.person)
  const movesWithPerson = moves.filter(move => move.person)
  const moveToCardComponent = presenters.moveToCardComponent({
    showStatus: false,
  })

  const removeUnassignedMoves = move => {
    return !(
      permissions.check('allocation:person:assign', userPermissions) &&
      !move.person
    )
  }

  const locals = {
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
    unassignedMoveId: movesWithoutPerson.length
      ? movesWithoutPerson[0].id
      : undefined,
    totalCount: moves.length,
    remainingCount: movesWithoutPerson.length,
    addedCount: movesWithPerson.length,
    moves: sortBy(moves.filter(removeUnassignedMoves), 'person.fullname')
      .reverse()
      .map(move => ({
        id: move.id,
        person: move.person,
        card: moveToCardComponent(move),
      })),
  }

  res.render('allocation/views/view', locals)
}
