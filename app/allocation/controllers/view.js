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
    dashboardUrl: '/allocations',
    /* eslint-disable indent */
    messageTitle: bannerStatuses.includes(allocation.status)
      ? req.t(`allocations::statuses.${allocation.status}`)
      : undefined,
    /* eslint-enable indent */
    messageContent: req.t('allocations::statuses.description'),
    unassignedMoveId: movesWithoutPerson.length
      ? movesWithoutPerson[0].id
      : undefined,
    allocationDetails: presenters.allocationToMetaListComponent(allocation),
    allocationSummary: presenters.allocationToSummaryListComponent(allocation),
    allocationPeople: {
      emptySlots: movesWithoutPerson.length,
      filledSlots: moves
        .filter(move => move.person)
        .map(move => ({
          id: move.id,
          fullname: move.person.fullname,
          card: moveToCardComponent(move),
        })),
    },
  }
  res.render('allocation/views/view', locals)
}
