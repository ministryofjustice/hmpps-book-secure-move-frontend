const { omitBy, isUndefined } = require('lodash')
const querystring = require('qs')

const singleRequestService = require('../../../common/services/single-request')
const i18n = require('../../../config/i18n')

const getItemFilterHref = (req, status, href) => {
  href = href || `${req.baseUrl}${req.path}`
  const query = querystring.stringify({
    ...req.query,
    status,
  })

  return `${href}?${query}`
}

function setfilterSingleRequests(items = []) {
  return async function buildFilter(req, res, next) {
    const requested = req?.body?.requested || {}
    const requestedStatus = requested.status
    const promises = items.map(item => {
      const { status, label } = item
      const href = getItemFilterHref(req, status, item.href)

      let dateRangeType = 'createdAtDate'
      let surplusDateRangeType = 'moveDate'

      if (status === 'approved') {
        ;[dateRangeType, surplusDateRangeType] = [
          surplusDateRangeType,
          dateRangeType,
        ]
      }

      const itemRequested = omitBy(
        {
          ...requested,
          [dateRangeType]: requested.dateRange,
          [surplusDateRangeType]: undefined,
          dateRange: undefined,
          isAggregation: true,
          status,
        },
        isUndefined
      )

      return singleRequestService.getAll(itemRequested).then(value => {
        return {
          value,
          label: i18n.t(label).toLowerCase(),
          active: status === requestedStatus,
          href,
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
