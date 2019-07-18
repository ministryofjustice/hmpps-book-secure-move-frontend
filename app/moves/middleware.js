const { format } = require('date-fns')
const { get } = require('lodash')

const permissions = require('../../common/middleware/permissions')
const moveService = require('../../common/services/move')

module.exports = {
  checkPermissions: (req, res, next) => {
    const userPermissions = get(req.session, 'user.permissions')
    const currentLocation = get(req.session, 'currentLocation.id')

    if (permissions.check('moves:view:all', userPermissions)) {
      return res.redirect('/moves')
    }

    if (
      permissions.check('moves:view:by_location', userPermissions) &&
      currentLocation
    ) {
      return res.redirect(`/moves/${currentLocation}`)
    }

    next()
  },
  setMoveDate: (req, res, next) => {
    res.locals.moveDate =
      req.query['move-date'] || format(new Date(), 'YYYY-MM-DD')

    next()
  },
  setFromLocation: (req, res, next, locationId) => {
    res.locals.fromLocationId = locationId
    next()
  },
  setMovesByDate: async (req, res, next) => {
    const { moveDate } = res.locals

    if (!moveDate) {
      return next()
    }

    try {
      res.locals.movesByDate = await moveService.getRequestedMovesByDateAndLocation(
        moveDate,
        res.locals.fromLocationId
      )

      next()
    } catch (error) {
      next(error)
    }
  },
}
