const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodyMoves(property, locationProperty) {
  return function handleBody(req, res, next) {
    const { status } = req.query
    const { dateRange } = req.params
    const locations = req.locations
    const { location } = req

    const bodyLocations = location?.id ? [location.id] : locations

    set(req, `body.${property}`, {
      status,
      dateRange: dateRange || dateHelpers.getCurrentDayAsRange(),
      [locationProperty]: bodyLocations,
      supplierId: req.session?.user?.supplierId,
    })

    next()
  }
}

module.exports = setBodyMoves
