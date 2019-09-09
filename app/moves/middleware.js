const queryString = require('query-string')
const { format, addDays, subDays } = require('date-fns')
const { get } = require('lodash')

const { getQueryString } = require('../../common/lib/request')
const moveService = require('../../common/services/move')
const permissions = require('../../common/middleware/permissions')

const moveDateFormat = 'YYYY-MM-DD'

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
  setMoveDate: (req, res, next) => {
    res.locals.moveDate =
      req.query['move-date'] || format(new Date(), moveDateFormat)

    next()
  },
  setFromLocation: (req, res, next, locationId) => {
    res.locals.fromLocationId = locationId
    next()
  },
  setPagination: (req, res, next) => {
    const { moveDate } = res.locals
    const today = format(new Date(), moveDateFormat)
    const previousDay = format(subDays(moveDate, 1), moveDateFormat)
    const nextDay = format(addDays(moveDate, 1), moveDateFormat)

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
