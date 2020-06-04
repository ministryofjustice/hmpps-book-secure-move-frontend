const { get, camelCase } = require('lodash')
const querystring = require('qs')

const moveService = require('../../../common/services/move')
const i18n = require('../../../config/i18n')

function setfilterMoves(items = [], bodyKey) {
  return async function buildFilter(req, res, next) {
    const promises = items.map(item =>
      moveService
        .getActive({
          ...get(req, `body.${bodyKey}`, {}),
          isAggregation: true,
        })
        .then(value => {
          const query = querystring.stringify(req.query)

          return {
            value,
            label: i18n.t(item.label, { count: value }).toLowerCase(),
            href: `${item.href || req.baseUrl + req.path}?${query}`,
          }
        })
    )

    try {
      const filter = await Promise.all(promises)
      req.filter = filter
      req[camelCase('filter_' + bodyKey)] = filter

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setfilterMoves
