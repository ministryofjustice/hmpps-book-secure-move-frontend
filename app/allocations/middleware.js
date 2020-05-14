const { format } = require('date-fns')
const { cloneDeep, isEqual, mapValues } = require('lodash')
const queryString = require('query-string')

const {
  dateFormat,
  getDateFromParams,
  getPeriod,
} = require('../../common/helpers/date-utils')
const presenters = require('../../common/presenters')
const allocationService = require('../../common/services/allocation')

const allocationTypeNavigationConfig = [
  {
    label: 'allocations::complete',
    filter: { complete_in_full: true },
  },
  {
    label: 'allocations::incomplete',
    filter: { complete_in_full: false },
  },
]

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
  const { dateRange } = req.params
  const value = await allocationService.getCount({ dateRange })
  res.locals.allocationsSummary = [
    {
      active: false,
      label: req.t('allocations::dashboard.labels.single_requests'),
      href: `/allocations/week/${getDateFromParams(req)}/outgoing`,
      value,
    },
  ]
  next()
}
async function setAllocationsByDateAndFilter(req, res, next) {
  const additionalFilters = queryString.parse(req._parsedOriginalUrl.query, {
    parseBooleans: true,
  })
  const { dateRange } = req.params
  res.locals.allocations = await allocationService.getByStatus({
    dateRange,
    additionalFilters,
  })
  next()
}
function getAllocationTypeMetadata(params, allocationType) {
  const { baseUrl, dateRange, period, date, currentFilter } = params
  return allocationService
    .getCount({ dateRange, additionalFilters: allocationType.filter })
    .then(count => {
      return {
        ...allocationType,
        value: count,
        active: isEqual(allocationType.filter, currentFilter),
        href: `${baseUrl}/${period}/${date}/outgoing?${queryString.stringify(
          allocationType.filter
        )}`,
      }
    })
}
function addTotalAllocationsToFilter(
  allocationTypes,
  { baseUrl, period, date, currentFilter }
) {
  const totalAllocationItem = {
    label: 'allocations::total',
    filter: null,
    value: allocationTypes.reduce((accumulator, item) => {
      return (accumulator += item.value)
    }, 0),
    active: isEqual({}, currentFilter),
    href: `${baseUrl}/${period}/${date}/outgoing`,
  }
  return [totalAllocationItem, ...allocationTypes]
}
async function setAllocationTypeNavigation(req, res, next) {
  const { baseUrl } = req
  const { dateRange, locationId, period, date } = req.params
  const currentFilter = queryString.parse(req._parsedOriginalUrl.query, {
    parseBooleans: true,
  })
  try {
    res.locals.allocationTypeNavigation = await Promise.all(
      cloneDeep(allocationTypeNavigationConfig).map(
        getAllocationTypeMetadata.bind(null, {
          baseUrl,
          dateRange,
          locationId,
          period,
          date,
          currentFilter,
        })
      )
    ).then(allocationTypes => {
      const allocationTypesWithTotal = addTotalAllocationsToFilter(
        allocationTypes,
        {
          baseUrl,
          period,
          date,
          currentFilter,
        }
      )
      return allocationTypesWithTotal.map(presenters.moveTypesToFilterComponent)
    })
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setPagination,
  setAllocationsSummary,
  setAllocationsByDateAndFilter,
  getAllocationTypeMetadata,
  addTotalAllocationsToFilter,
  setAllocationTypeNavigation,
}
