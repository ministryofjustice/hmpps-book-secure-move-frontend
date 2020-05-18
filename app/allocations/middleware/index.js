const { cloneDeep, isEqual } = require('lodash')
const queryString = require('query-string')

const { getDateFromParams } = require('../../../common/helpers/date-utils')
const presenters = require('../../../common/presenters')
const allocationService = require('../../../common/services/allocation')

const setBodyAllocations = require('./set-body.allocations')
const setFilterAllocations = require('./set-filter.allocations')
const setResultsAllocations = require('./set-results.allocations')

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
  setBodyAllocations,
  setFilterAllocations,
  setResultsAllocations,
  setAllocationsSummary,
  setAllocationsByDateAndFilter,
  getAllocationTypeMetadata,
  addTotalAllocationsToFilter,
  setAllocationTypeNavigation,
}
