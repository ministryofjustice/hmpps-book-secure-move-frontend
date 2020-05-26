const { get } = require('lodash')
const querystring = require('qs')

const allocationService = require('../../../common/services/allocation')
const i18n = require('../../../config/i18n')

function setfilterAllocations(items = []) {
  return async function buildFilter(req, res, next) {
    const promises = items.map(item =>
      allocationService
        .getActiveAllocations({
          ...req.body.allocations,
          isAggregation: true,
          status: item.status,
        })
        .then(value => {
          const query = querystring.stringify({
            ...req.query,
            status: item.status,
          })

          return {
            value,
            label: i18n.t(item.label).toLowerCase(),
            active: item.status === get(req, 'body.allocations.status'),
            href: `${item.href || req.baseUrl + req.path}?${query}`,
          }
        })
    )

    try {
      const filter = await Promise.all(promises)
      req.filter = filter
      req.filterAllocations = filter

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setfilterAllocations
