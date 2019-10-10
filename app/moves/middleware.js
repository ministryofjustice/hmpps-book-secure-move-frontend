const {
  format,
  addDays,
  subDays,
  parseISO,
  isValid: isValidDate,
} = require('date-fns')
const { find, get } = require('lodash')

const moveService = require('../../common/services/move')

const moveDateFormat = 'yyyy-MM-dd'

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
    const { locationId = '' } = req.params
    const today = format(new Date(), moveDateFormat)
    const previousDay = format(subDays(parseISO(moveDate), 1), moveDateFormat)
    const nextDay = format(addDays(parseISO(moveDate), 1), moveDateFormat)

    res.locals.pagination = {
      todayUrl: `${req.baseUrl}/${today}/${locationId}`,
      nextUrl: `${req.baseUrl}/${nextDay}/${locationId}`,
      prevUrl: `${req.baseUrl}/${previousDay}/${locationId}`,
    }

    next()
  },
  setMovesByDate: async (req, res, next) => {
    const { moveDate, fromLocationId } = res.locals

    if (!moveDate) {
      return next()
    }

    try {
      const userLocations = get(req.session, 'user.locations', [])
      const locationIds =
        fromLocationId || userLocations.map(location => location.id).join(',')
      const [requestedMoves, cancelledMoves] = await Promise.all([
        moveService.getRequested({ moveDate, fromLocationId: locationIds }),
        moveService.getCancelled({ moveDate, fromLocationId: locationIds }),
      ])

      res.locals.requestedMovesByDate = requestedMoves
      res.locals.cancelledMovesByDate = cancelledMoves

      next()
    } catch (error) {
      next(error)
    }
  },
}
