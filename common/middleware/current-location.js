const { get } = require('lodash')

const referenceDataService = require('../../common/services/reference-data')

module.exports = function currentLocation (locationUUID) {
  return (req, res, next) => {
    const userAuthorities = get(req.session, 'userInfo.authorities', [])

    if (
      req.session.currentLocation ||
      userAuthorities.includes('ROLE_PECS_SUPPLIER')
    ) {
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
