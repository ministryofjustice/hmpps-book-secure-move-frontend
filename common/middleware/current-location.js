const referenceDataService = require('../../common/services/reference-data')

module.exports = function currentLocation (locationUUID) {
  return (req, res, next) => {
    if (req.session.currentLocation) {
      return next()
    }

    referenceDataService
      .getLocationById(locationUUID)
      .then(location => {
        req.session.currentLocation = location
        next()
      })
      .catch(next)
  }
}
