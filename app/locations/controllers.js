const { get } = require('lodash')

const { populateSupplierLocations } = require('../../common/services/user')

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

  try {
    await populateSupplierLocations(req.session.user)
  } catch (error) {
    return next(error)
  }

  const activeLocations = userLocations.filter(
    location => location.disabled_at === null
  )
  const inactiveLocations = userLocations.filter(
    location => location.disabled_at !== null
  )

  res.render('locations/views/locations.njk', {
    activeLocations,
    inactiveLocations,
    regions,
  })
}

module.exports = {
  locations,
}
