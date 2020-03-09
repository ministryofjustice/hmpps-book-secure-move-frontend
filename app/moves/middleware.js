const { format } = require('date-fns')
const { find, get, chunk, cloneDeep } = require('lodash')

const {
  getDateRange,
  getDateFromParams,
  getPeriod,
  dateFormat,
} = require('../../common/helpers/date-utils')

const presenters = require('../../common/presenters')

const moveService = require('../../common/services/move')
const { LOCATIONS_BATCH_SIZE } = require('../../config')

function makeMultipleRequests(service, dateRange, locationIdBatches) {
  return Promise.all(
    locationIdBatches.map(chunk =>
      service({ dateRange, fromLocationId: chunk })
    )
  )
}
const moveTypeNavigationConfig = [
  {
    label: 'moves::dashboard.filter.proposed',
    filter: 'proposed',
  },
  {
    label: 'moves::dashboard.filter.approved',
    filter: 'requested,accepted,completed',
  },
  {
    label: 'moves::dashboard.filter.rejected',
    filter: 'rejected',
  },
]
const movesMiddleware = {
  redirectBaseUrl: (req, res) => {
    const today = format(new Date(), dateFormat)
    const currentLocation = get(req.session, 'currentLocation.id')

    if (currentLocation) {
      return res.redirect(`${req.baseUrl}/day/${today}/${currentLocation}`)
    }

    return res.redirect(`${req.baseUrl}/day/${today}`)
  },
  saveUrl: (req, res, next) => {
    req.session.movesUrl = req.originalUrl
    next()
  },
  setPeriod: (req, res, next, period) => {
    res.locals.period = period
    next()
  },
  setDateRange: (req, res, next) => {
    const { period } = req.params
    const date = getDateFromParams(req)
    if (!date) {
      return res.redirect(req.baseUrl)
    }
    res.locals.dateRange = getDateRange(period, date)
    next()
  },
  setFromLocation: (req, res, next, locationId) => {
    const userLocations = get(req.session, 'user.locations')
    const location = find(userLocations, { id: locationId })

    if (!location) {
      const error = new Error('Location not found')
      error.statusCode = 404

      return next(error)
    }

    res.locals.fromLocationId = locationId
    next()
  },
  setPagination: (req, res, next) => {
    const { locationId = '', period, status } = req.params
    const today = format(new Date(), dateFormat)
    const baseDate = getDateFromParams(req)
    const interval = period === 'week' ? 7 : 1

    const previousPeriod = getPeriod(baseDate, -interval)
    const nextPeriod = getPeriod(baseDate, interval)

    const locationInUrl = locationId ? `/${locationId}` : ''
    const statusInUrl = status ? `/${status}` : ''

    res.locals.pagination = {
      todayUrl: `${req.baseUrl}/${period}/${today}${locationInUrl}${statusInUrl}`,
      nextUrl: `${req.baseUrl}/${period}/${nextPeriod}${locationInUrl}${statusInUrl}`,
      prevUrl: `${req.baseUrl}/${period}/${previousPeriod}${locationInUrl}${statusInUrl}`,
    }

    next()
  },
  setMoveTypeNavigation: async (req, res, next) => {
    const { dateRange } = res.locals
    const { locationId, period, date } = req.params
    try {
      res.locals.moveTypeNavigation = await Promise.all(
        cloneDeep(moveTypeNavigationConfig).map(moveType => {
          return moveService
            .getMovesCount({ dateRange, status: moveType.filter, locationId })
            .then(count => {
              const { label } = moveType
              return {
                label,
                value: count,
                active: moveType.filter === req.params.status,
                href: `${req.baseUrl}/${period}/${date}${
                  locationId ? '/' + locationId : ''
                }/${moveType.filter}`,
              }
            })
            .then(presenters.moveTypesToFilterComponent)
        })
      )
      next()
    } catch (error) {
      next(error)
    }
  },
  setMovesByDateAndLocation: async (req, res, next) => {
    const { dateRange, fromLocationId } = res.locals

    if (!dateRange) {
      return next()
    }

    try {
      const [activeMoves, cancelledMoves] = await Promise.all([
        moveService.getActive({ dateRange, fromLocationId }),
        moveService.getCancelled({ dateRange, fromLocationId }),
      ])

      res.locals.activeMovesByDate = activeMoves
      res.locals.cancelledMovesByDate = cancelledMoves

      next()
    } catch (error) {
      next(error)
    }
  },
  setMovesByDateRangeAndStatus: async (req, res, next) => {
    const { dateRange } = res.locals
    const { status, locationId } = req.params

    if (!dateRange) {
      return next()
    }

    try {
      res.locals.movesByRangeAndStatus = await moveService.getMovesByDateRangeAndStatus(
        {
          dateRange,
          status,
          locationId,
        }
      )

      next()
    } catch (error) {
      next(error)
    }
  },
  setMovesByDateAllLocations: async (req, res, next) => {
    const { dateRange } = res.locals

    if (!dateRange) {
      return next()
    }

    try {
      const userLocations = get(req.session, 'user.locations', []).map(
        location => location.id
      )

      if (userLocations.length === 0) {
        return next()
      }

      const idChunks = chunk(userLocations, LOCATIONS_BATCH_SIZE).map(id =>
        id.join(',')
      )

      const [activeMoves, cancelledMoves] = (
        await Promise.all([
          makeMultipleRequests(moveService.getActive, dateRange, idChunks),
          makeMultipleRequests(moveService.getCancelled, dateRange, idChunks),
        ])
      ).map(response => response.flat())

      res.locals.activeMovesByDate = activeMoves
      res.locals.cancelledMovesByDate = cancelledMoves
      next()
    } catch (error) {
      next(error)
    }
  },
}

module.exports = movesMiddleware
