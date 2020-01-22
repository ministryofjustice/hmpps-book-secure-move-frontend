const {
  format,
  addDays,
  subDays,
  parseISO,
  isValid: isValidDate,
} = require('date-fns')
const { find, get, chunk } = require('lodash')

const moveService = require('../../common/services/move')
const { LOCATIONS_BATCH_SIZE } = require('../../config')

const moveDateFormat = 'yyyy-MM-dd'

function makeMultipleRequests(service, moveDate, locationIdBatches) {
  return Promise.all(
    locationIdBatches.map(chunk => service({ moveDate, fromLocationId: chunk }))
  )
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
  setMovesByDateAndLocation: async (req, res, next) => {
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
  setMovesByDateAllLocations: async (req, res, next) => {
    const { moveDate } = res.locals

    if (!moveDate) {
      return next()
    }

    try {
      const userLocations = get(req.session, 'user.locations', []).map(
        loc => loc.id
      )

      if (userLocations.length === 0) {
        return next()
      }

      const idChunks = chunk(userLocations, LOCATIONS_BATCH_SIZE).map(id =>
        id.join(',')
      )

      const [requestedMoves, cancelledMoves] = (await Promise.all([
        makeMultipleRequests(moveService.getRequested, moveDate, idChunks),
        makeMultipleRequests(moveService.getCancelled, moveDate, idChunks),
      ])).map(response => response.flat())

      res.locals.requestedMovesByDate = requestedMoves
      res.locals.cancelledMovesByDate = cancelledMoves
      next()
    } catch (error) {
      next(error)
    }
  },
}
