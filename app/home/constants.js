const {
  FILTERS: allocationsFilters,
  MOUNTPATH: allocationsUrl,
} = require('../allocations/constants')
const {
  FILTERS: movesFilters,
  MOUNTPATH: movesUrl,
} = require('../moves/constants')

const FILTERS = {
  outgoing: movesFilters.outgoing
    .filter(item =>
      ['active', 'incomplete', 'ready_for_transit'].includes(item.status)
    )
    .map(item => {
      return { ...item, href: `${movesUrl}/outgoing` }
    }),
  incoming: movesFilters.incoming
    .filter(item =>
      ['active', 'awaiting_collection', 'in_transit'].includes(item.status)
    )
    .map(item => {
      return { ...item, href: `${movesUrl}/incoming` }
    }),
  requested: movesFilters.requested.map(item => {
    return { ...item, href: `${movesUrl}/requested` }
  }),
  allocations: allocationsFilters.outgoing.map(item => {
    return { ...item, href: `${allocationsUrl}/outgoing` }
  }),
}

module.exports = {
  FILTERS,
}
