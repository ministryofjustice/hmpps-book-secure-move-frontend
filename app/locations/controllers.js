const { get } = require('lodash')

async function locations(req, res, next) {
  const userPermissions = get(req.session, 'user.permissions', [])
  const userLocations = get(req.session, 'user.locations', [])

  let regions = []

  try {
    if (userPermissions.includes('allocation:create')) {
      regions = await req.services.referenceData.getRegions()
    }
  } catch (error) {
    return next(error)
  }

  const activeLocations = userLocations.filter(
    location => location.disabled_at === null
  )

  res.render('locations/views/locations.njk', {
    activeLocations,
    regions,
  })
}

module.exports = {
  locations,
}
