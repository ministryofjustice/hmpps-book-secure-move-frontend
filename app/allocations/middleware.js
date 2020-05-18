const queryString = require('query-string')

const { getDateFromParams } = require('../../common/helpers/date-utils')
const presenters = require('../../common/presenters')
const allocationService = require('../../common/services/allocation')

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
  setAllocationsSummary,
  setAllocationsByDateAndFilter,
  setAllocationTypeNavigation,
}
