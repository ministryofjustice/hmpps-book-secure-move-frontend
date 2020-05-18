const querystring = require('qs')

const singleRequestService = require('../../../common/services/single-request')
const i18n = require('../../../config/i18n')

function setfilterSingleRequests(items = []) {
  return async function buildFilter(req, res, next) {
    const promises = items.map(item =>
      singleRequestService
        .getAll({
          ...req.body,
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
            active: item.status === req.body.status,
            href: `${item.href || req.baseUrl + req.path}?${query}`,
          }
        })
    )

    try {
      req.filter = await Promise.all(promises)

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setfilterSingleRequests
