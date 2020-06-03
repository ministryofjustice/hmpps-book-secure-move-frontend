const { MOUNTPATH: allocationsUrl } = require('../allocations/constants')
const {
  FILTERS: movesFilters,
  MOUNTPATH: movesUrl,
} = require('../moves/constants')

const FILTERS = {
  allocations: [
    {
      href: allocationsUrl,
      label: 'dashboard::sections.allocations.summary.total',
      status: '',
    },
  ],
  requested: movesFilters.requested.map(item => {
    return {
      ...item,
      href: `${movesUrl}/requested`,
    }
  }),
}

module.exports = {
  FILTERS,
}
