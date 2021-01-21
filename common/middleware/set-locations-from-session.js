const pipe = functions => data => {
  return functions.reduce((value, func) => {
    if (value.locations) {
      return value
    }

    return func(value)
  }, data)
}

const getParamsLocation = data => {
  // This function does not do anything
  //
  // https://expressjs.com/en/4x/api.html#app.param
  // > Param callback functions are local to the router on which they are
  // > defined. They are not inherited by mounted apps or routers. Hence, param
  // > callbacks defined on app will be triggered only by route parameters
  // > defined on app routes.
  //
  // We do not define our routes on the main app, therefore this means that this
  // middleware is never used, as params are never configured at this level.
  //
  // A similar function will need to be applied at each level of router that
  // requires it

  const { locationId } = data.req.params

  if (locationId) {
    data.locations = [{ id: locationId }]
  }

  return data
}

const getCurrentLocation = data => {
  const currentLocation = data.req.session?.currentLocation

  if (currentLocation) {
    data.locations = [currentLocation]
  }

  return data
}

const getCurrentRegion = data => {
  data.locations = data.req.session?.currentRegion?.locations
  return data
}

const getUserLocations = data => {
  if (data.req.session?.user?.supplierId) {
    return data
  }

  data.locations = data.req.session?.user?.locations
  return data
}

const getLocationIds = data => {
  const locations = data.locations || []
  return locations.map(location => location.id)
}

const setLocationsFromSession = (req, res, next) => {
  const data = pipe([
    getParamsLocation,
    getCurrentLocation,
    getCurrentRegion,
    getUserLocations,
  ])({ req })

  req.locations = getLocationIds(data)

  next()
}

module.exports = setLocationsFromSession
