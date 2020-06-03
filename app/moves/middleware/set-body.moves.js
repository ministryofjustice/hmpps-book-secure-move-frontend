const { get, set } = require('lodash')

const { getCurrentDayAsRange } = require('../../../common/helpers/date')

function setBodyMoves(property, locationProperty) {
  return function handleBody(req, res, next) {
    const { dateRange, locationId } = req.params
    const locations =
      locationId ||
      get(req.session, 'user.locations', [])
        .map(location => location.id)
        .join(',')

    set(req, `body.${property}`, {
      dateRange: dateRange || getCurrentDayAsRange(),
      [locationProperty]: locations,
    })

    next()
  }
}

module.exports = setBodyMoves
