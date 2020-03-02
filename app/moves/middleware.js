const {
  format,
  addDays,
  subDays,
  parseISO,
  startOfWeek,
  endOfWeek,
  isValid: isValidDate,
} = require('date-fns')
const { find, get, chunk } = require('lodash')

const moveService = require('../../common/services/move')
const { LOCATIONS_BATCH_SIZE } = require('../../config')

const moveDateFormat = 'yyyy-MM-dd'
const weekStartsOn = 1

function makeMultipleRequests(service, moveDate, locationIdBatches) {
  return Promise.all(
    locationIdBatches.map(chunk => service({ moveDate, fromLocationId: chunk }))
  )
}

function getPeriod(date, interval) {
  const method = interval >= 0 ? addDays : subDays
  return format(method(parseISO(date), Math.abs(interval)), moveDateFormat)
}

module.exports = {
  redirectBaseUrl: (req, res) => {
    const today = format(new Date(), moveDateFormat)
    const currentLocation = get(req.session, 'currentLocation.id')

    if (currentLocation) {
      return res.redirect(`${req.baseUrl}/${today}/${currentLocation}`)
    }

    return res.redirect(`${req.baseUrl}/${today}`)
  },
  saveUrl: (req, res, next) => {
    req.session.movesUrl = req.originalUrl
    next()
  },
  setPeriod: (req, res, next, period) => {
    res.locals.period = period
    next()
  },
  setStatus: (req, res, next, status) => {
    res.locals.status = status
    next()
  },
  setMoveDate: (req, res, next, date) => {
    const parsedDate = parseISO(date)
    const validDate = isValidDate(parsedDate)

    if (!validDate) {
      return res.redirect(req.baseUrl)
    }

    res.locals.moveDate = format(parsedDate, moveDateFormat)
    next()
  },
  setDateRange: (req, res, next) => {
    const { period = 'week' } = res.locals
    let startDate
    let endDate

    if (period === 'week') {
      startDate = startOfWeek(parseISO(res.locals.moveDate), { weekStartsOn })
      endDate = endOfWeek(parseISO(res.locals.moveDate), { weekStartsOn })
    } else {
      startDate = parseISO(res.locals.moveDate)
      endDate = addDays(startDate, 1)
    }
    res.locals.createdAtRange = [
      format(startDate, moveDateFormat),
      format(endDate, moveDateFormat),
    ]
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
    const { moveDate } = res.locals
    const { locationId = '' } = req.params
    const today = format(new Date(), moveDateFormat)
    const previousDay = getPeriod(moveDate, -1)
    const nextDay = getPeriod(moveDate, 1)

    res.locals.pagination = {
      todayUrl: `${req.baseUrl}/${today}/${locationId}`,
      nextUrl: `${req.baseUrl}/${nextDay}/${locationId}`,
      prevUrl: `${req.baseUrl}/${previousDay}/${locationId}`,
    }

    next()
  },
  setPaginationForMovesByDateRangeAndStatus: (req, res, next) => {
    const { moveDate, period = 'week', status = '' } = res.locals
    const { locationId = '' } = req.params
    const today = format(new Date(), moveDateFormat)
    const interval = period === 'week' ? 7 : 1

    const previousPeriod = getPeriod(moveDate, -interval)
    const nextPeriod = getPeriod(moveDate, interval)

    res.locals.pagination = {
      todayUrl: `${req.baseUrl}/${period}/${today}/${locationId}/${status}`,
      nextUrl: `${req.baseUrl}/${period}/${nextPeriod}/${locationId}/${status}`,
      prevUrl: `${req.baseUrl}/${period}/${previousPeriod}/${locationId}/${status}`,
    }

    next()
  },
  setMovesByDateAndLocation: async (req, res, next) => {
    const { moveDate, fromLocationId } = res.locals

    if (!moveDate) {
      return next()
    }

    try {
      const [activeMoves, cancelledMoves] = await Promise.all([
        moveService.getActive({ moveDate, fromLocationId }),
        moveService.getCancelled({ moveDate, fromLocationId }),
      ])

      res.locals.activeMovesByDate = activeMoves
      res.locals.cancelledMovesByDate = cancelledMoves

      next()
    } catch (error) {
      next(error)
    }
  },
  setMovesByDateRangeAndStatus: async (req, res, next) => {
    const { createdAtRange, fromLocationId, status } = res.locals

    if (!createdAtRange) {
      return next()
    }

    try {
      res.locals.proposedMovesByWeek = await moveService.getMovesByDateRangeAndStatus(
        {
          createdAtRange,
          status,
          fromLocationId,
        }
      )

      next()
    } catch (error) {
      next(error)
    }
  },
  setMovesByDateAllLocations: async (req, res, next) => {
    const { moveDate } = res.locals

    if (!moveDate) {
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
          makeMultipleRequests(moveService.getActive, moveDate, idChunks),
          makeMultipleRequests(moveService.getCancelled, moveDate, idChunks),
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
