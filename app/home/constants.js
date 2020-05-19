const { MOUNTPATH: allocationsUrl } = require('../allocations/constants')
const {
  FILTERS: movesFilters,
  MOUNTPATH: movesUrl,
} = require('../moves/constants')

const FILTERS = {
  requested: movesFilters.requested.map(item => {
    return {
      ...item,
      href: `${movesUrl}/requested`,
    }
  }),
  allocations: [
    {
      label: 'dashboard::sections.allocations.summary.total',
      status: '',
      href: allocationsUrl,
    },
  ],
}

module.exports = {
  FILTERS,
}
