const { omitBy, isUndefined } = require('lodash')
const querystring = require('qs')

const singleRequestService = require('../../../common/services/single-request')
const i18n = require('../../../config/i18n')

function setfilterSingleRequests(items = []) {
  return async function buildFilter(req, res, next) {
    const requested = req?.body?.requested || {}
    const requestedStatus = requested.status
    const promises = items.map(item => {
      const { status, label, href } = item

      return singleRequestService
        .getAll(
          omitBy(
            {
              ...requested,
              isAggregation: true,
              status,
            },
            isUndefined
          )
        )
        .then(value => {
          const query = querystring.stringify({
            ...req.query,
            status,
          })

          return {
            value,
            label: i18n.t(label).toLowerCase(),
            active: status === requestedStatus,
            href: `${href || req.baseUrl + req.path}?${query}`,
          }
        })
    })

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
