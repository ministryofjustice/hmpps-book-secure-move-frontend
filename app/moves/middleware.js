const queryString = require('query-string')
const {
  format,
  addDays,
  subDays,
  parseISO,
  isValid: isValidDate,
} = require('date-fns')
const { find, get } = require('lodash')

const { getQueryString } = require('../../common/lib/request')
const moveService = require('../../common/services/move')
const permissions = require('../../common/middleware/permissions')

const moveDateFormat = 'yyyy-MM-dd'

module.exports = {
  redirectUsers: (req, res, next) => {
    const userPermissions = get(req.session, 'user.permissions')
    const currentLocation = get(req.session, 'currentLocation.id')
    const search = queryString.stringify(req.query)

    if (permissions.check('moves:view:all', userPermissions)) {
      return next()
    }

    if (
      permissions.check('moves:view:by_location', userPermissions) &&
      currentLocation
    ) {
      return res.redirect(
        `${req.baseUrl}/${currentLocation}${search ? `?${search}` : ''}`
      )
    }

    next()
  },
  storeQuery: (req, res, next) => {
    req.session.movesQuery = req.query

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
    const today = format(new Date(), moveDateFormat)
    const previousDay = format(subDays(parseISO(moveDate), 1), moveDateFormat)
    const nextDay = format(addDays(parseISO(moveDate), 1), moveDateFormat)

    res.locals.pagination = {
      todayUrl: getQueryString(req.query, { 'move-date': today }),
      nextUrl: getQueryString(req.query, { 'move-date': nextDay }),
      prevUrl: getQueryString(req.query, { 'move-date': previousDay }),
    }

    next()
  },
  setMovesByDate: async (req, res, next) => {
    const { moveDate, fromLocationId } = res.locals

    if (!moveDate) {
      return next()
    }

    try {
      const [requestedMoves, cancelledMoves] = await Promise.all([
        moveService.getRequested({ moveDate, fromLocationId }),
        moveService.getCancelled({ moveDate, fromLocationId }),
      ])

      res.locals.requestedMovesByDate = requestedMoves
      res.locals.cancelledMovesByDate = cancelledMoves

      next()
    } catch (error) {
      next(error)
    }
  },
}
