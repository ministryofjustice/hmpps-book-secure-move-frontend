const { find, flatMapDeep } = require('lodash')

// If we want to also use this as normal middleware, we can't have an extra property
// param, as normal middleware uses the 4th param for error handling
async function setLocation(req, res, next) {
  const locationId = req.params?.locationId || req.session?.currentLocation?.id

  if (!locationId) {
    return next()
  }

  // Find this location in the available locations of the current user
  const userLocations = req.session?.user?.locations
  let location = find(userLocations, { id: locationId })

  if (location) {
    req.location = location
    return next()
  }

  // Find this location in the currentRegion of the current user
  const userRegionLocations = req.session?.currentRegion?.locations
  location = find(userRegionLocations, { id: locationId })

  if (location) {
    req.location = location
    return next()
  }

  // Find this location in the all regions
  const allRegions = await req.services.referenceData.getRegions()
  const flattenedRegions = flatMapDeep(allRegions, region => region.locations)
  location = find(flattenedRegions, { id: locationId })

  if (location) {
    req.location = location
    return next()
  }

  if (!location) {
    const error = new Error('Location not found')
    error.statusCode = 404

    return next(error)
  }
}

module.exports = setLocation
