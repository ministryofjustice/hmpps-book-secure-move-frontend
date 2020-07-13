const { get, sortBy } = require('lodash')

const referenceDataService = require('../../common/services/reference-data')

async function locations(req, res, next) {
  const userPermissions = get(req.session, 'user.permissions', [])

  let regions = []

  if (userPermissions.includes('allocation:create')) {
    try {
      regions = await referenceDataService.getRegions()
    } catch (error) {
      return next(error)
    }
  }
  const locations = sortBy(req.userLocations, 'title')

  res.render('locations/views/locations.njk', {
    locations,
    regions,
  })
}

function redirect(req, res) {
  const redirectUrl = req.session.originalRequestUrl || '/'

  req.session.originalRequestUrl = null

  res.redirect(redirectUrl)
}

module.exports = {
  locations,
  redirect,
}
