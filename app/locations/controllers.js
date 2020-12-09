const { get, sortBy } = require('lodash')

async function locations(req, res, next) {
  const userPermissions = get(req.session, 'user.permissions', [])

  let regions = []

  if (userPermissions.includes('allocation:create')) {
    try {
      regions = await req.services.referenceData.getRegions()
    } catch (error) {
      return next(error)
    }
  }

  let userLocations = req.userLocations

  const supplierId = req.session.user.supplierId

  if (supplierId) {
    userLocations = await req.services.referenceData.getLocationsBySupplierId(
      supplierId
    )
    req.session.user.locations = userLocations
  }

  const locations = sortBy(userLocations, 'title')

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
