const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodyMoves(property, locationProperty) {
  return function handleBody(req, res, next) {
    const { status } = req.query
    const { dateRange } = req.params
    const locations = req.locations

    set(req, `body.${property}`, {
      status,
      dateRange: dateRange || dateHelpers.getCurrentDayAsRange(),
      [locationProperty]: locations,
      supplierId: req.session?.user?.supplierId,
    })

    next()
  }
}

module.exports = setBodyMoves
