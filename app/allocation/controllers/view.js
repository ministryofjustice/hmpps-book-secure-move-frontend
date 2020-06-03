const presenters = require('../../../common/presenters')

module.exports = function view(req, res) {
  const { allocation } = res.locals
  const { moves } = allocation
  const bannerStatuses = ['cancelled']

  const movesWithoutPerson = moves.filter(move => !move.person)
  const moveToCardComponent = presenters.moveToCardComponent({
    showStatus: false,
  })

  const locals = {
    allocationDetails: presenters.allocationToMetaListComponent(allocation),
    allocationPeople: {
      emptySlots: movesWithoutPerson.length,
      filledSlots: moves
        .filter(move => move.person)
        .map(move => ({
          card: moveToCardComponent(move),
          fullname: move.person.fullname,
          id: move.id,
        })),
    },
    allocationSummary: presenters.allocationToSummaryListComponent(allocation),
    dashboardUrl: '/allocations',
    messageContent: req.t('allocations::statuses.description'),
    /* eslint-disable indent */
    messageTitle: bannerStatuses.includes(allocation.status)
      ? req.t(`allocations::statuses.${allocation.status}`)
      : undefined,
    /* eslint-enable indent */
    unassignedMoveId: movesWithoutPerson.length
      ? movesWithoutPerson[0].id
      : undefined,
  }
  res.render('allocation/views/view', locals)
}
