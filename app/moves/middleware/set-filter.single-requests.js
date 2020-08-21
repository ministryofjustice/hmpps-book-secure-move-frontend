const { get, omitBy, isUndefined } = require('lodash')
const querystring = require('qs')

const singleRequestService = require('../../../common/services/single-request')
const i18n = require('../../../config/i18n')

function setfilterSingleRequests(items = []) {
  return async function buildFilter(req, res, next) {
    const promises = items.map(item =>
      singleRequestService
        .getAll(
          omitBy(
            {
              ...get(req, 'body.requested', {}),
              isAggregation: true,
              status: item.status,
            },
            isUndefined
          )
        )
        .then(value => {
          const query = querystring.stringify({
            ...req.query,
            status: item.status,
          })

          return {
            value,
            label: i18n.t(item.label).toLowerCase(),
            active: item.status === get(req, 'body.requested.status'),
            href: `${item.href || req.baseUrl + req.path}?${query}`,
          }
        })
    )

    try {
      const filter = await Promise.all(promises)
      req.filter = filter
      req.filterSingleRequests = filter

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setfilterSingleRequests
