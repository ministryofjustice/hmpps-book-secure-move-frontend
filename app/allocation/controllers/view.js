const presenters = require('../../../common/presenters')

module.exports = function view(req, res) {
  const { allocation } = res.locals
  const { moves } = allocation
  const locals = {
    dashboardUrl: '/allocations',
    allocationDetails: presenters.allocationToMetaListComponent(allocation),
    allocationSummary: presenters.allocationToSummaryListComponent(allocation),
    allocationPeople: {
      emptySlots: moves.filter(move => !move.person).length,
      filledSlots: moves
        .filter(move => move.person)
        .map(move => {
          const { person } = move
          if (!person.fullname) {
            person.fullname = `${person.first_names} ${person.last_name}`
          }
          return person
        })
        .map(presenters.personToCardComponent()),
    },
  }
  res.render('allocation/views/view', locals)
}
