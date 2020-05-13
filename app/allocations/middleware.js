const { format } = require('date-fns')
const { mapValues } = require('lodash')
const queryString = require('query-string')

const {
  dateFormat,
  getDateFromParams,
  getPeriod,
} = require('../../common/helpers/date-utils')
const presenters = require('../../common/presenters')
const allocationService = require('../../common/services/allocation')
const singleRequestService = require('../../common/services/single-request')

// TODO: refactor this to be common with the /moves pagination.
//  It differs only in the output of the url
function setPagination(req, res, next) {
  const { period, view } = req.params
  const query = req.query
  const today = format(new Date(), dateFormat)
  const baseDate = getDateFromParams(req)
  const interval = period === 'week' ? 7 : 1

  const previousPeriod = getPeriod(baseDate, -interval)
  const nextPeriod = getPeriod(baseDate, interval)
  const viewInUrl = view ? `${view}` : ''

  const urlPeriods = {
    todayUrl: today,
    nextUrl: nextPeriod,
    prevUrl: previousPeriod,
  }

  res.locals.pagination = mapValues(urlPeriods, urlPeriod => {
    return queryString.stringifyUrl({
      url: `${req.baseUrl}/${period}/${urlPeriod}/${viewInUrl}`,
      query,
    })
  })
  next()
}
async function setAllocationsSummary(req, res, next) {
  const { dateRange } = res.locals
  const allocationsCount = await allocationService.getCount({ dateRange })
  res.locals.allocationsSummary = [
    {
      active: false,
      label: req.t('allocations::dashboard.labels.allocations'),
      href: `/allocations/week/${getDateFromParams(req)}/outgoing`,
      value: allocationsCount,
    },
  ]
  next()
}
async function setSingleRequestsSummary(req, res, next) {
  const { dateRange } = res.locals
  const singleRequests = await singleRequestService.getAll({
    status: 'approved',
    createdAtDate: dateRange,
  })
  const pendingSingleRequests = await singleRequestService.getAll({
    status: 'pending',
    createdAtDate: dateRange,
  })
  res.locals.singleRequestsSummary = [
    {
      active: false,
      label: req.t('allocations::dashboard.labels.single_requests'),
      href: `/moves/week/${getDateFromParams(req)}/approved`,
      value: singleRequests.length,
    },
    {
      active: false,
      label: req.t('allocations::dashboard.labels.single_requests.pending'),
      href: `/moves/week/${getDateFromParams(req)}/pending`,
      value: pendingSingleRequests.length,
    },
  ]
  next()
}
async function setAllocationsByDateAndFilter(req, res, next) {
  const additionalFilters = queryString.parse(req._parsedOriginalUrl.query, {
    parseBooleans: true,
  })
  const { dateRange } = res.locals
  res.locals.allocations = await allocationService.getByStatus({
    dateRange,
    additionalFilters,
  })
  next()
}
async function setAllocationTypeNavigation(req, res, next) {
  const { dateRange } = res.locals
  try {
    const count = await allocationService.getCount({ dateRange })
    res.locals.allocationTypeNavigation = [
      {
        label: 'allocations::total',
        filter: null,
        value: count,
        active: false,
      },
    ].map(presenters.moveTypesToFilterComponent)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setPagination,
  setAllocationsSummary,
  setAllocationsByDateAndFilter,
  setAllocationTypeNavigation,
  setSingleRequestsSummary,
}
