const { mountpath: movesUrl } = require('../moves')
const { FILTERS: movesFilters } = require('../moves/constants')

const FILTERS = {
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
