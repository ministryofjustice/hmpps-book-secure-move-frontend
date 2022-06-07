const { get, omit } = require('lodash')
const querystring = require('qs')

const i18n = require('../../../config/i18n').default

function setfilterAllocations(items = []) {
  return async function buildFilter(req, res, next) {
    const promises = items.map(item =>
      req.services.allocation
        .getByDateAndLocation({
          ...req.body.allocations,
          isAggregation: true,
          status: item.status,
        })
        .then(value => {
          const query = querystring.stringify({
            ...omit(req.query, 'page'),
            status: item.status,
          })

          return {
            value,
            label: i18n.t(item.label, { count: value }).toLowerCase(),
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
