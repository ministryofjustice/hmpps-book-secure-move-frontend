const presenters = require('../../../common/presenters')

module.exports = function view(req, res) {
  const { allocation } = res.locals
  const { moves, status } = allocation
  const bannerStatuses = ['cancelled']

  const movesWithoutPerson = moves.filter(move => !move.person)
  const movesWithPerson = moves.filter(move => move.person)
  const moveToCardComponent = presenters.moveToCardComponent({
    showStatus: false,
  })

  const locals = {
    dashboardUrl: '/allocations',
    messageTitle: bannerStatuses.includes(status)
      ? req.t(`statuses::${status}`, { context: 'allocation' })
      : undefined,
    messageContent: req.t('statuses::description', {
      context: 'allocation',
    }),
    unassignedMoveId: movesWithoutPerson.length
      ? movesWithoutPerson[0].id
      : undefined,
    allocationDetails: presenters.allocationToMetaListComponent(allocation),
    allocationSummary: presenters.allocationToSummaryListComponent(allocation),
    totalCount: moves.length,
    remainingCount: movesWithoutPerson.length,
    addedCount: movesWithPerson.length,
    moves: moves
      .filter(move => move.person)
      .map(move => ({
        id: move.id,
        fullname: move.person.fullname,
        card: moveToCardComponent(move),
      })),
  }
  res.render('allocation/views/view', locals)
}
