const { format } = require('date-fns')
const allocationService = require('../../common/services/allocation')

const {
  dateFormat,
  getDateFromParams,
  getPeriod,
} = require('../../common/helpers/date-utils')

const allocationsMiddleware = {
  // todo: refactor this to be common with the /moves pagination.
  //  It differs only in the output of the url
  setPagination: (req, res, next) => {
    const { period } = req.params
    const today = format(new Date(), dateFormat)
    const baseDate = getDateFromParams(req)
    const interval = period === 'week' ? 7 : 1

    const previousPeriod = getPeriod(baseDate, -interval)
    const nextPeriod = getPeriod(baseDate, interval)

    res.locals.pagination = {
      todayUrl: `${req.baseUrl}/${period}/${today}/`,
      nextUrl: `${req.baseUrl}/${period}/${nextPeriod}/`,
      prevUrl: `${req.baseUrl}/${period}/${previousPeriod}/`,
    }
    next()
  },
  setAllocationsSummary: async (req, res, next) => {
    const { dateRange } = res.locals
    const value = await allocationService.getCount({ dateRange })
    res.locals.allocationsSummary = [
      {
        active: false,
        label: req.t('allocations::dashboard.label'),
        href: `/allocations/week/${getDateFromParams(req)}/`,
        value,
      },
    ]
    /* res.locals.allocationsSummary = [
      {
        active: false,
        label: 'Allocations',
        href: '/allocations/week/2010-09-07/',
        value: 4,
      } */
    next()
  },
}

module.exports = allocationsMiddleware
