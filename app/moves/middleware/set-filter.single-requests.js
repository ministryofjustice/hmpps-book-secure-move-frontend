const { omit, omitBy, isUndefined } = require('lodash')
const querystring = require('qs')

const i18n = require('../../../config/i18n').default

const getItemFilterHref = (req, status, href) => {
  href = href || `${req.baseUrl}${req.path}`
  const query = querystring.stringify({
    ...omit(req.query, 'page'),
    status,
  })

  return `${href}?${query}`
}

const getItemFilterPromise = (item, req, requested) => {
  const { status, label } = item
  const href = getItemFilterHref(req, status, item.href)
  const { dateRangeType, surplusDateRangeType } = getDateRangeTypeKeys(status)
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
  const singleRequestService = req.services.singleRequest

  return singleRequestService.getAll(itemRequested).then(value => ({
    value,
    label: i18n.t(label).toLowerCase(),
    active: status === requested.status,
    href,
  }))
}

const getDateRangeTypeKeys = status => {
  let dateRangeType = 'createdAtDate'
  let surplusDateRangeType = 'moveDate'

  if (status === 'approved') {
    ;[dateRangeType, surplusDateRangeType] = [
      surplusDateRangeType,
      dateRangeType,
    ]
  }

  return { dateRangeType, surplusDateRangeType }
}

function setfilterSingleRequests(items = []) {
  return async function buildFilter(req, res, next) {
    const requested = req?.body?.requested || {}
    const promises = items.map(item =>
      getItemFilterPromise(item, req, requested)
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
